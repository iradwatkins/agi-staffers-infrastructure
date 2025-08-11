const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { exec, spawn } = require('child_process');
const os = require('os');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const cors = require('cors');
const archiver = require('archiver');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Store connected WebSocket clients
const clients = new Set();

// Metrics collection class
class MetricsCollector {
    constructor() {
        this.metricsHistory = [];
        this.maxHistorySize = 100;
        this.alertThresholds = {
            cpu: 80,
            memory: 85,
            disk: 90,
            containerCpu: 50,
            containerMemory: 80
        };
    }

    // Get system metrics
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
            exec('top -bn1 | grep "Cpu(s)" | awk "{print \$2}" | cut -d"%" -f1', (error, stdout) => {
                if (error) {
                    // Fallback to os.loadavg()
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
        
        return new Promise((resolve) => {
            // Try to get cached memory info on Linux
            exec('free -m | awk "NR==2{printf \"%s %s %s\", \$3, \$7, \$2}"', (error, stdout) => {
                if (error) {
                    // Fallback to Node.js os module
                    resolve({
                        total: Math.round(totalMem / (1024 * 1024 * 1024) * 100) / 100,
                        used: Math.round(usedMem / (1024 * 1024 * 1024) * 100) / 100,
                        available: Math.round(freeMem / (1024 * 1024 * 1024) * 100) / 100,
                        cached: 0,
                        percentage: Math.round((usedMem / totalMem) * 100 * 100) / 100
                    });
                } else {
                    const [used, available, total] = stdout.trim().split(' ').map(val => parseInt(val) || 0);
                    resolve({
                        total: Math.round(total / 1024 * 100) / 100,
                        used: Math.round(used / 1024 * 100) / 100,
                        available: Math.round(available / 1024 * 100) / 100,
                        cached: Math.round((total - used - available) / 1024 * 100) / 100,
                        percentage: Math.round((used / total) * 100 * 100) / 100
                    });
                }
            });
        });
    }

    // Get disk information
    async getDiskInfo() {
        return new Promise((resolve) => {
            exec('df -h / | tail -1 | awk "{print \$2, \$3, \$5}"', (error, stdout) => {
                if (error) {
                    // Fallback values
                    resolve({ total: 193, used: 34, percentage: 18 });
                } else {
                    const parts = stdout.trim().split(' ');
                    const total = parseFloat(parts[0]) || 193;
                    const used = parseFloat(parts[1]) || 34;
                    const percentage = parseInt(parts[2]) || 18;
                    
                    resolve({
                        total: Math.round(total),
                        used: Math.round(used),
                        percentage: percentage
                    });
                }
            });
        });
    }

    // Get network statistics
    async getNetworkStats() {
        return new Promise((resolve) => {
            exec('cat /proc/net/dev | grep eth0 || cat /proc/net/dev | grep ens', (error, stdout) => {
                if (error) {
                    // Fallback values
                    resolve({ rx: 125, tx: 89 });
                } else {
                    const lines = stdout.trim().split('\n');
                    if (lines.length > 0) {
                        const parts = lines[0].split(/\s+/);
                        const rx = Math.round((parseInt(parts[1]) || 0) / 1024); // Convert to KB
                        const tx = Math.round((parseInt(parts[9]) || 0) / 1024); // Convert to KB
                        resolve({ rx, tx });
                    } else {
                        resolve({ rx: 125, tx: 89 });
                    }
                }
            });
        });
    }

    // Get system uptime
    async getUptime() {
        return Math.floor(os.uptime());
    }

    // Get Docker container stats
    async getContainerStats() {
        return new Promise((resolve) => {
            exec('docker stats --no-stream --format "table {{.Name}}\t{{.Image}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | tail -n +2', (error, stdout) => {
                if (error) {
                    console.error('Error getting container stats:', error);
                    resolve([]);
                    return;
                }

                const containers = stdout.trim().split('\n')
                    .filter(line => line.trim())
                    .map(line => {
                        const parts = line.split('\t').map(part => part.trim());
                        if (parts.length >= 5) {
                            return {
                                name: parts[0],
                                image: parts[1],
                                cpu: parts[2],
                                memUsage: parts[3],
                                memPercent: parts[4].replace('%', ''),
                                status: 'running'
                            };
                        }
                        return null;
                    })
                    .filter(container => container !== null);

                resolve(containers);
            });
        });
    }

    // Get complete metrics including containers
    async getCompleteMetrics() {
        try {
            const [systemMetrics, containers] = await Promise.all([
                this.getSystemMetrics(),
                this.getContainerStats()
            ]);

            const metrics = {
                ...systemMetrics,
                containers: containers
            };

            // Store in history
            this.metricsHistory.push(metrics);
            if (this.metricsHistory.length > this.maxHistorySize) {
                this.metricsHistory.shift();
            }

            // Check for alerts
            this.checkAlerts(metrics);

            return metrics;
        } catch (error) {
            console.error('Error collecting complete metrics:', error);
            return null;
        }
    }

    // Check for alert conditions
    checkAlerts(metrics) {
        const alerts = [];

        if (metrics.system.cpu.usage > this.alertThresholds.cpu) {
            alerts.push({
                type: 'cpu',
                severity: 'warning',
                message: `High CPU usage: ${metrics.system.cpu.usage}%`,
                timestamp: new Date().toISOString()
            });
        }

        if (metrics.system.memory.percentage > this.alertThresholds.memory) {
            alerts.push({
                type: 'memory',
                severity: 'warning', 
                message: `High memory usage: ${metrics.system.memory.percentage}%`,
                timestamp: new Date().toISOString()
            });
        }

        if (metrics.system.disk.percentage > this.alertThresholds.disk) {
            alerts.push({
                type: 'disk',
                severity: 'critical',
                message: `High disk usage: ${metrics.system.disk.percentage}%`,
                timestamp: new Date().toISOString()
            });
        }

        // Check container alerts
        metrics.containers.forEach(container => {
            const cpuPercent = parseFloat(container.cpu);
            const memPercent = parseFloat(container.memPercent);

            if (cpuPercent > this.alertThresholds.containerCpu) {
                alerts.push({
                    type: 'container',
                    severity: 'warning',
                    message: `High CPU usage in ${container.name}: ${container.cpu}`,
                    timestamp: new Date().toISOString()
                });
            }

            if (memPercent > this.alertThresholds.containerMemory) {
                alerts.push({
                    type: 'container',
                    severity: 'warning',
                    message: `High memory usage in ${container.name}: ${container.memPercent}%`,
                    timestamp: new Date().toISOString()
                });
            }
        });

        if (alerts.length > 0) {
            this.broadcastAlerts(alerts);
        }
    }

    // Broadcast alerts to connected clients
    broadcastAlerts(alerts) {
        const alertMessage = {
            type: 'alerts',
            data: alerts,
            timestamp: new Date().toISOString()
        };

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(alertMessage));
            }
        });

        console.log(`Sent ${alerts.length} alerts to ${clients.size} clients`);
    }

    // Get metrics history
    getHistory(limit = 50) {
        return this.metricsHistory.slice(-limit);
    }
}

