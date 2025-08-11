// AI Agent-Generated Component: Samsung Fold-Aware Responsive Layout System
// Advanced multi-screen layout management with fold detection and optimization

class FoldAwareLayout {
    constructor(config = {}) {
        this.config = {
            foldThreshold: 653, // Samsung Galaxy Fold 6 folded width
            unfoldedThreshold: 768, // Unfolded width threshold
            debounceDelay: 150,
            enableTransitions: true,
            logChanges: false,
            persistLayout: true,
            adaptiveContent: true,
            touchOptimization: true,
            ...config
        };

        this.state = {
            isFolded: false,
            isUnfolded: false,
            isTablet: false,
            isDesktop: false,
            orientation: 'portrait',
            previousState: null,
            lastUpdate: 0
        };

        this.breakpoints = {
            foldedPortrait: { max: 653, orientation: 'portrait' },
            foldedLandscape: { max: 653, orientation: 'landscape' },
            unfoldedPortrait: { min: 654, max: 767, orientation: 'portrait' },
            unfoldedLandscape: { min: 654, max: 1023, orientation: 'landscape' },
            tablet: { min: 768, max: 1023 },
            desktop: { min: 1024 }
        };

        this.observers = [];
        this.components = new Map();
        this.resizeTimeout = null;
        this.isInitialized = false;

        // Device capability detection
        this.capabilities = {
            touch: 'ontouchstart' in window,
            hover: window.matchMedia('(hover: hover)').matches,
            finePointer: window.matchMedia('(pointer: fine)').matches,
            coarsePointer: window.matchMedia('(pointer: coarse)').matches,
            multiTouch: navigator.maxTouchPoints > 1,
            screenSpanning: this.checkScreenSpanningSupport()
        };
    }

    async init() {
        if (this.isInitialized) return;

        try {
            this.detectInitialState();
            this.setupMediaQueries();
            this.setupResizeObserver();
            this.setupOrientationObserver();
            this.injectStyles();
            this.loadPersistedLayout();
            this.updateLayout();
            this.isInitialized = true;

            if (this.config.logChanges) {
                console.log('✅ FoldAwareLayout: Initialized', this.state);
            }
        } catch (error) {
            console.error('❌ FoldAwareLayout: Initialization failed:', error);
        }
    }

