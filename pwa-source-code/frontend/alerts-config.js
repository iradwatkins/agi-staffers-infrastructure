// Alert Configuration Manager
class AlertsConfig {
    constructor() {
        this.apiUrl = 'https://admin.agistaffers.com:3009/api';
        this.currentThresholds = {
            cpu: 80,
            memory: 85,
            disk: 90,
            containerCpu: 50,
            containerMemory: 80
        };
        this.isOpen = false;
    }

    // Initialize alerts configuration
    async init() {
        this.createConfigModal();
        await this.loadThresholds();
        this.setupEventListeners();
    }

    // Load current thresholds from API
    async loadThresholds() {
        try {
            const response = await fetch(`${this.apiUrl}/alerts/thresholds`);
            if (response.ok) {
                this.currentThresholds = await response.json();
                this.updateUI();
            }
        } catch (error) {
            console.error('Error loading alert thresholds:', error);
        }
    }

    // Save thresholds to API
    async saveThresholds(newThresholds) {
        try {
            const response = await fetch(`${this.apiUrl}/alerts/thresholds`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newThresholds)
            });

            if (response.ok) {
                const result = await response.json();
                this.currentThresholds = result.thresholds;
                this.updateUI();
                this.showNotification('Alert thresholds updated successfully', 'success');
                return true;
            } else {
                throw new Error('Failed to save thresholds');
            }
        } catch (error) {
            console.error('Error saving alert thresholds:', error);
            this.showNotification('Failed to save alert thresholds', 'error');
            return false;
        }
    }

    // Create configuration modal
    createConfigModal() {
        const modalHTML = `
            <div id="alerts-config-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-90vh overflow-y-auto">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                            <i data-lucide="bell" class="w-5 h-5 mr-2 text-orange-500"></i>
                            Alert Configuration
                        </h3>
                        <button id="close-alerts-config" class="text-gray-400 hover:text-gray-600">
                            <i data-lucide="x" class="w-5 h-5"></i>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="p-6 space-y-6">
                        <!-- System Alerts -->
                        <div class="space-y-4">
                            <h4 class="text-sm font-medium text-gray-900 border-b pb-2">System Resource Thresholds</h4>
                            
                            <!-- CPU Threshold -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center">
                                    <i data-lucide="cpu" class="w-4 h-4 mr-2 text-red-500"></i>
                                    CPU Usage Alert (%)
                                </label>
                                <div class="flex items-center space-x-3">
                                    <input type="range" id="cpu-threshold" min="50" max="95" step="5" 
                                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                    <span id="cpu-threshold-value" class="text-sm font-medium text-gray-900 min-w-[3rem]">80%</span>
                                </div>
                                <p class="text-xs text-gray-500">Alert when CPU usage exceeds this threshold</p>
                            </div>

                            <!-- Memory Threshold -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center">
                                    <i data-lucide="chip" class="w-4 h-4 mr-2 text-blue-500"></i>
                                    Memory Usage Alert (%)
                                </label>
                                <div class="flex items-center space-x-3">
                                    <input type="range" id="memory-threshold" min="60" max="95" step="5"
                                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                    <span id="memory-threshold-value" class="text-sm font-medium text-gray-900 min-w-[3rem]">85%</span>
                                </div>
                                <p class="text-xs text-gray-500">Alert when memory usage exceeds this threshold</p>
                            </div>

                            <!-- Disk Threshold -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center">
                                    <i data-lucide="hard-drive" class="w-4 h-4 mr-2 text-yellow-500"></i>
                                    Disk Usage Alert (%)
                                </label>
                                <div class="flex items-center space-x-3">
                                    <input type="range" id="disk-threshold" min="70" max="95" step="5"
                                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                    <span id="disk-threshold-value" class="text-sm font-medium text-gray-900 min-w-[3rem]">90%</span>
                                </div>
                                <p class="text-xs text-gray-500">Alert when disk usage exceeds this threshold</p>
                            </div>
                        </div>

                        <!-- Container Alerts -->
                        <div class="space-y-4">
                            <h4 class="text-sm font-medium text-gray-900 border-b pb-2">Container Resource Thresholds</h4>
                            
                            <!-- Container CPU -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center">
                                    <i data-lucide="box" class="w-4 h-4 mr-2 text-purple-500"></i>
                                    Container CPU Alert (%)
                                </label>
                                <div class="flex items-center space-x-3">
                                    <input type="range" id="container-cpu-threshold" min="20" max="80" step="10"
                                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                    <span id="container-cpu-threshold-value" class="text-sm font-medium text-gray-900 min-w-[3rem]">50%</span>
                                </div>
                                <p class="text-xs text-gray-500">Alert when any container exceeds this CPU usage</p>
                            </div>

                            <!-- Container Memory -->
                            <div class="space-y-2">
                                <label class="text-sm font-medium text-gray-700 flex items-center">
                                    <i data-lucide="database" class="w-4 h-4 mr-2 text-green-500"></i>
                                    Container Memory Alert (%)
                                </label>
                                <div class="flex items-center space-x-3">
                                    <input type="range" id="container-memory-threshold" min="50" max="90" step="10"
                                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                                    <span id="container-memory-threshold-value" class="text-sm font-medium text-gray-900 min-w-[3rem]">80%</span>
                                </div>
                                <p class="text-xs text-gray-500">Alert when any container exceeds this memory usage</p>
                            </div>
                        </div>

                        <!-- Push Notifications -->
                        <div class="space-y-4">
                            <h4 class="text-sm font-medium text-gray-900 border-b pb-2">Notification Settings</h4>
                            
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <i data-lucide="smartphone" class="w-5 h-5 text-blue-500"></i>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">Browser Notifications</div>
                                        <div class="text-xs text-gray-500">Get alerts via browser notifications</div>
                                    </div>
                                </div>
                                <button id="enable-notifications" class="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                                    Enable
                                </button>
                            </div>

                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <i data-lucide="bell-ring" class="w-5 h-5 text-purple-500"></i>
                                    <div>
                                        <div class="text-sm font-medium text-gray-900">Push Notifications</div>
                                        <div class="text-xs text-gray-500">Get alerts via push notifications</div>
                                    </div>
                                </div>
                                <button id="enable-push-notifications" class="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">
                                    Setup
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-between p-6 border-t border-gray-200">
                        <button id="reset-thresholds" class="px-4 py-2 text-gray-600 text-sm hover:text-gray-800">
                            Reset to Defaults
                        </button>
                        <div class="flex space-x-3">
                            <button id="cancel-alerts-config" class="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button id="save-alerts-config" class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Setup event listeners
    setupEventListeners() {
        // Modal controls
        document.getElementById('close-alerts-config').addEventListener('click', () => this.closeModal());
        document.getElementById('cancel-alerts-config').addEventListener('click', () => this.closeModal());
        document.getElementById('save-alerts-config').addEventListener('click', () => this.saveCurrentSettings());
        document.getElementById('reset-thresholds').addEventListener('click', () => this.resetToDefaults());

        // Range sliders
        const sliders = [
            { id: 'cpu-threshold', valueId: 'cpu-threshold-value', key: 'cpu' },
            { id: 'memory-threshold', valueId: 'memory-threshold-value', key: 'memory' },
            { id: 'disk-threshold', valueId: 'disk-threshold-value', key: 'disk' },
            { id: 'container-cpu-threshold', valueId: 'container-cpu-threshold-value', key: 'containerCpu' },
            { id: 'container-memory-threshold', valueId: 'container-memory-threshold-value', key: 'containerMemory' }
        ];

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valueElement = document.getElementById(slider.valueId);
            
            element.addEventListener('input', (e) => {
                const value = e.target.value;
                valueElement.textContent = `${value}%`;
            });
        });

        // Notification buttons
        document.getElementById('enable-notifications').addEventListener('click', () => {
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showNotification('Browser notifications enabled', 'success');
                    }
                });
            }
        });

        document.getElementById('enable-push-notifications').addEventListener('click', () => {
            if (window.pushNotifications) {
                window.pushNotifications.requestPermission();
            } else {
                this.showNotification('Push notifications not available', 'error');
            }
        });

        // Modal backdrop click
        document.getElementById('alerts-config-modal').addEventListener('click', (e) => {
            if (e.target.id === 'alerts-config-modal') {
                this.closeModal();
            }
        });
    }

    // Open modal
    openModal() {
        this.isOpen = true;
        this.updateUI();
        document.getElementById('alerts-config-modal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Reinitialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Close modal
    closeModal() {
        this.isOpen = false;
        document.getElementById('alerts-config-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Update UI with current thresholds
    updateUI() {
        if (!this.isOpen) return;

        const sliders = [
            { id: 'cpu-threshold', valueId: 'cpu-threshold-value', key: 'cpu' },
            { id: 'memory-threshold', valueId: 'memory-threshold-value', key: 'memory' },
            { id: 'disk-threshold', valueId: 'disk-threshold-value', key: 'disk' },
            { id: 'container-cpu-threshold', valueId: 'container-cpu-threshold-value', key: 'containerCpu' },
            { id: 'container-memory-threshold', valueId: 'container-memory-threshold-value', key: 'containerMemory' }
        ];

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            const valueElement = document.getElementById(slider.valueId);
            
            if (element && valueElement) {
                const value = this.currentThresholds[slider.key];
                element.value = value;
                valueElement.textContent = `${value}%`;
            }
        });
    }

    // Save current settings
    async saveCurrentSettings() {
        const newThresholds = {
            cpu: parseInt(document.getElementById('cpu-threshold').value),
            memory: parseInt(document.getElementById('memory-threshold').value),
            disk: parseInt(document.getElementById('disk-threshold').value),
            containerCpu: parseInt(document.getElementById('container-cpu-threshold').value),
            containerMemory: parseInt(document.getElementById('container-memory-threshold').value)
        };

        const success = await this.saveThresholds(newThresholds);
        if (success) {
            this.closeModal();
        }
    }

    // Reset to defaults
    resetToDefaults() {
        const defaults = {
            cpu: 80,
            memory: 85,
            disk: 90,
            containerCpu: 50,
            containerMemory: 80
        };

        this.currentThresholds = defaults;
        this.updateUI();
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Initialize alerts configuration
let alertsConfig;
document.addEventListener('DOMContentLoaded', () => {
    alertsConfig = new AlertsConfig();
    alertsConfig.init();
});

// Global function to open alerts config
window.openAlertsConfig = function() {
    if (alertsConfig) {
        alertsConfig.openModal();
    }
};