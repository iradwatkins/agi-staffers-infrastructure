// Enhanced Fold Detection for Samsung Galaxy Fold 6
class FoldDetector {
    constructor() {
        this.currentPosture = 'single';
        this.screenSegments = null;
        this.foldAngle = 180;
        this.callbacks = [];
        
        // Samsung Galaxy Fold 6 specifications
        this.specs = {
            cover: {
                width: 968,
                height: 2142,
                inches: 6.2,
                aspectRatio: '21:9'
            },
            main: {
                width: 2176,
                height: 1812,
                inches: 7.6,
                aspectRatio: '6:5'
            }
        };
        
        this.init();
    }
    
    init() {
        // Check for viewport segments API
        if ('visualViewport' in window) {
            this.setupViewportSegments();
        }
        
        // Check for device posture API
        if ('devicePosture' in navigator) {
            this.setupDevicePosture();
        }
        
        // Screen orientation API
        if ('orientation' in screen) {
            screen.orientation.addEventListener('change', () => this.handleOrientationChange());
        }
        
        // Window resize fallback
        window.addEventListener('resize', () => this.detectFoldState());
        
        // Initial detection
        this.detectFoldState();
    }
    
    setupViewportSegments() {
        // Monitor viewport segments for fold detection
        const updateSegments = () => {
            const viewport = window.visualViewport;
            
            // Check CSS environment variables
            const computedStyle = getComputedStyle(document.documentElement);
            const horizontalSegments = computedStyle.getPropertyValue('env(viewport-segment-count-horizontal, 1)');
            const verticalSegments = computedStyle.getPropertyValue('env(viewport-segment-count-vertical, 1)');
            
            if (horizontalSegments > 1 || verticalSegments > 1) {
                this.screenSegments = {
                    horizontal: horizontalSegments,
                    vertical: verticalSegments
                };
                this.updatePosture('dual');
            }
        };
        
        window.visualViewport.addEventListener('resize', updateSegments);
        window.visualViewport.addEventListener('scroll', updateSegments);
    }
    
    setupDevicePosture() {
        // Device Posture API for foldable devices
        navigator.devicePosture.addEventListener('change', (e) => {
            this.currentPosture = e.type;
            this.notifyCallbacks({
                posture: e.type,
                angle: this.foldAngle
            });
        });
    }
    
    detectFoldState() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;
        const pixelRatio = window.devicePixelRatio;
        
        // Calculate physical dimensions
        const physicalWidth = width * pixelRatio;
        const physicalHeight = height * pixelRatio;
        
        let state = 'unknown';
        let displayType = 'standard';
        
        // Detect Samsung Fold states
        if (this.isCoverDisplay(width, height, aspectRatio)) {
            state = 'folded';
            displayType = 'cover';
        } else if (this.isMainDisplay(width, height, aspectRatio)) {
            state = 'unfolded';
            displayType = 'main';
        } else if (this.isTransitioning(width)) {
            state = 'transitioning';
            displayType = 'transition';
        }
        
        // Update UI
        this.updateUI(state, displayType);
        
        // Notify callbacks
        this.notifyCallbacks({
            state,
            displayType,
            dimensions: { width, height },
            aspectRatio,
            pixelRatio,
            physical: { width: physicalWidth, height: physicalHeight }
        });
        
        return { state, displayType };
    }
    
    isCoverDisplay(width, height, aspectRatio) {
        // Cover display detection
        // 6.2" display, ~21:9 aspect ratio
        return (
            width <= 376 || // CSS pixels
            (aspectRatio > 2.0 && aspectRatio < 2.5) || // ~21:9
            (width < 400 && height > 800) // Portrait narrow
        );
    }
    
    isMainDisplay(width, height, aspectRatio) {
        // Main display detection
        // 7.6" display, ~6:5 aspect ratio
        return (
            (width >= 768 && width <= 1024 && aspectRatio >= 1 && aspectRatio <= 1.3) || // Landscape
            (height >= 768 && height <= 1024 && aspectRatio >= 0.77 && aspectRatio <= 1) // Portrait
        );
    }
    
    isTransitioning(width) {
        // Between folded and unfolded states
        return width > 376 && width < 768;
    }
    
    updateUI(state, displayType) {
        // Update body classes
        document.body.classList.remove('fold-folded', 'fold-unfolded', 'fold-transitioning');
        if (state !== 'unknown') {
            document.body.classList.add(`fold-${state}`);
        }
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--fold-state', state);
        document.documentElement.style.setProperty('--fold-display', displayType);
        
        // Update status indicator
        const statusEl = document.querySelector('.fold-status');
        if (statusEl) {
            if (state === 'unknown') {
                statusEl.style.display = 'none';
            } else {
                statusEl.style.display = 'block';
                statusEl.innerHTML = this.getStatusMessage(state, displayType);
            }
        }
    }
    
    getStatusMessage(state, displayType) {
        const messages = {
            folded: '📱 Folded Mode (6.2")',
            unfolded: '📱 Unfolded Mode (7.6")',
            transitioning: '📱 Transitioning...'
        };
        return messages[state] || '📱 Samsung Fold';
    }
    
    handleOrientationChange() {
        const orientation = screen.orientation.type;
        const angle = screen.orientation.angle;
        
        this.detectFoldState();
        
        // Notify about orientation change
        this.notifyCallbacks({
            orientation,
            angle,
            isLandscape: orientation.includes('landscape')
        });
    }
    
    // Subscribe to fold state changes
    onChange(callback) {
        this.callbacks.push(callback);
        // Immediately notify with current state
        callback(this.getCurrentState());
    }
    
    // Get current state
    getCurrentState() {
        const { state, displayType } = this.detectFoldState();
        return {
            state,
            displayType,
            posture: this.currentPosture,
            segments: this.screenSegments,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }
    
    notifyCallbacks(data) {
        this.callbacks.forEach(callback => callback(data));
    }
    
    // Update posture
    updatePosture(posture) {
        this.currentPosture = posture;
        document.documentElement.style.setProperty('--fold-posture', posture);
    }
}

// Initialize fold detector
const foldDetector = new FoldDetector();

// Export for use in other scripts
window.FoldDetector = FoldDetector;
window.foldDetector = foldDetector;