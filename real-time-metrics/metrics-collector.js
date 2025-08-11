#!/usr/bin/env node

// Real-time Metrics Collector for AGI Staffers
// Collects system and service metrics every 5 seconds

const { exec } = require('child_process');
const WebSocket = require('ws');
const http = require('http');

// Configuration
const COLLECTION_INTERVAL = 5000; // 5 seconds
const WS_PORT = 3012;
const HTTP_PORT = 3013;

// Store latest metrics
let latestMetrics = {
    timestamp: Date.now(),
    system: {},
    containers: {},
    services: {},
    alerts: []
};

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: WS_PORT });

// Broadcast metrics to all connected clients
function broadcastMetrics(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Execute command and return promise
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

// Collect system metrics
async function collectSystemMetrics() {
    try {
        // CPU usage
        const cpuUsage = await execPromise("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1");
        
        // Memory usage
        const memInfo = await execPromise("free -m | grep Mem | awk '{print $3,$2}'");
        const [memUsed, memTotal] = memInfo.split(' ').map(Number);
        
        // Disk usage
        const diskInfo = await execPromise("df -h / | tail -1 | awk '{print $3,$2,$5}'");
        const [diskUsed, diskTotal, diskPercent] = diskInfo.split(' ');
        
        // Load average
        const loadAvg = await execPromise("uptime | awk -F'load average:' '{print $2}'");
        
        return {
            cpu: {
                usage: parseFloat(cpuUsage) || 0,
                cores: await execPromise("nproc")
            },
            memory: {
                used: memUsed,
                total: memTotal,
                percent: ((memUsed / memTotal) * 100).toFixed(1)
            },
            disk: {
                used: diskUsed,
                total: diskTotal,
                percent: parseInt(diskPercent)
            },
            load: loadAvg.trim().split(',').map(l => parseFloat(l.trim()))
        };
    } catch (error) {
        console.error('Error collecting system metrics:', error);
        return {};
    }
}

// Collect Docker container metrics
async function collectContainerMetrics() {
    try {
        // Get container stats
        const containerStats = await execPromise(
            "docker stats --no-stream --format '{{.Container}}|{{.CPUPerc}}|{{.MemUsage}}|{{.MemPerc}}|{{.NetIO}}|{{.BlockIO}}'"
        );
        
        const containers = {};
        containerStats.split('\n').forEach(line => {
            if (line) {
                const [id, cpu, memUsage, memPerc, netIO, blockIO] = line.split('|');
                
                // Get container name
                execPromise(`docker inspect -f '{{.Name}}' ${id}`).then(name => {
                    containers[name.replace('/', '')] = {
                        id: id.substring(0, 12),
                        cpu: parseFloat(cpu),
                        memory: {
                            usage: memUsage,
                            percent: parseFloat(memPerc)
                        },
                        network: netIO,
                        disk: blockIO
                    };
                });
            }
        });
        
        // Get container status
        const containerList = await execPromise(
            "docker ps -a --format '{{.Names}}|{{.Status}}|{{.State}}'"
        );
        
        containerList.split('\n').forEach(line => {
            if (line) {
                const [name, status, state] = line.split('|');
                if (containers[name]) {
                    containers[name].status = status;
                    containers[name].state = state;
                } else {
                    containers[name] = {
                        status: status,
                        state: state,
                        cpu: 0,
                        memory: { percent: 0 }
                    };
                }
            }
        });
        
        return containers;
    } catch (error) {
        console.error('Error collecting container metrics:', error);
        return {};
    }
}

// Check service health
async function checkServiceHealth() {
    const services = {
        'admin.agistaffers.com': { url: 'https://admin.agistaffers.com', critical: true },
        'pgadmin.agistaffers.com': { url: 'https://pgadmin.agistaffers.com', critical: false },
        'n8n.agistaffers.com': { url: 'https://n8n.agistaffers.com', critical: false },
        'chat.agistaffers.com': { url: 'https://chat.agistaffers.com', critical: false },
        'flowise.agistaffers.com': { url: 'https://flowise.agistaffers.com', critical: false },
        'push-api': { url: 'http://localhost:3011/health', critical: true },
        'postgresql': { check: 'docker exec stepperslife-db pg_isready', critical: true }
    };
    
    const health = {};
    
    for (const [name, config] of Object.entries(services)) {
        try {
            if (config.url) {
                const start = Date.now();
                await execPromise(`curl -s -f -m 5 ${config.url} > /dev/null`);
                health[name] = {
                    status: 'healthy',
                    responseTime: Date.now() - start,
                    critical: config.critical
                };
            } else if (config.check) {
                await execPromise(config.check);
                health[name] = {
                    status: 'healthy',
                    critical: config.critical
                };
            }
        } catch (error) {
            health[name] = {
                status: 'unhealthy',
                error: error.message,
                critical: config.critical
            };
        }
    }
    
    return health;
}

// Generate alerts based on thresholds
function generateAlerts(metrics) {
    const alerts = [];
    const thresholds = {
        cpu: 80,
        memory: 85,
        disk: 90
    };
    
    // System alerts
    if (metrics.system.cpu && metrics.system.cpu.usage > thresholds.cpu) {
        alerts.push({
            type: 'warning',
            category: 'system',
            message: `High CPU usage: ${metrics.system.cpu.usage}%`,
            value: metrics.system.cpu.usage,
            threshold: thresholds.cpu
        });
    }
    
    if (metrics.system.memory && metrics.system.memory.percent > thresholds.memory) {
        alerts.push({
            type: 'warning',
            category: 'system',
            message: `High memory usage: ${metrics.system.memory.percent}%`,
            value: metrics.system.memory.percent,
            threshold: thresholds.memory
        });
    }
    
    if (metrics.system.disk && metrics.system.disk.percent > thresholds.disk) {
        alerts.push({
            type: 'critical',
            category: 'system',
            message: `Critical disk usage: ${metrics.system.disk.percent}%`,
            value: metrics.system.disk.percent,
            threshold: thresholds.disk
        });
    }
    
    // Container alerts
    Object.entries(metrics.containers).forEach(([name, container]) => {
        if (container.state === 'exited' || container.state === 'dead') {
            alerts.push({
                type: 'critical',
                category: 'container',
                message: `Container ${name} is not running`,
                container: name,
                state: container.state
            });
        }
        
        if (container.memory && container.memory.percent > 80) {
            alerts.push({
                type: 'warning',
                category: 'container',
                message: `Container ${name} high memory: ${container.memory.percent}%`,
                container: name,
                value: container.memory.percent
            });
        }
    });
    
    // Service alerts
    Object.entries(metrics.services).forEach(([name, service]) => {
        if (service.status === 'unhealthy' && service.critical) {
            alerts.push({
                type: 'critical',
                category: 'service',
                message: `Critical service ${name} is down`,
                service: name,
                error: service.error
            });
        } else if (service.status === 'unhealthy') {
            alerts.push({
                type: 'warning',
                category: 'service',
                message: `Service ${name} is not responding`,
                service: name,
                error: service.error
            });
        }
        
        if (service.responseTime > 3000) {
            alerts.push({
                type: 'warning',
                category: 'performance',
                message: `Service ${name} slow response: ${service.responseTime}ms`,
                service: name,
                value: service.responseTime
            });
        }
    });
    
    return alerts;
}

// Main collection loop
async function collectMetrics() {
    try {
        const [system, containers, services] = await Promise.all([
            collectSystemMetrics(),
            collectContainerMetrics(),
            checkServiceHealth()
        ]);
        
        const metrics = {
            timestamp: Date.now(),
            system,
            containers,
            services
        };
        
        // Generate alerts
        metrics.alerts = generateAlerts(metrics);
        
        // Store latest metrics
        latestMetrics = metrics;
        
        // Broadcast to connected clients
        broadcastMetrics({
            type: 'metrics',
            data: metrics
        });
        
        // Send critical alerts as push notifications
        const criticalAlerts = metrics.alerts.filter(a => a.type === 'critical');
        if (criticalAlerts.length > 0) {
            sendPushAlert(criticalAlerts);
        }
        
    } catch (error) {
        console.error('Error in metrics collection:', error);
    }
}

// Send push notification for critical alerts
async function sendPushAlert(alerts) {
    try {
        const alertMessage = alerts.map(a => a.message).join('; ');
        
        await execPromise(`curl -X POST http://localhost:3011/api/broadcast \
            -H "Content-Type: application/json" \
            -d '{"title": "⚠️ Critical Alert", "body": "${alertMessage}"}'`);
    } catch (error) {
        console.error('Error sending push alert:', error);
    }
}

// HTTP endpoint for current metrics
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.url === '/metrics') {
        res.statusCode = 200;
        res.end(JSON.stringify(latestMetrics));
    } else if (req.url === '/health') {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: 'healthy', uptime: process.uptime() }));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    
    // Send current metrics immediately
    ws.send(JSON.stringify({
        type: 'metrics',
        data: latestMetrics
    }));
    
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Start servers
server.listen(HTTP_PORT, () => {
    console.log(`HTTP metrics server running on port ${HTTP_PORT}`);
});

console.log(`WebSocket server running on port ${WS_PORT}`);

// Start collecting metrics
collectMetrics();
setInterval(collectMetrics, COLLECTION_INTERVAL);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down metrics collector...');
    clearInterval(collectMetrics);
    server.close();
    wss.close();
    process.exit(0);
});