// AI Agent-Generated Component: Advanced Component Integration System
// Orchestrates all AI-generated components with enhanced functionality

class ComponentIntegrator {
    constructor(config = {}) {
        this.config = {
            autoInit: true,
            loadOrder: ['FoldAwareLayout', 'PushNotificationUI', 'DashboardMetrics'],
            errorHandling: 'graceful', // strict, graceful, ignore
            performanceMonitoring: true,
            componentTracking: true,
            ...config
        };

        this.components = new Map();
        this.loadingPromises = new Map();
        this.performanceMetrics = new Map();
        this.isInitialized = false;
        this.initStartTime = 0;
    }

    async init() {
        if (this.isInitialized) return;
        
        this.initStartTime = performance.now();
        console.log('🚀 ComponentIntegrator: Starting initialization...');

        try {
            // Initialize components in specified order
            await this.initializeComponents();
            
            // Set up component communication
            this.setupComponentCommunication();
            
            // Set up global event handlers
            this.setupGlobalEventHandlers();
            
            // Apply theme and initial configurations
            this.applyInitialConfigurations();

            this.isInitialized = true;
            this.logPerformanceMetrics();
            console.log('✅ ComponentIntegrator: All components initialized successfully');
            
        } catch (error) {
            console.error('❌ ComponentIntegrator: Initialization failed:', error);
            if (this.config.errorHandling === 'strict') {
                throw error;
            }
        }
    }

    async initializeComponents() {
        const componentConfigs = {
            FoldAwareLayout: {
                foldThreshold: 653,
                unfoldedThreshold: 768,
                enableTransitions: true,
                logChanges: false,
                persistLayout: true
            },
            PushNotificationUI: {
                containerId: 'notification-container',
                position: 'top-right',
                maxNotifications: 5,
                defaultDuration: 5000,
                accessibility: true
            },
            DashboardMetrics: {
                containerId: 'metrics-container',
                updateInterval: 5000,
                chartTheme: 'auto',
                animations: true,
                foldAware: true
            }
        };

        for (const componentName of this.config.loadOrder) {
            await this.initializeComponent(componentName, componentConfigs[componentName] || {});
        }
    }

    async initializeComponent(componentName, config) {
        const startTime = performance.now();
        
        try {
            console.log(`🔧 Initializing ${componentName}...`);
            
            // Check if component class exists
            if (!window[componentName]) {
                throw new Error(`Component class ${componentName} not found`);
            }

            // Create and initialize component instance
            const ComponentClass = window[componentName];
            const instance = new ComponentClass(config);
            
            if (typeof instance.init === 'function') {
                await instance.init();
            }

            this.components.set(componentName, instance);
            
            const duration = performance.now() - startTime;
            this.performanceMetrics.set(componentName, {
                initTime: duration,
                status: 'initialized',
                config: config
            });

            console.log(`✅ ${componentName} initialized in ${duration.toFixed(2)}ms`);
            
        } catch (error) {
            const duration = performance.now() - startTime;
            this.performanceMetrics.set(componentName, {
                initTime: duration,
                status: 'failed',
                error: error.message
            });
            
            console.error(`❌ Failed to initialize ${componentName}:`, error);
            
            if (this.config.errorHandling === 'strict') {
                throw error;
            }
        }
    }

    setupComponentCommunication() {
        const foldLayout = this.components.get('FoldAwareLayout');
        const notifications = this.components.get('PushNotificationUI');
        const metrics = this.components.get('DashboardMetrics');

        if (foldLayout && metrics) {
            // Register metrics component with fold-aware layout
            foldLayout.registerComponent('DashboardMetrics', {
                onFoldStateChange: (state) => {
                    if (typeof metrics.onFoldStateChange === 'function') {
                        metrics.onFoldStateChange(state);
                    }
                    this.adaptMetricsToFoldState(state);
                }
            });
        }

        if (foldLayout && notifications) {
            // Register notifications with fold-aware layout
            foldLayout.registerComponent('PushNotificationUI', {
                onFoldStateChange: (state) => {
                    this.adaptNotificationsToFoldState(state);
                }
            });
        }

        // Set up inter-component communication
        this.setupMetricsNotificationIntegration();
    }

