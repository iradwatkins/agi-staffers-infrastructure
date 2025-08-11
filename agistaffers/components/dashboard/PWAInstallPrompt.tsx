'use client'

import { useState } from 'react'
import { X, Download, Smartphone, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function PWAInstallPrompt() {
  const [dismissed, setDismissed] = useState(false)
  const { isInstalled, isInstallable, platform, install, getInstallInstructions } = usePWAInstall()
  
  if (isInstalled || dismissed) {
    return null
  }
  
  const instructions = getInstallInstructions()
  const showInstructions = platform === 'ios' || platform === 'samsung'
  
  return (
    <Card className="relative border-primary/50 shadow-lg max-w-md mx-auto">
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 z-10"
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader className="pb-3 pr-12">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">Install AGI Staffers App</span>
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed">
          Install the app for a better experience with offline access and push notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isInstallable && !showInstructions ? (
          <Button onClick={install} className="w-full" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Install Now
          </Button>
        ) : showInstructions ? (
          <div className="space-y-4">
            <Alert>
              <Share className="h-4 w-4" />
              <AlertDescription>
                <strong className="block mb-2">{instructions.title}</strong>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {instructions.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </AlertDescription>
            </Alert>
            
            {platform === 'samsung' && isInstallable && (
              <Button onClick={install} className="w-full" variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Or Use Install Prompt
              </Button>
            )}
          </div>
        ) : (
          <Alert>
            <AlertDescription>
              Installation is handled by your browser. Look for an install option in your browser&apos;s menu or address bar.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-2">
          <div className="text-center p-2">
            <div className="text-lg sm:text-2xl mb-1">📱</div>
            <p className="text-xs text-muted-foreground leading-tight">Mobile Ready</p>
          </div>
          <div className="text-center p-2">
            <div className="text-lg sm:text-2xl mb-1">⚡</div>
            <p className="text-xs text-muted-foreground leading-tight">Fast & Offline</p>
          </div>
          <div className="text-center p-2">
            <div className="text-lg sm:text-2xl mb-1">🔔</div>
            <p className="text-xs text-muted-foreground leading-tight">Push Alerts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}