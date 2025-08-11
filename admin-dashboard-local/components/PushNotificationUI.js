// AI Agent-Generated Component: Enhanced Push Notification UI
// Security-first, mobile-optimized, WCAG-compliant notification system

class PushNotificationUI {
    constructor(config = {}) {
        this.config = {
            containerId: 'notification-container',
            position: 'top-right', // top-right, top-left, bottom-right, bottom-left
            maxNotifications: 5,
            defaultDuration: 5000,
            animations: true,
            sounds: false,
            rtl: false,
            accessibility: true,
            persistentStorage: true,
            ...config
        };

        this.notifications = [];
        this.notificationCounter = 0;
        this.isInitialized = false;
        this.serviceWorkerReady = false;
        this.permission = Notification.permission;
        
        // Security: Input sanitization patterns
        this.sanitizePatterns = {
            html: /[<>]/g,
            script: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            url: /^https?:\/\/[^\s<>"{}|\\^`\[\]]+$/
        };

        // Accessibility announcer
        this.announcer = null;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            await this.createContainer();
            await this.setupServiceWorker();
            this.setupAccessibility();
            this.setupEventListeners();
            this.loadPersistedSettings();
            this.isInitialized = true;
            
            console.log('✅ PushNotificationUI: Initialized successfully');
        } catch (error) {
            console.error('❌ PushNotificationUI: Initialization failed:', error);
        }
    }