    adaptMetricsToFoldState(state) {
        const metricsContainer = document.getElementById('metrics-container');
        if (!metricsContainer) return;

        if (state.isFolded) {
            // Optimize for folded state - stack vertically, larger touch targets
            metricsContainer.style.setProperty('--metrics-columns', '1');
            metricsContainer.style.setProperty('--metrics-gap', '0.75rem');
            metricsContainer.style.setProperty('--chart-height', '200px');
            metricsContainer.classList.add('folded-optimized');
        } else if (state.isUnfolded) {
            // Optimize for unfolded state - 2 columns
            metricsContainer.style.setProperty('--metrics-columns', '2');
            metricsContainer.style.setProperty('--metrics-gap', '1rem');
            metricsContainer.style.setProperty('--chart-height', '250px');
            metricsContainer.classList.remove('folded-optimized');
            metricsContainer.classList.add('unfolded-optimized');
        } else {
            // Desktop/tablet optimization
            metricsContainer.style.setProperty('--metrics-columns', '4');
            metricsContainer.style.setProperty('--metrics-gap', '1.5rem');
            metricsContainer.style.setProperty('--chart-height', '300px');
            metricsContainer.classList.remove('folded-optimized', 'unfolded-optimized');
        }
    }

    adaptNotificationsToFoldState(state) {
        const notifications = this.components.get('PushNotificationUI');
        if (!notifications) return;

        if (state.isFolded) {
            // Move notifications to top for folded devices
            notifications.config.position = 'top-right';
            notifications.config.maxNotifications = 3; // Fewer on small screen
        } else if (state.isUnfolded) {
            notifications.config.position = 'top-right';
            notifications.config.maxNotifications = 4;
        } else {
            notifications.config.position = 'top-right';
            notifications.config.maxNotifications = 5;
        }

        // Update notification container positioning
        const container = document.getElementById('notification-system-container');
        if (container) {
            container.className = container.className.replace(/top-\w+|bottom-\w+/, '');
            container.classList.add(notifications.config.position);
        }
    }

    setupMetricsNotificationIntegration() {
        const metrics = this.components.get('DashboardMetrics');
        const notifications = this.components.get('PushNotificationUI');
        
        if (!metrics || !notifications) return;

        // Create alert thresholds monitoring
        this.alertThresholds = {
            cpu: { warning: 80, critical: 95 },
            memory: { warning: 85, critical: 98 },
            disk: { warning: 90, critical: 98 },
            network: { warning: 90, critical: 99 }
        };

        this.lastAlertTimes = new Map();
        
        // Override metrics update to include alerting
        const originalUpdateMetrics = metrics.updateMetrics.bind(metrics);
        metrics.updateMetrics = (data) => {
            originalUpdateMetrics(data);
            this.checkMetricAlerts(data);
        };
    }

    checkMetricAlerts(data) {
        const notifications = this.components.get('PushNotificationUI');
        if (!notifications) return;

        const now = Date.now();
        const alertCooldown = 300000; // 5 minutes

        Object.entries(data).forEach(([metric, value]) => {
            const numValue = parseFloat(value);
            const thresholds = this.alertThresholds[metric];
            if (!thresholds) return;

            const lastAlert = this.lastAlertTimes.get(metric) || 0;
            if (now - lastAlert < alertCooldown) return;

            let alertLevel = null;
            if (numValue >= thresholds.critical) {
                alertLevel = 'critical';
            } else if (numValue >= thresholds.warning) {
                alertLevel = 'warning';
            }

            if (alertLevel) {
                const title = `${metric.toUpperCase()} ${alertLevel.toUpperCase()}`;
                const message = `${metric} usage is at ${numValue.toFixed(1)}%`;
                
                notifications.show({
                    type: alertLevel === 'critical' ? 'error' : 'warning',
                    title,
                    message,
                    duration: alertLevel === 'critical' ? 0 : 8000, // Critical alerts persist
                    actions: [
                        {
                            label: 'View Details',
                            handler: () => this.showMetricDetails(metric),
                            primary: true
                        },
                        {
                            label: 'Dismiss',
                            handler: () => {}
                        }
                    ]
                });

                this.lastAlertTimes.set(metric, now);
            }
        });
    }

