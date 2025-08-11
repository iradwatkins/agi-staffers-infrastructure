interface MetricData {
  cpu: number
  memory: number
  disk: number
  containers: { running: number; total: number } | any[]
  network: { rx: number; tx: number }
}

interface AlertThreshold {
  id: string
  name: string
  metric: string
  operator: 'above' | 'below'
  value: number
  unit: string
  enabled: boolean
}

interface Alert {
  id: string
  thresholdId: string
  name: string
  message: string
  value: number
  threshold: number
  timestamp: Date
  severity: 'warning' | 'critical'
}

export class MonitoringService {
  private thresholds: AlertThreshold[] = []
  private lastAlerts: Map<string, Date> = new Map()
  private alertCooldown = 5 * 60 * 1000 // 5 minutes cooldown between same alerts
  private containerStates: Map<string, string> = new Map() // Track container states for down notifications

  setThresholds(thresholds: AlertThreshold[]) {
    this.thresholds = thresholds.filter(t => t.enabled)
  }

  checkThresholds(metrics: MetricData): Alert[] {
    const alerts: Alert[] = []
    const now = new Date()

    // Default thresholds if none are set
    if (this.thresholds.length === 0) {
      this.setDefaultThresholds()
    }

    for (const threshold of this.thresholds) {
      let currentValue: number | undefined
      let breached = false

      // Get current metric value
      switch (threshold.metric) {
        case 'cpu':
          currentValue = metrics.cpu
          break
        case 'memory':
          currentValue = metrics.memory
          break
        case 'disk':
          currentValue = metrics.disk
          break
        case 'container':
          currentValue = metrics.containers.running
          break
        case 'network':
          // Convert to MB/s
          currentValue = (metrics.network.rx + metrics.network.tx) / (1024 * 1024)
          break
      }

      if (currentValue === undefined) continue

      // Check if threshold is breached
      if (threshold.operator === 'above') {
        breached = currentValue > threshold.value
      } else {
        breached = currentValue < threshold.value
      }

      if (breached) {
        // Check cooldown
        const lastAlert = this.lastAlerts.get(threshold.id)
        if (lastAlert && now.getTime() - lastAlert.getTime() < this.alertCooldown) {
          continue // Skip if still in cooldown
        }

        // Determine severity
        let severity: 'warning' | 'critical' = 'warning'
        if (threshold.operator === 'above') {
          if (currentValue > threshold.value * 1.2) severity = 'critical'
        } else {
          if (currentValue < threshold.value * 0.8) severity = 'critical'
        }

        // Create alert
        const alert: Alert = {
          id: `${threshold.id}-${now.getTime()}`,
          thresholdId: threshold.id,
          name: threshold.name,
          message: this.formatAlertMessage(threshold, currentValue),
          value: currentValue,
          threshold: threshold.value,
          timestamp: now,
          severity
        }

        alerts.push(alert)
        this.lastAlerts.set(threshold.id, now)
      }
    }

    // Check for container state changes (down containers)
    const containerAlerts = this.checkContainerStates(metrics.containers || [])
    alerts.push(...containerAlerts)

    return alerts
  }

  private checkContainerStates(containers: any[]): Alert[] {
    const alerts: Alert[] = []
    const now = new Date()
    const currentContainers = new Map<string, string>()

    // Track current container states
    for (const container of containers) {
      const containerId = container.id || container.containerId
      const containerName = container.name || container.containerName || containerId
      const status = container.status || 'unknown'
      
      currentContainers.set(containerId, status)

      // Check if container went down
      const previousStatus = this.containerStates.get(containerId)
      if (previousStatus && previousStatus === 'running' && status !== 'running') {
        // Container went down, create alert
        const alertId = `container-down-${containerId}-${now.getTime()}`
        const alert: Alert = {
          id: alertId,
          thresholdId: 'container-down',
          name: 'Container Down',
          message: `Container ${containerName} has stopped (status: ${status})`,
          value: 0,
          threshold: 1,
          timestamp: now,
          severity: 'critical'
        }

        alerts.push(alert)
        console.log(`Container down alert: ${containerName} (${status})`)
        
        // Send immediate container down notification
        this.sendContainerDownNotification(containerName, containerId).catch(console.error)
      }
    }

    // Update container states
    this.containerStates = currentContainers

    return alerts
  }

