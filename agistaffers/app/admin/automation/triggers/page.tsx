'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/safe-dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  Plus,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2,
  Edit,
  Play,
  GitBranch,
  Bell,
  Mail,
  Globe,
  Database,
  RefreshCw
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AutomationTrigger {
  id: string
  name: string
  description: string
  event: string
  conditions: string[]
  actions: TriggerAction[]
  enabled: boolean
  triggerCount: number
  lastTriggered?: string
  createdAt: string
}

interface TriggerAction {
  type: 'email' | 'webhook' | 'script' | 'slack' | 'create_backup' | 'restart_service'
  config: Record<string, any>
}

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<AutomationTrigger[]>([])
  const [loading, setLoading] = useState(true)
  const [createTriggerOpen, setCreateTriggerOpen] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState<AutomationTrigger | null>(null)
  const [editTriggerOpen, setEditTriggerOpen] = useState(false)

  const [newTrigger, setNewTrigger] = useState({
    name: '',
    description: '',
    event: '',
    conditions: [''],
    actionType: 'email',
    actionConfig: '',
    enabled: true
  })

  useEffect(() => {
    fetchTriggers()
  }, [])

  const fetchTriggers = async () => {
    try {
      // Mock data for demonstration
      setTriggers([
        {
          id: '1',
          name: 'High CPU Alert',
          description: 'Send email alert when CPU usage exceeds 90%',
          event: 'system.cpu_high',
          conditions: ['cpu_usage > 90', 'duration > 300'],
          actions: [
            {
              type: 'email',
              config: {
                to: 'admin@agistaffers.com',
                subject: 'High CPU Usage Alert',
                template: 'cpu_alert'
              }
            }
          ],
          enabled: true,
          triggerCount: 12,
          lastTriggered: '2025-01-10T14:30:00Z',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          name: 'Deployment Success Notification',
          description: 'Send Slack notification when deployment completes successfully',
          event: 'deployment.success',
          conditions: ['environment = production'],
          actions: [
            {
              type: 'slack',
              config: {
                channel: '#deployments',
                message: 'Production deployment completed successfully!'
              }
            }
          ],
          enabled: true,
          triggerCount: 45,
          lastTriggered: '2025-01-11T16:20:00Z',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '3',
          name: 'SSL Certificate Expiry Warning',
          description: 'Create backup when SSL certificate is about to expire',
          event: 'ssl.expiring_soon',
          conditions: ['days_until_expiry <= 30'],
          actions: [
            {
              type: 'email',
              config: {
                to: 'security@agistaffers.com',
                subject: 'SSL Certificate Expiring Soon'
              }
            },
            {
              type: 'create_backup',
              config: {
                type: 'full',
                retention: 90
              }
            }
          ],
          enabled: true,
          triggerCount: 8,
          lastTriggered: '2025-01-08T09:00:00Z',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '4',
          name: 'Failed Login Attempts',
          description: 'Send webhook notification for multiple failed login attempts',
          event: 'auth.failed_login_threshold',
          conditions: ['attempts >= 5', 'time_window <= 300'],
          actions: [
            {
              type: 'webhook',
              config: {
                url: 'https://security-monitor.agistaffers.com/webhook',
                method: 'POST',
                headers: {
                  'Authorization': 'Bearer xxx'
                }
              }
            }
          ],
          enabled: true,
          triggerCount: 3,
          lastTriggered: '2025-01-09T11:15:00Z',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: '5',
          name: 'Database Connection Lost',
          description: 'Restart database service when connection is lost',
          event: 'database.connection_lost',
          conditions: ['retries_exhausted = true'],
          actions: [
            {
              type: 'restart_service',
              config: {
                service: 'postgresql',
                timeout: 60
              }
            },
            {
              type: 'email',
              config: {
                to: 'ops@agistaffers.com',
                subject: 'Database Service Restarted'
              }
            }
          ],
          enabled: false,
          triggerCount: 0,
          createdAt: '2024-01-15T00:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch automation triggers:', error)
      toast.error('Failed to load automation triggers')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrigger = async () => {
    if (!newTrigger.name || !newTrigger.event) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const trigger: AutomationTrigger = {
        id: Math.random().toString(36).substr(2, 9),
        name: newTrigger.name,
        description: newTrigger.description,
        event: newTrigger.event,
        conditions: newTrigger.conditions.filter(c => c.trim() !== ''),
        actions: [
          {
            type: newTrigger.actionType as any,
            config: JSON.parse(newTrigger.actionConfig || '{}')
          }
        ],
        enabled: newTrigger.enabled,
        triggerCount: 0,
        createdAt: new Date().toISOString()
      }

      setTriggers([...triggers, trigger])
      setCreateTriggerOpen(false)
      setNewTrigger({
        name: '',
        description: '',
        event: '',
        conditions: [''],
        actionType: 'email',
        actionConfig: '',
        enabled: true
      })
      toast.success('Automation trigger created successfully')
    } catch (error) {
      toast.error('Failed to create automation trigger')
    }
  }

  const handleToggleTrigger = async (triggerId: string) => {
    try {
      setTriggers(triggers.map(trigger => 
        trigger.id === triggerId 
          ? { ...trigger, enabled: !trigger.enabled }
          : trigger
      ))
      toast.success('Trigger updated successfully')
    } catch (error) {
      toast.error('Failed to update trigger')
    }
  }

  const handleTestTrigger = async (triggerId: string) => {
    try {
      toast.success('Trigger test executed successfully')
    } catch (error) {
      toast.error('Failed to test trigger')
    }
  }

  const handleDeleteTrigger = async (triggerId: string) => {
    try {
      setTriggers(triggers.filter(trigger => trigger.id !== triggerId))
      toast.success('Trigger deleted successfully')
    } catch (error) {
      toast.error('Failed to delete trigger')
    }
  }

  const getEventIcon = (event: string) => {
    if (event.includes('system')) return <Activity className="h-4 w-4" />
    if (event.includes('deployment')) return <GitBranch className="h-4 w-4" />
    if (event.includes('ssl')) return <CheckCircle className="h-4 w-4" />
    if (event.includes('auth')) return <AlertTriangle className="h-4 w-4" />
    if (event.includes('database')) return <Database className="h-4 w-4" />
    return <Zap className="h-4 w-4" />
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'webhook': return <Globe className="h-4 w-4" />
      case 'slack': return <Bell className="h-4 w-4" />
      case 'create_backup': return <Database className="h-4 w-4" />
      case 'restart_service': return <RefreshCw className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
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

  const addCondition = () => {
    setNewTrigger({
      ...newTrigger,
      conditions: [...newTrigger.conditions, '']
    })
  }

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...newTrigger.conditions]
    newConditions[index] = value
    setNewTrigger({ ...newTrigger, conditions: newConditions })
  }

  const removeCondition = (index: number) => {
    setNewTrigger({
      ...newTrigger,
      conditions: newTrigger.conditions.filter((_, i) => i !== index)
    })
  }

  return (
    <AdminLayout title="Automation Triggers" subtitle="Manage event-based automation and workflows">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Dialog open={createTriggerOpen} onOpenChange={setCreateTriggerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Trigger
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Triggers</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{triggers.length}</div>
              <p className="text-xs text-muted-foreground">Configured triggers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {triggers.filter(t => t.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Triggers enabled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {triggers.reduce((sum, t) => sum + t.triggerCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg per Trigger</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(triggers.reduce((sum, t) => sum + t.triggerCount, 0) / triggers.length || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Executions</p>
            </CardContent>
          </Card>
        </div>

        {/* Triggers List */}
        <Card>
          <CardHeader>
            <CardTitle>Automation Triggers</CardTitle>
            <CardDescription>Event-based triggers and their configured actions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading automation triggers...</div>
            ) : triggers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No automation triggers configured
              </div>
            ) : (
              <div className="space-y-4">
                {triggers.map((trigger) => (
                  <div key={trigger.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={trigger.enabled}
                        onCheckedChange={() => handleToggleTrigger(trigger.id)}
                      />
                      <div className="flex items-center gap-3">
                        {getEventIcon(trigger.event)}
                        <div>
                          <div className="font-medium">{trigger.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {trigger.description}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {trigger.event}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {trigger.conditions.length} condition{trigger.conditions.length !== 1 ? 's' : ''}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {trigger.actions.length} action{trigger.actions.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Triggered {trigger.triggerCount} times
                        </div>
                        {trigger.lastTriggered && (
                          <div className="text-xs text-muted-foreground">
                            Last: {formatTimestamp(trigger.lastTriggered)}
                          </div>
                        )}
                        <div className="flex gap-1 mt-1">
                          {trigger.actions.map((action, index) => (
                            <div key={index} className="flex items-center">
                              {getActionIcon(action.type)}
                            </div>
                          ))}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Trigger actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleTestTrigger(trigger.id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Test Trigger
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTrigger(trigger)
                              setEditTriggerOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteTrigger(trigger.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Trigger Dialog */}
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Automation Trigger</DialogTitle>
            <DialogDescription>
              Configure a new event-based trigger with conditions and actions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="triggerName">Trigger Name *</Label>
              <Input
                id="triggerName"
                value={newTrigger.name}
                onChange={(e) => setNewTrigger({ ...newTrigger, name: e.target.value })}
                placeholder="High CPU Usage Alert"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="triggerDescription">Description</Label>
              <Textarea
                id="triggerDescription"
                value={newTrigger.description}
                onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                placeholder="Send alert when CPU usage exceeds threshold"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Event Type *</Label>
              <Select value={newTrigger.event} onValueChange={(value) => setNewTrigger({ ...newTrigger, event: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system.cpu_high">System - High CPU Usage</SelectItem>
                  <SelectItem value="system.memory_high">System - High Memory Usage</SelectItem>
                  <SelectItem value="system.disk_full">System - Disk Space Low</SelectItem>
                  <SelectItem value="deployment.success">Deployment - Success</SelectItem>
                  <SelectItem value="deployment.failed">Deployment - Failed</SelectItem>
                  <SelectItem value="ssl.expiring_soon">SSL - Certificate Expiring</SelectItem>
                  <SelectItem value="auth.failed_login_threshold">Auth - Failed Login Threshold</SelectItem>
                  <SelectItem value="database.connection_lost">Database - Connection Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Conditions</Label>
              {newTrigger.conditions.map((condition, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateCondition(index, e.target.value)}
                    placeholder="cpu_usage > 90"
                    className="font-mono"
                  />
                  {newTrigger.conditions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCondition(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCondition}>
                Add Condition
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Select value={newTrigger.actionType} onValueChange={(value) => setNewTrigger({ ...newTrigger, actionType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Send Email</SelectItem>
                  <SelectItem value="webhook">Call Webhook</SelectItem>
                  <SelectItem value="slack">Send Slack Message</SelectItem>
                  <SelectItem value="create_backup">Create Backup</SelectItem>
                  <SelectItem value="restart_service">Restart Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actionConfig">Action Configuration (JSON)</Label>
              <Textarea
                id="actionConfig"
                value={newTrigger.actionConfig}
                onChange={(e) => setNewTrigger({ ...newTrigger, actionConfig: e.target.value })}
                placeholder='{"to": "admin@example.com", "subject": "Alert"}'
                rows={3}
                className="font-mono"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable Trigger</Label>
              <Switch
                id="enabled"
                checked={newTrigger.enabled}
                onCheckedChange={(checked) => setNewTrigger({ ...newTrigger, enabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTriggerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTrigger}>
              <Plus className="mr-2 h-4 w-4" />
              Create Trigger
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </AdminLayout>
  )
}