    checkScreenSpanningSupport() {
        try {
            // Check for CSS screen-spanning support safely
            if (window.CSS && typeof window.CSS.supports === 'function') {
                return window.CSS.supports('screen-spanning', 'single-fold-vertical') ||
                       window.CSS.supports('screen-spanning', 'single-fold-horizontal');
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    detectInitialState() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const orientation = width > height ? 'landscape' : 'portrait';

        this.state = {
            isFolded: width <= this.config.foldThreshold,
            isUnfolded: width > this.config.foldThreshold && width <= this.config.unfoldedThreshold,
            isTablet: width > this.config.unfoldedThreshold && width <= 1023,
            isDesktop: width > 1023,
            orientation,
            previousState: null,
            lastUpdate: Date.now(),
            width,
            height,
            aspectRatio: width / height,
            devicePixelRatio: window.devicePixelRatio || 1
        };

        // Detect Samsung Fold specific features
        this.detectFoldFeatures();
    }

    detectFoldFeatures() {
        // Check for Samsung Fold-specific indicators
        const userAgent = navigator.userAgent.toLowerCase();
        const isSamsungDevice = userAgent.includes('samsung') || userAgent.includes('sm-');
        
        // Properly check for screen-spanning CSS support
        let hasFoldableFeatures = false;
        try {
            if (window.CSS && typeof window.CSS.supports === 'function') {
                hasFoldableFeatures = window.CSS.supports('screen-spanning', 'single-fold-vertical') ||
                                    window.CSS.supports('screen-spanning', 'single-fold-horizontal');
            }
        } catch (error) {
            // Fallback to screen dimension check
            hasFoldableFeatures = window.screen?.availWidth !== window.screen?.width;
        }

        this.state.isSamsungFold = isSamsungDevice && (
            this.state.width <= 653 || 
            hasFoldableFeatures ||
            this.state.aspectRatio < 0.6 // Very narrow aspect ratio typical of folded devices
        );

        this.state.foldableCapabilities = {
            screenSpanning: hasFoldableFeatures,
            dualScreen: this.capabilities.screenSpanning,
            hinge: this.detectHinge()
        };
    }

    detectHinge() {
        // Attempt to detect hinge/fold line (experimental)
        try {
            if (window.CSS && typeof window.CSS.supports === 'function') {
                if (window.CSS.supports('screen-spanning', 'single-fold-vertical')) {
                    return { type: 'vertical', detected: true };
                }
                if (window.CSS.supports('screen-spanning', 'single-fold-horizontal')) {
                    return { type: 'horizontal', detected: true };
                }
            }
        } catch (error) {
            // Fallback - no hinge detection available
        }
        return { type: 'none', detected: false };
    }

    setupMediaQueries() {
        // Create media query observers for each breakpoint
        Object.entries(this.breakpoints).forEach(([name, breakpoint]) => {
            let query;
            
            if (breakpoint.orientation) {
                if (breakpoint.max && breakpoint.min) {
                    query = `(min-width: ${breakpoint.min}px) and (max-width: ${breakpoint.max}px) and (orientation: ${breakpoint.orientation})`;
                } else if (breakpoint.max) {
                    query = `(max-width: ${breakpoint.max}px) and (orientation: ${breakpoint.orientation})`;
                } else {
                    query = `(min-width: ${breakpoint.min}px) and (orientation: ${breakpoint.orientation})`;
                }
            } else {
                if (breakpoint.max && breakpoint.min) {
                    query = `(min-width: ${breakpoint.min}px) and (max-width: ${breakpoint.max}px)`;
                } else if (breakpoint.max) {
                    query = `(max-width: ${breakpoint.max}px)`;
                } else {
                    query = `(min-width: ${breakpoint.min}px)`;
                }
            }

            const mediaQuery = window.matchMedia(query);
            mediaQuery.addEventListener('change', () => this.handleStateChange());
            this.observers.push({ name, mediaQuery, query });
        });
    }

    setupResizeObserver() {
        const debouncedResize = this.debounce(() => {
            this.handleResize();
        }, this.config.debounceDelay);

        window.addEventListener('resize', debouncedResize);
        
        // Visual viewport API for mobile browsers
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', debouncedResize);
        }
    }

    setupOrientationObserver() {
        // Modern orientation API
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                this.handleOrientationChange();
            });
        } else {
            // Fallback for older browsers
            window.addEventListener('orientationchange', () => {
                setTimeout(() => this.handleOrientationChange(), 500);
            });
        }
    }

    injectStyles() {
        if (document.getElementById('fold-aware-layout-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'fold-aware-layout-styles';
        styles.textContent = `
            /* Base fold-aware utilities */
            .fold-aware-container {
                transition: ${this.config.enableTransitions ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'};
            }

            /* Folded state (≤653px) */
            .folded-layout {
                --fold-padding: 1rem;
                --fold-gap: 0.75rem;
                --fold-font-size: 0.875rem;
                --fold-header-height: 3.5rem;
                --fold-nav-height: 3rem;
            }

            .folded-layout .fold-adaptive-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--fold-gap);
                padding: var(--fold-padding);
            }

            .folded-layout .fold-adaptive-card {
                padding: 0.75rem;
                border-radius: 8px;
                background: white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .folded-layout .fold-adaptive-text {
                font-size: var(--fold-font-size);
                line-height: 1.4;
            }

            .folded-layout .fold-hide-on-fold {
                display: none !important;
            }

            .folded-layout .fold-compress-on-fold {
                padding: 0.5rem !important;
                margin: 0.25rem 0 !important;
            }

            /* Unfolded state (654px-767px) */
            .unfolded-layout {
                --unfold-padding: 1.5rem;
                --unfold-gap: 1rem;
                --unfold-font-size: 1rem;
                --unfold-header-height: 4rem;
                --unfold-nav-height: 3.5rem;
            }

            .unfolded-layout .fold-adaptive-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--unfold-gap);
                padding: var(--unfold-padding);
            }

            .unfolded-layout .fold-adaptive-card {
                padding: 1.25rem;
                border-radius: 12px;
                background: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .unfolded-layout .fold-adaptive-text {
                font-size: var(--unfold-font-size);
                line-height: 1.5;
            }

            .unfolded-layout .fold-show-on-unfold {
                display: block !important;
            }

            /* Samsung Fold specific optimizations */
            .samsung-fold .fold-adaptive-nav {
                position: sticky;
                top: 0;
                z-index: 100;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
            }

            .samsung-fold.folded-layout .fold-adaptive-nav {
                padding: 0.5rem 1rem;
                height: var(--fold-nav-height);
            }

            .samsung-fold.unfolded-layout .fold-adaptive-nav {
                padding: 0.75rem 1.5rem;
                height: var(--unfold-nav-height);
            }

            /* Touch optimization for folded state */
            .folded-layout .fold-touch-target {
                min-height: 44px;
                min-width: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .folded-layout button,
            .folded-layout .clickable {
                min-height: 44px;
                touch-action: manipulation;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }

            /* Dual screen support (experimental) */
            @media (screen-spanning: single-fold-vertical) {
                .fold-dual-screen {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: env(fold-width, 2rem);
                }
            }

            @media (screen-spanning: single-fold-horizontal) {
                .fold-dual-screen {
                    display: grid;
                    grid-template-rows: 1fr 1fr;
                    gap: env(fold-height, 2rem);
                }
            }

            /* Orientation-specific adjustments */
            .folded-layout.landscape {
                --fold-padding: 0.75rem;
                --fold-gap: 0.5rem;
            }

            .folded-layout.landscape .fold-adaptive-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            .unfolded-layout.landscape .fold-adaptive-grid {
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            }

            /* Animations and transitions */
            .fold-animate-resize {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .fold-animate-fade {
                transition: opacity 0.2s ease-in-out;
            }

            .fold-animate-slide {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* High contrast and accessibility */
            @media (prefers-contrast: high) {
                .fold-adaptive-card {
                    border: 2px solid;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .fold-aware-container,
                .fold-animate-resize,
                .fold-animate-fade,
                .fold-animate-slide {
                    transition: none !important;
                }
            }

            /* Print styles */
            @media print {
                .fold-hide-on-print {
                    display: none !important;
                }
                
                .fold-adaptive-grid {
                    grid-template-columns: 1fr !important;
                    gap: 1rem !important;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    handleResize() {
        const previousState = { ...this.state };
        this.detectInitialState();
        
        if (this.hasStateChanged(previousState)) {
            this.state.previousState = previousState;
            this.handleStateChange();
        }
    }

    handleOrientationChange() {
        setTimeout(() => {
            const previousState = { ...this.state };
            this.detectInitialState();
            
            if (this.hasStateChanged(previousState)) {
                this.state.previousState = previousState;
                this.handleStateChange();
            }
        }, 100); // Small delay to ensure accurate measurements
    }

    handleStateChange() {
        if (this.config.logChanges) {
            console.log('📱 FoldAwareLayout: State changed', this.state);
        }

        this.updateLayout();
        this.notifyComponents();
        this.saveLayoutState();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('foldStateChange', {
            detail: this.state
        }));
    }

    hasStateChanged(previousState) {
        return (
            this.state.isFolded !== previousState.isFolded ||
            this.state.isUnfolded !== previousState.isUnfolded ||
            this.state.orientation !== previousState.orientation ||
            Math.abs(this.state.width - previousState.width) > 10 ||
            Math.abs(this.state.height - previousState.height) > 10
        );
    }

    updateLayout() {
        const body = document.body;
        
        // Remove existing layout classes
        body.classList.remove('folded-layout', 'unfolded-layout', 'tablet-layout', 'desktop-layout');
        body.classList.remove('samsung-fold', 'portrait', 'landscape');
        
        // Add current state classes
        if (this.state.isFolded) {
            body.classList.add('folded-layout');
        } else if (this.state.isUnfolded) {
            body.classList.add('unfolded-layout');
        } else if (this.state.isTablet) {
            body.classList.add('tablet-layout');
        } else if (this.state.isDesktop) {
            body.classList.add('desktop-layout');
        }

        // Add device-specific classes
        if (this.state.isSamsungFold) {
            body.classList.add('samsung-fold');
        }

        // Add orientation class
        body.classList.add(this.state.orientation);

        // Update CSS custom properties
        document.documentElement.style.setProperty('--viewport-width', `${this.state.width}px`);
        document.documentElement.style.setProperty('--viewport-height', `${this.state.height}px`);
        document.documentElement.style.setProperty('--aspect-ratio', this.state.aspectRatio.toString());
        document.documentElement.style.setProperty('--device-pixel-ratio', this.state.devicePixelRatio.toString());

        // Update fold-aware containers
        this.updateContainers();
    }

    updateContainers() {
        const containers = document.querySelectorAll('.fold-aware-container');
        containers.forEach(container => {
            // Add state-specific classes
            container.className = container.className.replace(/fold-state-\w+/g, '');
            
            if (this.state.isFolded) {
                container.classList.add('fold-state-folded');
            } else if (this.state.isUnfolded) {
                container.classList.add('fold-state-unfolded');
            } else if (this.state.isTablet) {
                container.classList.add('fold-state-tablet');
            } else {
                container.classList.add('fold-state-desktop');
            }

            // Trigger container-specific updates
            if (typeof container.foldAwareUpdate === 'function') {
                container.foldAwareUpdate(this.state);
            }
        });
    }

    registerComponent(name, component) {
        if (typeof component.onFoldStateChange !== 'function') {
            console.warn(`Component ${name} does not implement onFoldStateChange method`);
            return;
        }

        this.components.set(name, component);
        
        // Immediately notify of current state
        component.onFoldStateChange(this.state);
    }

    unregisterComponent(name) {
        this.components.delete(name);
    }

    notifyComponents() {
        this.components.forEach((component, name) => {
            try {
                if (typeof component.onFoldStateChange === 'function') {
                    component.onFoldStateChange(this.state);
                }
            } catch (error) {
                console.error(`Error notifying component ${name}:`, error);
            }
        });
    }

    // Utility methods for components
    isFolded() {
        return this.state.isFolded;
    }

    isUnfolded() {
        return this.state.isUnfolded;
    }

    isTablet() {
        return this.state.isTablet;
    }

    isDesktop() {
        return this.state.isDesktop;
    }

    isSamsungFold() {
        return this.state.isSamsungFold;
    }

    isPortrait() {
        return this.state.orientation === 'portrait';
    }

    isLandscape() {
        return this.state.orientation === 'landscape';
    }

    getCurrentState() {
        return { ...this.state };
    }

    // Layout adaptation helpers
    adaptGridColumns(baseColumns) {
        if (this.state.isFolded) {
            return 1;
        } else if (this.state.isUnfolded) {
            return Math.min(2, baseColumns);
        } else if (this.state.isTablet) {
            return Math.min(3, baseColumns);
        }
        return baseColumns;
    }

    adaptFontSize(baseSize) {
        const multiplier = this.state.isFolded ? 0.875 : 
                          this.state.isUnfolded ? 1 : 
                          this.state.isTablet ? 1.125 : 1.25;
        return baseSize * multiplier;
    }

    adaptSpacing(baseSpacing) {
        const multiplier = this.state.isFolded ? 0.75 : 
                          this.state.isUnfolded ? 1 : 
                          this.state.isTablet ? 1.25 : 1.5;
        return baseSpacing * multiplier;
    }

    // Persistence
    saveLayoutState() {
        if (!this.config.persistLayout) return;
        
        try {
            const stateToSave = {
                lastWidth: this.state.width,
                lastHeight: this.state.height,
                lastOrientation: this.state.orientation,
                isSamsungFold: this.state.isSamsungFold,
                timestamp: Date.now()
            };
            localStorage.setItem('foldAwareLayoutState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('Error saving layout state:', error);
        }
    }

    loadPersistedLayout() {
        if (!this.config.persistLayout) return;
        
        try {
            const saved = localStorage.getItem('foldAwareLayoutState');
            if (saved) {
                const parsedState = JSON.parse(saved);
                // Use saved state to inform initial setup if recent
                if (Date.now() - parsedState.timestamp < 300000) { // 5 minutes
                    // Apply any relevant persisted settings
                    if (this.config.logChanges) {
                        console.log('📱 FoldAwareLayout: Loaded persisted state', parsedState);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading persisted layout state:', error);
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    destroy() {
        // Remove event listeners
        this.observers.forEach(({ mediaQuery }) => {
            // Note: MediaQuery listeners are automatically cleaned up
        });

        // Clear components
        this.components.clear();

        // Remove resize listeners
        window.removeEventListener('resize', this.handleResize);
        if (window.visualViewport) {
            window.visualViewport.removeEventListener('resize', this.handleResize);
        }

        // Remove orientation listeners
        if (screen.orientation) {
            screen.orientation.removeEventListener('change', this.handleOrientationChange);
        } else {
            window.removeEventListener('orientationchange', this.handleOrientationChange);
        }

        // Remove styles
        const styles = document.getElementById('fold-aware-layout-styles');
        if (styles) styles.remove();

        this.isInitialized = false;
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.FoldAwareLayout = FoldAwareLayout;
}