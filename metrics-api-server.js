// Metrics API Server for AGI Staffers Dashboard
const express = require('express');
const si = require('systeminformation');
const Docker = require('dockerode');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3009;
const docker = new Docker();

// Enable CORS
app.use(cors({
    origin: ['https://admin.agistaffers.com', 'https://agistaffers.com', 'http://localhost:3007'],
    credentials: true
}));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Main metrics endpoint
app.get('/api/metrics', async (req, res) => {
    try {
        const [cpu, memory, disk, network, containers] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
            getContainerStats()
        ]);

        const metrics = {
            timestamp: Date.now(),
            cpu: {
                usage: cpu.currentLoad.toFixed(2),
                cores: cpu.cpus.length
            },
            memory: {
                total: formatBytes(memory.total),
                used: formatBytes(memory.used),
                free: formatBytes(memory.free),
                percentage: ((memory.used / memory.total) * 100).toFixed(2)
            },
            disk: {
                total: formatBytes(disk[0].size),
                used: formatBytes(disk[0].used),
                free: formatBytes(disk[0].size - disk[0].used),
                percentage: disk[0].use.toFixed(2)
            },
            network: {
                rx: formatBytes(network[0].rx_sec),
                tx: formatBytes(network[0].tx_sec),
                interface: network[0].iface
            },
            containers: containers
        };

        res.json(metrics);
    } catch (error) {
        console.error('Metrics error:', error);
        res.status(500).json({ error: 'Failed to fetch metrics' });
    }
});

// Get Docker container stats
async function getContainerStats() {
    try {
        const containers = await docker.listContainers({ all: true });
        return containers.map(container => ({
            id: container.Id.substring(0, 12),
            name: container.Names[0].replace('/', ''),
            image: container.Image,
            status: container.Status,
            state: container.State,
            ports: container.Ports
        }));
    } catch (error) {
        console.error('Docker error:', error);
        return [];
    }
}

// Helper function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Start server
app.listen(port, () => {
    console.log(`🎯 Metrics API running on port ${port}`);
});