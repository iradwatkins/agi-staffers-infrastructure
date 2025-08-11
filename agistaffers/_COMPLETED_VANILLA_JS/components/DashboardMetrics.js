// AI Agent-Generated Component: Advanced Dashboard Metrics System
// Security-enhanced, mobile-optimized, accessible metrics dashboard

class DashboardMetrics {
    constructor(config = {}) {
        this.config = {
            containerId: 'metrics-container',
            updateInterval: 5000,
            chartTheme: 'auto', // auto, light, dark
            animations: true,
            accessibility: true,
            mobileOptimized: true,
            foldAware: true,
            ...config
        };
        
        this.metrics = {
            cpu: { current: 0, history: [], threshold: { warning: 70, critical: 90 } },
            memory: { current: 0, history: [], threshold: { warning: 80, critical: 95 } },
            disk: { current: 0, history: [], threshold: { warning: 85, critical: 95 } },
            network: { in: 0, out: 0, history: [], threshold: { warning: 80, critical: 95 } }
        };
        
        this.charts = {};
        this.resizeObserver = null;
        this.initialized = false;
        this.theme = 'light';
    }

    async init() {
        if (this.initialized) return;
        
        try {
            await this.createContainer();
            await this.initializeCharts();
            this.setupEventListeners();
            this.setupAccessibility();
            this.startDataPolling();
            this.initialized = true;
            
            console.log('✅ DashboardMetrics: Initialized successfully');
        } catch (error) {
            console.error('❌ DashboardMetrics: Initialization failed:', error);
        }
    }

    createContainer() {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container ${this.config.containerId} not found`);
        }

        // Clear existing content
        container.innerHTML = '';
        container.className = 'dashboard-metrics-container';

        // Create responsive grid structure
        const gridHTML = this.generateGridHTML();
        container.insertAdjacentHTML('beforeend', gridHTML);

        // Add CSS for responsive behavior
        this.injectResponsiveCSS();
    }

    generateGridHTML() {
        return `
            <div class="metrics-grid" role="region" aria-label="System Performance Metrics">
                <div class="metrics-header">
                    <h2 class="metrics-title">System Performance</h2>
                    <div class="metrics-controls">
                        <button class="theme-toggle" aria-label="Toggle theme">
                            <i data-lucide="sun" class="theme-icon"></i>
                        </button>
                        <button class="refresh-btn" aria-label="Refresh metrics">
                            <i data-lucide="refresh-cw" class="refresh-icon"></i>
                        </button>
                    </div>
                </div>
                
                <div class="metrics-cards">
                    ${this.generateMetricCard('cpu', 'CPU Usage', 'cpu')}
                    ${this.generateMetricCard('memory', 'Memory Usage', 'memory-stick')}
                    ${this.generateMetricCard('disk', 'Disk Usage', 'hard-drive')}
                    ${this.generateMetricCard('network', 'Network I/O', 'network')}
                </div>
            </div>
        `;
    }

    generateMetricCard(type, title, icon) {
        return `
            <div class="metric-card" data-metric="${type}" role="article" aria-labelledby="${type}-title">
                <div class="metric-header">
                    <div class="metric-icon">
                        <i data-lucide="${icon}" aria-hidden="true"></i>
                    </div>
                    <h3 id="${type}-title" class="metric-title">${title}</h3>
                    <div class="metric-trend" id="${type}-trend" aria-label="Trend indicator">
                        <i data-lucide="trending-up" class="trend-icon"></i>
                    </div>
                </div>
                <div class="metric-value" id="${type}-value" aria-live="polite">
                    <span class="value-number">0</span>
                    <span class="value-unit">%</span>
                </div>
                <div class="metric-details" id="${type}-details">
                    <span class="details-text">Loading...</span>
                </div>
                <div class="metric-chart-container">
                    <canvas id="${type}-metric-chart" height="100"></canvas>
                </div>
                <div class="metric-status" id="${type}-status">
                    <div class="status-bar">
                        <div class="status-fill" style="width: 0%"></div>
                    </div>
                    <span class="status-text">Normal</span>
                </div>
            </div>
        `;
    }

    injectResponsiveCSS() {
        if (document.getElementById('dashboard-metrics-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'dashboard-metrics-styles';
        styles.textContent = `
            .dashboard-metrics-container {
                padding: 1rem;
                max-width: 100%;
                overflow-x: hidden;
            }

            .metrics-grid {
                display: grid;
                gap: 1.5rem;
                grid-template-rows: auto auto 1fr;
            }

            .metrics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                color: white;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            }

