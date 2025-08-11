// Enhanced Monitoring Module with Advanced Visualizations
class EnhancedMonitoring {
    constructor() {
        this.baseMonitor = null; // Will be set during initialization
        this.initialized = false;
        this.initializationAttempts = 0;
        this.maxInitAttempts = 10;
        this.charts = {};
        this.historicalData = {
            hourly: [],
            daily: [],
            weekly: []
        };
        this.predictions = {};
        this.alertHistory = [];
        this.timeRange = 'realtime'; // realtime, hourly, daily, weekly
        
        // Chart.js plugin for gradient backgrounds
        this.gradientPlugin = {
            id: 'customGradient',
            beforeDraw: (chart, args, options) => {
                const { ctx, chartArea: { top, bottom } } = chart;
                if (!top) return;
                
                const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
                gradientBg.addColorStop(0, 'rgba(75, 192, 192, 0.2)');
                gradientBg.addColorStop(1, 'rgba(75, 192, 192, 0.0)');
                
                chart.data.datasets.forEach((dataset, i) => {
                    if (dataset.useGradient) {
                        dataset.backgroundColor = gradientBg;
                    }
                });
            }
        };
    }

    async init() {
        console.log('EnhancedMonitoring: Starting initialization...');
        
        if (this.initialized) {
            console.log('EnhancedMonitoring: Already initialized, skipping...');
            return;
        }
        
        try {
            // Wait for base monitor to be available
            await this.waitForBaseMonitor();
            
            console.log('EnhancedMonitoring: Base monitor ready, proceeding with setup...');
            this.createEnhancedUI();
            this.setupAdvancedCharts();
            this.startDataCollection();
            this.setupEventHandlers();
            
            this.initialized = true;
            console.log('EnhancedMonitoring: Initialization complete');
        } catch (error) {
            console.error('EnhancedMonitoring: Initialization failed:', error);
        }
    }

    async waitForBaseMonitor() {
        return new Promise((resolve, reject) => {
            const checkBaseMonitor = () => {
                this.initializationAttempts++;
                console.log(`EnhancedMonitoring: Checking for base monitor (attempt ${this.initializationAttempts}/${this.maxInitAttempts})`);
                
                if (window.serverMonitor) {
                    this.baseMonitor = window.serverMonitor;
                    console.log('EnhancedMonitoring: Base monitor found and assigned');
                    resolve();
                } else if (this.initializationAttempts >= this.maxInitAttempts) {
                    reject(new Error('Base monitor not available after maximum attempts'));
                } else {
                    setTimeout(checkBaseMonitor, 500); // Check every 500ms
                }
            };
            
            checkBaseMonitor();
        });
    }

