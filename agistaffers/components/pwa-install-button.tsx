'use client'

import { Smartphone, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function PWAInstallButton() {
  const { isInstalled, isInstallable, install } = usePWAInstall()

  if (isInstalled) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled
        className="gap-2"
      >
        <Check className="h-4 w-4 text-green-600" />
        <span>Installed</span>
      </Button>
    )
  }

  if (!isInstallable) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={install}
      className="gap-2"
    >
      <Smartphone className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  )
}