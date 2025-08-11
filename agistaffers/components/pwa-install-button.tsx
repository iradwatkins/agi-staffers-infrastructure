'use client'

import { Download, Check, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function PWAInstallButton() {
  const { isInstalled, isInstallable, platform, install } = usePWAInstall()

  if (isInstalled) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        disabled
        title="App Installed"
      >
        <Check className="h-4 w-4 text-green-600" />
      </Button>
    )
  }

  if (platform === 'ios' || platform === 'samsung') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={install}
        className="relative"
        title="Click to see installation instructions"
      >
        <Info className="h-4 w-4" />
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
      </Button>
    )
  }

  if (!isInstallable) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={install}
      className="relative"
      title="Install App"
    >
      <Download className="h-4 w-4" />
      <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
    </Button>
  )
}