    createEnhancedUI() {
        console.log('EnhancedMonitoring: Creating enhanced UI...');
        
        // Find monitoring section
        const monitoringSection = document.querySelector('#monitoring-section');
        if (!monitoringSection) {
            console.error('EnhancedMonitoring: monitoring-section not found!');
            return;
        }
        
        console.log('EnhancedMonitoring: monitoring-section found, proceeding with UI creation...');

        // Add enhanced controls
        const enhancedControls = document.createElement('div');
        enhancedControls.className = 'mb-6 p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow-lg';
        enhancedControls.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <h3 class="text-xl font-bold">🚀 Enhanced Monitoring Active</h3>
                    <div class="flex gap-2">
                        <button onclick="enhancedMonitor.setTimeRange('realtime')" 
                                class="time-range-btn px-3 py-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors"
                                data-range="realtime">Real-time</button>
                        <button onclick="enhancedMonitor.setTimeRange('hourly')" 
                                class="time-range-btn px-3 py-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors"
                                data-range="hourly">1 Hour</button>
                        <button onclick="enhancedMonitor.setTimeRange('daily')" 
                                class="time-range-btn px-3 py-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors"
                                data-range="daily">24 Hours</button>
                        <button onclick="enhancedMonitor.setTimeRange('weekly')" 
                                class="time-range-btn px-3 py-2 text-sm bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors"
                                data-range="weekly">7 Days</button>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="enhancedMonitor.exportMetrics()" 
                            class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors flex items-center gap-2 text-base">
                        <i data-lucide="download" class="w-4 h-4"></i>
                        Export Data
                    </button>
                    <button onclick="enhancedMonitor.togglePredictions()" 
                            class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-md transition-colors flex items-center gap-2 text-base">
                        <i data-lucide="trending-up" class="w-4 h-4"></i>
                        <span id="prediction-toggle-text">Show Predictions</span>
                    </button>
                </div>
            </div>
        `;

        // Add enhanced charts container
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6';
        chartsContainer.innerHTML = `
            <!-- Resource Usage Heatmap -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i data-lucide="activity" class="w-5 h-5"></i>
                    Resource Usage Heatmap
                </h4>
                <canvas id="heatmap-chart" height="300"></canvas>
            </div>

            <!-- Performance Trends -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i data-lucide="trending-up" class="w-5 h-5"></i>
                    Performance Trends
                </h4>
                <canvas id="trends-chart" height="300"></canvas>
            </div>

            <!-- Alert Analytics -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-5 h-5"></i>
                    Alert Analytics
                </h4>
                <canvas id="alerts-chart" height="300"></canvas>
            </div>

            <!-- Container Performance Matrix -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i data-lucide="box" class="w-5 h-5"></i>
                    Container Performance
                </h4>
                <canvas id="container-matrix-chart" height="300"></canvas>
            </div>
        `;

        // Add alert history section
        const alertHistorySection = document.createElement('div');
        alertHistorySection.className = 'mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6';
        alertHistorySection.innerHTML = `
            <h4 class="text-lg font-semibold mb-4 flex items-center gap-2">
                <i data-lucide="history" class="w-5 h-5"></i>
                Alert History
                <span class="text-sm font-normal text-gray-500 ml-2" id="alert-count">(0 alerts)</span>
            </h4>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b dark:border-gray-700">
                            <th class="text-left py-2 px-3">Time</th>
                            <th class="text-left py-2 px-3">Type</th>
                            <th class="text-left py-2 px-3">Service</th>
                            <th class="text-left py-2 px-3">Message</th>
                            <th class="text-left py-2 px-3">Severity</th>
                        </tr>
                    </thead>
                    <tbody id="alert-history-body">
                        <tr>
                            <td colspan="5" class="text-center py-4 text-gray-500">No alerts recorded</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Insert enhanced elements
        console.log('EnhancedMonitoring: Inserting enhanced controls...');
        monitoringSection.insertBefore(enhancedControls, monitoringSection.firstChild);
        console.log('EnhancedMonitoring: Adding charts container...');
        monitoringSection.appendChild(chartsContainer);
        console.log('EnhancedMonitoring: Adding alert history section...');
        monitoringSection.appendChild(alertHistorySection);
        console.log('EnhancedMonitoring: All enhanced UI elements added successfully!');

        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons();
        }