    showMetricDetails(metric) {
        // Focus on the specific metric in the dashboard
        const metricCard = document.querySelector(`[data-metric="${metric}"]`);
        if (metricCard) {
            metricCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            metricCard.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                metricCard.style.animation = '';
            }, 2000);
        }
    }

    setupGlobalEventHandlers() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.refreshAllComponents();
                        break;
                    case 't':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.testNotification();
                        break;
                }
            }
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseComponents();
            } else {
                this.resumeComponents();
            }
        });

        // Handle connection changes
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.handleConnectionChange();
            });
        }
    }

    applyInitialConfigurations() {
        // Apply stored theme preference
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme) {
            document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        }

        // Apply accessibility preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }

        // Set up responsive behavior
        this.setupResponsiveBehavior();
    }

    setupResponsiveBehavior() {
        // Add responsive utility classes
        const style = document.createElement('style');
        style.textContent = `
            .component-integrator-responsive {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .folded-optimized {
                --component-padding: 0.75rem;
                --component-gap: 0.5rem;
                --touch-target-size: 44px;
            }

            .unfolded-optimized {
                --component-padding: 1rem;
                --component-gap: 0.75rem;
                --touch-target-size: 40px;
            }

            .pulse {
                animation: pulse 2s ease-in-out;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @media (prefers-reduced-motion: reduce) {
                .component-integrator-responsive,
                .pulse {
                    transition: none !important;
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    refreshAllComponents() {
        const notifications = this.components.get('PushNotificationUI');
        if (notifications) {
            notifications.info('Refreshing', 'Updating all dashboard components...');
        }

        this.components.forEach((component, name) => {
            if (typeof component.refresh === 'function') {
                component.refresh();
            } else if (typeof component.fetchMetrics === 'function') {
                component.fetchMetrics();
            }
        });
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('dashboard-theme', isDark ? 'dark' : 'light');
        
        const notifications = this.components.get('PushNotificationUI');
        if (notifications) {
            notifications.info('Theme Changed', `Switched to ${isDark ? 'dark' : 'light'} theme`);
        }
    }

    testNotification() {
        const notifications = this.components.get('PushNotificationUI');
        if (notifications) {
            notifications.success('Test Notification', 'This is a test of the notification system', {
                actions: [
                    { label: 'Action 1', handler: () => console.log('Action 1'), primary: true },
                    { label: 'Action 2', handler: () => console.log('Action 2') }
                ]
            });
        }
    }

    pauseComponents() {
        this.components.forEach((component, name) => {
            if (typeof component.pause === 'function') {
                component.pause();
            }
        });
    }

    resumeComponents() {
        this.components.forEach((component, name) => {
            if (typeof component.resume === 'function') {
                component.resume();
            }
        });
    }

    handleConnectionChange() {
        const connection = navigator.connection;
        const notifications = this.components.get('PushNotificationUI');
        
        if (connection && notifications) {
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                notifications.warning('Slow Connection', 'Performance may be affected by slow network');
            } else if (!navigator.onLine) {
                notifications.error('Connection Lost', 'Dashboard functionality may be limited');
            }
        }
    }

    logPerformanceMetrics() {
        if (!this.config.performanceMonitoring) return;

        const totalTime = performance.now() - this.initStartTime;
        
        console.group('📊 ComponentIntegrator Performance Metrics');
        console.log(`Total initialization time: ${totalTime.toFixed(2)}ms`);
        
        this.performanceMetrics.forEach((metrics, componentName) => {
            console.log(`${componentName}: ${metrics.initTime.toFixed(2)}ms (${metrics.status})`);
            if (metrics.error) {
                console.error(`  Error: ${metrics.error}`);
            }
        });
        
        console.groupEnd();

        // Store metrics for debugging
        window.componentIntegratorMetrics = {
            totalTime,
            components: Object.fromEntries(this.performanceMetrics),
            timestamp: Date.now()
        };
    }

    getComponentStatus() {
        const status = {};
        this.components.forEach((component, name) => {
            status[name] = {
                initialized: true,
                instance: component,
                config: component.config || {},
                performance: this.performanceMetrics.get(name)
            };
        });
        return status;
    }

    getComponent(name) {
        return this.components.get(name);
    }

    async reinitializeComponent(name) {
        const component = this.components.get(name);
        if (component && typeof component.destroy === 'function') {
            component.destroy();
        }
        
        this.components.delete(name);
        this.performanceMetrics.delete(name);
        
        await this.initializeComponent(name, {});
    }

    destroy() {
        console.log('🔄 ComponentIntegrator: Destroying all components...');
        
        this.components.forEach((component, name) => {
            if (typeof component.destroy === 'function') {
                try {
                    component.destroy();
                } catch (error) {
                    console.error(`Error destroying ${name}:`, error);
                }
            }
        });

        this.components.clear();
        this.performanceMetrics.clear();
        this.isInitialized = false;
        
        console.log('✅ ComponentIntegrator: All components destroyed');
    }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.ComponentIntegrator = ComponentIntegrator;
    
    // Auto-initialize if configured
    document.addEventListener('DOMContentLoaded', async () => {
        if (window.autoInitializeComponents !== false) {
            try {
                window.componentIntegrator = new ComponentIntegrator();
                await window.componentIntegrator.init();
            } catch (error) {
                console.error('Failed to auto-initialize ComponentIntegrator:', error);
            }
        }
    });
}