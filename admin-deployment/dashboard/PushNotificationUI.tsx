'use client'

import { Bell, BellOff, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { Badge } from '@/components/ui/badge'

export function PushNotificationUI() {
  const {
    permission,
    isSupported,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
  } = usePushNotifications()

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      await subscribe()
    } else {
      await unsubscribe()
    }
  }

  const testNotification = () => {
    showNotification({
      title: 'Test Notification',
      body: 'This is a test notification from AGI Staffers Dashboard',
      tag: 'test',
    })
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Push notifications are not supported in this browser
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Receive alerts about system events and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Permission Status</span>
          <Badge
            variant={
              permission === 'granted'
                ? 'default'
                : permission === 'denied'
                ? 'destructive'
                : 'secondary'
            }
          >
            {permission === 'granted' && <Check className="h-3 w-3 mr-1" />}
            {permission === 'denied' && <X className="h-3 w-3 mr-1" />}
            {permission.charAt(0).toUpperCase() + permission.slice(1)}
          </Badge>
        </div>

        {/* Enable/Disable Toggle */}
        {permission !== 'denied' && (
          <div className="flex items-center justify-between">
            <Label htmlFor="push-toggle" className="flex flex-col space-y-1">
              <span>Enable Notifications</span>
              <span className="font-normal text-sm text-muted-foreground">
                Get notified about important events
              </span>
            </Label>
            <Switch
              id="push-toggle"
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={false}
            />
          </div>
        )}

        {/* Request Permission Button */}
        {permission === 'default' && (
          <Button
            onClick={requestPermission}
            className="w-full"
            variant="outline"
          >
            <Bell className="h-4 w-4 mr-2" />
            Request Permission
          </Button>
        )}

        {/* Denied Permission Message */}
        {permission === 'denied' && (
          <div className="rounded-lg bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Push notifications have been blocked. Please enable them in your
              browser settings to receive alerts.
            </p>
          </div>
        )}

        {/* Test Notification Button */}
        {isSubscribed && (
          <Button
            onClick={testNotification}
            variant="secondary"
            className="w-full"
          >
            Send Test Notification
          </Button>
        )}

        {/* Notification Settings */}
        {isSubscribed && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">Notification Preferences</h4>
            <div className="space-y-2">
              {[
                { id: 'alerts', label: 'System Alerts', default: true },
                { id: 'backups', label: 'Backup Completion', default: true },
                { id: 'updates', label: 'Service Updates', default: false },
                { id: 'performance', label: 'Performance Warnings', default: true },
              ].map((pref) => (
                <div key={pref.id} className="flex items-center justify-between">
                  <Label htmlFor={pref.id} className="text-sm font-normal">
                    {pref.label}
                  </Label>
                  <Switch
                    id={pref.id}
                    defaultChecked={pref.default}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}