        // Set initial active button
        this.updateTimeRangeButtons();
    }

    setupAdvancedCharts() {
        // Resource Usage Heatmap
        const heatmapCtx = document.getElementById('heatmap-chart')?.getContext('2d');
        if (heatmapCtx) {
            this.charts.heatmap = new Chart(heatmapCtx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'CPU',
                        data: [],
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderWidth: 0
                    }, {
                        label: 'Memory',
                        data: [],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderWidth: 0
                    }, {
                        label: 'Disk',
                        data: [],
                        backgroundColor: 'rgba(255, 206, 86, 0.7)',
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `${context.dataset.label}: ${context.parsed.y}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: false,
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: (value) => value + '%'
                            }
                        }
                    }
                }
            });
        }

        // Performance Trends with Predictions
        const trendsCtx = document.getElementById('trends-chart')?.getContext('2d');
        if (trendsCtx) {
            this.charts.trends = new Chart(trendsCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'CPU Actual',
                        data: [],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    }, {
                        label: 'CPU Predicted',
                        data: [],
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        borderDash: [5, 5],
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 2,
                        hidden: true
                    }, {
                        label: 'Memory Actual',
                        data: [],
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        tension: 0.4,
                        borderWidth: 2
                    }, {
                        label: 'Memory Predicted',
                        data: [],
                        borderColor: 'rgba(54, 162, 235, 0.5)',
                        borderDash: [5, 5],
                        backgroundColor: 'transparent',
                        tension: 0.4,
                        borderWidth: 2,
                        hidden: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                callback: (value) => value + '%'
                            }
                        }
                    }
                }
            });
        }

        // Alert Analytics (Donut Chart)
        const alertsCtx = document.getElementById('alerts-chart')?.getContext('2d');
        if (alertsCtx) {
            this.charts.alerts = new Chart(alertsCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Critical', 'Warning', 'Info'],
                    datasets: [{
                        data: [0, 0, 0],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(54, 162, 235, 0.8)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? Math.round((context.parsed / total) * 100) : 0;
                                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Container Performance Matrix (Bubble Chart)
        const matrixCtx = document.getElementById('container-matrix-chart')?.getContext('2d');
        if (matrixCtx) {
            this.charts.containerMatrix = new Chart(matrixCtx, {
                type: 'bubble',
                data: {
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.dataset.label;
                                    const cpu = context.parsed.x;
                                    const memory = context.parsed.y;
                                    const uptime = context.raw.r;
                                    return [
                                        `Container: ${label}`,
                                        `CPU: ${cpu}%`,
                                        `Memory: ${memory}%`,
                                        `Uptime: ${uptime}h`
                                    ];
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'CPU Usage (%)'
                            },
                            min: 0,
                            max: 100
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Memory Usage (%)'
                            },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    startDataCollection() {
        console.log('EnhancedMonitoring: Starting data collection...');
        
        if (!this.baseMonitor) {
            console.error('EnhancedMonitoring: Cannot start data collection - base monitor not available');
            return;
        }
        
        // Collect enhanced metrics every 5 seconds
        setInterval(() => {
            try {
                this.collectEnhancedMetrics();
            } catch (error) {
                console.error('EnhancedMonitoring: Error collecting metrics:', error);
            }
        }, 5000);

        // Update historical data every minute
        setInterval(() => {
            try {
                this.updateHistoricalData();
            } catch (error) {
                console.error('EnhancedMonitoring: Error updating historical data:', error);
            }
        }, 60000);

        // Initial collection
        try {
            this.collectEnhancedMetrics();
            console.log('EnhancedMonitoring: Data collection started successfully');
        } catch (error) {
            console.error('EnhancedMonitoring: Error in initial data collection:', error);
        }
    }

    collectEnhancedMetrics() {
        const currentData = this.baseMonitor?.data;
        if (!currentData) {
            console.debug('EnhancedMonitoring: No data available from base monitor');
            return;
        }

        const timestamp = new Date();
        
        try {
            // Update heatmap
            this.updateHeatmap(currentData);
            
            // Update trends with predictions
            this.updateTrends(currentData, timestamp);
            
            // Update container matrix
            this.updateContainerMatrix(currentData.containers);
            
            // Check for alerts
            this.checkAlerts(currentData);
        } catch (error) {
            console.error('EnhancedMonitoring: Error in collectEnhancedMetrics:', error);
        }
    }

    updateHeatmap(data) {
        const chart = this.charts.heatmap;
        if (!chart) return;

        const timeLabel = new Date().toLocaleTimeString();
        
        // Keep last 10 time points
        if (chart.data.labels.length >= 10) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }

        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(data.cpu[data.cpu.length - 1] || 0);
        chart.data.datasets[1].data.push(data.memory[data.memory.length - 1] || 0);
        chart.data.datasets[2].data.push(data.disk[data.disk.length - 1] || 0);
        
        chart.update('none');
    }

    updateTrends(data, timestamp) {
        const chart = this.charts.trends;
        if (!chart) return;

        const timeLabel = timestamp.toLocaleTimeString();
        
        // Keep appropriate number of points based on time range
        const maxPoints = this.getMaxDataPoints();
        if (chart.data.labels.length >= maxPoints) {
            chart.data.labels.shift();
            chart.data.datasets.forEach(dataset => dataset.data.shift());
        }

        // Add actual data
        chart.data.labels.push(timeLabel);
        const cpuValue = data.cpu[data.cpu.length - 1] || 0;
        const memoryValue = data.memory[data.memory.length - 1] || 0;
        
        chart.data.datasets[0].data.push(cpuValue);
        chart.data.datasets[2].data.push(memoryValue);

        // Calculate predictions using simple moving average
        if (this.showPredictions && data.cpu.length > 5) {
            const cpuPrediction = this.predictNextValue(data.cpu.slice(-10));
            const memoryPrediction = this.predictNextValue(data.memory.slice(-10));
            
            chart.data.datasets[1].data.push(cpuPrediction);
            chart.data.datasets[3].data.push(memoryPrediction);
        }

        chart.update('none');
    }

    updateContainerMatrix(containers) {
        const chart = this.charts.containerMatrix;
        if (!chart || !containers) return;

        const datasets = containers.map((container, index) => {
            const name = container.name || container.Names?.[0]?.replace('/', '') || 'Unknown';
            const cpu = parseFloat(container.cpu) || 0;
            const memory = parseFloat(container.memory) || 0;
            const uptime = this.calculateUptime(container.status);
            
            return {
                label: name,
                data: [{
                    x: cpu,
                    y: memory,
                    r: Math.min(uptime / 4, 20) // Scale bubble size
                }],
                backgroundColor: this.getContainerColor(index),
                borderColor: this.getContainerColor(index),
                borderWidth: 2
            };
        });

        chart.data.datasets = datasets;
        chart.update('none');
    }

    checkAlerts(data) {
        const thresholds = this.baseMonitor?.metricsCollector?.alertThresholds || {
            cpu: 80,
            memory: 85,
            disk: 90
        };

        const cpu = data.cpu[data.cpu.length - 1] || 0;
        const memory = data.memory[data.memory.length - 1] || 0;
        const disk = data.disk[data.disk.length - 1] || 0;

        // Check system alerts
        if (cpu > thresholds.cpu) {
            this.addAlert('critical', 'System', `CPU usage exceeded ${thresholds.cpu}%`, 'CPU');
        }
        if (memory > thresholds.memory) {
            this.addAlert('warning', 'System', `Memory usage exceeded ${thresholds.memory}%`, 'Memory');
        }
        if (disk > thresholds.disk) {
            this.addAlert('critical', 'System', `Disk usage exceeded ${thresholds.disk}%`, 'Disk');
        }

        // Update alert analytics
        this.updateAlertAnalytics();
    }

    addAlert(severity, service, message, type) {
        const alert = {
            timestamp: new Date(),
            severity,
            service,
            message,
            type
        };

        this.alertHistory.unshift(alert);
        if (this.alertHistory.length > 100) {
            this.alertHistory.pop();
        }

        this.updateAlertHistory();
    }

    updateAlertHistory() {
        const tbody = document.getElementById('alert-history-body');
        const countSpan = document.getElementById('alert-count');
        
        if (!tbody) return;

        countSpan.textContent = `(${this.alertHistory.length} alerts)`;

        if (this.alertHistory.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">No alerts recorded</td></tr>';
            return;
        }

        tbody.innerHTML = this.alertHistory.slice(0, 10).map(alert => `
            <tr class="border-b dark:border-gray-700">
                <td class="py-2 px-3">${alert.timestamp.toLocaleTimeString()}</td>
                <td class="py-2 px-3">${alert.type}</td>
                <td class="py-2 px-3">${alert.service}</td>
                <td class="py-2 px-3">${alert.message}</td>
                <td class="py-2 px-3">
                    <span class="px-2 py-1 text-xs rounded-full ${this.getSeverityClass(alert.severity)}">
                        ${alert.severity}
                    </span>
                </td>
            </tr>
        `).join('');
    }

    updateAlertAnalytics() {
        const chart = this.charts.alerts;
        if (!chart) return;

        const counts = {
            critical: 0,
            warning: 0,
            info: 0
        };

        this.alertHistory.forEach(alert => {
            if (counts[alert.severity] !== undefined) {
                counts[alert.severity]++;
            }
        });

        chart.data.datasets[0].data = [counts.critical, counts.warning, counts.info];
        chart.update('none');
    }

    predictNextValue(values) {
        if (values.length < 3) return values[values.length - 1] || 0;
        
        // Simple exponential moving average
        const alpha = 0.3;
        let ema = values[0];
        
        for (let i = 1; i < values.length; i++) {
            ema = alpha * values[i] + (1 - alpha) * ema;
        }
        
        // Add trend component
        const trend = (values[values.length - 1] - values[values.length - 3]) / 2;
        const prediction = ema + trend;
        
        return Math.max(0, Math.min(100, prediction));
    }

    setTimeRange(range) {
        this.timeRange = range;
        this.updateTimeRangeButtons();
        this.refreshCharts();
    }

    updateTimeRangeButtons() {
        document.querySelectorAll('.time-range-btn').forEach(btn => {
            if (btn.dataset.range === this.timeRange) {
                btn.classList.add('bg-blue-500', 'text-white');
                btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            } else {
                btn.classList.remove('bg-blue-500', 'text-white');
                btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            }
        });
    }

    togglePredictions() {
        this.showPredictions = !this.showPredictions;
        const toggleText = document.getElementById('prediction-toggle-text');
        toggleText.textContent = this.showPredictions ? 'Hide Predictions' : 'Show Predictions';

        // Toggle prediction datasets
        const chart = this.charts.trends;
        if (chart) {
            chart.data.datasets[1].hidden = !this.showPredictions;
            chart.data.datasets[3].hidden = !this.showPredictions;
            chart.update();
        }
    }

    exportMetrics() {
        const exportData = {
            timestamp: new Date().toISOString(),
            timeRange: this.timeRange,
            systemMetrics: {
                cpu: this.baseMonitor?.data.cpu || [],
                memory: this.baseMonitor?.data.memory || [],
                disk: this.baseMonitor?.data.disk || [],
                network: this.baseMonitor?.data.network || {}
            },
            containers: this.baseMonitor?.data.containers || [],
            alerts: this.alertHistory,
            historicalData: this.historicalData
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metrics-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success message
        this.showNotification('Metrics exported successfully', 'success');
    }

    refreshCharts() {
        // Clear and reload data based on time range
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.data.labels = [];
                chart.data.datasets.forEach(dataset => {
                    dataset.data = [];
                });
                chart.update('none');
            }
        });
    }

    updateHistoricalData() {
        const currentData = this.baseMonitor?.data;
        if (!currentData) return;

        const snapshot = {
            timestamp: new Date(),
            cpu: currentData.cpu[currentData.cpu.length - 1] || 0,
            memory: currentData.memory[currentData.memory.length - 1] || 0,
            disk: currentData.disk[currentData.disk.length - 1] || 0,
            containerCount: currentData.containers?.length || 0
        };

        // Add to appropriate historical array
        this.historicalData.hourly.push(snapshot);
        
        // Keep only last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        this.historicalData.hourly = this.historicalData.hourly.filter(
            d => d.timestamp > oneHourAgo
        );
    }

    getMaxDataPoints() {
        switch (this.timeRange) {
            case 'realtime': return 50;
            case 'hourly': return 60;
            case 'daily': return 288; // 5-minute intervals
            case 'weekly': return 168; // hourly
            default: return 50;
        }
    }

    getContainerColor(index) {
        const colors = [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
        ];
        return colors[index % colors.length];
    }

    calculateUptime(status) {
        // Extract uptime from status string (e.g., "Up 2 hours")
        if (!status || typeof status !== 'string') return 1;
        
        const match = status.match(/Up (\d+) (hour|minute|day)/);
        if (!match) return 1;
        
        const value = parseInt(match[1]);
        const unit = match[2];
        
        switch (unit) {
            case 'minute': return value / 60;
            case 'hour': return value;
            case 'day': return value * 24;
            default: return 1;
        }
    }

    getSeverityClass(severity) {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all transform translate-y-0 ${
            type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('translate-y-20', 'opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    setupEventHandlers() {
        // Listen for window resize
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        });

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            this.updateChartThemes();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    updateChartThemes() {
        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#e5e7eb' : '#374151';
        const gridColor = isDark ? '#374151' : '#e5e7eb';
        
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                // Update text colors
                if (chart.options.plugins?.legend) {
                    chart.options.plugins.legend.labels = { color: textColor };
                }
                
                // Update grid colors
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        scale.ticks = { ...scale.ticks, color: textColor };
                        scale.grid = { ...scale.grid, color: gridColor };
                        if (scale.title) {
                            scale.title.color = textColor;
                        }
                    });
                }
                
                chart.update();
            }
        });
    }
}

// Initialize enhanced monitoring instance (manual initialization via index.html)
window.enhancedMonitor = new EnhancedMonitoring();