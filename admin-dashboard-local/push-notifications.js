// Push Notifications Module for AGI Staffers Dashboard
class PushNotificationManager {
    constructor() {
        // Production VAPID key for AGI Staffers Push Notifications
        this.vapidPublicKey = 'BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8';
        this.subscribed = false;
        this.subscription = null;
        this.apiUrl = 'https://admin.agistaffers.com/push-api';
        this.userId = this.generateUserId();
    }

    // Initialize push notifications
    async init() {
        console.log('Initializing push notifications...');
        
        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.log('Notifications not supported in this browser');
            this.updateUI(false);
            return false;
        }

        // Check current permission status
        if (Notification.permission === 'denied') {
            console.log('Notifications have been blocked');
            this.updateUI(false);
            return false;
        }

        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker not supported');
            this.updateUI(false);
            return false;
        }

        try {
            // Wait for service worker to be ready
            const registration = await navigator.serviceWorker.ready;
            console.log('Service worker is ready');
            
            // Check if already has permission and subscription
            if (Notification.permission === 'granted') {
                // Check for existing subscription
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) {
                    this.subscription = subscription;
                    this.subscribed = true;
                    this.updateUI(true);
                    console.log('Notifications already enabled with existing subscription');
                    return true;
                }
            }
            
            this.updateUI(false);
            return false;
        } catch (error) {
            console.error('Failed to initialize push notifications:', error);
            this.updateUI(false);
            return false;
        }
    }

    // Request notification permission and subscribe
    async subscribe() {
        try {
            console.log('Requesting notification permission...');
            
            // Request permission
            const permission = await Notification.requestPermission();
            console.log('Permission result:', permission);
            
            if (permission !== 'granted') {
                alert('Notification permission was denied. Please enable notifications in your browser settings.');
                return false;
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;
            
            // Subscribe to push notifications
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
            });
            
            console.log('Push subscription:', subscription);
            this.subscription = subscription;
            
            // Send subscription to server
            const response = await fetch(`${this.apiUrl}/api/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscription: subscription.toJSON(),
                    userId: this.userId
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save subscription on server');
            }
            
            // Mark as subscribed
            this.subscribed = true;
            this.updateUI(true);
            
            // Show success notification
            await this.showTestNotification();
            
            console.log('Notifications enabled successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to enable notifications:', error);
            alert('Failed to enable notifications: ' + error.message);
            return false;
        }
    }

    // Unsubscribe from push notifications
    async unsubscribe() {
        try {
            if (this.subscription) {
                // Unsubscribe from push manager
                await this.subscription.unsubscribe();
                
                // Remove subscription from server
                const response = await fetch(`${this.apiUrl}/api/unsubscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: this.userId
                    })
                });
                
                if (!response.ok) {
                    console.error('Failed to remove subscription from server');
                }
            }
            
            // Mark as unsubscribed
            this.subscribed = false;
            this.subscription = null;
            this.updateUI(false);
            
            console.log('Notifications disabled');
            return true;
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            return false;
        }
    }

    // Send subscription to server
    async sendSubscriptionToServer(subscription) {
        // In production, you'd send this to your server
        console.log('Sending subscription to server:', subscription);
        
        // For now, store locally
        localStorage.setItem('pushSubscription', JSON.stringify(subscription));
    }

    // Remove subscription from server
    async removeSubscriptionFromServer(subscription) {
        // In production, you'd remove this from your server
        console.log('Removing subscription from server:', subscription);
        
        // For now, remove from local storage
        localStorage.removeItem('pushSubscription');
    }

    // Show test notification
    async showTestNotification() {
        try {
            const options = {
                body: 'Push notifications are now enabled for AGI Staffers',
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                vibrate: [200, 100, 200],
                tag: 'test-notification',
                requireInteraction: false,
                silent: false
            };

            // Try to use service worker if available
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification('🎉 Notifications Enabled!', options);
            } else {
                // Fallback to basic notification
                const notification = new Notification('🎉 Notifications Enabled!', options);
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };
            }
        } catch (error) {
            console.error('Failed to show test notification:', error);
        }
    }

    // Update UI based on subscription status
    updateUI(subscribed) {
        const btnElement = document.getElementById('push-notification-btn');
        const statusElement = document.getElementById('push-status');
        const preferencesElement = document.getElementById('notification-preferences');
        
        if (btnElement) {
            if (subscribed) {
                btnElement.innerHTML = `
                    <i data-lucide="bell-off" class="w-4 h-4 inline mr-1"></i>
                    Disable
                `;
                btnElement.classList.remove('bg-purple-600', 'hover:bg-purple-700');
                btnElement.classList.add('bg-red-600', 'hover:bg-red-700');
            } else {
                btnElement.innerHTML = `
                    <i data-lucide="bell" class="w-4 h-4 inline mr-1"></i>
                    Enable
                `;
                btnElement.classList.remove('bg-red-600', 'hover:bg-red-700');
                btnElement.classList.add('bg-purple-600', 'hover:bg-purple-700');
            }
            
            // Re-initialize Lucide icons
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
        
        if (statusElement) {
            statusElement.textContent = subscribed ? '• Enabled' : '• Disabled';
            statusElement.className = subscribed ? 'text-sm text-green-600' : 'text-sm text-gray-500';
        }
        
        // Show/hide preferences section
        if (preferencesElement) {
            if (subscribed) {
                preferencesElement.classList.remove('hidden');
                this.loadPreferences();
            } else {
                preferencesElement.classList.add('hidden');
            }
        }
    }
    
    // Load saved preferences
    loadPreferences() {
        const savedPrefs = localStorage.getItem('notificationPreferences');
        if (savedPrefs) {
            try {
                const prefs = JSON.parse(savedPrefs);
                // Apply saved preferences to checkboxes
                Object.keys(prefs).forEach(key => {
                    const checkbox = document.getElementById(key);
                    if (checkbox) {
                        checkbox.checked = prefs[key];
                    }
                });
            } catch (e) {
                console.error('Failed to load preferences:', e);
            }
        }
    }
    
    // Save preferences
    savePreferences() {
        const prefs = {
            'notify-container-down': document.getElementById('notify-container-down').checked,
            'notify-high-cpu': document.getElementById('notify-high-cpu').checked,
            'notify-low-memory': document.getElementById('notify-low-memory').checked,
            'notify-low-disk': document.getElementById('notify-low-disk').checked,
            'notify-deployments': document.getElementById('notify-deployments').checked,
            'notify-security': document.getElementById('notify-security').checked
        };
        
        // Save to localStorage
        localStorage.setItem('notificationPreferences', JSON.stringify(prefs));
        
        // Show save confirmation
        const statusEl = document.getElementById('pref-save-status');
        if (statusEl) {
            statusEl.classList.remove('hidden');
            setTimeout(() => {
                statusEl.classList.add('hidden');
            }, 2000);
        }
        
        // Send preferences to server
        this.sendPreferencesToServer(prefs);
        
        return prefs;
    }
    
    // Send preferences to server
    async sendPreferencesToServer(prefs) {
        try {
            const response = await fetch(`${this.apiUrl}/api/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.userId,
                    preferences: prefs
                })
            });
            
            if (!response.ok) {
                console.error('Failed to save preferences on server');
            }
        } catch (error) {
            console.error('Failed to send preferences:', error);
        }
    }
    
    // Generate or retrieve user ID
    generateUserId() {
        let userId = localStorage.getItem('push-user-id');
        if (!userId) {
            userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('push-user-id', userId);
        }
        return userId;
    }

    // Toggle push notifications
    async toggle() {
        if (this.subscribed) {
            return await this.unsubscribe();
        } else {
            return await this.subscribe();
        }
    }

    // Helper function to convert VAPID key
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Send test notification via API
    async sendTestNotificationViaAPI(title, body) {
        try {
            const response = await fetch(`${this.apiUrl}/api/test-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.userId,
                    title,
                    body
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send notification via API');
            }
            
            return true;
        } catch (error) {
            console.error('API notification failed:', error);
            return false;
        }
    }

    // Send custom notification (for testing)
    async sendCustomNotification(title, body, options = {}) {
        // Check if notifications are enabled
        if (Notification.permission !== 'granted') {
            alert('Please enable notifications first');
            return;
        }

        try {
            const defaultOptions = {
                body: body,
                icon: '/icon-192x192.png',
                badge: '/icon-192x192.png',
                vibrate: [200, 100, 200],
                tag: 'custom-notification',
                requireInteraction: false,
                data: {
                    dateOfArrival: Date.now(),
                    url: 'https://admin.agistaffers.com'
                }
            };

            const finalOptions = { ...defaultOptions, ...options };

            // Try to use service worker if available
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                const registration = await navigator.serviceWorker.ready;
                await registration.showNotification(title, finalOptions);
            } else {
                // Fallback to basic notification
                const notification = new Notification(title, finalOptions);
                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };
            }
        } catch (error) {
            console.error('Failed to show notification:', error);
            alert('Failed to show notification: ' + error.message);
        }
    }
}

// Initialize push notification manager
const pushManager = new PushNotificationManager();

// Export for use in other scripts
window.PushNotificationManager = PushNotificationManager;
window.pushManager = pushManager;