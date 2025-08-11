// Real-time Monitoring Module for AGI Staffers Dashboard
class ServerMonitor {
    constructor() {
        this.charts = {};
        this.websocket = null;
        this.reconnectInterval = 5000;
        this.maxDataPoints = 50;
        this.metricsUrl = window.location.protocol + '//' + window.location.hostname + ':3009';
        this.wsUrl = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.hostname + ':3009/ws';
        
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

    // Helper functions for formatting
    formatMemory(gb) {
        // Convert to number and format to 1 decimal place
        const num = parseFloat(gb);
        if (isNaN(num)) return '0.0GB';
        return num.toFixed(1) + 'GB';
    }

    calculatePercentage(used, total) {
        if (!total || total === 0) return '0.0';
        return ((used / total) * 100).toFixed(1);
    }

    formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0.0GB';
        const gb = bytes / (1024 * 1024 * 1024);
        return gb.toFixed(1) + 'GB';
    }

    // Initialize monitoring
    init() {
        this.setupCharts();
        this.connectWebSocket();
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Reconnect button
        const reconnectBtn = document.getElementById('reconnectBtn');
        if (reconnectBtn) {
            reconnectBtn.addEventListener('click', () => {
                this.connectWebSocket();
            });
        }
    }

    // Connect to WebSocket for real-time data
    connectWebSocket() {
        if (this.websocket) {
            this.websocket.close();
        }

        try {
            this.websocket = new WebSocket(this.wsUrl);
            
            this.websocket.onopen = () => {
                console.log('Connected to metrics WebSocket');
                this.updateConnectionStatus(true);
            };
            
            this.websocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'metrics') {
                        this.updateMetrics(data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket data:', error);
                }
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus(false);
            };
            
            this.websocket.onclose = () => {
                console.log('WebSocket connection closed');
                this.updateConnectionStatus(false);
                // Auto-reconnect
                setTimeout(() => this.connectWebSocket(), this.reconnectInterval);
            };
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            this.updateConnectionStatus(false);
            // Fallback to REST API polling
            this.startPolling();
        }
    }

    // Fallback polling method
    startPolling() {
        this.pollingInterval = setInterval(async () => {
            try {
                const response = await fetch(`${this.metricsUrl}/api/metrics`);
                if (response.ok) {
                    const data = await response.json();
                    this.updateMetrics(data);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 2000);
    }

    // Update connection status indicator
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            if (connected) {
                statusElement.textContent = 'Connected';
                statusElement.className = 'text-green-400';
            } else {
                statusElement.textContent = 'Disconnected';
                statusElement.className = 'text-red-400';
            }
        }
    }

    // Update metrics from server data
    updateMetrics(data) {
        if (!data.system) return;

        const timestamp = new Date().toLocaleTimeString();
        
        // Update data arrays
        this.data.timestamps.push(timestamp);
        this.data.cpu.push(data.system.cpu.usage);
        this.data.memory.push(data.system.memory.percentage);
        this.data.disk.push(data.system.disk.percentage);
        this.data.network.in.push(data.system.network.rx);
        this.data.network.out.push(data.system.network.tx);
        
        // Keep only the last N data points
        if (this.data.timestamps.length > this.maxDataPoints) {
            this.data.timestamps.shift();
            this.data.cpu.shift();
            this.data.memory.shift();
            this.data.disk.shift();
            this.data.network.in.shift();
            this.data.network.out.shift();
        }
        
        // Update charts
        this.updateCharts();
        
        // Update text displays
        this.updateTextDisplays(data.system);
        
        // Update container status
        if (data.containers) {
            this.updateContainerStatus(data.containers);
        }
        
        // Update website metrics
        if (data.websites) {
            this.updateWebsiteMetrics(data.websites);
        }
    }

    // Update text displays
    updateTextDisplays(system) {
        // CPU
        const cpuElement = document.getElementById('cpuUsage');
        if (cpuElement) {
            cpuElement.textContent = `${system.cpu.usage}%`;
        }
        
        // Memory
        const memElement = document.getElementById('memoryUsage');
        if (memElement) {
            const used = this.formatMemory(system.memory.used);
            const total = this.formatMemory(system.memory.total);
            const percentage = this.calculatePercentage(system.memory.used, system.memory.total);
            memElement.textContent = `${used} / ${total} (${percentage}%)`;
        }
        
        // Disk
        const diskElement = document.getElementById('diskUsage');
        if (diskElement) {
            const diskUsed = this.formatMemory(system.disk.used);
            const diskTotal = this.formatMemory(system.disk.total);
            const diskPercentage = this.calculatePercentage(system.disk.used, system.disk.total);
            diskElement.textContent = `${diskUsed} / ${diskTotal} (${diskPercentage}%)`;
        }
        
        // Network
        const netInElement = document.getElementById('networkIn');
        const netOutElement = document.getElementById('networkOut');
        if (netInElement) {
            netInElement.textContent = `↓ ${system.network.rx} KB/s`;
        }
        if (netOutElement) {
            netOutElement.textContent = `↑ ${system.network.tx} KB/s`;
        }
        
        // Update progress bars
        this.updateProgressBar('cpuProgress', system.cpu.usage);
        this.updateProgressBar('memoryProgress', system.memory.percentage);
        this.updateProgressBar('diskProgress', system.disk.percentage);
    }

    // Update progress bar
    updateProgressBar(elementId, percentage) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.width = `${percentage}%`;
            
            // Change color based on usage
            if (percentage > 80) {
                element.className = element.className.replace(/bg-\w+-\d+/g, 'bg-red-500');
            } else if (percentage > 60) {
                element.className = element.className.replace(/bg-\w+-\d+/g, 'bg-yellow-500');
            } else {
                element.className = element.className.replace(/bg-\w+-\d+/g, 'bg-green-500');
            }
        }
    }

    // Update container status
    updateContainerStatus(containers) {
        const containerList = document.getElementById('containerStatus');
        if (!containerList) return;
        
        containerList.innerHTML = containers.map(container => {
            const isRunning = container.status === 'running';
            const statusClass = isRunning ? 'text-green-400' : 'text-red-400';
            const statusIcon = isRunning ? '🟢' : '🔴';
            
            return `
                <div class="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span class="text-sm">${container.name}</span>
                    <span class="${statusClass} text-xs">
                        ${statusIcon} ${container.state}
                    </span>
                </div>
            `;
        }).join('');
    }

    // Update website metrics
    updateWebsiteMetrics(websites) {
        websites.forEach(site => {
            const cpuElement = document.querySelector(`[data-site="${site.name}"] .site-cpu`);
            const memElement = document.querySelector(`[data-site="${site.name}"] .site-memory`);
            
            if (cpuElement) {
                cpuElement.textContent = `${site.cpu}%`;
            }
            if (memElement) {
                memElement.textContent = `${site.memory}%`;
            }
        });
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
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: this.getChartOptions('CPU Usage', 100)
            });
        }

        // Memory Usage Chart
        const memCtx = document.getElementById('memoryChart');
        if (memCtx) {
            this.charts.memory = new Chart(memCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Memory Usage (%)',
                        data: [],
                        borderColor: this.colors.memory,
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: this.getChartOptions('Memory Usage', 100)
            });
        }

        // Disk Usage Chart
        const diskCtx = document.getElementById('diskChart');
        if (diskCtx) {
            this.charts.disk = new Chart(diskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Used', 'Free'],
                    datasets: [{
                        data: [0, 100],
                        backgroundColor: [
                            this.colors.disk,
                            'rgba(255, 206, 86, 0.2)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Network Chart
        const netCtx = document.getElementById('networkChart');
        if (netCtx) {
            this.charts.network = new Chart(netCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Download (KB/s)',
                            data: [],
                            borderColor: this.colors.networkIn,
                            backgroundColor: 'rgba(75, 192, 192, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Upload (KB/s)',
                            data: [],
                            borderColor: this.colors.networkOut,
                            backgroundColor: 'rgba(153, 102, 255, 0.1)',
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: this.getChartOptions('Network Traffic')
            });
        }
    }

    // Get common chart options
    getChartOptions(title, maxY = null) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxY,
                    ticks: {
                        color: '#9CA3AF'
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9CA3AF',
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    }
                }
            }
        };
    }

    // Update all charts
    updateCharts() {
        // Update CPU chart
        if (this.charts.cpu) {
            this.charts.cpu.data.labels = this.data.timestamps;
            this.charts.cpu.data.datasets[0].data = this.data.cpu;
            this.charts.cpu.update('none');
        }

        // Update Memory chart
        if (this.charts.memory) {
            this.charts.memory.data.labels = this.data.timestamps;
            this.charts.memory.data.datasets[0].data = this.data.memory;
            this.charts.memory.update('none');
        }

        // Update Disk chart
        if (this.charts.disk && this.data.disk.length > 0) {
            const diskUsage = this.data.disk[this.data.disk.length - 1];
            this.charts.disk.data.datasets[0].data = [diskUsage, 100 - diskUsage];
            this.charts.disk.update('none');
        }

        // Update Network chart
        if (this.charts.network) {
            this.charts.network.data.labels = this.data.timestamps;
            this.charts.network.data.datasets[0].data = this.data.network.in;
            this.charts.network.data.datasets[1].data = this.data.network.out;
            this.charts.network.update('none');
        }
    }

    // Cleanup
    destroy() {
        if (this.websocket) {
            this.websocket.close();
        }
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        Object.values(this.charts).forEach(chart => chart.destroy());
    }
}

// Initialize monitoring when the page loads
let serverMonitor;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cpuChart')) {
        serverMonitor = new ServerMonitor();
        serverMonitor.init();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (serverMonitor) {
        serverMonitor.destroy();
    }
});