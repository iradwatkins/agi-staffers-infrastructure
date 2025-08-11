// PWA Installation Manager for AGI Staffers Dashboard
class AppInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.installButton = null;
        this.installBanner = null;
        
        // Check if already installed
        this.checkIfInstalled();
        
        // Platform detection
        this.platform = this.detectPlatform();
    }
    
    init() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('Install prompt available');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallUI();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.handleAppInstalled();
        });
        
        // Check if launched from home screen
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('App launched from home screen');
            this.isInstalled = true;
        }
        
        // iOS specific handling
        if (this.platform === 'ios') {
            this.handleiOSInstall();
        }
        
        // Samsung specific handling
        if (this.platform === 'samsung') {
            this.handleSamsungInstall();
        }
    }
    
    detectPlatform() {
        const ua = navigator.userAgent.toLowerCase();
        
        if (/iphone|ipad|ipod/.test(ua)) {
            return 'ios';
        } else if (/samsung/.test(ua)) {
            return 'samsung';
        } else if (/android/.test(ua)) {
            return 'android';
        } else if (/windows/.test(ua)) {
            return 'windows';
        }
        return 'other';
    }
    
    checkIfInstalled() {
        // Check various conditions that indicate app is installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            return;
        }
        
        // Check if launched from home screen on iOS
        if (window.navigator.standalone === true) {
            this.isInstalled = true;
            return;
        }
        
        // Check localStorage for installation flag
        if (localStorage.getItem('pwaInstalled') === 'true') {
            this.isInstalled = true;
        }
    }
    
    showInstallUI() {
        if (this.isInstalled) return;
        
        // Create install banner
        this.createInstallBanner();
        
        // Add install button to UI
        this.addInstallButton();
        
        // Show banner after delay if not dismissed
        setTimeout(() => {
            if (!this.isInstalled && !localStorage.getItem('installBannerDismissed')) {
                this.showInstallBanner();
            }
        }, 30000); // Show after 30 seconds
    }
    
    createInstallBanner() {
        const banner = document.createElement('div');
        banner.id = 'install-banner';
        banner.className = 'install-banner';
        banner.innerHTML = `
            <div class="install-banner-content">
                <div class="install-banner-icon">
                    <img src="/icon-192x192.png" alt="AGI Staffers" width="48" height="48">
                </div>
                <div class="install-banner-text">
                    <h4>Install AGI Staffers Dashboard</h4>
                    <p>Add to your home screen for quick access and offline use</p>
                </div>
                <div class="install-banner-actions">
                    <button onclick="appInstaller.installApp()" class="install-btn-primary">Install</button>
                    <button onclick="appInstaller.dismissBanner()" class="install-btn-secondary">Not Now</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .install-banner {
                position: fixed;
                bottom: -200px;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                padding: 16px;
                z-index: 1000;
                transition: bottom 0.3s ease;
            }
            
            .install-banner.show {
                bottom: 0;
            }
            
            .install-banner-content {
                max-width: 800px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                gap: 16px;
            }
            
            .install-banner-icon {
                flex-shrink: 0;
            }
            
            .install-banner-text {
                flex: 1;
            }
            
            .install-banner-text h4 {
                margin: 0 0 4px 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .install-banner-text p {
                margin: 0;
                font-size: 14px;
                color: #666;
            }
            
            .install-banner-actions {
                display: flex;
                gap: 8px;
                flex-shrink: 0;
            }
            
            .install-btn-primary {
                background: #667eea;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            }
            
            .install-btn-secondary {
                background: transparent;
                color: #666;
                border: 1px solid #ddd;
                padding: 8px 16px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
            }
            
            @media (max-width: 640px) {
                .install-banner-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .install-banner-actions {
                    width: 100%;
                    justify-content: center;
                }
            }
            
            /* iOS Install Instructions */
            .ios-install-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 20px;
            }
            
            .ios-install-content {
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 400px;
                text-align: center;
            }
            
            .ios-install-content h3 {
                margin: 0 0 16px 0;
                font-size: 20px;
            }
            
            .ios-install-steps {
                text-align: left;
                margin: 20px 0;
            }
            
            .ios-install-step {
                display: flex;
                align-items: center;
                margin: 12px 0;
                gap: 12px;
            }
            
            .ios-install-step-icon {
                width: 40px;
                height: 40px;
                background: #f0f0f0;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(banner);
        this.installBanner = banner;
    }
    
    showInstallBanner() {
        if (this.installBanner) {
            this.installBanner.classList.add('show');
        }
    }
    
    dismissBanner() {
        if (this.installBanner) {
            this.installBanner.classList.remove('show');
            localStorage.setItem('installBannerDismissed', 'true');
        }
    }
    
    addInstallButton() {
        // Add install button to navigation or settings
        const navElement = document.querySelector('.desktop-nav');
        if (navElement && !document.getElementById('install-nav-btn')) {
            const installBtn = document.createElement('a');
            installBtn.id = 'install-nav-btn';
            installBtn.href = '#';
            installBtn.className = 'text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium';
            installBtn.innerHTML = '<i data-lucide="download" class="w-4 h-4 inline mr-1"></i>Install App';
            installBtn.onclick = (e) => {
                e.preventDefault();
                this.installApp();
            };
            
            const navLinks = navElement.querySelector('.space-x-4');
            if (navLinks) {
                navLinks.appendChild(installBtn);
                // Re-initialize Lucide icons
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        }
    }
    
    async installApp() {
        if (this.platform === 'ios') {
            this.showiOSInstructions();
            return;
        }
        
        if (!this.deferredPrompt) {
            alert('App installation is not available. Please try again later.');
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond
        const { outcome } = await this.deferredPrompt.userChoice;
        
        console.log(`User response: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            this.handleAppInstalled();
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        this.deferredPrompt = null;
    }
    
    handleAppInstalled() {
        this.isInstalled = true;
        localStorage.setItem('pwaInstalled', 'true');
        this.dismissBanner();
        
        // Remove install button
        const installBtn = document.getElementById('install-nav-btn');
        if (installBtn) {
            installBtn.remove();
        }
        
        // Show success notification
        if (window.pushManager) {
            window.pushManager.sendCustomNotification(
                '✅ App Installed!',
                'AGI Staffers Dashboard has been added to your home screen'
            );
        }
    }
    
    showiOSInstructions() {
        const modal = document.createElement('div');
        modal.className = 'ios-install-modal';
        modal.innerHTML = `
            <div class="ios-install-content">
                <h3>📱 Install on iPhone</h3>
                <p>To install this app on your iPhone:</p>
                <div class="ios-install-steps">
                    <div class="ios-install-step">
                        <div class="ios-install-step-icon">📤</div>
                        <div>Tap the Share button at the bottom of Safari</div>
                    </div>
                    <div class="ios-install-step">
                        <div class="ios-install-step-icon">➕</div>
                        <div>Scroll down and tap "Add to Home Screen"</div>
                    </div>
                    <div class="ios-install-step">
                        <div class="ios-install-step-icon">✏️</div>
                        <div>Name the app and tap "Add"</div>
                    </div>
                </div>
                <button onclick="this.closest('.ios-install-modal').remove()" class="install-btn-primary">Got it!</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    handleiOSInstall() {
        // Show install prompt for iOS if not in standalone mode
        if (!window.navigator.standalone && !localStorage.getItem('iosInstallPromptShown')) {
            setTimeout(() => {
                this.showInstallBanner();
                localStorage.setItem('iosInstallPromptShown', 'true');
            }, 60000); // Show after 1 minute
        }
    }
    
    handleSamsungInstall() {
        // Samsung-specific optimizations
        console.log('Samsung device detected - optimizing install experience');
        
        // Add Samsung Internet specific features
        if ('setAppBadge' in navigator) {
            // Samsung Internet supports app badges
            navigator.setAppBadge(1);
        }
    }
}

// Create and export installer instance
const appInstaller = new AppInstaller();
window.appInstaller = appInstaller;