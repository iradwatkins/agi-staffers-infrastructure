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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { 
  Plus,
  Calendar,
  Clock,
  Database,
  HardDrive,
  FileText,
  RefreshCw,
  Settings,
  Trash2,
  Edit,
  Play,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BackupSchedule {
  id: string
  name: string
  description: string
  type: 'full' | 'incremental' | 'database' | 'files'
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  schedule: string // cron expression for custom frequency
  time: string
  retention: number // days
  enabled: boolean
  lastRun?: string
  nextRun: string
  targets: string[]
  compressionEnabled: boolean
  encryptionEnabled: boolean
  runCount: number
  avgDuration: number
  successRate: number
  createdAt: string
}

export default function BackupSchedulePage() {
  const [schedules, setSchedules] = useState<BackupSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [createScheduleOpen, setCreateScheduleOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<BackupSchedule | null>(null)
  const [editScheduleOpen, setEditScheduleOpen] = useState(false)

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    type: 'full',
    frequency: 'daily',
    customSchedule: '',
    time: '03:00',
    retention: 30,
    targets: [] as string[],
    compressionEnabled: true,
    encryptionEnabled: false
  })

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      // Mock data for demonstration
      setSchedules([
        {
          id: '1',
          name: 'Daily Full System Backup',
          description: 'Complete system backup including all customer data and configurations',
          type: 'full',
          frequency: 'daily',
          schedule: '0 3 * * *',
          time: '03:00',
          retention: 30,
          enabled: true,
          lastRun: '2025-01-11T03:00:00Z',
          nextRun: '2025-01-12T03:00:00Z',
          targets: ['all-customers', 'system-config', 'databases', 'uploads'],
          compressionEnabled: true,
          encryptionEnabled: true,
          runCount: 365,
          avgDuration: 1800, // 30 minutes
          successRate: 99.2,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Database Backup',
          description: 'PostgreSQL database backup with transaction logs',
          type: 'database',
          frequency: 'daily',
          schedule: '0 2 * * *',
          time: '02:00',
          retention: 60,
          enabled: true,
          lastRun: '2025-01-11T02:00:00Z',
          nextRun: '2025-01-12T02:00:00Z',
          targets: ['postgresql', 'transaction-logs'],
          compressionEnabled: true,
          encryptionEnabled: false,
          runCount: 365,
          avgDuration: 420, // 7 minutes
          successRate: 100.0,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Incremental File Backup',
          description: 'Incremental backup of changed customer files',
          type: 'incremental',
          frequency: 'daily',
          schedule: '0 12 * * *',
          time: '12:00',
          retention: 14,
          enabled: true,
          lastRun: '2025-01-11T12:00:00Z',
          nextRun: '2025-01-12T12:00:00Z',
          targets: ['customer-files', 'user-uploads'],
          compressionEnabled: true,
          encryptionEnabled: false,
          runCount: 365,
          avgDuration: 180, // 3 minutes
          successRate: 98.9,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Weekly Archive Backup',
          description: 'Weekly comprehensive backup for long-term storage',
          type: 'full',
          frequency: 'weekly',
          schedule: '0 1 * * 0',
          time: '01:00',
          retention: 365,
          enabled: false,
          nextRun: '2025-01-19T01:00:00Z',
          targets: ['all-systems', 'logs', 'cache'],
          compressionEnabled: true,
          encryptionEnabled: true,
          runCount: 52,
          avgDuration: 3600, // 1 hour
          successRate: 96.2,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'Monthly Compliance Backup',
          description: 'Monthly backup for compliance and audit requirements',
          type: 'full',
          frequency: 'monthly',
          schedule: '0 0 1 * *',
          time: '00:00',
          retention: 2555, // 7 years
          enabled: true,
          lastRun: '2025-01-01T00:00:00Z',
          nextRun: '2025-02-01T00:00:00Z',
          targets: ['all-data', 'audit-logs', 'compliance-docs'],
          compressionEnabled: true,
          encryptionEnabled: true,
          runCount: 12,
          avgDuration: 7200, // 2 hours
          successRate: 100.0,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch backup schedules:', error)
      toast.error('Failed to load backup schedules')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSchedule = async () => {
    if (!newSchedule.name || newSchedule.targets.length === 0) {
      toast.error('Please fill in all required fields and select at least one target')
      return
    }

    try {
      const schedule: BackupSchedule = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSchedule.name,
        description: newSchedule.description,
        type: newSchedule.type as any,
        frequency: newSchedule.frequency as any,
        schedule: generateCronExpression(newSchedule.frequency, newSchedule.time, newSchedule.customSchedule),
        time: newSchedule.time,
        retention: newSchedule.retention,
        enabled: true,
        nextRun: calculateNextRun(newSchedule.frequency, newSchedule.time),
        targets: newSchedule.targets,
        compressionEnabled: newSchedule.compressionEnabled,
        encryptionEnabled: newSchedule.encryptionEnabled,
        runCount: 0,
        avgDuration: 0,
        successRate: 0,
        createdAt: new Date().toISOString()
      }

      setSchedules([...schedules, schedule])
      setCreateScheduleOpen(false)
      resetNewSchedule()
      toast.success('Backup schedule created successfully')
    } catch (error) {
      toast.error('Failed to create backup schedule')
    }
  }

  const handleToggleSchedule = async (scheduleId: string) => {
    try {
      setSchedules(schedules.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      ))
      toast.success('Schedule updated successfully')
    } catch (error) {
      toast.error('Failed to update schedule')
    }
  }

  const handleRunNow = async (scheduleId: string) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId)
      if (schedule) {
        toast.success(`Backup "${schedule.name}" started successfully`)
      }
    } catch (error) {
      toast.error('Failed to run backup')
    }
  }

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId))
      toast.success('Schedule deleted successfully')
    } catch (error) {
      toast.error('Failed to delete schedule')
    }
  }

  const generateCronExpression = (frequency: string, time: string, custom?: string) => {
    if (frequency === 'custom' && custom) {
      return custom
    }

    const [hours, minutes] = time.split(':').map(Number)
    
    switch (frequency) {
      case 'daily':
        return `${minutes} ${hours} * * *`
      case 'weekly':
        return `${minutes} ${hours} * * 0` // Sunday
      case 'monthly':
        return `${minutes} ${hours} 1 * *` // 1st of month
      default:
        return `${minutes} ${hours} * * *`
    }
  }

  const calculateNextRun = (frequency: string, time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const now = new Date()
    const next = new Date()
    
    next.setHours(hours, minutes, 0, 0)
    
    if (frequency === 'daily') {
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
    } else if (frequency === 'weekly') {
      next.setDate(next.getDate() + (7 - next.getDay()))
    } else if (frequency === 'monthly') {
      next.setMonth(next.getMonth() + 1, 1)
    }
    
    return next.toISOString()
  }

  const resetNewSchedule = () => {
    setNewSchedule({
      name: '',
      description: '',
      type: 'full',
      frequency: 'daily',
      customSchedule: '',
      time: '03:00',
      retention: 30,
      targets: [],
      compressionEnabled: true,
      encryptionEnabled: false
    })
  }

  const handleToggleTarget = (target: string) => {
    setNewSchedule(prev => ({
      ...prev,
      targets: prev.targets.includes(target)
        ? prev.targets.filter(t => t !== target)
        : [...prev.targets, target]
    }))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return <HardDrive className="h-4 w-4" />
      case 'incremental': return <RefreshCw className="h-4 w-4" />
      case 'database': return <Database className="h-4 w-4" />
      case 'files': return <FileText className="h-4 w-4" />
      default: return <HardDrive className="h-4 w-4" />
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'N/A'
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 99) return 'text-green-600'
    if (rate >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }

  const availableTargets = [
    'all-customers',
    'system-config',
    'databases',
    'customer-files',
    'user-uploads',
    'logs',
    'cache',
    'audit-logs',
    'compliance-docs'
  ]

  return (
    <AdminLayout title="Backup Schedules" subtitle="Manage automated backup scheduling and configuration">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Dialog open={createScheduleOpen} onOpenChange={setCreateScheduleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Schedule
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Schedules</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{schedules.length}</div>
              <p className="text-xs text-muted-foreground">Configured schedules</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {schedules.filter(s => s.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Schedules enabled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedules.reduce((sum, s) => sum + s.runCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">All time executions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(schedules.reduce((sum, s) => sum + s.successRate, 0) / schedules.length || 0)}%
              </div>
              <p className="text-xs text-muted-foreground">Across all schedules</p>
            </CardContent>
          </Card>
        </div>

        {/* Schedules List */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Schedules</CardTitle>
            <CardDescription>Automated backup configurations and schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading backup schedules...</div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No backup schedules configured
              </div>
            ) : (
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={() => handleToggleSchedule(schedule.id)}
                      />
                      <div className="flex items-center gap-3">
                        {getTypeIcon(schedule.type)}
                        <div>
                          <div className="font-medium">{schedule.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {schedule.description}
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className="capitalize">
                              {schedule.type}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {schedule.frequency}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Retention: {schedule.retention} days
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {schedule.compressionEnabled && 'Compressed'}
                              {schedule.compressionEnabled && schedule.encryptionEnabled && ' • '}
                              {schedule.encryptionEnabled && 'Encrypted'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Next: {formatTimestamp(schedule.nextRun)}
                        </div>
                        {schedule.lastRun && (
                          <div className="text-xs text-muted-foreground">
                            Last: {formatTimestamp(schedule.lastRun)}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {schedule.runCount} runs
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(schedule.avgDuration)} avg
                          </span>
                          <span className={`text-xs font-medium ${getSuccessRateColor(schedule.successRate)}`}>
                            {schedule.successRate}% success
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Schedule actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRunNow(schedule.id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSchedule(schedule)
                              setEditScheduleOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteSchedule(schedule.id)}
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

        {/* Create Schedule Dialog */}
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Backup Schedule</DialogTitle>
            <DialogDescription>
              Configure a new automated backup schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleName">Schedule Name *</Label>
              <Input
                id="scheduleName"
                value={newSchedule.name}
                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                placeholder="Daily System Backup"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleDescription">Description</Label>
              <Input
                id="scheduleDescription"
                value={newSchedule.description}
                onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
                placeholder="Automated daily backup of all systems"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleType">Backup Type</Label>
                <Select value={newSchedule.type} onValueChange={(value) => setNewSchedule({ ...newSchedule, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full System</SelectItem>
                    <SelectItem value="incremental">Incremental</SelectItem>
                    <SelectItem value="database">Database Only</SelectItem>
                    <SelectItem value="files">Files Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={newSchedule.frequency} onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom (Cron)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {newSchedule.frequency === 'custom' ? (
              <div className="space-y-2">
                <Label htmlFor="customSchedule">Cron Expression *</Label>
                <Input
                  id="customSchedule"
                  value={newSchedule.customSchedule}
                  onChange={(e) => setNewSchedule({ ...newSchedule, customSchedule: e.target.value })}
                  placeholder="0 3 * * *"
                  className="font-mono"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="scheduleTime">Time</Label>
                <Input
                  id="scheduleTime"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="retention">Retention Period (days)</Label>
              <Input
                id="retention"
                type="number"
                value={newSchedule.retention}
                onChange={(e) => setNewSchedule({ ...newSchedule, retention: parseInt(e.target.value) || 30 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Backup Targets *</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {availableTargets.map((target) => (
                  <div key={target} className="flex items-center space-x-2">
                    <Checkbox
                      id={target}
                      checked={newSchedule.targets.includes(target)}
                      onCheckedChange={() => handleToggleTarget(target)}
                    />
                    <Label htmlFor={target} className="text-sm">
                      {target.replace(/-/g, ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compression">Enable Compression</Label>
              <Switch
                id="compression"
                checked={newSchedule.compressionEnabled}
                onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, compressionEnabled: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="encryption">Enable Encryption</Label>
              <Switch
                id="encryption"
                checked={newSchedule.encryptionEnabled}
                onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, encryptionEnabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateScheduleOpen(false)
              resetNewSchedule()
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule}>
              <Calendar className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </AdminLayout>
  )
}