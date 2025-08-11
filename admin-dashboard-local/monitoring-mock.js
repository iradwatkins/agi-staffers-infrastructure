// Real-time Monitoring Module for AGI Staffers Dashboard
class ServerMonitor {
    constructor() {
        this.charts = {};
        this.websocket = null;
        this.reconnectInterval = 5000;
        this.maxDataPoints = 50;
        this.mockMode = true; // Start in mock mode for development
        
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
    }

    // Initialize monitoring
    init() {
        this.setupCharts();
        if (this.mockMode) {
            this.startMockData();
        } else {
            this.connectWebSocket();
        }
    }

    // Setup Chart.js charts
    setupCharts() {
        // CPU Usage Chart
        const cpuCtx = document.getElementById('cpuChart');
        if (cpuCtx) {
            this.charts.cpu = new Chart(cpuCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'CPU Usage (%)',
                        data: [],
                        borderColor: this.colors.cpu,
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Memory Usage Chart
        const memoryCtx = document.getElementById('memoryChart');
        if (memoryCtx) {
            this.charts.memory = new Chart(memoryCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Memory Usage (%)',
                        data: [],
                        borderColor: this.colors.memory,
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Disk Usage Chart (Doughnut)
        const diskCtx = document.getElementById('diskChart');
        if (diskCtx) {
            this.charts.disk = new Chart(diskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Used', 'Free'],
                    datasets: [{
                        data: [32, 68],
                        backgroundColor: [
                            this.colors.disk,
                            'rgba(200, 200, 200, 0.3)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Network Traffic Chart
        const networkCtx = document.getElementById('networkChart');
        if (networkCtx) {
            this.charts.network = new Chart(networkCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Inbound (MB/s)',
                        data: [],
                        borderColor: this.colors.networkIn,
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Outbound (MB/s)',
                        data: [],
                        borderColor: this.colors.networkOut,
                        backgroundColor: 'rgba(153, 102, 255, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    // Connect to WebSocket for real-time data
    connectWebSocket() {
        const wsUrl = 'wss://admin.agistaffers.com/ws/metrics';
        
        try {
            this.websocket = new WebSocket(wsUrl);
            
            this.websocket.onopen = () => {
                console.log('Connected to metrics WebSocket');
                this.updateConnectionStatus(true);
            };
            
            this.websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.updateMetrics(data);
            };
            
            this.websocket.onclose = () => {
                console.log('Disconnected from metrics WebSocket');
                this.updateConnectionStatus(false);
                // Reconnect after interval
                setTimeout(() => this.connectWebSocket(), this.reconnectInterval);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            // Fall back to mock data
            this.startMockData();
        }
    }

    // Start mock data generation for development
    startMockData() {
        console.log('Starting mock data generation');
        this.updateConnectionStatus(true, true);
        
        // Generate initial data
        this.generateMockData();
        
        // Update every 2 seconds
        this.mockInterval = setInterval(() => {
            this.generateMockData();
        }, 2000);
    }

    // Generate mock metrics data
    generateMockData() {
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        
        const mockData = {
            cpu: Math.random() * 30 + 20, // 20-50%
            memory: Math.random() * 20 + 40, // 40-60%
            disk: 32, // Static 32%
            network: {
                in: Math.random() * 5,
                out: Math.random() * 3
            },
            containers: [
                { name: 'nginx', status: 'running', cpu: Math.random() * 10, memory: Math.random() * 100 },
                { name: 'postgres', status: 'running', cpu: Math.random() * 20, memory: Math.random() * 500 },
                { name: 'admin-dashboard', status: 'running', cpu: Math.random() * 5, memory: Math.random() * 200 },
                { name: 'portainer', status: 'running', cpu: Math.random() * 5, memory: Math.random() * 150 }
            ]
        };
        
        this.updateMetrics(mockData);
    }

    // Update metrics with new data
    updateMetrics(data) {
        const timestamp = new Date().toLocaleTimeString();
        
        // Update data arrays
        this.data.cpu.push(data.cpu);
        this.data.memory.push(data.memory);
        this.data.network.in.push(data.network.in);
        this.data.network.out.push(data.network.out);
        this.data.timestamps.push(timestamp);
        
        // Keep only recent data points
        if (this.data.timestamps.length > this.maxDataPoints) {
            this.data.cpu.shift();
            this.data.memory.shift();
            this.data.network.in.shift();
            this.data.network.out.shift();
            this.data.timestamps.shift();
        }
        
        // Update charts
        this.updateCharts();
        
        // Update text displays
        this.updateTextDisplays(data);
        
        // Update container list
        this.updateContainerList(data.containers);
    }

    // Update all charts with new data
    updateCharts() {
        // CPU Chart
        if (this.charts.cpu) {
            this.charts.cpu.data.labels = this.data.timestamps;
            this.charts.cpu.data.datasets[0].data = this.data.cpu;
            this.charts.cpu.update('none');
        }
        
        // Memory Chart
        if (this.charts.memory) {
            this.charts.memory.data.labels = this.data.timestamps;
            this.charts.memory.data.datasets[0].data = this.data.memory;
            this.charts.memory.update('none');
        }
        
        // Disk Chart
        if (this.charts.disk && this.data.cpu.length > 0) {
            const diskUsed = 32; // Static for now
            this.charts.disk.data.datasets[0].data = [diskUsed, 100 - diskUsed];
            this.charts.disk.update('none');
        }
        
        // Network Chart
        if (this.charts.network) {
            this.charts.network.data.labels = this.data.timestamps;
            this.charts.network.data.datasets[0].data = this.data.network.in;
            this.charts.network.data.datasets[1].data = this.data.network.out;
            this.charts.network.update('none');
        }
    }

    // Update text displays
    updateTextDisplays(data) {
        // CPU
        const cpuElement = document.getElementById('cpu-value');
        if (cpuElement) {
            cpuElement.textContent = data.cpu.toFixed(1) + '%';
        }
        
        // Memory
        const memoryElement = document.getElementById('memory-value');
        if (memoryElement) {
            memoryElement.textContent = data.memory.toFixed(1) + '%';
        }
        
        // Disk
        const diskElement = document.getElementById('disk-value');
        if (diskElement) {
            diskElement.textContent = data.disk + '%';
        }
        
        // Network
        const networkInElement = document.getElementById('network-in-value');
        if (networkInElement) {
            networkInElement.textContent = data.network.in.toFixed(2) + ' MB/s';
        }
        
        const networkOutElement = document.getElementById('network-out-value');
        if (networkOutElement) {
            networkOutElement.textContent = data.network.out.toFixed(2) + ' MB/s';
        }
    }

    // Update container list
    updateContainerList(containers) {
        const containerList = document.getElementById('container-list');
        if (!containerList) return;
        
        containerList.innerHTML = containers.map(container => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full ${container.status === 'running' ? 'bg-green-500' : 'bg-red-500'} mr-3"></div>
                    <div>
                        <span class="font-medium text-gray-700">${container.name}</span>
                        <span class="text-xs text-gray-500 ml-2">CPU: ${container.cpu.toFixed(1)}% | RAM: ${container.memory.toFixed(0)}MB</span>
                    </div>
                </div>
                <span class="text-sm ${container.status === 'running' ? 'text-green-600' : 'text-red-600'}">${container.status}</span>
            </div>
        `).join('');
    }

    // Update connection status indicator
    updateConnectionStatus(connected, mock = false) {
        const statusElement = document.getElementById('monitor-status');
        if (statusElement) {
            if (connected) {
                statusElement.textContent = mock ? 'Mock Data' : 'Connected';
                statusElement.className = 'text-green-600';
            } else {
                statusElement.textContent = 'Disconnected';
                statusElement.className = 'text-red-600';
            }
        }
    }

    // Stop monitoring
    stop() {
        if (this.websocket) {
            this.websocket.close();
        }
        if (this.mockInterval) {
            clearInterval(this.mockInterval);
        }
    }
}

// Initialize monitor
const serverMonitor = new ServerMonitor();

// Export for use
window.ServerMonitor = ServerMonitor;
window.serverMonitor = serverMonitor;