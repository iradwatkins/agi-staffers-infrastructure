// Real-time Alerts System with Configurable Thresholds
// Monitors system metrics and triggers push notifications

class AlertsSystem {
    constructor(config = {}) {
        this.config = {
            checkInterval: 30000, // Check every 30 seconds
            metricsUrl: 'https://admin.agistaffers.com/api/metrics',
            pushApiUrl: 'https://admin.agistaffers.com/push-api',
            ...config
        };

        // Default thresholds
        this.thresholds = {
            cpu: {
                warning: 70,
                critical: 85,
                duration: 300000 // 5 minutes
            },
            memory: {
                warning: 80,
                critical: 90,
                duration: 300000
            },
            disk: {
                warning: 80,
                critical: 90,
                duration: 600000 // 10 minutes
            },
            containerDown: {
                duration: 60000 // 1 minute
            }
        };

        // Alert states
        this.alertStates = new Map();
        this.activeAlerts = new Map();
        this.metrics = null;
        this.isMonitoring = false;
        this.checkTimer = null;

        // Load saved thresholds
        this.loadThresholds();
    }

    async init() {
        try {
            console.log('🚨 Initializing Alerts System...');
            
            // Create UI elements
            this.createAlertsUI();
            
            // Start monitoring
            await this.startMonitoring();
            
            console.log('✅ Alerts System initialized');
        } catch (error) {
            console.error('❌ Alerts System initialization failed:', error);
        }
    }

