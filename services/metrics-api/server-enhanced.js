const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { exec } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Store connected WebSocket clients
const clients = new Set();

// Enhanced Metrics Collector with predictions and analytics
class EnhancedMetricsCollector {
    constructor() {
        this.metricsHistory = [];
        this.maxHistorySize = 1000; // Store more history
        this.hourlyAggregates = [];
        this.dailyAggregates = [];
        this.alertHistory = [];
        this.predictions = {};
        
        this.alertThresholds = {
            cpu: 80,
            memory: 85,
            disk: 90,
            containerCpu: 50,
            containerMemory: 80
        };
        
        // Start aggregation timers
        this.startAggregation();
    }

    // Get system metrics (reuse from original)
    async getSystemMetrics() {
        try {
            const [cpuUsage, memoryInfo, diskInfo, networkStats, uptime] = await Promise.all([
                this.getCpuUsage(),
                this.getMemoryInfo(),
                this.getDiskInfo(),
                this.getNetworkStats(),
                this.getUptime()
            ]);

            return {
                timestamp: new Date().toISOString(),
                system: {
                    cpu: cpuUsage,
                    memory: memoryInfo,
                    disk: diskInfo,
                    network: networkStats,
                    uptime: uptime
                }
            };
        } catch (error) {
            console.error('Error collecting system metrics:', error);
            return null;
        }
    }

    // Get CPU usage
    async getCpuUsage() {
        return new Promise((resolve) => {
            exec('top -bn1 | grep "Cpu(s)" | awk \'{print $2}\' | cut -d\'%\' -f1', (error, stdout) => {
                if (error) {
                    const load = os.loadavg()[0];
                    const cpus = os.cpus().length;
                    const usage = Math.min((load / cpus) * 100, 100);
                    resolve({ usage: Math.round(usage * 100) / 100, cores: cpus });
                } else {
                    const usage = parseFloat(stdout.trim()) || 0;
                    resolve({ usage: Math.round(usage * 100) / 100, cores: os.cpus().length });
                }
            });
        });
    }

    // Get memory information
    async getMemoryInfo() {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        return {
            total: Math.round(totalMem / (1024 * 1024 * 1024) * 100) / 100,
            used: Math.round(usedMem / (1024 * 1024 * 1024) * 100) / 100,
            available: Math.round(freeMem / (1024 * 1024 * 1024) * 100) / 100,
            percentage: Math.round((usedMem / totalMem) * 100 * 100) / 100
        };
    }

    // Get disk information
    async getDiskInfo() {
        return new Promise((resolve) => {
            exec('df -h / | awk \'NR==2{print $3" "$4" "$5}\'', (error, stdout) => {
                if (error) {
                    resolve({ used: 0, available: 0, percentage: 0 });
                } else {
                    const [used, available, percentage] = stdout.trim().split(' ');
                    resolve({
                        used: used || '0G',
                        available: available || '0G',
                        percentage: parseFloat(percentage) || 0
                    });
                }
            });
        });
    }

    // Get network statistics
    async getNetworkStats() {
        return new Promise((resolve) => {
            exec('cat /proc/net/dev | grep -E "eth0|ens" | head -1', (error, stdout) => {
                if (error) {
                    resolve({ in: 0, out: 0 });
                } else {
                    const stats = stdout.trim().split(/\s+/);
                    if (stats.length >= 10) {
                        resolve({
                            in: Math.round(parseInt(stats[1]) / (1024 * 1024)),
                            out: Math.round(parseInt(stats[9]) / (1024 * 1024))
                        });
                    } else {
                        resolve({ in: 0, out: 0 });
                    }
                }
            });
        });
    }

    // Get system uptime
    async getUptime() {
        const uptimeSeconds = os.uptime();
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        
        return {
            days,
            hours,
            minutes,
            formatted: `${days}d ${hours}h ${minutes}m`
        };
    }

