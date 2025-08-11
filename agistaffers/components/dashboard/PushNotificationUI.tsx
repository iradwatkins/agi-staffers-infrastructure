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
    preferences,
    preferencesLoading,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    updatePreferences,
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">Push Notifications</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Receive alerts about system events and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
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
          <div className="space-y-2">
            <Button
              onClick={testNotification}
              variant="secondary"
              className="w-full"
              disabled={preferencesLoading}
            >
              Send Test Notification
            </Button>
            {preferencesLoading && (
              <p className="text-xs text-muted-foreground text-center">
                Updating preferences...
              </p>
            )}
          </div>
        )}

        {/* Notification Settings */}
        {isSubscribed && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">Notification Preferences</h4>
            <div className="space-y-3">
              {[
                { id: 'alerts', label: 'System Alerts', description: 'Critical system alerts and warnings' },
                { id: 'container_down', label: 'Container Down', description: 'When Docker containers stop unexpectedly' },
                { id: 'performance', label: 'Performance Warnings', description: 'High CPU, memory, or disk usage alerts' },
                { id: 'backups', label: 'Backup Completion', description: 'Backup success and failure notifications' },
                { id: 'deployments', label: 'Deployments', description: 'Service deployment and update notifications' },
                { id: 'security', label: 'Security Alerts', description: 'Security-related notifications' },
                { id: 'updates', label: 'Service Updates', description: 'Non-critical service updates' },
              ].map((pref) => (
                <div key={pref.id} className="flex items-start justify-between gap-3 py-2">
                  <div className="flex-1 min-w-0">
                    <Label 
                      htmlFor={pref.id} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {pref.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {pref.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Switch
                      id={pref.id}
                      checked={preferences[pref.id as keyof typeof preferences]}
                      onCheckedChange={(checked) => 
                        updatePreferences({ [pref.id]: checked })
                      }
                      disabled={preferencesLoading}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}