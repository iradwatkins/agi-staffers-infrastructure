// Historical Data Visualization Component
// Shows 24hr, 7 day, and 30 day performance trends with export functionality

class HistoricalData {
    constructor(config = {}) {
        this.config = {
            containerId: 'historical-data-container',
            metricsUrl: 'https://admin.agistaffers.com/api/metrics',
            refreshInterval: 300000, // 5 minutes
            ...config
        };

        this.charts = {};
        this.historicalData = {
            '24h': [],
            '7d': [],
            '30d': []
        };
        this.currentView = '24h';
        this.isInitialized = false;
        this.refreshTimer = null;
    }

    async init() {
        try {
            console.log('📊 Initializing Historical Data Visualization...');
            
            // Create UI
            this.createUI();
            
            // Load historical data
            await this.loadHistoricalData();
            
            // Initialize charts
            this.initializeCharts();
            
            // Start auto-refresh
            this.startAutoRefresh();
            
            this.isInitialized = true;
            console.log('✅ Historical Data Visualization initialized');
        } catch (error) {
            console.error('❌ Historical Data initialization failed:', error);
        }
    }

    createUI() {
        // Find or create container
        let container = document.getElementById(this.config.containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.config.containerId;
            
            // Insert after monitoring section
            const monitoringSection = document.getElementById('monitoring-section');
            if (monitoringSection) {
                monitoringSection.insertAdjacentElement('afterend', container);
            } else {
                document.querySelector('.fold-container').appendChild(container);
            }
        }

        container.innerHTML = `
            <div class="historical-data-section mb-8">
                <div class="bg-white rounded-xl shadow-sm border">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <i data-lucide="trending-up" class="w-6 h-6 text-indigo-600"></i>
                                <h3 class="text-xl font-semibold text-gray-900">Historical Performance</h3>
                            </div>
                            
                            <!-- Time Range Selector -->
                            <div class="flex items-center space-x-4">
                                <div class="flex bg-gray-100 rounded-lg p-1">
                                    <button onclick="historicalData.switchView('24h')" 
                                            class="time-range-btn px-4 py-2 text-sm font-medium rounded-md transition-colors active"
                                            data-range="24h">
                                        24 Hours
                                    </button>
                                    <button onclick="historicalData.switchView('7d')" 
                                            class="time-range-btn px-4 py-2 text-sm font-medium rounded-md transition-colors"
                                            data-range="7d">
                                        7 Days
                                    </button>
                                    <button onclick="historicalData.switchView('30d')" 
                                            class="time-range-btn px-4 py-2 text-sm font-medium rounded-md transition-colors"
                                            data-range="30d">
                                        30 Days
                                    </button>
                                </div>
                                
                                <!-- Export Button -->
                                <button onclick="historicalData.exportData()" 
                                        class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                                    <i data-lucide="download" class="w-4 h-4 mr-2"></i>
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Charts Grid -->
                    <div class="p-6">
                        <!-- Summary Stats -->
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Avg CPU Usage</h4>
                                <p class="text-2xl font-bold text-gray-900" id="avg-cpu">--</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    <span id="cpu-trend" class="inline-flex items-center">
                                        <i data-lucide="minus" class="w-3 h-3 mr-1"></i>
                                        --
                                    </span>
                                </p>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Avg Memory</h4>
                                <p class="text-2xl font-bold text-gray-900" id="avg-memory">--</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    <span id="memory-trend" class="inline-flex items-center">
                                        <i data-lucide="minus" class="w-3 h-3 mr-1"></i>
                                        --
                                    </span>
                                </p>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Peak Usage</h4>
                                <p class="text-2xl font-bold text-gray-900" id="peak-usage">--</p>
                                <p class="text-xs text-gray-500 mt-1" id="peak-time">--</p>
                            </div>
                            
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-medium text-gray-500 mb-1">Uptime</h4>
                                <p class="text-2xl font-bold text-green-600" id="uptime">--</p>
                                <p class="text-xs text-gray-500 mt-1">System availability</p>
                            </div>
                        </div>
                        
                        <!-- Main Charts -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- CPU & Memory Chart -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-semibold text-gray-700 mb-3">CPU & Memory Usage</h4>
                                <div class="h-64">
                                    <canvas id="cpu-memory-chart"></canvas>
                                </div>
                            </div>
                            
                            <!-- Disk Usage Chart -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-semibold text-gray-700 mb-3">Disk Usage Trend</h4>
                                <div class="h-64">
                                    <canvas id="disk-usage-chart"></canvas>
                                </div>
                            </div>
                            
                            <!-- Network I/O Chart -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-semibold text-gray-700 mb-3">Network I/O</h4>
                                <div class="h-64">
                                    <canvas id="network-io-chart"></canvas>
                                </div>
                            </div>
                            
                            <!-- Container Activity Chart -->
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="text-sm font-semibold text-gray-700 mb-3">Container Activity</h4>
                                <div class="h-64">
                                    <canvas id="container-activity-chart"></canvas>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Predictions (if 7d or 30d view) -->
                        <div id="predictions-section" class="mt-6 hidden">
                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 class="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                                    <i data-lucide="brain" class="w-4 h-4 mr-2"></i>
                                    AI Predictions
                                </h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p class="text-blue-700">Next 24h CPU Peak:</p>
                                        <p class="font-semibold text-blue-900" id="predicted-cpu">--</p>
                                    </div>
                                    <div>
                                        <p class="text-blue-700">Memory Trend:</p>
                                        <p class="font-semibold text-blue-900" id="predicted-memory">--</p>
                                    </div>
                                    <div>
                                        <p class="text-blue-700">Disk Space in 7 days:</p>
                                        <p class="font-semibold text-blue-900" id="predicted-disk">--</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer with last update -->
                    <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
                        <p class="text-xs text-gray-500">
                            Last updated: <span id="last-update">--</span>
                            <span class="ml-4">Auto-refresh in <span id="refresh-countdown">5:00</span></span>
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('historical-data-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'historical-data-styles';
        styles.textContent = `
            .time-range-btn {
                color: #6b7280;
                background: transparent;
            }
            
            .time-range-btn.active {
                color: #4f46e5;
                background: white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            
            .time-range-btn:hover:not(.active) {
                color: #374151;
                background: rgba(255, 255, 255, 0.5);
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .historical-data-section .grid-cols-4 {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .historical-data-section .lg\\:grid-cols-2 {
                    grid-template-columns: 1fr;
                }
            }
            
            /* Samsung Fold specific */
            @media (max-width: 376px) {
                .historical-data-section .flex-items-center {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .time-range-btn {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.75rem;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    async loadHistoricalData() {
        try {
            // Simulate loading historical data
            // In production, this would fetch from your metrics API with time range parameters
            const now = Date.now();
            const dataPoints = {
                '24h': 288, // 5-minute intervals
                '7d': 168,  // 1-hour intervals
                '30d': 720  // 1-hour intervals
            };

            for (const [range, points] of Object.entries(dataPoints)) {
                this.historicalData[range] = this.generateMockData(points, range);
            }

            this.updateSummaryStats();
            this.updateLastUpdate();
        } catch (error) {
            console.error('Failed to load historical data:', error);
        }
    }

    generateMockData(points, range) {
        const data = [];
        const now = Date.now();
        let interval;

        switch (range) {
            case '24h':
                interval = 5 * 60 * 1000; // 5 minutes
                break;
            case '7d':
                interval = 60 * 60 * 1000; // 1 hour
                break;
            case '30d':
                interval = 60 * 60 * 1000; // 1 hour
                break;
        }

        for (let i = points - 1; i >= 0; i--) {
            const timestamp = now - (i * interval);
            data.push({
                timestamp,
                cpu: Math.random() * 40 + 10 + (Math.sin(i / 10) * 10),
                memory: Math.random() * 30 + 50 + (Math.cos(i / 8) * 10),
                disk: 45 + (i / points) * 5 + Math.random() * 5,
                networkIn: Math.random() * 100,
                networkOut: Math.random() * 80,
                containers: Math.floor(Math.random() * 3) + 17
            });
        }

        return data;
    }

    initializeCharts() {
        // CPU & Memory Chart
        const cpuMemoryCtx = document.getElementById('cpu-memory-chart');
        if (cpuMemoryCtx) {
            this.charts.cpuMemory = new Chart(cpuMemoryCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'CPU %',
                        data: [],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Memory %',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // Disk Usage Chart
        const diskCtx = document.getElementById('disk-usage-chart');
        if (diskCtx) {
            this.charts.disk = new Chart(diskCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Disk Usage %',
                        data: [],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // Network I/O Chart
        const networkCtx = document.getElementById('network-io-chart');
        if (networkCtx) {
            this.charts.network = new Chart(networkCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Network In (MB/s)',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Network Out (MB/s)',
                        data: [],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Container Activity Chart
        const containerCtx = document.getElementById('container-activity-chart');
        if (containerCtx) {
            this.charts.containers = new Chart(containerCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Active Containers',
                        data: [],
                        backgroundColor: '#6366f1',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        // Update charts with current view data
        this.updateCharts();
    }

    updateCharts() {
        const data = this.historicalData[this.currentView];
        if (!data || data.length === 0) return;

        // Generate labels based on time range
        const labels = data.map(d => this.formatTimeLabel(d.timestamp, this.currentView));

        // Update CPU & Memory Chart
        if (this.charts.cpuMemory) {
            this.charts.cpuMemory.data.labels = labels;
            this.charts.cpuMemory.data.datasets[0].data = data.map(d => d.cpu.toFixed(1));
            this.charts.cpuMemory.data.datasets[1].data = data.map(d => d.memory.toFixed(1));
            this.charts.cpuMemory.update();
        }

        // Update Disk Chart
        if (this.charts.disk) {
            this.charts.disk.data.labels = labels;
            this.charts.disk.data.datasets[0].data = data.map(d => d.disk.toFixed(1));
            this.charts.disk.update();
        }

        // Update Network Chart
        if (this.charts.network) {
            this.charts.network.data.labels = labels;
            this.charts.network.data.datasets[0].data = data.map(d => (d.networkIn / 1024).toFixed(2));
            this.charts.network.data.datasets[1].data = data.map(d => (d.networkOut / 1024).toFixed(2));
            this.charts.network.update();
        }

        // Update Container Chart
        if (this.charts.containers) {
            // Sample every N points for bar chart
            const sampleRate = Math.max(1, Math.floor(data.length / 20));
            const sampledData = data.filter((_, i) => i % sampleRate === 0);
            
            this.charts.containers.data.labels = sampledData.map(d => 
                this.formatTimeLabel(d.timestamp, this.currentView)
            );
            this.charts.containers.data.datasets[0].data = sampledData.map(d => d.containers);
            this.charts.containers.update();
        }
    }

    formatTimeLabel(timestamp, range) {
        const date = new Date(timestamp);
        
        switch (range) {
            case '24h':
                return date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
            case '7d':
                return date.toLocaleDateString('en-US', { 
                    weekday: 'short',
                    hour: 'numeric',
                    hour12: true 
                });
            case '30d':
                return date.toLocaleDateString('en-US', { 
                    month: 'short',
                    day: 'numeric'
                });
            default:
                return date.toLocaleString();
        }
    }

    updateSummaryStats() {
        const data = this.historicalData[this.currentView];
        if (!data || data.length === 0) return;

        // Calculate averages
        const avgCpu = data.reduce((sum, d) => sum + d.cpu, 0) / data.length;
        const avgMemory = data.reduce((sum, d) => sum + d.memory, 0) / data.length;

        // Find peaks
        const cpuPeak = Math.max(...data.map(d => d.cpu));
        const memoryPeak = Math.max(...data.map(d => d.memory));
        const peakTime = data.find(d => d.cpu === cpuPeak || d.memory === memoryPeak);

        // Calculate trends (compare last quarter to first quarter)
        const quarter = Math.floor(data.length / 4);
        const firstQuarterCpu = data.slice(0, quarter).reduce((sum, d) => sum + d.cpu, 0) / quarter;
        const lastQuarterCpu = data.slice(-quarter).reduce((sum, d) => sum + d.cpu, 0) / quarter;
        const cpuTrend = lastQuarterCpu - firstQuarterCpu;

        const firstQuarterMemory = data.slice(0, quarter).reduce((sum, d) => sum + d.memory, 0) / quarter;
        const lastQuarterMemory = data.slice(-quarter).reduce((sum, d) => sum + d.memory, 0) / quarter;
        const memoryTrend = lastQuarterMemory - firstQuarterMemory;

        // Update UI
        document.getElementById('avg-cpu').textContent = avgCpu.toFixed(1) + '%';
        document.getElementById('avg-memory').textContent = avgMemory.toFixed(1) + '%';
        document.getElementById('peak-usage').textContent = Math.max(cpuPeak, memoryPeak).toFixed(1) + '%';
        document.getElementById('peak-time').textContent = peakTime ? 
            new Date(peakTime.timestamp).toLocaleString() : '--';
        document.getElementById('uptime').textContent = '99.9%';

        // Update trends
        this.updateTrend('cpu-trend', cpuTrend);
        this.updateTrend('memory-trend', memoryTrend);

        // Update predictions for 7d and 30d views
        if (this.currentView !== '24h') {
            this.showPredictions();
        } else {
            this.hidePredictions();
        }
    }

    updateTrend(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const iconName = value > 0 ? 'trending-up' : value < 0 ? 'trending-down' : 'minus';
        const colorClass = value > 5 ? 'text-red-600' : value < -5 ? 'text-green-600' : 'text-gray-600';
        
        element.className = `inline-flex items-center ${colorClass}`;
        element.innerHTML = `
            <i data-lucide="${iconName}" class="w-3 h-3 mr-1"></i>
            ${Math.abs(value).toFixed(1)}%
        `;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    showPredictions() {
        const section = document.getElementById('predictions-section');
        if (!section) return;

        section.classList.remove('hidden');

        // Mock predictions
        document.getElementById('predicted-cpu').textContent = '65-75%';
        document.getElementById('predicted-memory').textContent = '↑ Increasing 2-3%';
        document.getElementById('predicted-disk').textContent = '52% (~48GB free)';
    }

    hidePredictions() {
        const section = document.getElementById('predictions-section');
        if (section) {
            section.classList.add('hidden');
        }
    }

    switchView(range) {
        this.currentView = range;
        
        // Update button states
        document.querySelectorAll('.time-range-btn').forEach(btn => {
            if (btn.dataset.range === range) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update charts and stats
        this.updateCharts();
        this.updateSummaryStats();
    }

    exportData() {
        const data = this.historicalData[this.currentView];
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Prepare CSV content
        const headers = ['Timestamp', 'CPU %', 'Memory %', 'Disk %', 'Network In MB/s', 'Network Out MB/s', 'Containers'];
        const rows = data.map(d => [
            new Date(d.timestamp).toISOString(),
            d.cpu.toFixed(2),
            d.memory.toFixed(2),
            d.disk.toFixed(2),
            (d.networkIn / 1024).toFixed(2),
            (d.networkOut / 1024).toFixed(2),
            d.containers
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

        // Download file
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agi-staffers-metrics-${this.currentView}-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        // Show notification
        if (window.componentIntegrator) {
            const notificationUI = window.componentIntegrator.getComponent('PushNotificationUI');
            if (notificationUI) {
                notificationUI.success('Export Complete', `Historical data exported for ${this.currentView} range`);
            }
        }
    }

    updateLastUpdate() {
        const element = document.getElementById('last-update');
        if (element) {
            element.textContent = new Date().toLocaleString();
        }
    }

    startAutoRefresh() {
        let countdown = this.config.refreshInterval / 1000;
        
        // Update countdown
        const updateCountdown = () => {
            const minutes = Math.floor(countdown / 60);
            const seconds = countdown % 60;
            const countdownEl = document.getElementById('refresh-countdown');
            if (countdownEl) {
                countdownEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            countdown--;
            if (countdown < 0) {
                this.refresh();
                countdown = this.config.refreshInterval / 1000;
            }
        };

        // Initial update
        updateCountdown();
        
        // Set interval
        this.refreshTimer = setInterval(updateCountdown, 1000);
    }

    async refresh() {
        await this.loadHistoricalData();
        this.updateCharts();
    }

    destroy() {
        // Clear timer
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }

        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });

        // Remove UI
        const container = document.getElementById(this.config.containerId);
        if (container) {
            container.remove();
        }

        // Remove styles
        const styles = document.getElementById('historical-data-styles');
        if (styles) {
            styles.remove();
        }
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.HistoricalData = HistoricalData;
}