// Initialize metrics collector
const metricsCollector = new MetricsCollector();

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/metrics', async (req, res) => {
    try {
        const metrics = await metricsCollector.getCompleteMetrics();
        res.json(metrics || { error: 'Failed to collect metrics' });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/metrics/history', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const history = metricsCollector.getHistory(limit);
    res.json({ history, count: history.length });
});

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

// Backup Management API Routes
const BACKUP_DIR = '/backup';

// Backup management helper functions
async function scanBackupDirectory() {
    const backups = [];
    
    try {
        const subdirs = ['docker-volumes', 'postgresql', 'websites', 'scripts'];
        
        for (const subdir of subdirs) {
            const subdirPath = path.join(BACKUP_DIR, subdir);
            
            try {
                const files = await fs.readdir(subdirPath);
                
                for (const file of files) {
                    if (file.endsWith('.tar.gz') || file.endsWith('.sql') || file.endsWith('.zip')) {
                        const filePath = path.join(subdirPath, file);
                        const stats = await fs.stat(filePath);
                        
                        backups.push({
                            name: file,
                            path: subdirPath,
                            fullPath: filePath,
                            size: formatBytes(stats.size),
                            sizeBytes: stats.size,
                            type: subdir,
                            date: stats.mtime.toISOString().slice(0, 19).replace('T', ' '),
                            age: getAgeCategory(stats.mtime),
                            mtime: stats.mtime
                        });
                    }
                }
            } catch (error) {
                console.warn(`Warning: Could not scan ${subdir}:`, error.message);
            }
        }
        
        backups.sort((a, b) => b.mtime - a.mtime);
        
    } catch (error) {
        console.error('Error scanning backup directory:', error);
    }
    
    return backups;
}