    // Get container statistics
    async getContainerStats() {
        return new Promise((resolve) => {
            exec('docker stats --no-stream --format "json"', (error, stdout) => {
                if (error) {
                    resolve([]);
                } else {
                    try {
                        const containers = stdout.trim().split('\n')
                            .filter(line => line)
                            .map(line => {
                                const stats = JSON.parse(line);
                                return {
                                    id: stats.ID,
                                    name: stats.Name,
                                    cpu: parseFloat(stats.CPUPerc),
                                    memory: parseFloat(stats.MemPerc),
                                    memoryUsage: stats.MemUsage,
                                    netIO: stats.NetIO,
                                    blockIO: stats.BlockIO,
                                    status: 'running'
                                };
                            });
                        resolve(containers);
                    } catch (e) {
                        resolve([]);
                    }
                }
            });
        });
    }

    // Get complete metrics with predictions
    async getCompleteMetrics() {
        try {
            const [systemMetrics, containers] = await Promise.all([
                this.getSystemMetrics(),
                this.getContainerStats()
            ]);

            const metrics = {
                ...systemMetrics,
                containers: containers,
                predictions: this.calculatePredictions()
            };

            // Store in history
            this.metricsHistory.push(metrics);
            if (this.metricsHistory.length > this.maxHistorySize) {
                this.metricsHistory.shift();
            }

            // Check for alerts
            const alerts = this.checkAlerts(metrics);
            if (alerts.length > 0) {
                this.alertHistory.push(...alerts);
                // Broadcast alerts
                this.broadcastAlerts(alerts);
            }

            return metrics;
        } catch (error) {
            console.error('Error collecting complete metrics:', error);
            return null;
        }
    }

    // Calculate predictions using moving averages
    calculatePredictions() {
        if (this.metricsHistory.length < 10) {
            return null;
        }

        const recentMetrics = this.metricsHistory.slice(-20);
        const cpuValues = recentMetrics.map(m => m.system.cpu.usage);
        const memoryValues = recentMetrics.map(m => m.system.memory.percentage);

        return {
            cpu: {
                next5min: this.predictValue(cpuValues, 5),
                next15min: this.predictValue(cpuValues, 15),
                next30min: this.predictValue(cpuValues, 30),
                trend: this.calculateTrend(cpuValues)
            },
            memory: {
                next5min: this.predictValue(memoryValues, 5),
                next15min: this.predictValue(memoryValues, 15),
                next30min: this.predictValue(memoryValues, 30),
                trend: this.calculateTrend(memoryValues)
            }
        };
    }

    // Simple prediction using exponential moving average
    predictValue(values, minutesAhead) {
        if (values.length < 3) return values[values.length - 1] || 0;
        
        const alpha = 0.3;
        let ema = values[0];
        
        for (let i = 1; i < values.length; i++) {
            ema = alpha * values[i] + (1 - alpha) * ema;
        }
        
        // Add trend component
        const trend = (values[values.length - 1] - values[values.length - 3]) / 2;
        const stepsAhead = minutesAhead / 5; // Assuming 5-second intervals
        const prediction = ema + (trend * stepsAhead);
        
        return Math.max(0, Math.min(100, Math.round(prediction * 100) / 100));
    }

    // Calculate trend direction
    calculateTrend(values) {
        if (values.length < 5) return 'stable';
        
        const recent = values.slice(-5);
        const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const firstAvg = values.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        
        if (avg > firstAvg + 5) return 'increasing';
        if (avg < firstAvg - 5) return 'decreasing';
        return 'stable';
    }

    // Check for alert conditions
    checkAlerts(metrics) {
        const alerts = [];
        const timestamp = new Date().toISOString();

        if (metrics.system.cpu.usage > this.alertThresholds.cpu) {
            alerts.push({
                type: 'cpu',
                severity: 'warning',
                service: 'system',
                message: `High CPU usage: ${metrics.system.cpu.usage}%`,
                value: metrics.system.cpu.usage,
                threshold: this.alertThresholds.cpu,
                timestamp
            });
        }

        if (metrics.system.memory.percentage > this.alertThresholds.memory) {
            alerts.push({
                type: 'memory',
                severity: 'warning',
                service: 'system',
                message: `High memory usage: ${metrics.system.memory.percentage}%`,
                value: metrics.system.memory.percentage,
                threshold: this.alertThresholds.memory,
                timestamp
            });
        }

        if (metrics.system.disk.percentage > this.alertThresholds.disk) {
            alerts.push({
                type: 'disk',
                severity: 'critical',
                service: 'system',
                message: `High disk usage: ${metrics.system.disk.percentage}%`,
                value: metrics.system.disk.percentage,
                threshold: this.alertThresholds.disk,
                timestamp
            });
        }

        // Container alerts
        metrics.containers.forEach(container => {
            if (container.cpu > this.alertThresholds.containerCpu) {
                alerts.push({
                    type: 'cpu',
                    severity: 'info',
                    service: container.name,
                    message: `Container ${container.name} high CPU: ${container.cpu}%`,
                    value: container.cpu,
                    threshold: this.alertThresholds.containerCpu,
                    timestamp
                });
            }

            if (container.memory > this.alertThresholds.containerMemory) {
                alerts.push({
                    type: 'memory',
                    severity: 'warning',
                    service: container.name,
                    message: `Container ${container.name} high memory: ${container.memory}%`,
                    value: container.memory,
                    threshold: this.alertThresholds.containerMemory,
                    timestamp
                });
            }
        });

        return alerts;
    }

