// Enhanced Real-time Monitoring Module with API Gateway Support
class ServerMonitor {
    constructor() {
        this.charts = {};
        this.websocket = null;
        this.reconnectInterval = 5000;
        this.maxDataPoints = 50;
        
        // API Gateway Configuration - Auto-detect best endpoint
        this.apiEndpoints = [
            // Primary: Use API Gateway when available (better performance + CORS)
            'https://api.agistaffers.com/api/metrics',
            // Fallback: Direct origin server
            'https://origin.agistaffers.com/api/metrics',
            // Local fallback: Relative path (if proxied)
            '/api/metrics'
        ];
        
        this.currentEndpoint = null;
        this.wsUrl = null; // Disable WebSocket for now, use polling
        this.isConnected = false;
        this.lastMetricsTime = null;
        this.endpointTestResults = new Map();
        
        // Initialize data arrays
        this.data = {
            cpu: [],
            memory: [],
            disk: [],
            network: { in: [], out: [] },
            containers: [],
            timestamps: []
        };
        
        // Color scheme
        this.colors = {
            cpu: 'rgb(255, 99, 132)',
            memory: 'rgb(54, 162, 235)',
            disk: 'rgb(255, 206, 86)',
            networkIn: 'rgb(75, 192, 192)',
            networkOut: 'rgb(153, 102, 255)'
        };
        
        // Enhanced container mapping
        this.containerMapping = {
            'pgadmin': { displayName: 'PgAdmin', icon: 'database' },
            'n8n': { displayName: 'n8n Automation', icon: 'git-branch' },
            'open-webui': { displayName: 'AI Chat', icon: 'message-square' },
            'flowise': { displayName: 'Flowise AI', icon: 'cpu' },
            'portainer': { displayName: 'Portainer', icon: 'box' },
            'searxng': { displayName: 'SearXNG', icon: 'search' },
            'admin-dashboard': { displayName: 'Admin Dashboard', icon: 'layout' },
            'stepperslife': { displayName: 'SteppersLife', icon: 'globe' },
            'caddy': { displayName: 'Caddy Server', icon: 'shield' },
            'ollama': { displayName: 'Ollama AI', icon: 'brain' },
            'metrics-api': { displayName: 'Metrics API', icon: 'activity' },
            'postgresql': { displayName: 'PostgreSQL', icon: 'database' },
            'stepperslife-db': { displayName: 'SteppersLife DB', icon: 'database' },
            'localai-neo4j-1': { displayName: 'Neo4j Graph', icon: 'share-2' },
            'prometheus': { displayName: 'Prometheus', icon: 'bar-chart-2' },
            'grafana': { displayName: 'Grafana', icon: 'trending-up' },
            'minio': { displayName: 'MinIO', icon: 'hard-drive' },
            'vault': { displayName: 'Vault', icon: 'lock' },
            'jaeger': { displayName: 'Jaeger', icon: 'search' },
            'uptime-kuma': { displayName: 'Uptime Monitor', icon: 'heart' }
        };
    }

    async findBestEndpoint() {
        console.log('🔍 Testing API endpoints for best performance...');
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.innerHTML = '<span class="status-testing">🔍 Finding best API endpoint...</span>';
        }

