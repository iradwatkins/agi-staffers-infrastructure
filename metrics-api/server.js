const express = require('express');
const WebSocket = require('ws');
const si = require('systeminformation');
const Docker = require('dockerode');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const PORT = process.env.PORT || 3009;

// Enable CORS for the dashboard
app.use(cors({
  origin: ['https://admin.agistaffers.com', 'http://localhost:3007']
}));

app.use(express.json());

// Store connected clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);
  
  // Send initial data
  sendMetrics(ws);
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Collect system metrics
async function getSystemMetrics() {
  try {
    const [cpu, mem, disk, network, time] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
      si.time()
    ]);
    
    // Calculate network speed (KB/s)
    const primaryInterface = network[0] || {};
    const rxSpeed = (primaryInterface.rx_sec || 0) / 1024;
    const txSpeed = (primaryInterface.tx_sec || 0) / 1024;
    
    // Get primary disk usage
    const primaryDisk = disk.find(d => d.mount === '/') || disk[0] || {};
    
    return {
      cpu: {
        usage: Math.round(cpu.currentLoad),
        cores: cpu.cpus.length
      },
      memory: {
        total: Math.round(mem.total / (1024 * 1024 * 1024)), // GB
        used: Math.round((mem.total - mem.available) / (1024 * 1024 * 1024)), // GB (actual used, not including cache)
        available: Math.round(mem.available / (1024 * 1024 * 1024)), // GB
        cached: Math.round((mem.cached + mem.buffers) / (1024 * 1024 * 1024)), // GB
        percentage: Math.round(((mem.total - mem.available) / mem.total) * 100) // Real usage percentage
      },
      disk: {
        total: Math.round(primaryDisk.size / (1024 * 1024 * 1024)), // GB
        used: Math.round(primaryDisk.used / (1024 * 1024 * 1024)), // GB
        percentage: Math.round(primaryDisk.use || 0)
      },
      network: {
        rx: Math.round(rxSpeed),
        tx: Math.round(txSpeed)
      },
      uptime: time.uptime,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error collecting system metrics:', error);
    return null;
  }
}

// Get Docker container status with memory usage
async function getContainerStatus() {
  try {
    const containers = await docker.listContainers({ all: true });
    
    // Get detailed stats for each container
    const containerStats = await Promise.all(
      containers.map(async (container) => {
        try {
          const containerObj = docker.getContainer(container.Id);
          const stats = await containerObj.stats({ stream: false });
          
          // Calculate memory usage
          const memUsage = stats.memory_stats.usage || 0;
          const memLimit = stats.memory_stats.limit || 0;
          const memPercent = memLimit > 0 ? (memUsage / memLimit) * 100 : 0;
          
          return {
            id: container.Id.substring(0, 12),
            name: container.Names[0].replace(/^\//, ''),
            status: container.State,
            state: container.Status,
            image: container.Image,
            memUsage: `${Math.round(memUsage / 1024 / 1024)}MiB / ${Math.round(memLimit / 1024 / 1024)}MiB`,
            memPercent: memPercent.toFixed(2),
            ports: container.Ports.map(p => ({
              private: p.PrivatePort,
              public: p.PublicPort,
              type: p.Type
            }))
          };
        } catch (err) {
          // If stats fail, return basic info
          return {
            id: container.Id.substring(0, 12),
            name: container.Names[0].replace(/^\//, ''),
            status: container.State,
            state: container.Status,
            image: container.Image,
            memUsage: 'N/A',
            memPercent: 0,
            ports: container.Ports.map(p => ({
              private: p.PrivatePort,
              public: p.PublicPort,
              type: p.Type
            }))
          };
        }
      })
    );
    
    return containerStats;
  } catch (error) {
    console.error('Error getting container status:', error);
    return [];
  }
}

// Get website-specific metrics
async function getWebsiteMetrics() {
  const websites = [
    { name: 'SteppersLife', domain: 'stepperslife.com' },
    { name: 'Admin Dashboard', domain: 'admin.agistaffers.com' },
    { name: 'N8N Automation', domain: 'n8n.agistaffers.com' },
    { name: 'Flowise AI', domain: 'flowise.agistaffers.com' }
  ];
  
  // For now, return mock data for each website
  // In production, you'd check actual container stats
  return websites.map(site => ({
    name: site.name,
    domain: site.domain,
    cpu: Math.floor(Math.random() * 30) + 5,
    memory: Math.floor(Math.random() * 40) + 10,
    status: 'online',
    responseTime: Math.floor(Math.random() * 200) + 50
  }));
}

// Send metrics to a specific client
async function sendMetrics(ws) {
  try {
    const [system, containers, websites] = await Promise.all([
      getSystemMetrics(),
      getContainerStatus(),
      getWebsiteMetrics()
    ]);
    
    const data = {
      type: 'metrics',
      system,
      containers,
      websites,
      timestamp: new Date().toISOString()
    };
    
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error sending metrics:', error);
  }
}

// Broadcast metrics to all connected clients
async function broadcastMetrics() {
  const promises = Array.from(clients).map(client => sendMetrics(client));
  await Promise.all(promises);
}

// REST API endpoints
app.get('/api/metrics', async (req, res) => {
  try {
    const [system, containers, websites] = await Promise.all([
      getSystemMetrics(),
      getContainerStatus(),
      getWebsiteMetrics()
    ]);
    
    res.json({
      system,
      containers,
      websites,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/metrics:', error);
    res.status(500).json({ error: 'Failed to collect metrics' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    websockets: clients.size,
    timestamp: new Date().toISOString()
  });
});

// Memory optimization endpoints
app.post('/api/optimize/clear-cache', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('sync && echo 1 > /proc/sys/vm/drop_caches', (error, stdout, stderr) => {
      if (error) {
        console.error('Cache clear error:', error);
        return res.status(500).json({ error: 'Failed to clear cache' });
      }
      res.json({ success: true, message: 'Cache cleared successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/optimize/ollama-unload', async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('docker exec ollama sh -c "ollama list | tail -n +2 | awk \'{print $1}\' | xargs -I {} ollama rm {}"', (error, stdout, stderr) => {
      if (error) {
        console.error('Ollama unload error:', error);
        return res.status(500).json({ error: 'Failed to unload models' });
      }
      // Count unloaded models from output
      const unloaded = stdout.split('\n').filter(line => line.trim()).length;
      res.json({ success: true, unloaded, message: `Unloaded ${unloaded} models` });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/optimize/restart-noncritical', async (req, res) => {
  try {
    const nonCritical = ['pgadmin', 'portainer'];
    const results = await Promise.all(
      nonCritical.map(async (name) => {
        try {
          const container = docker.getContainer(name);
          await container.restart();
          return { name, status: 'restarted' };
        } catch (err) {
          return { name, status: 'error', error: err.message };
        }
      })
    );
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get optimization stats
app.get('/api/optimize/stats', async (req, res) => {
  try {
    const { exec } = require('child_process');
    const stats = {
      lastOptimization: new Date().toISOString(),
      modelsUnloaded: 0,
      memorySaved: 0,
      activeOptimizations: 4
    };
    
    // Check if Ollama has models loaded
    exec('docker exec ollama ollama list 2>/dev/null | tail -n +2 | wc -l', (error, stdout) => {
      if (!error) {
        stats.modelsLoaded = parseInt(stdout.trim()) || 0;
      }
      res.json(stats);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start periodic metrics broadcast
setInterval(broadcastMetrics, 2000); // Every 2 seconds

// Start server
server.listen(PORT, () => {
  console.log(`Metrics API server running on port ${PORT}`);
  console.log(`WebSocket server ready for connections`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});