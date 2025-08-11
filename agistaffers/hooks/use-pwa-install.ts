'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [platform, setPlatform] = useState<string>('other')
  
  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios')
    } else if (/samsung/.test(ua)) {
      setPlatform('samsung')
    } else if (/android/.test(ua)) {
      setPlatform('android')
    } else if (/windows/.test(ua)) {
      setPlatform('windows')
    }
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
    
    // Check iOS standalone
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      setIsInstalled(true)
    }
    
    // Check localStorage
    if (localStorage.getItem('pwaInstalled') === 'true') {
      setIsInstalled(true)
    }
    
    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }
    
    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      localStorage.setItem('pwaInstalled', 'true')
      toast.success('App installed successfully!')
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])
  
  const install = useCallback(async () => {
    if (!deferredPrompt) {
      // Show platform-specific instructions
      if (platform === 'ios') {
        toast('To install on iOS: Tap the share button and select "Add to Home Screen"', {
          duration: 10000,
        })
      } else if (platform === 'samsung') {
        toast('To install: Open menu → Add page to → Home screen', {
          duration: 10000,
        })
      } else {
        toast.error('Installation not available')
      }
      return false
    }
    
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        toast.success('Installing app...')
        return true
      } else {
        toast('Installation cancelled')
        return false
      }
    } catch (error) {
      console.error('Error installing PWA:', error)
      toast.error('Failed to install app')
      return false
    }
  }, [deferredPrompt, platform])
  
  const getInstallInstructions = useCallback(() => {
    switch (platform) {
      case 'ios':
        return {
          title: 'Install on iOS',
          steps: [
            'Tap the Share button (square with arrow)',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to install the app',
          ],
        }
      case 'samsung':
        return {
          title: 'Install on Samsung',
          steps: [
            'Open the browser menu (3 dots)',
            'Tap "Add page to"',
            'Select "Home screen"',
            'Tap "Add" to install',
          ],
        }
      case 'android':
        return {
          title: 'Install on Android',
          steps: [
            'Look for the install prompt in the address bar',
            'Or open menu → "Install app"',
            'Tap "Install" to add to home screen',
          ],
        }
      default:
        return {
          title: 'Install App',
          steps: [
            'Look for the install button in your browser',
            'Or check the browser menu for "Install" option',
          ],
        }
    }
  }, [platform])
  
  return {
    isInstalled,
    isInstallable,
    platform,
    install,
    getInstallInstructions,
  }
}