            .metrics-title {
                font-size: 1.5rem;
                font-weight: 600;
                margin: 0;
            }

            .metrics-controls {
                display: flex;
                gap: 0.75rem;
            }

            .theme-toggle, .refresh-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 8px;
                padding: 0.5rem;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .theme-toggle:hover, .refresh-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
            }

            .metrics-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1rem;
            }

            .metric-card {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                min-height: 320px;
            }

            .metric-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .metric-card:hover::before {
                opacity: 1;
            }

            .metric-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .metric-header {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }

            .metric-icon {
                background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
                border-radius: 8px;
                padding: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .metric-title {
                font-size: 1rem;
                font-weight: 500;
                color: #374151;
                margin: 0;
            }

            .metric-value {
                display: flex;
                align-items: baseline;
                gap: 0.25rem;
                margin-bottom: 1rem;
            }

            .value-number {
                font-size: 1.5rem;
                font-weight: 700;
                color: #111827;
            }

            .value-unit {
                font-size: 1rem;
                color: #6b7280;
                font-weight: 500;
            }

            .metric-status {
                margin-bottom: 0.75rem;
            }

            .status-bar {
                background: #f3f4f6;
                border-radius: 4px;
                height: 6px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }

            .status-fill {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
                border-radius: 4px;
                transition: width 0.6s ease-out;
            }

            .status-text {
                font-size: 0.875rem;
                color: #6b7280;
                font-weight: 500;
            }

            .metric-trend {
                opacity: 0.6;
            }

            .trend-icon {
                width: 1.25rem;
                height: 1.25rem;
            }

            .metric-details {
                font-size: 0.875rem;
                color: #6b7280;
                margin-top: -0.5rem;
                margin-bottom: 1rem;
            }

            .metric-chart-container {
                margin: 1rem 0;
                height: 100px;
                position: relative;
            }

            .metrics-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem;
            }

            .chart-container {
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
                min-height: 250px;
            }

            /* Fold-aware responsive design */
            @media (max-width: 768px) {
                .metrics-cards {
                    grid-template-columns: 1fr;
                }
                
                .metrics-charts {
                    grid-template-columns: 1fr;
                }
                
                .chart-container {
                    min-height: 200px;
                }
            }

            /* Samsung Fold specific - Folded State */
            @media (max-width: 653px) {
                .metrics-header {
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }
                
                .metric-card {
                    padding: 0.75rem;
                }
                
                .value-number {
                    font-size: 1.25rem;
                }
                
                .metric-title {
                    font-size: 0.875rem;
                }
                
                .value-unit {
                    font-size: 0.875rem;
                }
            }

            /* Dark theme */
            .dark-theme .metric-card {
                background: #1f2937;
                border-color: #374151;
                color: white;
            }

            .dark-theme .metric-title {
                color: #f9fafb;
            }

            .dark-theme .value-number {
                color: #f9fafb;
            }

            .dark-theme .chart-container {
                background: #1f2937;
                border-color: #374151;
            }

            /* Accessibility improvements */
            @media (prefers-reduced-motion: reduce) {
                .metric-card, .status-fill, .theme-toggle, .refresh-btn {
                    transition: none;
                }
            }

            .metric-card:focus-within {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
        `;
        
        document.head.appendChild(styles);
    }

    async initializeCharts() {
        // Destroy existing charts first
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.destroy();
            }
        });
        this.charts = {};

        const chartConfigs = {
            cpu: this.createChartConfig('CPU Usage', '#ef4444'),
            memory: this.createChartConfig('Memory Usage', '#f59e0b'),
            disk: this.createChartConfig('Disk Usage', '#8b5cf6'),
            network: this.createChartConfig('Network I/O', '#10b981')
        };

        for (const [type, config] of Object.entries(chartConfigs)) {
            const canvas = document.getElementById(`${type}-metric-chart`);
            if (canvas) {
                // Get the 2D context and check if a chart already exists
                const ctx = canvas.getContext('2d');
                if (ctx && ctx.chart) {
                    ctx.chart.destroy();
                }
                
                // Update config for embedded display
                config.options.maintainAspectRatio = false;
                config.options.responsive = true;
                config.options.plugins.legend.display = false;
                config.options.scales.x.display = false;
                config.options.scales.y.display = false;
                
                this.charts[type] = new Chart(canvas, config);
            }
        }
    }

    createChartConfig(label, color) {
        return {
            type: 'line',
            data: {
                labels: Array(20).fill('').map((_, i) => ''),
                datasets: [{
                    label,
                    data: Array(20).fill(0),
                    borderColor: color,
                    backgroundColor: `${color}20`,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: value => `${value}%` }
                    }
                },
                elements: {
                    point: { hoverRadius: 6 }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        };
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Refresh button
        const refreshBtn = document.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshMetrics());
        }

        // Resize observer for responsive charts
        this.resizeObserver = new ResizeObserver(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        });

        const container = document.getElementById(this.config.containerId);
        if (container) {
            this.resizeObserver.observe(container);
        }
    }

    setupAccessibility() {
        // Add ARIA live regions for screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'metrics-live-region';
        document.body.appendChild(liveRegion);
    }

    updateMetrics(data) {
        try {
            // Handle structured data from metrics API
            if (data.system) {
                // CPU
                const cpuUsage = data.system.cpu?.usage || 0;
                this.updateMetricValue('cpu', cpuUsage);
                this.updateMetricChart('cpu', cpuUsage);
                this.updateMetricStatus('cpu', cpuUsage);
                this.updateMetricDetails('cpu', `${cpuUsage.toFixed(1)}% of 8 cores`);
                
                // Memory
                const memData = data.system.memory || {};
                const memUsage = parseFloat(memData.percentage || 0);
                this.updateMetricValue('memory', memUsage);
                this.updateMetricChart('memory', memUsage);
                this.updateMetricStatus('memory', memUsage);
                this.updateMetricDetails('memory', `${memData.used || '0'}GB / ${memData.total || '16'}GB`);
                
                // Disk
                const diskData = data.system.disk || {};
                const diskUsage = parseFloat(diskData.percentage || 0);
                this.updateMetricValue('disk', diskUsage);
                this.updateMetricChart('disk', diskUsage);
                this.updateMetricStatus('disk', diskUsage);
                this.updateMetricDetails('disk', `${diskData.used || '0'}GB / ${diskData.total || '193'}GB`);
                
                // Network
                const netData = data.system.network || {};
                const networkUsage = 0; // Network doesn't have a percentage
                this.updateMetricValue('network', networkUsage);
                this.updateMetricChart('network', networkUsage);
                this.updateMetricStatus('network', networkUsage);
                // Handle both API formats: 'in/out' and 'rx/tx'
                const rxValue = netData.in || netData.rx || 0;
                const txValue = netData.out || netData.tx || 0;
                this.updateMetricDetails('network', `↓ ${rxValue} Mbps ↑ ${txValue} Mbps`);
                
                // Update container status if available
                if (data.containers) {
                    this.updateContainerStatus(data.containers);
                }
            } else {
                // Fallback for simple data format
                for (const [type, value] of Object.entries(data)) {
                    if (this.metrics[type]) {
                        this.updateMetricValue(type, value);
                        this.updateMetricChart(type, value);
                        this.updateMetricStatus(type, value);
                    }
                }
            }
            
            this.announceChanges(data);
        } catch (error) {
            console.error('Error updating metrics:', error);
        }
    }

    updateMetricValue(type, value) {
        const valueEl = document.querySelector(`#${type}-value .value-number`);
        if (valueEl) {
            // Sanitize and validate value
            const sanitizedValue = Math.max(0, Math.min(100, parseFloat(value) || 0));
            valueEl.textContent = sanitizedValue.toFixed(1);
            this.metrics[type].current = sanitizedValue;
        }
    }

    updateMetricChart(type, value) {
        const chart = this.charts[type];
        if (chart) {
            const data = chart.data.datasets[0].data;
            data.shift();
            data.push(parseFloat(value) || 0);
            chart.update('none');
        }
    }

    updateMetricStatus(type, value) {
        const statusFill = document.querySelector(`#${type}-status .status-fill`);
        const statusText = document.querySelector(`#${type}-status .status-text`);
        
        if (statusFill && statusText) {
            const numValue = parseFloat(value) || 0;
            const thresholds = this.metrics[type].threshold;
            
            statusFill.style.width = `${numValue}%`;
            
            let status, color;
            if (numValue >= thresholds.critical) {
                status = 'Critical';
                color = '#ef4444';
            } else if (numValue >= thresholds.warning) {
                status = 'Warning';
                color = '#f59e0b';
            } else {
                status = 'Normal';
                color = '#10b981';
            }
            
            statusText.textContent = status;
            statusFill.style.background = color;
        }
    }

    updateMetricDetails(type, details) {
        const detailsEl = document.querySelector(`#${type}-details .details-text`);
        if (detailsEl) {
            detailsEl.textContent = details;
        }
    }

    updateMonitoringStatus(status) {
        const statusEl = document.getElementById('monitor-status');
        if (statusEl) {
            if (status === 'connected') {
                statusEl.textContent = 'Connected';
                statusEl.className = 'text-sm text-green-600 font-medium';
            } else if (status === 'error') {
                statusEl.textContent = 'Connection Error';
                statusEl.className = 'text-sm text-red-600 font-medium';
            } else {
                statusEl.textContent = 'Connecting...';
                statusEl.className = 'text-sm text-gray-500';
            }
        }
    }

    updateContainerStatus(containers) {
        const containerList = document.getElementById('container-list');
        if (!containerList) return;
        
        if (containers.length === 0) {
            containerList.innerHTML = '<div class="text-center text-gray-500">No containers running</div>';
            return;
        }
        
        containerList.innerHTML = containers.map(container => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                    <span class="font-medium text-gray-900">${container.name || 'Unknown'}</span>
                    <span class="text-sm text-gray-500 ml-2">${container.image || ''}</span>
                </div>
                <div class="text-right">
                    <div class="text-sm text-gray-600">
                        CPU: ${container.cpu || '0'}% | Mem: ${container.memory || '0MB'}
                    </div>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        container.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }">
                        ${container.status || 'unknown'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    announceChanges(data) {
        const liveRegion = document.getElementById('metrics-live-region');
        if (liveRegion) {
            const highValues = Object.entries(data)
                .filter(([_, value]) => parseFloat(value) > 80)
                .map(([type, value]) => `${type} at ${parseFloat(value).toFixed(1)}%`)
                .join(', ');
                
            if (highValues) {
                liveRegion.textContent = `High resource usage detected: ${highValues}`;
            }
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.classList.toggle('dark-theme');
        
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.setAttribute('data-lucide', this.theme === 'light' ? 'sun' : 'moon');
            if (window.lucide) window.lucide.createIcons();
        }
    }

    refreshMetrics() {
        const refreshIcon = document.querySelector('.refresh-icon');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                refreshIcon.style.animation = '';
            }, 1000);
        }
        
        // Trigger immediate data fetch
        this.fetchMetrics();
    }

    async fetchMetrics() {
        try {
            // Use proxied metrics API endpoint
            const hostname = window.location.hostname;
            const metricsUrl = hostname === 'localhost' || hostname === '127.0.0.1' 
                ? 'http://localhost:3009/api/metrics'
                : '/api/metrics'; // Use proxied path for production
                
            const response = await fetch(metricsUrl);
            if (response.ok) {
                const data = await response.json();
                this.updateMetrics(data);
                console.log('✅ Metrics fetched successfully');
                // Update monitoring status
                this.updateMonitoringStatus('connected');
            } else {
                console.error('Metrics API error:', response.status, response.statusText);
                this.updateMonitoringStatus('error');
            }
        } catch (error) {
            console.error('Error fetching metrics:', error);
            this.updateMonitoringStatus('error');
            // For local development, try direct connection
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                if (!this.triedFallback) {
                    this.triedFallback = true;
                    try {
                        const fallbackResponse = await fetch('http://148.230.93.174:3009/api/metrics');
                        if (fallbackResponse.ok) {
                            const data = await fallbackResponse.json();
                            this.updateMetrics(data);
                            console.log('✅ Metrics fetched via fallback');
                        }
                    } catch (fallbackError) {
                        console.error('Fallback also failed:', fallbackError);
                    }
                }
            }
        }
    }

    startDataPolling() {
        this.fetchMetrics(); // Initial fetch
        this.pollInterval = setInterval(() => {
            this.fetchMetrics();
        }, this.config.updateInterval);
    }

    destroy() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        this.initialized = false;
    }
}

// Export for global use with singleton check
if (typeof window !== 'undefined') {
    // Prevent multiple instances
    if (!window.DashboardMetrics) {
        window.DashboardMetrics = DashboardMetrics;
        window.dashboardMetricsInstance = null;
    }
}