async function findBackupFile(filename) {
    const subdirs = ['docker-volumes', 'postgresql', 'websites', 'scripts'];
    
    for (const subdir of subdirs) {
        const filePath = path.join(BACKUP_DIR, subdir, filename);
        
        try {
            await fs.access(filePath);
            return filePath;
        } catch (error) {
            // File doesn't exist in this directory, continue
        }
    }
    
    return null;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getAgeCategory(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    if (diffHours < 24) return 'today';
    if (diffDays <= 7) return 'week';
    if (diffDays <= 30) return 'month';
    return 'old';
}

// Get list of all backups with metadata
app.get('/api/backups', async (req, res) => {
    try {
        const backups = await scanBackupDirectory();
        const totalSize = backups.reduce((sum, backup) => sum + backup.sizeBytes, 0);
        
        res.json({
            backups,
            stats: {
                total: backups.length,
                totalSize,
                totalSizeFormatted: formatBytes(totalSize)
            }
        });
    } catch (error) {
        console.error('Error listing backups:', error);
        res.status(500).json({ error: 'Failed to list backups' });
    }
});

// Download a specific backup file
app.get('/api/backups/download/:filename', async (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = await findBackupFile(filename);
        
        if (!filePath) {
            return res.status(404).json({ error: 'Backup file not found' });
        }

        // Security check - ensure file is in backup directory
        const resolvedPath = path.resolve(filePath);
        const backupDirResolved = path.resolve(BACKUP_DIR);
        
        if (!resolvedPath.startsWith(backupDirResolved)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/gzip');
        
        // Stream the file
        const fileStream = fsSync.createReadStream(filePath);
        fileStream.pipe(res);
        
        fileStream.on('error', (error) => {
            console.error('File stream error:', error);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to download file' });
            }
        });
        
    } catch (error) {
        console.error('Error downloading backup:', error);
        res.status(500).json({ error: 'Failed to download backup' });
    }
});

// Delete a specific backup file
app.delete('/api/backups/delete/:filename', async (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = await findBackupFile(filename);
        
        if (!filePath) {
            return res.status(404).json({ error: 'Backup file not found' });
        }

        // Security check
        const resolvedPath = path.resolve(filePath);
        const backupDirResolved = path.resolve(BACKUP_DIR);
        
        if (!resolvedPath.startsWith(backupDirResolved)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete the file
        await fs.unlink(filePath);
        
        res.json({ 
            success: true, 
            message: `Deleted backup: ${filename}` 
        });
        
    } catch (error) {
        console.error('Error deleting backup:', error);
        res.status(500).json({ error: 'Failed to delete backup' });
    }
});

// Get backup storage statistics
app.get('/api/backups/stats', async (req, res) => {
    try {
        // Get disk usage of backup directory
        const { stdout } = await new Promise((resolve, reject) => {
            const proc = spawn('du', ['-sh', BACKUP_DIR], { stdio: 'pipe' });
            let stdout = '';
            let stderr = '';
            
            proc.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            
            proc.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            
            proc.on('close', (code) => {
                if (code === 0) {
                    resolve({ stdout, stderr });
                } else {
                    reject(new Error(`du command failed: ${stderr}`));
                }
            });
        });
        
        const sizeMatch = stdout.match(/^(\S+)/);
        const totalSize = sizeMatch ? sizeMatch[1] : 'Unknown';
        
        // Get total disk space
        const { stdout: dfOutput } = await new Promise((resolve, reject) => {
            const proc = spawn('df', ['-h', '/'], { stdio: 'pipe' });
            let stdout = '';
            
            proc.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            
            proc.on('close', (code) => {
                resolve({ stdout });
            });
        });
        
        const dfLines = dfOutput.trim().split('\n');
        const dfData = dfLines[1].split(/\s+/);
        const totalDisk = dfData[1];
        const usedDisk = dfData[2];
        const availableDisk = dfData[3];
        const usagePercent = dfData[4];
        
        res.json({
            backupSize: totalSize,
            totalDisk,
            usedDisk,
            availableDisk,
            usagePercent,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error getting backup stats:', error);
        res.status(500).json({
            error: 'Failed to get statistics',
            timestamp: new Date().toISOString()
        });
    }
});

// WebSocket handling
wss.on('connection', (ws) => {
    console.log('Client connected to metrics WebSocket');
    clients.add(ws);

    // Send initial metrics
    metricsCollector.getCompleteMetrics().then(metrics => {
        if (metrics && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'metrics', data: metrics }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected from metrics WebSocket');
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
                        client.send(message);
                    }
                });
            }
        } catch (error) {
            console.error('Error broadcasting metrics:', error);
        }
    }
}, 5000);

// Start server
const PORT = process.env.PORT || 3008;
server.listen(PORT, () => {
    console.log(`🚀 Metrics API Server running on port ${PORT}`);
    console.log(`📊 WebSocket endpoint: ws://localhost:${PORT}`);
    console.log(`🔗 API endpoints:`);
    console.log(`   GET /api/health - Health check`);
    console.log(`   GET /api/metrics - Current metrics`);
    console.log(`   GET /api/metrics/history - Metrics history`);
    console.log(`   GET /api/alerts/thresholds - Alert thresholds`);
    console.log(`   PUT /api/alerts/thresholds - Update thresholds`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down metrics server...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('Shutting down metrics server...');
    server.close(() => {
        process.exit(0);
    });
});