        for (const endpoint of this.apiEndpoints) {
            try {
                console.log(`Testing endpoint: ${endpoint}`);
                const startTime = Date.now();
                
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'no-cache'
                    },
                    timeout: 5000
                });
                
                const responseTime = Date.now() - startTime;
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Validate response structure
                    if (data && typeof data === 'object' && 
                        ('containers' in data || 'cpu' in data || 'memory' in data)) {
                        
                        this.currentEndpoint = endpoint;
                        this.endpointTestResults.set(endpoint, {
                            success: true,
                            responseTime,
                            timestamp: Date.now()
                        });
                        
                        console.log(`✅ Found working endpoint: ${endpoint} (${responseTime}ms)`);
                        
                        if (statusElement) {
                            const endpointType = endpoint.includes('api.agistaffers.com') ? '🚀 API Gateway' :
                                                endpoint.includes('origin.agistaffers.com') ? '🎯 Origin Server' : '📍 Local Proxy';
                            statusElement.innerHTML = `<span class="status-connected">${endpointType} (${responseTime}ms)</span>`;
                        }
                        
                        return endpoint;
                    }
                }
            } catch (error) {
                console.log(`❌ Endpoint failed: ${endpoint} - ${error.message}`);
                this.endpointTestResults.set(endpoint, {
                    success: false,
                    error: error.message,
                    timestamp: Date.now()
                });
            }
        }
        
        console.error('❌ No working API endpoints found');
        if (statusElement) {
            statusElement.innerHTML = '<span class="status-error">❌ No API endpoints available</span>';
        }
        return null;
    }

    async fetchMetrics() {
        if (!this.currentEndpoint) {
            this.currentEndpoint = await this.findBestEndpoint();
            if (!this.currentEndpoint) {
                console.error('No working API endpoint available');
                return null;
            }
        }

        try {
            const response = await fetch(this.currentEndpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.lastMetricsTime = Date.now();
                this.isConnected = true;
                return data;
            } else {
                console.error('Metrics API error:', response.status, response.statusText);
                // Try to find another endpoint
                this.currentEndpoint = null;
                return null;
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
            this.isConnected = false;
            // Try to find another endpoint on next call
            this.currentEndpoint = null;
            return null;
        }
    }

    // Add endpoint status to dashboard
    displayEndpointStatus() {
        const statusHtml = `
            <div class="endpoint-status" style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                <h4>🔗 API Endpoint Status</h4>
                <div id="connection-status">Checking endpoints...</div>
                <div class="endpoint-details" style="font-size: 0.8em; margin-top: 5px;">
                    ${Array.from(this.endpointTestResults.entries()).map(([endpoint, result]) => `
                        <div style="margin: 2px 0;">
                            ${result.success ? '✅' : '❌'} ${endpoint} 
                            ${result.success ? `(${result.responseTime}ms)` : `- ${result.error}`}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert before the first metric card
        const metricsContainer = document.querySelector('.metrics-grid') || document.querySelector('.container');
        if (metricsContainer && !document.querySelector('.endpoint-status')) {
            metricsContainer.insertAdjacentHTML('afterbegin', statusHtml);
        }
    }

    async init() {
        console.log('🚀 Initializing Enhanced Server Monitor with API Gateway Support');
        
        // Find the best endpoint first
        await this.findBestEndpoint();
        
        // Display endpoint status in UI
        this.displayEndpointStatus();
        
        // Start data collection
        this.startDataCollection();
        
        console.log('✅ Server Monitor initialized successfully');
    }

    // Rest of the existing methods remain the same...
    async startDataCollection() {
        const fetchData = async () => {
            const data = await this.fetchMetrics();
            if (data) {
                this.updateData(data);
            }
        };

        // Initial fetch
        await fetchData();
        
        // Set up periodic updates
        setInterval(fetchData, 5000); // Every 5 seconds
    }

    updateData(newData) {
        const timestamp = new Date().toLocaleTimeString();
        
        // Update CPU data
        if (newData.cpu !== undefined) {
            this.data.cpu.push(newData.cpu);
            if (this.data.cpu.length > this.maxDataPoints) {
                this.data.cpu.shift();
            }
        }

        // Update Memory data
        if (newData.memory && newData.memory.percent !== undefined) {
            this.data.memory.push(newData.memory.percent);
            if (this.data.memory.length > this.maxDataPoints) {
                this.data.memory.shift();
            }
        }

        // Update Disk data
        if (newData.disk && newData.disk.percent !== undefined) {
            this.data.disk.push(newData.disk.percent);
            if (this.data.disk.length > this.maxDataPoints) {
                this.data.disk.shift();
            }
        }

        // Update Network data
        if (newData.network) {
            // Handle both rx/tx and in/out formats
            const networkIn = newData.network.rx || newData.network.in || 0;
            const networkOut = newData.network.tx || newData.network.out || 0;
            
            this.data.network.in.push(networkIn);
            this.data.network.out.push(networkOut);
            
            if (this.data.network.in.length > this.maxDataPoints) {
                this.data.network.in.shift();
                this.data.network.out.shift();
            }
        }

        // Update Container data
        if (newData.containers) {
            this.data.containers = newData.containers;
        }

        // Update timestamps
        this.data.timestamps.push(timestamp);
        if (this.data.timestamps.length > this.maxDataPoints) {
            this.data.timestamps.shift();
        }

        // Update UI
        this.updateUI(newData);
    }

    updateUI(data) {
        // Update connection status
        this.updateConnectionStatus(true);
        
        // Update metric displays
        this.updateMetricCard('cpu', data.cpu, '%');
        this.updateMetricCard('memory', data.memory?.percent, '%');
        this.updateMetricCard('disk', data.disk?.percent, '%');
        
        // Update network
        if (data.network) {
            const networkIn = data.network.rx || data.network.in || 0;
            const networkOut = data.network.tx || data.network.out || 0;
            this.updateNetworkDisplay(networkIn, networkOut);
        }
        
        // Update containers
        if (data.containers) {
            this.updateContainerStatus(data.containers);
        }
        
        // Update charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.updateCharts();
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connection-status');
        if (statusElement && this.currentEndpoint) {
            const endpointType = this.currentEndpoint.includes('api.agistaffers.com') ? '🚀 API Gateway' :
                                this.currentEndpoint.includes('origin.agistaffers.com') ? '🎯 Origin Server' : '📍 Local Proxy';
            
            if (connected) {
                statusElement.innerHTML = `<span class="status-connected">${endpointType} ✅ Connected</span>`;
            } else {
                statusElement.innerHTML = `<span class="status-error">${endpointType} ❌ Disconnected</span>`;
            }
        }
    }

    updateMetricCard(type, value, unit) {
        const element = document.getElementById(type);
        if (element && value !== undefined) {
            element.textContent = `${Math.round(value)}${unit}`;
            
            // Add color coding based on value
            const parent = element.parentElement;
            if (parent) {
                parent.className = parent.className.replace(/\s*(status-\w+)/g, '');
                if (value > 90) parent.classList.add('status-critical');
                else if (value > 75) parent.classList.add('status-warning');
                else parent.classList.add('status-good');
            }
        }
    }

    updateNetworkDisplay(networkIn, networkOut) {
        const formatBytes = (bytes) => {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        };

        const inElement = document.getElementById('network-in');
        const outElement = document.getElementById('network-out');
        
        if (inElement) inElement.textContent = formatBytes(networkIn);
        if (outElement) outElement.textContent = formatBytes(networkOut);
    }

    updateContainerStatus(containers) {
        const containerElement = document.getElementById('containers');
        if (!containerElement) return;

        const runningContainers = containers.filter(c => c.status && c.status.toLowerCase().includes('up'));
        const totalContainers = containers.length;

        containerElement.innerHTML = `
            <div class="container-summary">
                <span class="container-count">${runningContainers.length}/${totalContainers}</span>
                <span class="container-label">Running</span>
            </div>
            <div class="container-list">
                ${containers.map(container => {
                    const name = container.name || container.Names?.[0]?.replace('/', '') || 'Unknown';
                    const isRunning = container.status && container.status.toLowerCase().includes('up');
                    const mapping = this.containerMapping[name] || { displayName: name, icon: 'box' };
                    
                    return `
                        <div class="container-item ${isRunning ? 'running' : 'stopped'}">
                            <span class="container-icon">${this.getIcon(mapping.icon)}</span>
                            <span class="container-name">${mapping.displayName}</span>
                            <span class="container-status">${isRunning ? '🟢' : '🔴'}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    updateCharts() {
        // Update CPU chart
        if (this.charts.cpu && this.data.cpu.length > 0) {
            this.charts.cpu.data.labels = this.data.timestamps;
            this.charts.cpu.data.datasets[0].data = this.data.cpu;
            this.charts.cpu.update('none');
        }

        // Update Memory chart
        if (this.charts.memory && this.data.memory.length > 0) {
            this.charts.memory.data.labels = this.data.timestamps;
            this.charts.memory.data.datasets[0].data = this.data.memory;
            this.charts.memory.update('none');
        }

        // Update Network chart
        if (this.charts.network && this.data.network.in.length > 0) {
            this.charts.network.data.labels = this.data.timestamps;
            this.charts.network.data.datasets[0].data = this.data.network.in;
            this.charts.network.data.datasets[1].data = this.data.network.out;
            this.charts.network.update('none');
        }
    }

    getIcon(iconName) {
        const icons = {
            'database': '🗄️',
            'git-branch': '🔀',
            'message-square': '💬',
            'cpu': '🧠',
            'box': '📦',
            'search': '🔍',
            'layout': '📊',
            'globe': '🌐',
            'shield': '🛡️',
            'brain': '🤖',
            'activity': '📈',
            'share-2': '🔗',
            'bar-chart-2': '📊',
            'trending-up': '📈',
            'hard-drive': '💾',
            'lock': '🔒',
            'heart': '💓'
        };
        return icons[iconName] || '📦';
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.serverMonitor = new ServerMonitor();
        window.serverMonitor.init();
    });
} else {
    window.serverMonitor = new ServerMonitor();
    window.serverMonitor.init();
}

// Export for manual initialization if needed
window.ServerMonitor = ServerMonitor;