  private async sendContainerDownNotification(containerName: string, containerId: string) {
    const pushApiUrl = process.env.PUSH_API_URL || 'http://localhost:3011'
    
    try {
      const response = await fetch(`${pushApiUrl}/api/notify/container-down`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          containerName,
          containerId
        })
      })

      if (!response.ok) {
        console.error('Failed to send container down notification:', await response.text())
      }
    } catch (error) {
      console.error('Error sending container down notification:', error)
    }
  }

  private setDefaultThresholds() {
    this.thresholds = [
      {
        id: 'cpu-high',
        name: 'High CPU Usage',
        metric: 'cpu',
        operator: 'above',
        value: 80,
        unit: '%',
        enabled: true
      },
      {
        id: 'memory-high',
        name: 'High Memory Usage', 
        metric: 'memory',
        operator: 'above',
        value: 85,
        unit: '%',
        enabled: true
      },
      {
        id: 'disk-low',
        name: 'Low Disk Space',
        metric: 'disk',
        operator: 'below',
        value: 10,
        unit: 'GB',
        enabled: true
      }
    ]
  }

  private formatAlertMessage(threshold: AlertThreshold, value: number): string {
    const formattedValue = threshold.unit === '%' 
      ? value.toFixed(1) 
      : value.toFixed(2)

    if (threshold.operator === 'above') {
      return `${threshold.name}: ${formattedValue}${threshold.unit} (threshold: ${threshold.value}${threshold.unit})`
    } else {
      return `${threshold.name}: ${formattedValue}${threshold.unit} (minimum: ${threshold.value}${threshold.unit})`
    }
  }

  async sendAlerts(alerts: Alert[]) {
    if (!alerts.length) return

    // Import database service dynamically to avoid circular dependencies
    const { databaseService } = await import('./database-service')

    // Send to push notification API
    const pushApiUrl = process.env.PUSH_API_URL || 'http://localhost:3011'
    
    for (const alert of alerts) {
      try {
        // Save alert to database
        await databaseService.saveAlert({
          id: alert.id,
          thresholdId: alert.thresholdId,
          name: alert.name,
          metric: alert.thresholdId.split('-')[0], // Extract metric from threshold ID
          value: alert.value,
          threshold: alert.threshold,
          operator: alert.value > alert.threshold ? 'above' : 'below',
          severity: alert.severity,
          message: alert.message
        })

        // Send appropriate notification based on metric type
        await this.sendSpecificNotification(pushApiUrl, alert)
        
      } catch (error) {
        console.error('Failed to send/save alert:', error)
      }
    }
  }

  private async sendSpecificNotification(pushApiUrl: string, alert: Alert) {
    const { thresholdId, message, value, threshold, severity } = alert
    const metric = thresholdId.split('-')[0]

    try {
      let endpoint = '/api/broadcast'
      let payload: any = {
        title: this.getAlertIcon(severity, metric) + ' ' + alert.name,
        body: message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
          type: 'alert',
          alertId: alert.id,
          severity,
          metric,
          url: '/?tab=monitoring'
        }
      }

      // Use specific notification endpoints when available
      switch (metric) {
        case 'cpu':
          endpoint = '/api/notify/high-cpu'
          payload = {
            usage: Math.round(value),
            threshold: Math.round(threshold)
          }
          break
        case 'disk':
          if (alert.name.toLowerCase().includes('low') || alert.name.toLowerCase().includes('disk')) {
            endpoint = '/api/notify/low-disk'
            payload = {
              available: Math.round(value),
              threshold: Math.round(threshold)
            }
          }
          break
        default:
          // Use broadcast for other alert types
          break
      }

      const response = await fetch(`${pushApiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error('Push notification failed:', await response.text())
      } else {
        console.log(`Alert notification sent: ${alert.name}`)
      }

    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  private getAlertIcon(severity: string, metric: string): string {
    if (severity === 'critical') {
      return '🚨'
    }
    
    switch (metric) {
      case 'cpu': return '⚠️'
      case 'memory': return '💾'
      case 'disk': return '💽'
      case 'container': return '🐳'
      case 'network': return '🌐'
      default: return '⚠️'
    }
  }
}

// Singleton instance
export const monitoringService = new MonitoringService()