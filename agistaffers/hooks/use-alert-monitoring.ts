'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

export function useAlertMonitoring() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastAlertTimeRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const response = await fetch('/api/metrics')
        if (!response.ok) return

        const data = await response.json()
        
        if (data.alerts && data.alerts.length > 0) {
          const now = Date.now()
          const cooldown = 5 * 60 * 1000 // 5 minutes

          data.alerts.forEach((alert: any) => {
            const lastAlertTime = lastAlertTimeRef.current.get(alert.thresholdId) || 0
            
            // Only show toast if not in cooldown period
            if (now - lastAlertTime > cooldown) {
              toast.error(alert.message, {
                duration: 10000,
                description: `Current: ${alert.value.toFixed(1)}, Threshold: ${alert.threshold}`,
                action: {
                  label: 'View',
                  onClick: () => {
                    // Navigate to monitoring tab
                    const tabTrigger = document.querySelector('[value="monitoring"]') as HTMLElement
                    if (tabTrigger) tabTrigger.click()
                  }
                }
              })
              
              lastAlertTimeRef.current.set(alert.thresholdId, now)
            }
          })
        }
      } catch (error) {
        console.error('Error checking alerts:', error)
      }
    }

    // Check immediately
    checkAlerts()

    // Then check every 30 seconds
    intervalRef.current = setInterval(checkAlerts, 30000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
}