'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Network, 
  ThermometerSun,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SystemMetric {
  name: string
  value: number
  max: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend?: 'up' | 'down' | 'stable'
  icon: React.ComponentType<{ className?: string }>
}

interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  message?: string
  lastCheck: Date
}

export function SystemHealthWidget() {
  const [mounted, setMounted] = useState(false)
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      value: 0,
      max: 100,
      unit: '%',
      status: 'good',
      trend: 'stable',
      icon: Cpu
    },
    {
      name: 'Memory',
      value: 0,
      max: 100,
      unit: '%',
      status: 'good',
      trend: 'up',
      icon: MemoryStick
    },
    {
      name: 'Disk Space',
      value: 0,
      max: 100,
      unit: '%',
      status: 'good',
      trend: 'up',
      icon: HardDrive
    },
    {
      name: 'Network I/O',
      value: 0,
      max: 1000,
      unit: 'Mbps',
      status: 'good',
      trend: 'stable',
      icon: Network
    },
    {
      name: 'Temperature',
      value: 0,
      max: 80,
      unit: '°C',
      status: 'good',
      trend: 'stable',
      icon: ThermometerSun
    },
    {
      name: 'Load Average',
      value: 0,
      max: 4,
      unit: '',
      status: 'good',
      trend: 'down',
      icon: Zap
    }
  ])

  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([
    { service: 'Database', status: 'healthy', lastCheck: new Date() },
    { service: 'Redis Cache', status: 'healthy', lastCheck: new Date() },
    { service: 'Docker Engine', status: 'healthy', lastCheck: new Date() },
    { service: 'Nginx Proxy', status: 'healthy', lastCheck: new Date() },
    { service: 'Backup Service', status: 'healthy', lastCheck: new Date() }
  ])

  const [overallHealth, setOverallHealth] = useState<'healthy' | 'degraded' | 'critical'>('healthy')

  // Set mounted flag
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate real-time metrics updates
  useEffect(() => {
    if (!mounted) return
    const updateMetrics = () => {
      setMetrics(prev => prev.map(metric => {
        let newValue = metric.value
        
        // Simulate realistic metric changes
        switch (metric.name) {
          case 'CPU Usage':
            newValue = 35 + Math.random() * 30
            break
          case 'Memory':
            newValue = 93 - Math.random() * 10 // Currently high
            break
          case 'Disk Space':
            newValue = 65 + Math.random() * 10
            break
          case 'Network I/O':
            newValue = Math.random() * 500
            break
          case 'Temperature':
            newValue = 45 + Math.random() * 15
            break
          case 'Load Average':
            newValue = 0.5 + Math.random() * 2
            break
        }

        // Determine status based on value
        let status: 'good' | 'warning' | 'critical' = 'good'
        const percentage = (newValue / metric.max) * 100
        
        if (metric.name === 'Memory') {
          // Memory is critical above 90%
          if (percentage > 90) status = 'critical'
          else if (percentage > 80) status = 'warning'
        } else if (percentage > 80) {
          status = 'critical'
        } else if (percentage > 60) {
          status = 'warning'
        }

        return {
          ...metric,
          value: newValue,
          status
        }
      }))

      // Randomly update health checks
      setHealthChecks(prev => prev.map(check => ({
        ...check,
        status: Math.random() > 0.95 ? 'degraded' : 'healthy',
        lastCheck: new Date()
      })))
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)
    return () => clearInterval(interval)
  }, [mounted])

  // Update overall health based on metrics and health checks
  useEffect(() => {
    const criticalMetrics = metrics.filter(m => m.status === 'critical')
    const warningMetrics = metrics.filter(m => m.status === 'warning')
    const unhealthyServices = healthChecks.filter(h => h.status !== 'healthy')

    if (criticalMetrics.length > 0 || unhealthyServices.length > 2) {
      setOverallHealth('critical')
    } else if (warningMetrics.length > 2 || unhealthyServices.length > 0) {
      setOverallHealth('degraded')
    } else {
      setOverallHealth('healthy')
    }
  }, [metrics, healthChecks])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'healthy':
        return 'text-green-600'
      case 'warning':
      case 'degraded':
        return 'text-yellow-600'
      case 'critical':
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-600'
      case 'warning':
        return 'bg-yellow-600'
      case 'critical':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  return (
    <div className="space-y-4">
      {/* Overall System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>
            Real-time system performance and health metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {overallHealth === 'healthy' && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-600">All Systems Operational</span>
                </>
              )}
              {overallHealth === 'degraded' && (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-600">Degraded Performance</span>
                </>
              )}
              {overallHealth === 'critical' && (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-600">Critical Issues Detected</span>
                </>
              )}
            </div>
            <Badge variant={overallHealth === 'healthy' ? 'default' : overallHealth === 'degraded' ? 'secondary' : 'destructive'}>
              {overallHealth.toUpperCase()}
            </Badge>
          </div>

          {/* Critical Alerts */}
          {metrics.filter(m => m.status === 'critical').length > 0 && (
            <Alert className="mb-4 border-red-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical:</strong> {metrics.filter(m => m.status === 'critical').map(m => m.name).join(', ')} exceeding thresholds
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* System Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map(metric => {
          const Icon = metric.icon
          const percentage = (metric.value / metric.max) * 100
          
          return (
            <Card key={metric.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {metric.name}
                  </div>
                  <span className={cn('text-xs', getStatusColor(metric.status))}>
                    {getTrendIcon(metric.trend)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {metric.value.toFixed(metric.unit === '%' ? 0 : 1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {metric.unit} / {metric.max}{metric.unit}
                    </span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn("h-full transition-all", getProgressColor(metric.status))}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', getStatusColor(metric.status))}
                  >
                    {metric.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Service Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health Checks</CardTitle>
          <CardDescription>
            Status of critical system services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {healthChecks.map(check => (
              <div key={check.service} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
                <div className="flex items-center gap-3">
                  {check.status === 'healthy' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : check.status === 'degraded' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">{check.service}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', getStatusColor(check.status))}
                  >
                    {check.status}
                  </Badge>
                  {mounted && (
                    <span className="text-xs text-muted-foreground">
                      {check.lastCheck.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}