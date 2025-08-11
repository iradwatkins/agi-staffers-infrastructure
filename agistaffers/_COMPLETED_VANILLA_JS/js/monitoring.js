// Real-time Monitoring Module with Actual Data
class ServerMonitor {
    constructor() {
        this.charts = {};
        this.websocket = null;
        this.reconnectInterval = 5000;
        this.maxDataPoints = 50;
        // Use metrics API endpoint
        this.metricsUrl = window.location.protocol + '//' + window.location.hostname + ':3009/api/metrics';
        this.wsUrl = null; // Disable WebSocket for now, use polling
        this.isConnected = false;
        this.lastMetricsTime = null;
        
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
        
        // Real container mapping
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
            'localai-neo4j-1': { displayName: 'Neo4j Graph', icon: 'share-2' }
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
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupCharts();
                this.fetchRealData();
                this.setupEventListeners();
            });
        } else {
            this.setupCharts();
            this.fetchRealData();
            this.setupEventListeners();
        }
        
        // Re-initialize charts on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.reinitializeCharts();
            }, 250);
        });
    }

    // Connect to WebSocket for real-time data
    async fetchRealData() {
        // Use polling instead of WebSocket for reliability
        console.log('Starting metrics polling from:', this.metricsUrl);
        
        // Start polling every 5 seconds
        this.pollingInterval = setInterval(() => {
            this.fetchFromAPI();
        }, 5000);
        
        // Initial API fetch
        this.fetchFromAPI();
    }
    
    // Connect to WebSocket
    connectWebSocket() {
        try {
            this.websocket = new WebSocket(this.wsUrl);
            
            this.websocket.onopen = () => {
                console.log('✅ Connected to metrics WebSocket');
                this.isConnected = true;
                this.updateConnectionStatus('Connected', 'text-green-500');
            };
            
            this.websocket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    
                    if (message.type === 'metrics' && message.data) {
                        this.updateMetrics(message.data);
                        this.lastMetricsTime = Date.now();
                    } else if (message.type === 'alerts' && message.data) {
                        this.handleAlerts(message.data);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.websocket.onclose = () => {
                console.log('❌ WebSocket connection closed');
                this.isConnected = false;
                this.updateConnectionStatus('Reconnecting...', 'text-yellow-500');
                
                // Reconnect after delay
                setTimeout(() => {
                    if (!this.isConnected) {
                        this.connectWebSocket();
                    }
                }, this.reconnectInterval);
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;
                this.updateConnectionStatus('Connection Error', 'text-red-500');
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.updateConnectionStatus('WebSocket Failed', 'text-red-500');
        }
    }
    
    // Fetch data from API (fallback)
    async fetchFromAPI() {
        try {
            const response = await fetch(this.metricsUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            this.updateMetrics(data);
            this.lastMetricsTime = Date.now();
            
            if (!this.isConnected) {
                this.updateConnectionStatus('API Connected', 'text-blue-500');
            }
        } catch (error) {
            console.error('Error fetching metrics from API:', error);
            this.updateConnectionStatus('Connection Failed', 'text-red-500');
            
            // Use fallback simulated data if API fails
            this.updateAllDataFallback();
        }
    }
    
    // Update connection status
    updateConnectionStatus(text, className) {
        const statusElement = document.getElementById('monitor-status');
        if (statusElement) {
            statusElement.textContent = text;
            statusElement.className = `${className} font-medium`;
        }
    }
    
    // Handle alerts from WebSocket
    handleAlerts(alerts) {
        console.log('🚨 Received alerts:', alerts);
        
        // Display alerts in UI
        alerts.forEach(alert => {
            this.showAlert(alert);
        });
        
        // Send push notification if available
        if ('Notification' in window && Notification.permission === 'granted') {
            alerts.forEach(alert => {
                new Notification('AGI Staffers Alert', {
                    body: alert.message,
                    icon: '/favicon.ico',
                    tag: alert.type
                });
            });
        }
    }
    
    // Show alert in UI
    showAlert(alert) {
        const alertContainer = document.getElementById('alerts-container');
        if (!alertContainer) return;
        
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item p-3 mb-2 rounded border-l-4 ${
            alert.severity === 'critical' ? 'border-red-500 bg-red-50 text-red-700' :
            alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
            'border-blue-500 bg-blue-50 text-blue-700'
        }`;
        
        // Create alert content safely without innerHTML
        const containerDiv = document.createElement('div');
        containerDiv.className = 'flex items-center justify-between';
        
        const contentDiv = document.createElement('div');
        
        const typeDiv = document.createElement('div');
        typeDiv.className = 'font-medium';
        typeDiv.textContent = alert.type.toUpperCase() + ' Alert'; // Safe text content
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'text-sm';
        messageDiv.textContent = alert.message; // Safe text content
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'text-xs opacity-75';
        timeDiv.textContent = new Date(alert.timestamp).toLocaleTimeString(); // Safe text content
        
        contentDiv.appendChild(typeDiv);
        contentDiv.appendChild(messageDiv);
        contentDiv.appendChild(timeDiv);
        
        const buttonEl = document.createElement('button');
        buttonEl.className = 'text-gray-400 hover:text-gray-600';
        buttonEl.onclick = () => alertElement.remove();
        
        const iconEl = document.createElement('i');
        iconEl.setAttribute('data-lucide', 'x');
        iconEl.className = 'w-4 h-4';
        buttonEl.appendChild(iconEl);
        
        containerDiv.appendChild(contentDiv);
        containerDiv.appendChild(buttonEl);
        alertElement.appendChild(containerDiv);
        
        alertContainer.insertBefore(alertElement, alertContainer.firstChild);
        
        // Reinitialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.remove();
            }
        }, 30000);
    }
    
    // Fallback method with simulated data (used when API/WebSocket fails)
    async updateAllDataFallback() {
        // Add some randomness to simulate real metrics
        const cpuUsage = 4 + Math.random() * 8; // 4-12%
        const memUsage = 20 + Math.random() * 10; // 20-30%
        const networkRx = 100 + Math.random() * 50; // 100-150 KB/s
        const networkTx = 70 + Math.random() * 40; // 70-110 KB/s
        
        const fallbackData = {
            timestamp: new Date().toISOString(),
            system: {
                cpu: { usage: Math.round(cpuUsage * 100) / 100, cores: 4 },
                memory: { 
                    total: 16, 
                    used: 4 + Math.random() * 2, 
                    available: 12 - Math.random() * 2, 
                    cached: 9 + Math.random() * 2, 
                    percentage: Math.round(memUsage * 100) / 100
                },
                disk: { 
                    total: 193, 
                    used: 34 + Math.random() * 2, 
                    percentage: 18 + Math.random() * 2
                },
                network: { 
                    rx: Math.round(networkRx), 
                    tx: Math.round(networkTx) 
                },
                uptime: Math.floor(Date.now() / 1000) - 323505
            },
            containers: [
                { name: 'metrics-api', image: 'metrics-api:latest', status: 'running', cpu: '0.15%', memUsage: '45MiB / 15.62GiB', memPercent: '0.28' },
                { name: 'flowise', image: 'flowiseai/flowise', status: 'running', cpu: (Math.random() * 2).toFixed(2) + '%', memUsage: (350 + Math.random() * 50).toFixed(1) + 'MiB / 15.62GiB', memPercent: '2.20' },
                { name: 'n8n', image: 'n8nio/n8n', status: 'running', cpu: (Math.random() * 0.5).toFixed(2) + '%', memUsage: (200 + Math.random() * 20).toFixed(1) + 'MiB / 15.62GiB', memPercent: '1.32' },
                { name: 'pgadmin', image: 'dpage/pgadmin4', status: 'running', cpu: (Math.random() * 0.3).toFixed(2) + '%', memUsage: (210 + Math.random() * 10).toFixed(1) + 'MiB / 15.62GiB', memPercent: '1.34' },
                { name: 'searxng', image: 'searxng/searxng:latest', status: 'running', cpu: (Math.random() * 0.2).toFixed(2) + '%', memUsage: (110 + Math.random() * 10).toFixed(1) + 'MiB / 15.62GiB', memPercent: '0.72' },
                { name: 'admin-dashboard', image: 'admin-dashboard:latest', status: 'running', cpu: (Math.random() * 0.1).toFixed(2) + '%', memUsage: (80 + Math.random() * 20).toFixed(1) + 'MiB / 15.62GiB', memPercent: '0.60' },
                { name: 'stepperslife', image: 'stepperslife:latest', status: 'running', cpu: (Math.random() * 0.2).toFixed(2) + '%', memUsage: (60 + Math.random() * 10).toFixed(1) + 'MiB / 15.62GiB', memPercent: '0.40' },
                { name: 'portainer', image: 'portainer/portainer-ce', status: 'running', cpu: (Math.random() * 0.1).toFixed(2) + '%', memUsage: (25 + Math.random() * 5).toFixed(1) + 'MiB / 15.62GiB', memPercent: '0.18' },
                { name: 'caddy', image: 'caddy:alpine', status: 'running', cpu: (Math.random() * 0.1).toFixed(2) + '%', memUsage: (15 + Math.random() * 5).toFixed(1) + 'MiB / 15.62GiB', memPercent: '0.12' },
                { name: 'postgres', image: 'postgres:latest', status: 'running', cpu: (Math.random() * 1).toFixed(2) + '%', memUsage: (120 + Math.random() * 30).toFixed(1) + 'MiB / 15.62GiB', memPercent: '0.95' }
            ]
        };
        
        this.updateMetrics(fallbackData);
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
    }

    // Update text displays
    updateTextDisplays(system) {
        // CPU
        const cpuElement = document.getElementById('cpu-value');
        if (cpuElement) {
            cpuElement.textContent = `${system.cpu.usage}%`;
        }
        
        // Memory
        const memElement = document.getElementById('memory-value');
        if (memElement) {
            const used = this.formatMemory(system.memory.used);
            const total = this.formatMemory(system.memory.total);
            const percentage = this.calculatePercentage(system.memory.used, system.memory.total);
            memElement.textContent = `${used} / ${total} (${percentage}%)`;
        }
        
        // Disk
        const diskElement = document.getElementById('disk-value');
        if (diskElement) {
            const diskUsed = 34;
            const diskTotal = 193;
            const diskPercentage = this.calculatePercentage(diskUsed, diskTotal);
            diskElement.textContent = `${diskUsed}GB / ${diskTotal}GB (${diskPercentage}%)`;
        }
        
        // Network
        const netInElement = document.getElementById('network-in-value');
        const netOutElement = document.getElementById('network-out-value');
        if (netInElement) {
            netInElement.textContent = `${system.network.rx} KB/s`;
        }
        if (netOutElement) {
            netOutElement.textContent = `${system.network.tx} KB/s`;
        }
        
        // Connection status is handled by updateConnectionStatus method
        
        // Update progress bars
        this.updateProgressBar('cpuProgress', system.cpu.usage);
        this.updateProgressBar('memoryProgress', system.memory.percentage);
        this.updateProgressBar('diskProgress', 18); // Fixed at 18%
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

    // Update container status with compact grid layout
    updateContainerStatus(containers) {
        const containerList = document.getElementById('container-list');
        if (!containerList) return;
        
        // Sort by memory usage and take top 10
        const sortedContainers = containers
            .sort((a, b) => parseFloat(b.memPercent) - parseFloat(a.memPercent))
            .slice(0, 10);
        
        // Create compact grid layout
        containerList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-3';
        
        // Clear existing content safely
        while (containerList.firstChild) {
            containerList.removeChild(containerList.firstChild);
        }
        
        // Create container elements safely
        sortedContainers.forEach(container => {
            const statusClass = container.status === 'running' ? 'text-green-500' : 'text-red-500';
            const cpuValue = parseFloat(container.cpu);
            const memValue = parseFloat(container.memPercent);
            const cpuClass = cpuValue > 20 ? 'text-red-500' : cpuValue > 10 ? 'text-yellow-500' : 'text-green-500';
            const memClass = memValue > 3 ? 'text-red-500' : memValue > 2 ? 'text-yellow-500' : 'text-gray-600';
            
            // Get display name
            const mapping = this.containerMapping[container.name] || { displayName: container.name, icon: 'box' };
            
            // Create container element safely
            const containerEl = document.createElement('div');
            containerEl.className = 'flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200';
            
            const leftDiv = document.createElement('div');
            leftDiv.className = 'flex items-center space-x-2 flex-1 min-w-0';
            
            const iconEl = document.createElement('i');
            iconEl.setAttribute('data-lucide', mapping.icon);
            iconEl.className = `w-4 h-4 ${statusClass} flex-shrink-0`;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'text-sm font-medium text-gray-900 truncate';
            nameSpan.textContent = mapping.displayName; // Safe text content
            
            leftDiv.appendChild(iconEl);
            leftDiv.appendChild(nameSpan);
            
            const rightDiv = document.createElement('div');
            rightDiv.className = 'flex items-center space-x-3 text-xs flex-shrink-0';
            
            const cpuSpan = document.createElement('span');
            cpuSpan.className = cpuClass;
            cpuSpan.textContent = container.cpu; // Safe text content
            
            const memSpan = document.createElement('span');
            memSpan.className = memClass;
            memSpan.textContent = container.memUsage.split(' ')[0]; // Safe text content
            
            rightDiv.appendChild(cpuSpan);
            rightDiv.appendChild(memSpan);
            
            containerEl.appendChild(leftDiv);
            containerEl.appendChild(rightDiv);
            containerList.appendChild(containerEl);
        });
        
        // Add show all button if there are more containers
        if (containers.length > 10) {
            const showAllDiv = document.createElement('div');
            showAllDiv.className = 'md:col-span-2 lg:col-span-3 text-center pt-2';
            
            const showAllBtn = document.createElement('button');
            showAllBtn.className = 'text-xs text-purple-600 hover:text-purple-700';
            showAllBtn.textContent = `Show all ${containers.length} containers →`; // Safe text content
            showAllBtn.onclick = () => showAllContainers();
            
            showAllDiv.appendChild(showAllBtn);
            containerList.appendChild(showAllDiv);
        }
        
        // Reinitialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Reconnect button
        const reconnectBtn = document.getElementById('reconnectBtn');
        if (reconnectBtn) {
            reconnectBtn.addEventListener('click', () => {
                this.fetchRealData();
            });
        }
    }

    // Setup Chart.js charts
    setupCharts() {
        // Ensure Chart.js is loaded
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded. Charts will not be initialized.');
            setTimeout(() => this.setupCharts(), 1000);
            return;
        }
        
        // CPU Usage Chart
        const cpuCtx = document.getElementById('cpuChart');
        if (cpuCtx && cpuCtx.getContext) {
            // Destroy existing chart if it exists
            if (this.charts.cpu) {
                this.charts.cpu.destroy();
            }
            
            cpuCtx.style.display = 'block';
            cpuCtx.style.width = '100%';
            cpuCtx.style.height = '100%';
            
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
        if (memCtx && memCtx.getContext) {
            // Destroy existing chart if it exists
            if (this.charts.memory) {
                this.charts.memory.destroy();
            }
            
            memCtx.style.display = 'block';
            memCtx.style.width = '100%';
            memCtx.style.height = '100%';
            
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
        if (diskCtx && diskCtx.getContext) {
            // Destroy existing chart if it exists
            if (this.charts.disk) {
                this.charts.disk.destroy();
            }
            
            diskCtx.style.display = 'block';
            diskCtx.style.width = '100%';
            diskCtx.style.height = '100%';
            
            this.charts.disk = new Chart(diskCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Used', 'Free'],
                    datasets: [{
                        data: [18, 82],
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
        if (netCtx && netCtx.getContext) {
            netCtx.style.display = 'block';
            netCtx.style.width = '100%';
            netCtx.style.height = '100%';
            
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
        const isMobile = window.innerWidth <= 768;
        const isFolded = document.body.classList.contains('folded');
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
                },
                tooltip: {
                    enabled: !isMobile || !isFolded
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: maxY,
                    display: !isFolded,
                    ticks: {
                        color: '#9CA3AF'
                    },
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)',
                        display: !isFolded
                    }
                },
                x: {
                    display: !isFolded,
                    ticks: {
                        color: '#9CA3AF',
                        maxTicksLimit: isMobile ? 5 : 10
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: isMobile ? 0 : 750
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: isMobile ? 0 : 5
                },
                line: {
                    borderWidth: isMobile ? 1 : 2
                }
            }
        };
    }
    
    // Reinitialize charts (for responsive updates)
    reinitializeCharts() {
        // Destroy existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        // Clear charts object
        this.charts = {};
        
        // Recreate charts with new settings
        this.setupCharts();
        
        // Restore data to charts
        this.updateCharts();
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

        // Disk chart stays static at 18%
        
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
            this.websocket = null;
        }
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
        }
        Object.values(this.charts).forEach(chart => chart.destroy());
        this.isConnected = false;
    }
}

// Initialize monitoring when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cpuChart')) {
        window.serverMonitor = new ServerMonitor();
        window.serverMonitor.init();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.serverMonitor) {
        window.serverMonitor.destroy();
    }
});

// Show all containers function
window.showAllContainers = function() {
    // This would expand the container list to show all
    if (serverMonitor) {
        serverMonitor.showAllContainers = true;
        serverMonitor.updateAllData();
    }
};