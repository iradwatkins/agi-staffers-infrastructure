'use client'

import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function PWAInstallBanner() {
  const { isInstalled, isInstallable, platform, install, getInstallInstructions } = usePWAInstall()
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const bannerDismissed = localStorage.getItem('pwaInstallBannerDismissed')
    if (bannerDismissed === 'true') {
      setDismissed(true)
    }

    // Show banner after 30 seconds if installable and not dismissed
    const timer = setTimeout(() => {
      if ((isInstallable || platform === 'ios' || platform === 'samsung') && !isInstalled && !dismissed) {
        setShowBanner(true)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled, platform, dismissed])

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem('pwaInstallBannerDismissed', 'true')
  }

  const handleInstall = async () => {
    const installed = await install()
    if (installed) {
      setShowBanner(false)
    }
  }

  if (!showBanner || isInstalled) {
    return null
  }

  const instructions = getInstallInstructions()

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md lg:max-w-lg animate-in slide-in-from-bottom-2">
      <Card className="relative p-3 sm:p-4 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Smartphone className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          
          <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg leading-tight">Install AGI Staffers</h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Add to your home screen for a native app experience with offline access and push notifications.
            </p>

            {platform === 'ios' || platform === 'samsung' ? (
              <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                <p className="text-xs font-medium text-white/80">{instructions.title}:</p>
                <ol className="text-xs text-white/70 space-y-0.5 sm:space-y-1 list-decimal list-inside">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-white/90 flex-1 sm:flex-none"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Install Now
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 flex-1 sm:flex-none"
                >
                  Maybe Later
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}