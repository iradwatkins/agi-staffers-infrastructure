'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity,
  Server,
  Database,
  Globe,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Zap,
  Users,
  Eye
} from 'lucide-react'

interface SystemMetric {
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  change: number
  trend: 'up' | 'down' | 'stable'
}

interface ServiceStatus {
  id: string
  name: string
  status: 'running' | 'stopped' | 'error'
  uptime: string
  memory: number
  cpu: number
  lastCheck: string
}

interface AlertItem {
  id: string
  title: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  timestamp: string
  acknowledged: boolean
}

export default function MonitoringPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      change: -2.3,
      trend: 'down'
    },
    {
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      change: 5.1,
      trend: 'up'
    },
    {
      name: 'Disk Usage',
      value: 34,
      unit: '%',
      status: 'healthy',
      change: 1.2,
      trend: 'up'
    },
    {
      name: 'Network I/O',
      value: 156,
      unit: 'MB/s',
      status: 'healthy',
      change: -8.7,
      trend: 'down'
    }
  ])

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: '1',
      name: 'Web Server (Nginx)',
      status: 'running',
      uptime: '15d 4h 32m',
      memory: 125,
      cpu: 12,
      lastCheck: '2025-01-11T12:00:00Z'
    },
    {
      id: '2',
      name: 'Database (PostgreSQL)',
      status: 'running',
      uptime: '15d 4h 30m',
      memory: 512,
      cpu: 23,
      lastCheck: '2025-01-11T12:00:00Z'
    },
    {
      id: '3',
      name: 'Redis Cache',
      status: 'running',
      uptime: '12d 8h 15m',
      memory: 89,
      cpu: 5,
      lastCheck: '2025-01-11T12:00:00Z'
    },
    {
      id: '4',
      name: 'Application Server',
      status: 'running',
      uptime: '7d 16h 42m',
      memory: 256,
      cpu: 34,
      lastCheck: '2025-01-11T12:00:00Z'
    },
    {
      id: '5',
      name: 'CDN Service',
      status: 'error',
      uptime: '0d 0h 0m',
      memory: 0,
      cpu: 0,
      lastCheck: '2025-01-11T12:00:00Z'
    }
  ])

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: '1',
      title: 'High Memory Usage',
      message: 'Memory usage has exceeded 85% threshold on server-01',
      severity: 'warning',
      timestamp: '2025-01-11T11:45:00Z',
      acknowledged: false
    },
    {
      id: '2',
      title: 'CDN Service Down',
      message: 'CDN service is not responding to health checks',
      severity: 'critical',
      timestamp: '2025-01-11T11:30:00Z',
      acknowledged: false
    },
    {
      id: '3',
      title: 'SSL Certificate Expiring',
      message: 'SSL certificate for example.com expires in 7 days',
      severity: 'warning',
      timestamp: '2025-01-11T10:15:00Z',
      acknowledged: true
    },
    {
      id: '4',
      title: 'Backup Completed',
      message: 'Daily backup completed successfully at 03:00 UTC',
      severity: 'info',
      timestamp: '2025-01-11T03:00:00Z',
      acknowledged: true
    }
  ])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        updateMetrics()
        setLastRefresh(new Date())
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const updateMetrics = () => {
    setSystemMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5)),
      change: (Math.random() - 0.5) * 10
    })))
  }

  const handleRefresh = () => {
    updateMetrics()
    setLastRefresh(new Date())
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'stopped': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'stopped': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout title="System Monitoring" subtitle="Real-time system health and performance monitoring">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end items-center gap-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Last 5m</SelectItem>
              <SelectItem value="15m">Last 15m</SelectItem>
              <SelectItem value="1h">Last 1h</SelectItem>
              <SelectItem value="6h">Last 6h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold">Operational</div>
            </div>
            <p className="text-xs text-muted-foreground">All systems running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.filter(s => s.status === 'running').length}/{services.length}
            </div>
            <p className="text-xs text-muted-foreground">Services online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => !a.acknowledged && a.severity !== 'info').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {systemMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {metric.name === 'CPU Usage' && <Cpu className="h-4 w-4 text-muted-foreground" />}
                  {metric.name === 'Memory Usage' && <MemoryStick className="h-4 w-4 text-muted-foreground" />}
                  {metric.name === 'Disk Usage' && <HardDrive className="h-4 w-4 text-muted-foreground" />}
                  {metric.name === 'Network I/O' && <Network className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                        {metric.value}{metric.unit === '%' ? '%' : ''}
                      </span>
                      <Badge variant={metric.status === 'healthy' ? 'default' : metric.status === 'warning' ? 'secondary' : 'destructive'}>
                        {metric.status}
                      </Badge>
                    </div>
                    <Progress value={metric.unit === '%' ? metric.value : (metric.value / 200) * 100} className="w-full" />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : metric.trend === 'down' ? (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      ) : null}
                      {Math.abs(metric.change).toFixed(1)}{metric.unit} from last hour
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,247</div>
                <p className="text-sm text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Requests/min
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,456</div>
                <p className="text-sm text-muted-foreground">Average over last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127ms</div>
                <p className="text-sm text-muted-foreground">95th percentile</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
              <CardDescription>Monitor all system services and their health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getServiceStatusIcon(service.status)}
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Uptime: {service.uptime} • Last check: {formatTimestamp(service.lastCheck)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">CPU: {service.cpu}%</div>
                        <div className="text-sm text-muted-foreground">RAM: {service.memory}MB</div>
                      </div>
                      <Badge className={getServiceStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Recent alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-start gap-4 p-4 border rounded-lg ${
                    alert.acknowledged ? 'opacity-60' : ''
                  }`}>
                    {getAlertIcon(alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{alert.title}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'warning' ? 'secondary' :
                            alert.severity === 'error' ? 'destructive' :
                            'default'
                          }>
                            {alert.severity}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response times over {selectedTimeRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Eye className="h-8 w-8 mx-auto mb-2" />
                    <p>Response time chart would be displayed here</p>
                    <p className="text-sm">Current: 127ms average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>System resource utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2" />
                    <p>Resource usage chart would be displayed here</p>
                    <p className="text-sm">CPU: 45% • RAM: 68% • Disk: 34%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Error Rate</CardTitle>
              <CardDescription>HTTP error rates and status codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.2%</div>
                  <div className="text-sm text-muted-foreground">2xx Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">0.6%</div>
                  <div className="text-sm text-muted-foreground">3xx Redirect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">0.1%</div>
                  <div className="text-sm text-muted-foreground">4xx Client Error</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">0.1%</div>
                  <div className="text-sm text-muted-foreground">5xx Server Error</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Auto-refresh indicator */}
      {autoRefresh && (
        <div className="fixed bottom-4 right-4">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </Card>
        </div>
      )}
      </div>
    </AdminLayout>
  )
}