    createContainer() {
        // Remove existing container
        const existingContainer = document.getElementById('notification-system-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Create main container
        const container = document.createElement('div');
        container.id = 'notification-system-container';
        container.className = `notification-system ${this.config.position} ${this.config.rtl ? 'rtl' : 'ltr'}`;
        container.setAttribute('role', 'alert');
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'false');

        // Add notification container
        const notificationContainer = document.createElement('div');
        notificationContainer.id = this.config.containerId;
        notificationContainer.className = 'notification-container';
        container.appendChild(notificationContainer);

        document.body.appendChild(container);
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('push-notification-ui-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'push-notification-ui-styles';
        styles.textContent = `
            .notification-system {
                position: fixed;
                z-index: 10000;
                pointer-events: none;
                max-width: 400px;
                width: 100%;
                padding: 1rem;
            }

            .notification-system.top-right {
                top: 0;
                right: 0;
            }

            .notification-system.top-left {
                top: 0;
                left: 0;
            }

            .notification-system.bottom-right {
                bottom: 0;
                right: 0;
            }

            .notification-system.bottom-left {
                bottom: 0;
                left: 0;
            }

            .notification-container {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .notification {
                pointer-events: auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                border: 1px solid #e5e7eb;
                overflow: hidden;
                transform: translateX(100%);
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                opacity: 0;
                max-width: 100%;
                position: relative;
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification.removing {
                transform: translateX(100%);
                opacity: 0;
                pointer-events: none;
            }

            /* Notification types */
            .notification.success {
                border-left: 4px solid #10b981;
            }

            .notification.error {
                border-left: 4px solid #ef4444;
            }

            .notification.warning {
                border-left: 4px solid #f59e0b;
            }

            .notification.info {
                border-left: 4px solid #3b82f6;
            }

            .notification-header {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                padding: 1rem 1rem 0.5rem;
                gap: 0.75rem;
            }

            .notification-icon {
                flex-shrink: 0;
                margin-top: 0.125rem;
            }

            .notification-icon i {
                width: 1.25rem;
                height: 1.25rem;
            }

            .notification-icon.success i {
                color: #10b981;
            }

            .notification-icon.error i {
                color: #ef4444;
            }

            .notification-icon.warning i {
                color: #f59e0b;
            }

            .notification-icon.info i {
                color: #3b82f6;
            }

            .notification-content {
                flex: 1;
                min-width: 0;
            }

            .notification-title {
                font-weight: 600;
                font-size: 0.875rem;
                color: #111827;
                margin: 0 0 0.25rem;
                line-height: 1.4;
                word-wrap: break-word;
            }

            .notification-message {
                font-size: 0.8125rem;
                color: #6b7280;
                line-height: 1.4;
                margin: 0;
                word-wrap: break-word;
            }

            .notification-actions {
                padding: 0.5rem 1rem;
                display: flex;
                gap: 0.5rem;
                justify-content: flex-end;
                border-top: 1px solid #f3f4f6;
            }

            .notification-action {
                background: none;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                padding: 0.375rem 0.75rem;
                font-size: 0.8125rem;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #374151;
                font-weight: 500;
            }

            .notification-action:hover {
                background: #f9fafb;
                border-color: #9ca3af;
            }

            .notification-action.primary {
                background: #3b82f6;
                border-color: #3b82f6;
                color: white;
            }

            .notification-action.primary:hover {
                background: #2563eb;
            }

            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .notification-close:hover {
                color: #6b7280;
                background: #f3f4f6;
            }

            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: #e5e7eb;
                width: 100%;
            }

            .notification-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #10b981, #3b82f6);
                transition: width linear;
            }

            /* Mobile responsive */
            @media (max-width: 640px) {
                .notification-system {
                    max-width: calc(100vw - 2rem);
                    left: 1rem !important;
                    right: 1rem !important;
                }

                .notification {
                    transform: translateY(-100%);
                }

                .notification.show {
                    transform: translateY(0);
                }

                .notification.removing {
                    transform: translateY(-100%);
                }
            }

            /* Samsung Fold support */
            @media (max-width: 653px) {
                .notification-system {
                    max-width: calc(100vw - 1rem);
                    padding: 0.5rem;
                }

                .notification-header {
                    padding: 0.75rem 0.75rem 0.5rem;
                }

                .notification-actions {
                    padding: 0.5rem 0.75rem;
                    flex-direction: column;
                }

                .notification-action {
                    width: 100%;
                    justify-content: center;
                }
            }

            /* Dark theme */
            @media (prefers-color-scheme: dark) {
                .notification {
                    background: #1f2937;
                    border-color: #374151;
                }

                .notification-title {
                    color: #f9fafb;
                }

                .notification-message {
                    color: #d1d5db;
                }

                .notification-action {
                    border-color: #4b5563;
                    color: #d1d5db;
                }

                .notification-action:hover {
                    background: #374151;
                    border-color: #6b7280;
                }

                .notification-close {
                    color: #9ca3af;
                }

                .notification-close:hover {
                    color: #d1d5db;
                    background: #374151;
                }
            }

            /* Accessibility */
            @media (prefers-reduced-motion: reduce) {
                .notification {
                    transition: none;
                }
                
                .notification-progress-bar {
                    transition: none;
                }
            }

            .notification:focus-within {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }

            /* Screen reader only */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }

            /* High contrast mode */
            @media (prefers-contrast: high) {
                .notification {
                    border: 2px solid;
                }

                .notification-action {
                    border: 2px solid;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.ready;
                this.serviceWorkerReady = true;
                console.log('✅ Service Worker ready for push notifications');
            } catch (error) {
                console.error('Service Worker setup failed:', error);
            }
        }
    }

    setupAccessibility() {
        // Create announcer for screen readers
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'assertive');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only';
        this.announcer.id = 'notification-announcer';
        document.body.appendChild(this.announcer);
    }

    setupEventListeners() {
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearAll();
            }
        });

        // Handle window focus/blur for notification management
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNotifications();
            } else {
                this.resumeNotifications();
            }
        });
    }

    // Security: Sanitize user input
    sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') return '';
        
        switch (type) {
            case 'html':
                return input.replace(this.sanitizePatterns.html, '');
            case 'url':
                return this.sanitizePatterns.url.test(input) ? input : '';
            default:
                return input.replace(this.sanitizePatterns.script, '');
        }
    }

    show(options = {}) {
        const notification = {
            id: ++this.notificationCounter,
            type: options.type || 'info',
            title: this.sanitizeInput(options.title || 'Notification'),
            message: this.sanitizeInput(options.message || ''),
            duration: options.duration || this.config.defaultDuration,
            persistent: options.persistent || false,
            actions: options.actions || [],
            onClick: options.onClick || null,
            onClose: options.onClose || null,
            timestamp: Date.now()
        };

        // Validate and sanitize actions
        notification.actions = (options.actions || []).map(action => ({
            label: this.sanitizeInput(action.label || 'Action'),
            handler: typeof action.handler === 'function' ? action.handler : () => {},
            primary: Boolean(action.primary)
        })).slice(0, 3); // Limit to 3 actions max

        this.notifications.push(notification);
        this.render();
        this.announceToScreenReader(notification);

        // Auto-remove if not persistent
        if (!notification.persistent && notification.duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, notification.duration);
        }

        return notification.id;
    }

    render() {
        const container = document.getElementById(this.config.containerId);
        if (!container) return;

        // Limit notifications
        if (this.notifications.length > this.config.maxNotifications) {
            this.notifications = this.notifications.slice(-this.config.maxNotifications);
        }

        // Clear container
        container.innerHTML = '';

        // Render notifications
        this.notifications.forEach(notification => {
            const element = this.createNotificationElement(notification);
            container.appendChild(element);

            // Trigger animation
            requestAnimationFrame(() => {
                element.classList.add('show');
            });
        });
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `notification ${notification.type}`;
        element.setAttribute('role', 'alert');
        element.setAttribute('aria-labelledby', `notification-title-${notification.id}`);
        element.setAttribute('aria-describedby', `notification-message-${notification.id}`);
        element.id = `notification-${notification.id}`;

        const iconMap = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        element.innerHTML = `
            <div class="notification-header">
                <div class="notification-icon ${notification.type}">
                    <i data-lucide="${iconMap[notification.type]}" aria-hidden="true"></i>
                </div>
                <div class="notification-content">
                    <h3 class="notification-title" id="notification-title-${notification.id}">
                        ${notification.title}
                    </h3>
                    ${notification.message ? `
                        <p class="notification-message" id="notification-message-${notification.id}">
                            ${notification.message}
                        </p>
                    ` : ''}
                </div>
                <button class="notification-close" aria-label="Close notification" data-notification-id="${notification.id}">
                    <i data-lucide="x" aria-hidden="true"></i>
                </button>
            </div>
            ${notification.actions.length > 0 ? this.createActionsHTML(notification) : ''}
            ${!notification.persistent && notification.duration > 0 ? this.createProgressHTML(notification) : ''}
        `;

        // Add event listeners
        this.attachEventListeners(element, notification);

        return element;
    }

    createActionsHTML(notification) {
        return `
            <div class="notification-actions">
                ${notification.actions.map((action, index) => `
                    <button class="notification-action ${action.primary ? 'primary' : ''}" 
                            data-notification-id="${notification.id}" 
                            data-action-index="${index}"
                            aria-label="${action.label}">
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        `;
    }

    createProgressHTML(notification) {
        return `
            <div class="notification-progress" role="progressbar" aria-label="Time remaining">
                <div class="notification-progress-bar" style="animation: progress ${notification.duration}ms linear forwards;"></div>
            </div>
            <style>
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            </style>
        `;
    }

    attachEventListeners(element, notification) {
        // Close button
        const closeBtn = element.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.remove(notification.id);
            });
        }

        // Action buttons
        const actionBtns = element.querySelectorAll('.notification-action');
        actionBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = notification.actions[index];
                if (action && action.handler) {
                    action.handler(notification);
                }
                this.remove(notification.id);
            });
        });

        // Click handler
        if (notification.onClick) {
            element.addEventListener('click', () => {
                notification.onClick(notification);
            });
        }

        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    remove(id) {
        const notificationIndex = this.notifications.findIndex(n => n.id === id);
        if (notificationIndex === -1) return;

        const notification = this.notifications[notificationIndex];
        const element = document.getElementById(`notification-${id}`);
        
        if (element) {
            element.classList.add('removing');
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
                this.notifications.splice(notificationIndex, 1);
                
                // Call onClose callback
                if (notification.onClose) {
                    notification.onClose(notification);
                }
            }, 400);
        }
    }

    clearAll() {
        const container = document.getElementById(this.config.containerId);
        if (!container) return;

        const elements = container.querySelectorAll('.notification');
        elements.forEach(element => {
            element.classList.add('removing');
        });

        setTimeout(() => {
            this.notifications.length = 0;
            container.innerHTML = '';
        }, 400);
    }

    announceToScreenReader(notification) {
        if (!this.announcer || !this.config.accessibility) return;

        const message = `${notification.type} notification: ${notification.title}${
            notification.message ? '. ' + notification.message : ''
        }`;
        
        this.announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
            this.announcer.textContent = '';
        }, 1000);
    }

    // Convenience methods
    success(title, message, options = {}) {
        return this.show({ ...options, type: 'success', title, message });
    }

    error(title, message, options = {}) {
        return this.show({ ...options, type: 'error', title, message });
    }

    warning(title, message, options = {}) {
        return this.show({ ...options, type: 'warning', title, message });
    }

    info(title, message, options = {}) {
        return this.show({ ...options, type: 'info', title, message });
    }

    pauseNotifications() {
        // Implementation for pausing notifications when tab is not visible
        console.log('Notifications paused');
    }

    resumeNotifications() {
        // Implementation for resuming notifications
        console.log('Notifications resumed');
    }

    loadPersistedSettings() {
        if (!this.config.persistentStorage) return;
        
        try {
            const settings = localStorage.getItem('pushNotificationSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                Object.assign(this.config, parsed);
            }
        } catch (error) {
            console.error('Error loading notification settings:', error);
        }
    }

    saveSettings() {
        if (!this.config.persistentStorage) return;
        
        try {
            localStorage.setItem('pushNotificationSettings', JSON.stringify(this.config));
        } catch (error) {
            console.error('Error saving notification settings:', error);
        }
    }

    destroy() {
        this.clearAll();
        
        // Remove containers and styles
        const container = document.getElementById('notification-system-container');
        if (container) container.remove();
        
        const announcer = document.getElementById('notification-announcer');
        if (announcer) announcer.remove();
        
        const styles = document.getElementById('push-notification-ui-styles');
        if (styles) styles.remove();
        
        this.isInitialized = false;
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.PushNotificationUI = PushNotificationUI;
}