    createAlertsUI() {
        // Add alerts configuration modal
        const modalHTML = `
            <div id="alerts-config-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
                <div class="flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div class="p-6 border-b">
                            <h2 class="text-2xl font-bold text-gray-900">Alert Settings</h2>
                            <p class="text-sm text-gray-600 mt-1">Configure thresholds for system alerts</p>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            <!-- CPU Thresholds -->
                            <div class="border rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                                    <i data-lucide="cpu" class="w-5 h-5 mr-2 text-red-500"></i>
                                    CPU Usage Alerts
                                </h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Warning Threshold (%)
                                        </label>
                                        <input type="number" id="cpu-warning" min="0" max="100" 
                                               class="w-full px-3 py-2 border rounded-md" value="70">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Critical Threshold (%)
                                        </label>
                                        <input type="number" id="cpu-critical" min="0" max="100" 
                                               class="w-full px-3 py-2 border rounded-md" value="85">
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Duration before alert (minutes)
                                    </label>
                                    <input type="number" id="cpu-duration" min="1" max="60" 
                                           class="w-32 px-3 py-2 border rounded-md" value="5">
                                </div>
                            </div>

                            <!-- Memory Thresholds -->
                            <div class="border rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                                    <i data-lucide="zap" class="w-5 h-5 mr-2 text-blue-500"></i>
                                    Memory Usage Alerts
                                </h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Warning Threshold (%)
                                        </label>
                                        <input type="number" id="memory-warning" min="0" max="100" 
                                               class="w-full px-3 py-2 border rounded-md" value="80">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Critical Threshold (%)
                                        </label>
                                        <input type="number" id="memory-critical" min="0" max="100" 
                                               class="w-full px-3 py-2 border rounded-md" value="90">
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Duration before alert (minutes)
                                    </label>
                                    <input type="number" id="memory-duration" min="1" max="60" 
                                           class="w-32 px-3 py-2 border rounded-md" value="5">
                                </div>
                            </div>

                            <!-- Disk Thresholds -->
                            <div class="border rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                                    <i data-lucide="hard-drive" class="w-5 h-5 mr-2 text-yellow-500"></i>
                                    Disk Usage Alerts
                                </h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Warning Threshold (%)
                                        </label>
                                        <input type="number" id="disk-warning" min="0" max="100" 
                                               class="w-full px-3 py-2 border rounded-md" value="80">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">
                                            Critical Threshold (%)
                                        </label>
                                        <input type="number" id="disk-critical" min="0" max="100" 
                                               class="w-full px-3 py-2 border rounded-md" value="90">
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Duration before alert (minutes)
                                    </label>
                                    <input type="number" id="disk-duration" min="1" max="60" 
                                           class="w-32 px-3 py-2 border rounded-md" value="10">
                                </div>
                            </div>

                            <!-- Container Monitoring -->
                            <div class="border rounded-lg p-4">
                                <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
                                    <i data-lucide="box" class="w-5 h-5 mr-2 text-purple-500"></i>
                                    Container Monitoring
                                </h3>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">
                                        Alert after container down for (minutes)
                                    </label>
                                    <input type="number" id="container-duration" min="1" max="30" 
                                           class="w-32 px-3 py-2 border rounded-md" value="1">
                                </div>
                            </div>

                            <!-- Test Alerts -->
                            <div class="border rounded-lg p-4 bg-gray-50">
                                <h3 class="font-semibold text-gray-900 mb-3">Test Alerts</h3>
                                <div class="flex flex-wrap gap-2">
                                    <button onclick="alertsSystem.testAlert('cpu')" 
                                            class="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200">
                                        Test CPU Alert
                                    </button>
                                    <button onclick="alertsSystem.testAlert('memory')" 
                                            class="px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200">
                                        Test Memory Alert
                                    </button>
                                    <button onclick="alertsSystem.testAlert('disk')" 
                                            class="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200">
                                        Test Disk Alert
                                    </button>
                                    <button onclick="alertsSystem.testAlert('container')" 
                                            class="px-3 py-2 bg-purple-100 text-purple-700 rounded-md text-sm hover:bg-purple-200">
                                        Test Container Alert
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 border-t bg-gray-50 flex justify-between">
                            <button onclick="alertsSystem.resetThresholds()" 
                                    class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
                                Reset to Defaults
                            </button>
                            <div class="space-x-3">
                                <button onclick="alertsSystem.closeConfig()" 
                                        class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button onclick="alertsSystem.saveThresholds()" 
                                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = modalHTML;
        document.body.appendChild(modalDiv.firstElementChild);

        // Update the openAlertsConfig function
        window.openAlertsConfig = () => this.openConfig();
    }

    async startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Initial check
        await this.checkMetrics();
        
        // Set up interval
        this.checkTimer = setInterval(() => {
            this.checkMetrics();
        }, this.config.checkInterval);
    }

    stopMonitoring() {
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        this.isMonitoring = false;
    }

    async checkMetrics() {
        try {
            // Fetch current metrics
            const response = await fetch(this.config.metricsUrl);
            if (!response.ok) throw new Error('Failed to fetch metrics');
            
            const data = await response.json();
            this.metrics = data;
            
            // Check each metric against thresholds
            this.checkCPU(data.cpu);
            this.checkMemory(data.memory);
            this.checkDisk(data.disk);
            this.checkContainers(data.containers);
            
            // Update alerts display
            this.updateAlertsDisplay();
            
        } catch (error) {
            console.error('Metrics check failed:', error);
        }
    }

    checkCPU(cpuData) {
        if (!cpuData) return;
        
        const usage = parseFloat(cpuData.usage);
        const alertKey = 'cpu';
        
        if (usage >= this.thresholds.cpu.critical) {
            this.triggerAlert(alertKey, 'critical', {
                title: '🚨 Critical CPU Usage',
                body: `CPU usage at ${usage.toFixed(1)}% (Critical threshold: ${this.thresholds.cpu.critical}%)`,
                metric: 'cpu',
                value: usage
            });
        } else if (usage >= this.thresholds.cpu.warning) {
            this.triggerAlert(alertKey, 'warning', {
                title: '⚠️ High CPU Usage',
                body: `CPU usage at ${usage.toFixed(1)}% (Warning threshold: ${this.thresholds.cpu.warning}%)`,
                metric: 'cpu',
                value: usage
            });
        } else {
            this.clearAlert(alertKey);
        }
    }

    checkMemory(memoryData) {
        if (!memoryData) return;
        
        const usage = parseFloat(memoryData.percentage);
        const alertKey = 'memory';
        
        if (usage >= this.thresholds.memory.critical) {
            this.triggerAlert(alertKey, 'critical', {
                title: '🚨 Critical Memory Usage',
                body: `Memory usage at ${usage.toFixed(1)}% (Critical threshold: ${this.thresholds.memory.critical}%)`,
                metric: 'memory',
                value: usage
            });
        } else if (usage >= this.thresholds.memory.warning) {
            this.triggerAlert(alertKey, 'warning', {
                title: '⚠️ High Memory Usage',
                body: `Memory usage at ${usage.toFixed(1)}% (Warning threshold: ${this.thresholds.memory.warning}%)`,
                metric: 'memory',
                value: usage
            });
        } else {
            this.clearAlert(alertKey);
        }
    }

    checkDisk(diskData) {
        if (!diskData) return;
        
        const usage = parseFloat(diskData.percentage);
        const alertKey = 'disk';
        
        if (usage >= this.thresholds.disk.critical) {
            this.triggerAlert(alertKey, 'critical', {
                title: '🚨 Critical Disk Usage',
                body: `Disk usage at ${usage.toFixed(1)}% (Critical threshold: ${this.thresholds.disk.critical}%)`,
                metric: 'disk',
                value: usage
            });
        } else if (usage >= this.thresholds.disk.warning) {
            this.triggerAlert(alertKey, 'warning', {
                title: '⚠️ High Disk Usage',
                body: `Disk usage at ${usage.toFixed(1)}% (Warning threshold: ${this.thresholds.disk.warning}%)`,
                metric: 'disk',
                value: usage
            });
        } else {
            this.clearAlert(alertKey);
        }
    }

    checkContainers(containers) {
        if (!containers || !Array.isArray(containers)) return;
        
        containers.forEach(container => {
            const alertKey = `container-${container.name}`;
            
            if (container.status !== 'running') {
                this.triggerAlert(alertKey, 'critical', {
                    title: '🚨 Container Down',
                    body: `${container.name} is ${container.status}`,
                    metric: 'container',
                    container: container.name,
                    status: container.status
                });
            } else {
                this.clearAlert(alertKey);
            }
        });
    }

    triggerAlert(key, severity, data) {
        const now = Date.now();
        const alertState = this.alertStates.get(key);
        
        if (!alertState) {
            // New alert
            this.alertStates.set(key, {
                firstSeen: now,
                lastSeen: now,
                severity,
                data,
                notified: false
            });
        } else {
            // Update existing alert
            alertState.lastSeen = now;
            alertState.severity = severity;
            alertState.data = data;
        }
        
        // Check if duration threshold met
        const state = this.alertStates.get(key);
        const duration = this.getThresholdDuration(data.metric);
        
        if (!state.notified && (now - state.firstSeen) >= duration) {
            // Send notification
            this.sendAlertNotification(key, severity, data);
            state.notified = true;
            
            // Add to active alerts
            this.activeAlerts.set(key, {
                ...data,
                severity,
                timestamp: now
            });
        }
    }

    clearAlert(key) {
        this.alertStates.delete(key);
        this.activeAlerts.delete(key);
    }

    getThresholdDuration(metric) {
        switch (metric) {
            case 'cpu':
                return this.thresholds.cpu.duration;
            case 'memory':
                return this.thresholds.memory.duration;
            case 'disk':
                return this.thresholds.disk.duration;
            case 'container':
                return this.thresholds.containerDown.duration;
            default:
                return 300000; // 5 minutes default
        }
    }

    async sendAlertNotification(key, severity, data) {
        // Check user preferences
        const prefs = this.getNotificationPreferences();
        const prefKey = this.getPreferenceKey(data.metric);
        
        if (!prefs[prefKey]) {
            console.log(`Alert notification skipped due to preferences: ${key}`);
            return;
        }
        
        // Send via push notification
        if (window.pushManager && window.pushManager.subscribed) {
            await window.pushManager.sendCustomNotification(data.title, data.body, {
                tag: key,
                requireInteraction: severity === 'critical',
                data: {
                    metric: data.metric,
                    value: data.value,
                    severity
                }
            });
        }
        
        // Also send to server for persistence/logging
        try {
            await fetch(`${this.config.pushApiUrl}/api/alert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: this.getAlertType(data.metric),
                    severity,
                    message: data.body,
                    details: data
                })
            });
        } catch (error) {
            console.error('Failed to send alert to server:', error);
        }
        
        // Show in UI
        if (window.componentIntegrator) {
            const notificationUI = window.componentIntegrator.getComponent('PushNotificationUI');
            if (notificationUI) {
                notificationUI[severity === 'critical' ? 'error' : 'warning'](
                    data.title,
                    data.body,
                    {
                        persistent: severity === 'critical',
                        duration: 10000
                    }
                );
            }
        }
    }

    getPreferenceKey(metric) {
        const prefMap = {
            'cpu': 'notify-high-cpu',
            'memory': 'notify-low-memory',
            'disk': 'notify-low-disk',
            'container': 'notify-container-down'
        };
        return prefMap[metric] || null;
    }

    getAlertType(metric) {
        const typeMap = {
            'cpu': 'high-cpu',
            'memory': 'low-memory',
            'disk': 'low-disk',
            'container': 'container-down'
        };
        return typeMap[metric] || 'system';
    }

    getNotificationPreferences() {
        const saved = localStorage.getItem('notificationPreferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse notification preferences:', e);
            }
        }
        
        // Default all enabled
        return {
            'notify-container-down': true,
            'notify-high-cpu': true,
            'notify-low-memory': true,
            'notify-low-disk': true,
            'notify-deployments': false,
            'notify-security': true
        };
    }

    updateAlertsDisplay() {
        const container = document.getElementById('alerts-container');
        if (!container) return;
        
        if (this.activeAlerts.size === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-4">No active alerts</div>';
            return;
        }
        
        const alertsHTML = Array.from(this.activeAlerts.entries()).map(([key, alert]) => {
            const severityClass = alert.severity === 'critical' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200';
            const iconClass = alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600';
            
            return `
                <div class="alert-item ${severityClass} border rounded-lg p-3 mb-2">
                    <div class="flex items-start justify-between">
                        <div class="flex items-start">
                            <i data-lucide="alert-triangle" class="w-5 h-5 ${iconClass} mr-2 mt-0.5"></i>
                            <div>
                                <h4 class="font-medium text-gray-900">${alert.title}</h4>
                                <p class="text-sm text-gray-600">${alert.body}</p>
                                <p class="text-xs text-gray-500 mt-1">
                                    ${new Date(alert.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <button onclick="alertsSystem.dismissAlert('${key}')" 
                                class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = alertsHTML;
        
        // Re-initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    dismissAlert(key) {
        this.activeAlerts.delete(key);
        this.updateAlertsDisplay();
    }

    openConfig() {
        const modal = document.getElementById('alerts-config-modal');
        if (!modal) return;
        
        // Load current thresholds into form
        document.getElementById('cpu-warning').value = this.thresholds.cpu.warning;
        document.getElementById('cpu-critical').value = this.thresholds.cpu.critical;
        document.getElementById('cpu-duration').value = this.thresholds.cpu.duration / 60000;
        
        document.getElementById('memory-warning').value = this.thresholds.memory.warning;
        document.getElementById('memory-critical').value = this.thresholds.memory.critical;
        document.getElementById('memory-duration').value = this.thresholds.memory.duration / 60000;
        
        document.getElementById('disk-warning').value = this.thresholds.disk.warning;
        document.getElementById('disk-critical').value = this.thresholds.disk.critical;
        document.getElementById('disk-duration').value = this.thresholds.disk.duration / 60000;
        
        document.getElementById('container-duration').value = this.thresholds.containerDown.duration / 60000;
        
        modal.classList.remove('hidden');
        
        // Re-initialize icons
        setTimeout(() => {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }, 100);
    }

    closeConfig() {
        const modal = document.getElementById('alerts-config-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveThresholds() {
        // Get values from form
        this.thresholds.cpu.warning = parseInt(document.getElementById('cpu-warning').value);
        this.thresholds.cpu.critical = parseInt(document.getElementById('cpu-critical').value);
        this.thresholds.cpu.duration = parseInt(document.getElementById('cpu-duration').value) * 60000;
        
        this.thresholds.memory.warning = parseInt(document.getElementById('memory-warning').value);
        this.thresholds.memory.critical = parseInt(document.getElementById('memory-critical').value);
        this.thresholds.memory.duration = parseInt(document.getElementById('memory-duration').value) * 60000;
        
        this.thresholds.disk.warning = parseInt(document.getElementById('disk-warning').value);
        this.thresholds.disk.critical = parseInt(document.getElementById('disk-critical').value);
        this.thresholds.disk.duration = parseInt(document.getElementById('disk-duration').value) * 60000;
        
        this.thresholds.containerDown.duration = parseInt(document.getElementById('container-duration').value) * 60000;
        
        // Save to localStorage
        localStorage.setItem('alertThresholds', JSON.stringify(this.thresholds));
        
        // Clear existing alerts to re-evaluate with new thresholds
        this.alertStates.clear();
        this.activeAlerts.clear();
        
        // Close modal
        this.closeConfig();
        
        // Show success notification
        if (window.componentIntegrator) {
            const notificationUI = window.componentIntegrator.getComponent('PushNotificationUI');
            if (notificationUI) {
                notificationUI.success('Settings Saved', 'Alert thresholds have been updated');
            }
        }
    }

    resetThresholds() {
        if (!confirm('Reset all thresholds to default values?')) return;
        
        // Reset to defaults
        this.thresholds = {
            cpu: { warning: 70, critical: 85, duration: 300000 },
            memory: { warning: 80, critical: 90, duration: 300000 },
            disk: { warning: 80, critical: 90, duration: 600000 },
            containerDown: { duration: 60000 }
        };
        
        // Update form
        this.openConfig();
    }

    loadThresholds() {
        const saved = localStorage.getItem('alertThresholds');
        if (saved) {
            try {
                this.thresholds = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load saved thresholds:', e);
            }
        }
    }

    async testAlert(type) {
        const testData = {
            cpu: {
                title: '🚨 Test CPU Alert',
                body: 'This is a test CPU usage alert (85%)',
                metric: 'cpu',
                value: 85
            },
            memory: {
                title: '⚠️ Test Memory Alert',
                body: 'This is a test memory usage alert (92%)',
                metric: 'memory',
                value: 92
            },
            disk: {
                title: '⚠️ Test Disk Alert',
                body: 'This is a test disk space alert (88%)',
                metric: 'disk',
                value: 88
            },
            container: {
                title: '🚨 Test Container Alert',
                body: 'This is a test container down alert (nginx)',
                metric: 'container',
                container: 'nginx',
                status: 'stopped'
            }
        };
        
        const data = testData[type];
        if (!data) return;
        
        // Send test notification
        await this.sendAlertNotification(`test-${type}`, 'critical', data);
    }

    destroy() {
        this.stopMonitoring();
        
        // Remove modal
        const modal = document.getElementById('alerts-config-modal');
        if (modal) {
            modal.remove();
        }
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.AlertsSystem = AlertsSystem;
}