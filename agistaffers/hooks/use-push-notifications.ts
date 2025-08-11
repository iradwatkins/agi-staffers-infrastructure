'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface NotificationOptions {
  title: string
  body?: string
  icon?: string
  badge?: string
  tag?: string
  duration?: number
}

interface NotificationPreferences {
  alerts: boolean
  backups: boolean
  updates: boolean
  performance: boolean
  container_down: boolean
  high_cpu: boolean
  low_memory: boolean
  low_disk: boolean
  deployments: boolean
  security: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  alerts: true,
  backups: true,
  updates: false,
  performance: true,
  container_down: true,
  high_cpu: true,
  low_memory: true,
  low_disk: true,
  deployments: true,
  security: true
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)
  const [preferencesLoading, setPreferencesLoading] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    const supported = 'Notification' in window && 'serviceWorker' in navigator
    setIsSupported(supported)

    if (supported) {
      setPermission(Notification.permission)
      checkSubscriptionStatus()
    }
  }, [])

  const checkSubscriptionStatus = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const existingSubscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!existingSubscription)
      
      // Load preferences if subscribed
      if (existingSubscription) {
        await loadPreferences()
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
    }
  }, [])

  const loadPreferences = useCallback(async () => {
    try {
      setPreferencesLoading(true)
      const response = await fetch('/api/push/preferences')
      if (response.ok) {
        const data = await response.json()
        if (data.preferences) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences })
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setPreferencesLoading(false)
    }
  }, [])

  const updatePreferences = useCallback(async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      setPreferencesLoading(true)
      const updatedPreferences = { ...preferences, ...newPreferences }
      
      const response = await fetch('/api/push/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: updatedPreferences })
      })
      
      if (response.ok) {
        setPreferences(updatedPreferences)
        toast.success('Notification preferences updated')
      } else {
        throw new Error('Failed to update preferences')
      }
    } catch (error) {
      console.error('Error updating preferences:', error)
      toast.error('Failed to update preferences')
    } finally {
      setPreferencesLoading(false)
    }
  }, [preferences])

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser.')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === 'granted') {
        toast.success('You will now receive push notifications.')
        return true
      } else {
        toast.error('You have denied push notification permissions.')
        return false
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
      toast.error('Failed to request notification permission.')
      return false
    }
  }, [isSupported])

  const subscribe = useCallback(async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission()
      if (!granted) return false
    }

    try {
      const registration = await navigator.serviceWorker.ready
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        setIsSubscribed(true)
        return true
      }

      // Subscribe to push notifications
      const response = await fetch('/api/push/vapid-public-key')
      const { publicKey } = await response.json()
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicKey,
      })

      // Send subscription to server with default preferences
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscription,
          preferences: DEFAULT_PREFERENCES 
        }),
      })

      setIsSubscribed(true)
      setPreferences(DEFAULT_PREFERENCES)
      toast.success('Successfully subscribed to push notifications.')
      return true
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Failed to subscribe to push notifications.')
      return false
    }
  }, [permission, requestPermission])

  const unsubscribe = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Notify server
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        })
      }

      setIsSubscribed(false)
      toast.success('Successfully unsubscribed from push notifications.')
      return true
    } catch (error) {
      console.error('Error unsubscribing:', error)
      toast.error('Failed to unsubscribe from push notifications.')
      return false
    }
  }, [])

  const showNotification = useCallback(async (options: NotificationOptions) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/icon-192x192.png',
        tag: options.tag,
        requireInteraction: false,
      })
    } catch (error) {
      console.error('Error showing notification:', error)
      // Fallback to toast
      toast(options.title, {
        description: options.body,
      })
    }
  }, [permission])

  return {
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
    loadPreferences,
  }
}