    // Broadcast alerts via WebSocket
    broadcastAlerts(alerts) {
        const message = JSON.stringify({ type: 'alerts', data: alerts });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    // Start aggregation timers
    startAggregation() {
        // Aggregate hourly data
        setInterval(() => {
            this.aggregateHourlyData();
        }, 60 * 60 * 1000); // Every hour

        // Aggregate daily data
        setInterval(() => {
            this.aggregateDailyData();
        }, 24 * 60 * 60 * 1000); // Every day
    }

    // Aggregate hourly data
    aggregateHourlyData() {
        if (this.metricsHistory.length === 0) return;

        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const hourlyMetrics = this.metricsHistory.filter(m => 
            new Date(m.timestamp) > hourAgo
        );

        if (hourlyMetrics.length > 0) {
            const aggregate = {
                timestamp: new Date().toISOString(),
                period: 'hourly',
                cpu: {
                    avg: this.average(hourlyMetrics.map(m => m.system.cpu.usage)),
                    max: Math.max(...hourlyMetrics.map(m => m.system.cpu.usage)),
                    min: Math.min(...hourlyMetrics.map(m => m.system.cpu.usage))
                },
                memory: {
                    avg: this.average(hourlyMetrics.map(m => m.system.memory.percentage)),
                    max: Math.max(...hourlyMetrics.map(m => m.system.memory.percentage)),
                    min: Math.min(...hourlyMetrics.map(m => m.system.memory.percentage))
                },
                containerCount: hourlyMetrics[hourlyMetrics.length - 1].containers.length
            };

            this.hourlyAggregates.push(aggregate);
            if (this.hourlyAggregates.length > 168) { // Keep 7 days
                this.hourlyAggregates.shift();
            }
        }
    }

    // Aggregate daily data
    aggregateDailyData() {
        if (this.hourlyAggregates.length < 24) return;

        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const dailyData = this.hourlyAggregates.filter(h => 
            new Date(h.timestamp) > dayAgo
        );

        if (dailyData.length > 0) {
            const aggregate = {
                timestamp: new Date().toISOString(),
                period: 'daily',
                cpu: {
                    avg: this.average(dailyData.map(h => h.cpu.avg)),
                    max: Math.max(...dailyData.map(h => h.cpu.max)),
                    min: Math.min(...dailyData.map(h => h.cpu.min))
                },
                memory: {
                    avg: this.average(dailyData.map(h => h.memory.avg)),
                    max: Math.max(...dailyData.map(h => h.memory.max)),
                    min: Math.min(...dailyData.map(h => h.memory.min))
                }
            };

            this.dailyAggregates.push(aggregate);
            if (this.dailyAggregates.length > 30) { // Keep 30 days
                this.dailyAggregates.shift();
            }
        }
    }

    // Calculate average
    average(values) {
        if (values.length === 0) return 0;
        return Math.round(values.reduce((a, b) => a + b, 0) / values.length * 100) / 100;
    }

    // Get metrics history
    getHistory(limit = 50, offset = 0) {
        const start = Math.max(0, this.metricsHistory.length - offset - limit);
        const end = this.metricsHistory.length - offset;
        return this.metricsHistory.slice(start, end).reverse();
    }

    // Get aggregated data
    getAggregatedData(period) {
        switch (period) {
            case 'hourly':
                return this.hourlyAggregates;
            case 'daily':
                return this.dailyAggregates;
            default:
                return [];
        }
    }

    // Get alert history
    getAlertHistory(limit = 100) {
        return this.alertHistory.slice(-limit).reverse();
    }

    // Get analytics summary
    getAnalytics() {
        const now = new Date();
        const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        const dayAlerts = this.alertHistory.filter(a => new Date(a.timestamp) > dayAgo);
        const weekAlerts = this.alertHistory.filter(a => new Date(a.timestamp) > weekAgo);

        return {
            alerts: {
                last24h: {
                    total: dayAlerts.length,
                    bySeverity: this.groupBySeverity(dayAlerts),
                    byType: this.groupByType(dayAlerts)
                },
                last7d: {
                    total: weekAlerts.length,
                    bySeverity: this.groupBySeverity(weekAlerts),
                    byType: this.groupByType(weekAlerts)
                }
            },
            performance: {
                current: this.metricsHistory.length > 0 ? {
                    cpu: this.metricsHistory[this.metricsHistory.length - 1].system.cpu.usage,
                    memory: this.metricsHistory[this.metricsHistory.length - 1].system.memory.percentage,
                    disk: this.metricsHistory[this.metricsHistory.length - 1].system.disk.percentage
                } : null,
                averages: {
                    last1h: this.getRecentAverages(60),
                    last24h: this.getRecentAverages(24 * 60),
                    last7d: this.getRecentAverages(7 * 24 * 60)
                }
            }
        };
    }

    // Group alerts by severity
    groupBySeverity(alerts) {
        return alerts.reduce((acc, alert) => {
            acc[alert.severity] = (acc[alert.severity] || 0) + 1;
            return acc;
        }, {});
    }

    // Group alerts by type
    groupByType(alerts) {
        return alerts.reduce((acc, alert) => {
            acc[alert.type] = (acc[alert.type] || 0) + 1;
            return acc;
        }, {});
    }

    // Get recent averages
    getRecentAverages(minutes) {
        const cutoff = new Date(Date.now() - minutes * 60 * 1000);
        const recentMetrics = this.metricsHistory.filter(m => 
            new Date(m.timestamp) > cutoff
        );

        if (recentMetrics.length === 0) return null;

        return {
            cpu: this.average(recentMetrics.map(m => m.system.cpu.usage)),
            memory: this.average(recentMetrics.map(m => m.system.memory.percentage)),
            disk: this.average(recentMetrics.map(m => m.system.disk.percentage))
        };
    }
}

// Initialize enhanced metrics collector
const metricsCollector = new EnhancedMetricsCollector();

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        features: ['predictions', 'analytics', 'aggregation']
    });
});

