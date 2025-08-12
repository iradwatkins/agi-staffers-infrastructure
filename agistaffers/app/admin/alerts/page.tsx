'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bell, 
  BellOff,
  Clock,
  Settings,
  Filter,
  Trash2,
  Eye,
  MessageSquare,
  Activity,
  Server,
  Database,
  Globe,
  Shield,
  Zap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Alert {
  id: string
  title: string
  description: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  category: 'system' | 'security' | 'performance' | 'uptime' | 'custom'
  status: 'active' | 'acknowledged' | 'resolved'
  source: string
  timestamp: string
  acknowledgedBy?: string
  acknowledgedAt?: string
  resolvedAt?: string
  metadata?: Record<string, any>
}

interface AlertRule {
  id: string
  name: string
  description: string
  metric: string
  operator: '>' | '<' | '=' | '!='
  threshold: number
  enabled: boolean
  severity: 'info' | 'warning' | 'error' | 'critical'
  notificationChannels: string[]
  cooldownPeriod: number
  createdAt: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [createRuleOpen, setCreateRuleOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [alertDetailsOpen, setAlertDetailsOpen] = useState(false)

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    metric: '',
    operator: '>',
    threshold: 0,
    severity: 'warning',
    notificationChannels: [],
    cooldownPeriod: 300
  })

  useEffect(() => {
    fetchAlerts()
    fetchAlertRules()
  }, [])

  const fetchAlerts = async () => {
    try {
      // Mock data for demonstration
      setAlerts([
        {
          id: '1',
          title: 'High CPU Usage Detected',
          description: 'CPU usage has exceeded 90% for more than 5 minutes on server-01',
          severity: 'critical',
          category: 'performance',
          status: 'active',
          source: 'server-01',
          timestamp: '2025-01-11T11:45:00Z',
          metadata: {
            cpu_usage: 94.5,
            server: 'server-01',
            duration: '7 minutes'
          }
        },
        {
          id: '2',
          title: 'SSL Certificate Expiring',
          description: 'SSL certificate for techstartup.com expires in 7 days',
          severity: 'warning',
          category: 'security',
          status: 'acknowledged',
          source: 'ssl-monitor',
          timestamp: '2025-01-11T10:30:00Z',
          acknowledgedBy: 'John Admin',
          acknowledgedAt: '2025-01-11T10:45:00Z',
          metadata: {
            domain: 'techstartup.com',
            expires_in: '7 days'
          }
        },
        {
          id: '3',
          title: 'Database Connection Pool Full',
          description: 'PostgreSQL connection pool has reached maximum capacity',
          severity: 'error',
          category: 'system',
          status: 'resolved',
          source: 'database-monitor',
          timestamp: '2025-01-11T09:15:00Z',
          resolvedAt: '2025-01-11T09:30:00Z',
          metadata: {
            max_connections: 100,
            current_connections: 100
          }
        },
        {
          id: '4',
          title: 'Backup Completed Successfully',
          description: 'Daily backup completed without errors',
          severity: 'info',
          category: 'system',
          status: 'resolved',
          source: 'backup-service',
          timestamp: '2025-01-11T03:00:00Z',
          resolvedAt: '2025-01-11T03:00:00Z'
        },
        {
          id: '5',
          title: 'Unusual Login Activity',
          description: 'Multiple failed login attempts detected from IP 192.168.1.100',
          severity: 'warning',
          category: 'security',
          status: 'active',
          source: 'auth-service',
          timestamp: '2025-01-11T12:15:00Z',
          metadata: {
            ip_address: '192.168.1.100',
            attempts: 15,
            time_window: '10 minutes'
          }
        }
      ])
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      toast.error('Failed to load alerts')
    }
  }

  const fetchAlertRules = async () => {
    try {
      // Mock data for demonstration
      setAlertRules([
        {
          id: '1',
          name: 'High CPU Usage',
          description: 'Alert when CPU usage exceeds threshold',
          metric: 'cpu_usage_percent',
          operator: '>',
          threshold: 85,
          enabled: true,
          severity: 'warning',
          notificationChannels: ['email', 'slack'],
          cooldownPeriod: 300,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Low Disk Space',
          description: 'Alert when disk usage exceeds threshold',
          metric: 'disk_usage_percent',
          operator: '>',
          threshold: 90,
          enabled: true,
          severity: 'critical',
          notificationChannels: ['email', 'sms'],
          cooldownPeriod: 600,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '3',
          name: 'Memory Usage Critical',
          description: 'Alert when memory usage is critically high',
          metric: 'memory_usage_percent',
          operator: '>',
          threshold: 95,
          enabled: true,
          severity: 'critical',
          notificationChannels: ['email', 'slack', 'sms'],
          cooldownPeriod: 180,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '4',
          name: 'Response Time Degradation',
          description: 'Alert when average response time exceeds threshold',
          metric: 'response_time_ms',
          operator: '>',
          threshold: 500,
          enabled: false,
          severity: 'warning',
          notificationChannels: ['slack'],
          cooldownPeriod: 900,
          createdAt: '2024-01-15T10:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch alert rules:', error)
      toast.error('Failed to load alert rules')
    } finally {
      setLoading(false)
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.source.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory
  })

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              status: 'acknowledged',
              acknowledgedBy: 'Current User',
              acknowledgedAt: new Date().toISOString()
            }
          : alert
      ))
      toast.success('Alert acknowledged')
    } catch (error) {
      toast.error('Failed to acknowledge alert')
    }
  }

  const handleResolveAlert = async (alertId: string) => {
    try {
      setAlerts(alerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              status: 'resolved',
              resolvedAt: new Date().toISOString()
            }
          : alert
      ))
      toast.success('Alert resolved')
    } catch (error) {
      toast.error('Failed to resolve alert')
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    try {
      setAlerts(alerts.filter(alert => alert.id !== alertId))
      toast.success('Alert deleted')
    } catch (error) {
      toast.error('Failed to delete alert')
    }
  }

  const handleCreateRule = async () => {
    if (!newRule.name || !newRule.metric || !newRule.threshold) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const rule: AlertRule = {
        id: Math.random().toString(36).substr(2, 9),
        name: newRule.name,
        description: newRule.description,
        metric: newRule.metric,
        operator: newRule.operator as any,
        threshold: newRule.threshold,
        enabled: true,
        severity: newRule.severity as any,
        notificationChannels: newRule.notificationChannels,
        cooldownPeriod: newRule.cooldownPeriod,
        createdAt: new Date().toISOString()
      }

      setAlertRules([...alertRules, rule])
      setCreateRuleOpen(false)
      setNewRule({
        name: '',
        description: '',
        metric: '',
        operator: '>',
        threshold: 0,
        severity: 'warning',
        notificationChannels: [],
        cooldownPeriod: 300
      })
      toast.success('Alert rule created successfully')
    } catch (error) {
      toast.error('Failed to create alert rule')
    }
  }

  const handleToggleRule = async (ruleId: string) => {
    try {
      setAlertRules(alertRules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      ))
      toast.success('Alert rule updated')
    } catch (error) {
      toast.error('Failed to update alert rule')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-50'
      case 'acknowledged': return 'text-yellow-600 bg-yellow-50'
      case 'resolved': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return <Server className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'performance': return <Activity className="h-4 w-4" />
      case 'uptime': return <Globe className="h-4 w-4" />
      case 'custom': return <Settings className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout title="Alert Management" subtitle="Monitor and manage system alerts and notifications">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Dialog open={createRuleOpen} onOpenChange={setCreateRuleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Rule
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {alerts.filter(a => a.status === 'acknowledged').length}
            </div>
            <p className="text-xs text-muted-foreground">Being handled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.status === 'resolved').length}
            </div>
            <p className="text-xs text-muted-foreground">Issues fixed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alertRules.filter(r => r.enabled).length}/{alertRules.length}
            </div>
            <p className="text-xs text-muted-foreground">Rules enabled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="uptime">Uptime</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>
                {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading alerts...</div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No alerts found matching your criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div className="max-w-sm">
                            <div className="font-medium truncate">{alert.title}</div>
                            <div className="text-sm text-muted-foreground truncate">
                              {alert.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(alert.category)}
                            <span className="capitalize">{alert.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{alert.source}</TableCell>
                        <TableCell>{formatTimestamp(alert.timestamp)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Settings className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedAlert(alert)
                                  setAlertDetailsOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {alert.status === 'active' && (
                                <DropdownMenuItem
                                  onClick={() => handleAcknowledgeAlert(alert.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Acknowledge
                                </DropdownMenuItem>
                              )}
                              {alert.status !== 'resolved' && (
                                <DropdownMenuItem
                                  onClick={() => handleResolveAlert(alert.id)}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Resolve
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules</CardTitle>
              <CardDescription>Configure automatic alert triggers and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggleRule(rule.id)}
                      />
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.description}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="font-mono">
                            {rule.metric} {rule.operator} {rule.threshold}
                          </span>
                          • Cooldown: {rule.cooldownPeriod}s
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                      <Badge variant="outline">
                        {rule.notificationChannels.length} channels
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Rule Dialog */}
      <Dialog open={createRuleOpen} onOpenChange={setCreateRuleOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
          <DialogDescription>
            Set up automatic alerts based on system metrics
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ruleName">Rule Name *</Label>
            <Input
              id="ruleName"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              placeholder="High CPU Usage Alert"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ruleDescription">Description</Label>
            <Textarea
              id="ruleDescription"
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              placeholder="Alert when CPU usage exceeds threshold"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metric">Metric *</Label>
              <Select value={newRule.metric} onValueChange={(value) => setNewRule({ ...newRule, metric: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpu_usage_percent">CPU Usage (%)</SelectItem>
                  <SelectItem value="memory_usage_percent">Memory Usage (%)</SelectItem>
                  <SelectItem value="disk_usage_percent">Disk Usage (%)</SelectItem>
                  <SelectItem value="response_time_ms">Response Time (ms)</SelectItem>
                  <SelectItem value="error_rate_percent">Error Rate (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Select value={newRule.operator} onValueChange={(value) => setNewRule({ ...newRule, operator: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">Greater than</SelectItem>
                  <SelectItem value="<">Less than</SelectItem>
                  <SelectItem value="=">=Equal to</SelectItem>
                  <SelectItem value="!=">Not equal to</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold *</Label>
              <Input
                id="threshold"
                type="number"
                value={newRule.threshold}
                onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) || 0 })}
                placeholder="85"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={newRule.severity} onValueChange={(value) => setNewRule({ ...newRule, severity: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cooldown">Cooldown Period (seconds)</Label>
              <Input
                id="cooldown"
                type="number"
                value={newRule.cooldownPeriod}
                onChange={(e) => setNewRule({ ...newRule, cooldownPeriod: parseInt(e.target.value) || 300 })}
                placeholder="300"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCreateRuleOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateRule}>
            <Plus className="mr-2 h-4 w-4" />
            Create Rule
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Details Dialog */}
      <Dialog open={alertDetailsOpen} onOpenChange={setAlertDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              Detailed information about the alert
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedAlert.title}</h3>
                <div className="flex gap-2">
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedAlert.status)}>
                    {selectedAlert.status}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedAlert.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Source:</strong> {selectedAlert.source}
                </div>
                <div>
                  <strong>Category:</strong> {selectedAlert.category}
                </div>
                <div>
                  <strong>Created:</strong> {formatTimestamp(selectedAlert.timestamp)}
                </div>
                {selectedAlert.acknowledgedAt && (
                  <div>
                    <strong>Acknowledged:</strong> {formatTimestamp(selectedAlert.acknowledgedAt)}
                  </div>
                )}
              </div>
              {selectedAlert.metadata && (
                <div>
                  <strong>Additional Data:</strong>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs">
                    {JSON.stringify(selectedAlert.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  )
}