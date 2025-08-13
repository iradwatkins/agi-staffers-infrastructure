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
  Clock,
  Play,
  Pause,
  Settings,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  Globe,
  Mail,
  RefreshCw,
  Trash2,
  Edit
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ScheduledTask {
  id: string
  name: string
  description: string
  type: 'backup' | 'cleanup' | 'report' | 'maintenance' | 'notification' | 'custom'
  schedule: string // cron expression
  enabled: boolean
  lastRun?: string
  nextRun: string
  status: 'idle' | 'running' | 'success' | 'failed'
  runCount: number
  avgDuration: number
  createdAt: string
}

export default function ScheduledTasksPage() {
  const [tasks, setTasks] = useState<ScheduledTask[]>([])
  const [loading, setLoading] = useState(true)
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ScheduledTask | null>(null)
  const [editTaskOpen, setEditTaskOpen] = useState(false)

  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    type: 'custom',
    schedule: '',
    command: '',
    enabled: true
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      // Mock data for demonstration
      setTasks([
        {
          id: '1',
          name: 'Daily Database Backup',
          description: 'Automated daily backup of all customer databases',
          type: 'backup',
          schedule: '0 2 * * *', // Daily at 2 AM
          enabled: true,
          lastRun: '2025-01-11T02:00:00Z',
          nextRun: '2025-01-12T02:00:00Z',
          status: 'success',
          runCount: 365,
          avgDuration: 1800, // 30 minutes
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Weekly Performance Report',
          description: 'Generate and send weekly performance reports to administrators',
          type: 'report',
          schedule: '0 9 * * 1', // Mondays at 9 AM
          enabled: true,
          lastRun: '2025-01-06T09:00:00Z',
          nextRun: '2025-01-13T09:00:00Z',
          status: 'success',
          runCount: 52,
          avgDuration: 300, // 5 minutes
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Log File Cleanup',
          description: 'Clean up old log files to free up disk space',
          type: 'cleanup',
          schedule: '0 1 * * 0', // Sundays at 1 AM
          enabled: true,
          lastRun: '2025-01-05T01:00:00Z',
          nextRun: '2025-01-12T01:00:00Z',
          status: 'success',
          runCount: 52,
          avgDuration: 120, // 2 minutes
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'SSL Certificate Check',
          description: 'Check all SSL certificates for expiration and send alerts',
          type: 'maintenance',
          schedule: '0 8 * * *', // Daily at 8 AM
          enabled: true,
          lastRun: '2025-01-11T08:00:00Z',
          nextRun: '2025-01-12T08:00:00Z',
          status: 'success',
          runCount: 365,
          avgDuration: 60, // 1 minute
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'Failed Deployment Cleanup',
          description: 'Clean up failed deployment artifacts and temporary files',
          type: 'cleanup',
          schedule: '0 3 * * *', // Daily at 3 AM
          enabled: false,
          lastRun: '2025-01-10T03:00:00Z',
          nextRun: '2025-01-12T03:00:00Z',
          status: 'failed',
          runCount: 180,
          avgDuration: 90,
          createdAt: '2024-07-01T00:00:00Z'
        },
        {
          id: '6',
          name: 'Customer Usage Metrics',
          description: 'Calculate and store customer usage metrics for billing',
          type: 'custom',
          schedule: '0 4 * * *', // Daily at 4 AM
          enabled: true,
          lastRun: '2025-01-11T04:00:00Z',
          nextRun: '2025-01-12T04:00:00Z',
          status: 'running',
          runCount: 365,
          avgDuration: 600, // 10 minutes
          createdAt: '2024-01-01T00:00:00Z'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch scheduled tasks:', error)
      toast.error('Failed to load scheduled tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async () => {
    if (!newTask.name || !newTask.schedule) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const task: ScheduledTask = {
        id: Math.random().toString(36).substr(2, 9),
        name: newTask.name,
        description: newTask.description,
        type: newTask.type as any,
        schedule: newTask.schedule,
        enabled: newTask.enabled,
        nextRun: calculateNextRun(newTask.schedule),
        status: 'idle',
        runCount: 0,
        avgDuration: 0,
        createdAt: new Date().toISOString()
      }

      setTasks([...tasks, task])
      setCreateTaskOpen(false)
      setNewTask({
        name: '',
        description: '',
        type: 'custom',
        schedule: '',
        command: '',
        enabled: true
      })
      toast.success('Scheduled task created successfully')
    } catch (error) {
      toast.error('Failed to create scheduled task')
    }
  }

  const handleToggleTask = async (taskId: string) => {
    try {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, enabled: !task.enabled }
          : task
      ))
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleRunTask = async (taskId: string) => {
    try {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'running' as any }
          : task
      ))
      toast.success('Task started successfully')
      
      // Simulate task completion
      setTimeout(() => {
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                status: 'success' as any,
                lastRun: new Date().toISOString(),
                runCount: task.runCount + 1
              }
            : task
        ))
      }, 3000)
    } catch (error) {
      toast.error('Failed to run task')
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(tasks.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const calculateNextRun = (cronExpression: string): string => {
    // Simple calculation - in production, use a proper cron parser
    const now = new Date()
    const next = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Add 1 day
    return next.toISOString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-gray-500'
      case 'running': return 'bg-blue-500'
      case 'success': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Clock className="h-4 w-4 text-gray-500" />
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'backup': return <Database className="h-4 w-4" />
      case 'cleanup': return <RefreshCw className="h-4 w-4" />
      case 'report': return <Mail className="h-4 w-4" />
      case 'maintenance': return <Settings className="h-4 w-4" />
      case 'notification': return <Mail className="h-4 w-4" />
      case 'custom': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatDuration = (seconds: number) => {
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

  return (
    <AdminLayout title="Scheduled Tasks" subtitle="Manage automated tasks and job scheduling">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">Configured tasks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">Tasks enabled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter(t => t.status === 'running').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently executing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((tasks.filter(t => t.status === 'success').length / tasks.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Last execution</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Tasks</CardTitle>
            <CardDescription>Automated tasks and their execution schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading scheduled tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No scheduled tasks configured
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={task.enabled}
                        onCheckedChange={() => handleToggleTask(task.id)}
                      />
                      <div className="flex items-center gap-3">
                        {getTypeIcon(task.type)}
                        <div>
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.description}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-mono">{task.schedule}</span>
                            • Runs: {task.runCount}
                            • Avg: {formatDuration(task.avgDuration)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(task.status)}
                          <Badge className={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Next: {formatTimestamp(task.nextRun)}
                        </div>
                        {task.lastRun && (
                          <div className="text-xs text-muted-foreground">
                            Last: {formatTimestamp(task.lastRun)}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only">Task actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRunTask(task.id)}
                            disabled={task.status === 'running'}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Run Now
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTask(task)
                              setEditTaskOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteTask(task.id)}
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

        {/* Create Task Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Scheduled Task</DialogTitle>
            <DialogDescription>
              Configure a new automated task to run on a schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name *</Label>
              <Input
                id="taskName"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                placeholder="Daily backup task"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskDescription">Description</Label>
              <Textarea
                id="taskDescription"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Automated backup of all customer data"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backup">Backup</SelectItem>
                    <SelectItem value="cleanup">Cleanup</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule (Cron) *</Label>
                <Input
                  id="schedule"
                  value={newTask.schedule}
                  onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
                  placeholder="0 2 * * *"
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="command">Command/Script</Label>
              <Textarea
                id="command"
                value={newTask.command}
                onChange={(e) => setNewTask({ ...newTask, command: e.target.value })}
                placeholder="Enter the command or script to execute"
                rows={3}
                className="font-mono"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="enabled">Enable Task</Label>
              <Switch
                id="enabled"
                checked={newTask.enabled}
                onCheckedChange={(checked) => setNewTask({ ...newTask, enabled: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </AdminLayout>
  )
}