// Current metrics with predictions
app.get('/api/metrics', async (req, res) => {
    try {
        const metrics = await metricsCollector.getCompleteMetrics();
        res.json(metrics || { error: 'Failed to collect metrics' });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Metrics history with pagination
app.get('/api/metrics/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const history = metricsCollector.getHistory(limit, offset);
    res.json({ 
        history, 
        count: history.length,
        total: metricsCollector.metricsHistory.length 
    });
});

// Aggregated metrics (hourly/daily)
app.get('/api/metrics/aggregate/:period', (req, res) => {
    const { period } = req.params;
    const data = metricsCollector.getAggregatedData(period);
    res.json({ period, data, count: data.length });
});

// Analytics summary
app.get('/api/metrics/analytics', (req, res) => {
    const analytics = metricsCollector.getAnalytics();
    res.json(analytics);
});

// Alert history
app.get('/api/alerts/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 100;
    const alerts = metricsCollector.getAlertHistory(limit);
    res.json({ alerts, count: alerts.length });
});

// Alert thresholds
app.get('/api/alerts/thresholds', (req, res) => {
    res.json(metricsCollector.alertThresholds);
});

app.put('/api/alerts/thresholds', (req, res) => {
    const { cpu, memory, disk, containerCpu, containerMemory } = req.body;
    
    if (cpu !== undefined) metricsCollector.alertThresholds.cpu = cpu;
    if (memory !== undefined) metricsCollector.alertThresholds.memory = memory;
    if (disk !== undefined) metricsCollector.alertThresholds.disk = disk;
    if (containerCpu !== undefined) metricsCollector.alertThresholds.containerCpu = containerCpu;
    if (containerMemory !== undefined) metricsCollector.alertThresholds.containerMemory = containerMemory;
    
    res.json({ success: true, thresholds: metricsCollector.alertThresholds });
});

// Export metrics data
app.get('/api/metrics/export', (req, res) => {
    const format = req.query.format || 'json';
    const period = req.query.period || 'all';
    
    let data;
    switch (period) {
        case 'hour':
            data = metricsCollector.getHistory(720); // ~1 hour at 5s intervals
            break;
        case 'day':
            data = metricsCollector.getHistory(17280); // ~24 hours
            break;
        case 'week':
            data = metricsCollector.getAggregatedData('hourly');
            break;
        default:
            data = metricsCollector.getHistory(1000);
    }
    
    if (format === 'csv') {
        // Convert to CSV
        const csv = convertToCSV(data);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename=metrics-${period}.csv`);
        res.send(csv);
    } else {
        res.header('Content-Type', 'application/json');
        res.header('Content-Disposition', `attachment; filename=metrics-${period}.json`);
        res.json(data);
    }
});

// Convert metrics to CSV
function convertToCSV(data) {
    if (!data || data.length === 0) return '';
    
    const headers = ['timestamp', 'cpu_usage', 'memory_usage', 'disk_usage', 'containers'];
    const rows = data.map(m => [
        m.timestamp,
        m.system?.cpu?.usage || 0,
        m.system?.memory?.percentage || 0,
        m.system?.disk?.percentage || 0,
        m.containers?.length || 0
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// WebSocket handling with enhanced features
wss.on('connection', (ws) => {
    console.log('Client connected to enhanced metrics WebSocket');
    clients.add(ws);

    // Send initial metrics with predictions
    metricsCollector.getCompleteMetrics().then(metrics => {
        if (metrics && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
        }
    });

    // Send analytics summary
    const analytics = metricsCollector.getAnalytics();
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'analytics', data: analytics }));
    }

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            // Handle client requests
            switch (data.type) {
                case 'subscribe':
                    // Client can subscribe to specific data types
                    ws.subscriptions = data.subscriptions || ['metrics'];
                    break;
                case 'getHistory':
                    const history = metricsCollector.getHistory(data.limit || 50);
                    ws.send(JSON.stringify({ type: 'history', data: history }));
                    break;
            }
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected from enhanced metrics WebSocket');
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Broadcast metrics to all connected clients every 5 seconds
setInterval(async () => {
    if (clients.size > 0) {
        try {
            const metrics = await metricsCollector.getCompleteMetrics();
            if (metrics) {
                const message = JSON.stringify({ type: 'metrics', data: metrics });
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        // Check if client wants this type of data
                        if (!client.subscriptions || client.subscriptions.includes('metrics')) {
                            client.send(message);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error broadcasting metrics:', error);
        }
    }
}, 5000);

// Broadcast analytics updates every minute
setInterval(() => {
    if (clients.size > 0) {
        const analytics = metricsCollector.getAnalytics();
        const message = JSON.stringify({ type: 'analytics', data: analytics });
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                if (!client.subscriptions || client.subscriptions.includes('analytics')) {
                    client.send(message);
                }
            }
        });
    }
}, 60000);

// Start server
const PORT = process.env.PORT || 3008;
server.listen(PORT, () => {
    console.log(`🚀 Enhanced Metrics API Server running on port ${PORT}`);
    console.log(`📊 WebSocket endpoint: ws://localhost:${PORT}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   GET  /api/health - Health check`);
    console.log(`   GET  /api/metrics - Current metrics with predictions`);
    console.log(`   GET  /api/metrics/history - Metrics history`);
    console.log(`   GET  /api/metrics/aggregate/:period - Aggregated data`);
    console.log(`   GET  /api/metrics/analytics - Analytics summary`);
    console.log(`   GET  /api/metrics/export - Export metrics data`);
    console.log(`   GET  /api/alerts/history - Alert history`);
    console.log(`   GET  /api/alerts/thresholds - Alert thresholds`);
    console.log(`   PUT  /api/alerts/thresholds - Update thresholds`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down enhanced metrics server...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Shutting down enhanced metrics server...');
    server.close(() => {
        process.exit(0);
    });
});