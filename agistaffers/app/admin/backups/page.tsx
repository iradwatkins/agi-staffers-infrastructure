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
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar,
  Clock,
  Database,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Play,
  Pause,
  Settings,
  Archive,
  Trash2,
  FileText,
  Server,
  Shield
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'database' | 'files'
  status: 'completed' | 'in-progress' | 'failed' | 'scheduled'
  size: number
  sizeCompressed: number
  duration: number
  createdAt: string
  expiresAt?: string
  location: string
  customerName?: string
  siteName?: string
  checksum: string
}

interface BackupSchedule {
  id: string
  name: string
  description: string
  type: 'full' | 'incremental' | 'database' | 'files'
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  retention: number
  enabled: boolean
  lastRun?: string
  nextRun: string
  targets: string[]
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [schedules, setSchedules] = useState<BackupSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [createBackupOpen, setCreateBackupOpen] = useState(false)
  const [createScheduleOpen, setCreateScheduleOpen] = useState(false)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  const [currentBackupProgress, setCurrentBackupProgress] = useState(0)
  const [isBackupRunning, setIsBackupRunning] = useState(false)

  const [newBackup, setNewBackup] = useState({
    name: '',
    type: 'full',
    targets: [],
    compression: true
  })

  const [newSchedule, setNewSchedule] = useState({
    name: '',
    description: '',
    type: 'full',
    frequency: 'daily',
    time: '03:00',
    retention: 30,
    targets: []
  })

  useEffect(() => {
    fetchBackups()
    fetchSchedules()
  }, [])

  const fetchBackups = async () => {
    try {
      // Mock data for demonstration
      setBackups([
        {
          id: '1',
          name: 'Daily Full Backup - 2025-01-11',
          type: 'full',
          status: 'completed',
          size: 2147483648, // 2GB
          sizeCompressed: 858993459, // ~800MB
          duration: 1845, // 30min 45sec
          createdAt: '2025-01-11T03:00:00Z',
          expiresAt: '2025-02-10T03:00:00Z',
          location: 's3://backups/full/2025-01-11-030000.tar.gz',
          customerName: 'Tech Startup Inc',
          siteName: 'main-website',
          checksum: 'sha256:abc123def456...'
        },
        {
          id: '2',
          name: 'Database Backup - PostgreSQL',
          type: 'database',
          status: 'completed',
          size: 524288000, // 500MB
          sizeCompressed: 104857600, // ~100MB
          duration: 420, // 7min
          createdAt: '2025-01-11T02:00:00Z',
          expiresAt: '2025-02-10T02:00:00Z',
          location: 's3://backups/db/postgres-2025-01-11-020000.sql.gz',
          checksum: 'sha256:def456abc123...'
        },
        {
          id: '3',
          name: 'Incremental Backup - Files',
          type: 'incremental',
          status: 'completed',
          size: 268435456, // 256MB
          sizeCompressed: 134217728, // ~128MB
          duration: 180, // 3min
          createdAt: '2025-01-11T12:00:00Z',
          location: 's3://backups/incremental/2025-01-11-120000.tar.gz',
          customerName: 'Acme Corporation',
          siteName: 'corporate-site',
          checksum: 'sha256:ghi789jkl012...'
        },
        {
          id: '4',
          name: 'Emergency Backup - Pre-deployment',
          type: 'full',
          status: 'in-progress',
          size: 0,
          sizeCompressed: 0,
          duration: 0,
          createdAt: '2025-01-11T14:30:00Z',
          location: 's3://backups/emergency/2025-01-11-143000.tar.gz',
          customerName: 'Design Studio LLC',
          siteName: 'portfolio-site',
          checksum: ''
        },
        {
          id: '5',
          name: 'Failed Backup - Network Error',
          type: 'database',
          status: 'failed',
          size: 0,
          sizeCompressed: 0,
          duration: 0,
          createdAt: '2025-01-11T01:00:00Z',
          location: '',
          checksum: ''
        }
      ])
    } catch (error) {
      console.error('Failed to fetch backups:', error)
      toast.error('Failed to load backups')
    }
  }

  const fetchSchedules = async () => {
    try {
      // Mock data for demonstration
      setSchedules([
        {
          id: '1',
          name: 'Daily Full System Backup',
          description: 'Complete system backup including all customer data',
          type: 'full',
          frequency: 'daily',
          time: '03:00',
          retention: 30,
          enabled: true,
          lastRun: '2025-01-11T03:00:00Z',
          nextRun: '2025-01-12T03:00:00Z',
          targets: ['all-customers', 'system-config', 'databases']
        },
        {
          id: '2',
          name: 'Database Backup',
          description: 'PostgreSQL database backup',
          type: 'database',
          frequency: 'daily',
          time: '02:00',
          retention: 60,
          enabled: true,
          lastRun: '2025-01-11T02:00:00Z',
          nextRun: '2025-01-12T02:00:00Z',
          targets: ['postgresql']
        },
        {
          id: '3',
          name: 'Incremental File Backup',
          description: 'Incremental backup of changed files',
          type: 'incremental',
          frequency: 'daily',
          time: '12:00',
          retention: 14,
          enabled: true,
          lastRun: '2025-01-11T12:00:00Z',
          nextRun: '2025-01-12T12:00:00Z',
          targets: ['customer-files']
        },
        {
          id: '4',
          name: 'Weekly Archive Backup',
          description: 'Weekly comprehensive backup for long-term storage',
          type: 'full',
          frequency: 'weekly',
          time: '01:00',
          retention: 365,
          enabled: false,
          nextRun: '2025-01-19T01:00:00Z',
          targets: ['all-systems']
        }
      ])
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
      toast.error('Failed to load backup schedules')
    } finally {
      setLoading(false)
    }
  }

  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (backup.customerName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (backup.siteName?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === 'all' || backup.type === typeFilter
    const matchesStatus = statusFilter === 'all' || backup.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateBackup = async () => {
    if (!newBackup.name || newBackup.targets.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsBackupRunning(true)
    setCurrentBackupProgress(0)
    
    try {
      const backup: Backup = {
        id: Math.random().toString(36).substr(2, 9),
        name: newBackup.name,
        type: newBackup.type as any,
        status: 'in-progress',
        size: 0,
        sizeCompressed: 0,
        duration: 0,
        createdAt: new Date().toISOString(),
        location: `s3://backups/${newBackup.type}/${Date.now()}.tar.gz`,
        checksum: ''
      }

      setBackups([backup, ...backups])
      setCreateBackupOpen(false)
      
      // Simulate backup progress
      const progressInterval = setInterval(() => {
        setCurrentBackupProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            setIsBackupRunning(false)
            
            // Update backup status to completed
            setBackups(prevBackups => prevBackups.map(b => 
              b.id === backup.id 
                ? { 
                    ...b, 
                    status: 'completed', 
                    size: 1073741824, // 1GB
                    sizeCompressed: 536870912, // 512MB
                    duration: 900, // 15min
                    checksum: 'sha256:' + Math.random().toString(36).substr(2, 16)
                  }
                : b
            ))
            
            toast.success('Backup completed successfully')
            return 100
          }
          return prev + Math.random() * 10
        })
      }, 500)

      setNewBackup({
        name: '',
        type: 'full',
        targets: [],
        compression: true
      })
    } catch (error) {
      setIsBackupRunning(false)
      toast.error('Failed to create backup')
    }
  }

  const handleCreateSchedule = async () => {
    if (!newSchedule.name || newSchedule.targets.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const schedule: BackupSchedule = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSchedule.name,
        description: newSchedule.description,
        type: newSchedule.type as any,
        frequency: newSchedule.frequency as any,
        time: newSchedule.time,
        retention: newSchedule.retention,
        enabled: true,
        nextRun: getNextRunTime(newSchedule.frequency, newSchedule.time),
        targets: newSchedule.targets
      }

      setSchedules([...schedules, schedule])
      setCreateScheduleOpen(false)
      setNewSchedule({
        name: '',
        description: '',
        type: 'full',
        frequency: 'daily',
        time: '03:00',
        retention: 30,
        targets: []
      })
      toast.success('Backup schedule created successfully')
    } catch (error) {
      toast.error('Failed to create backup schedule')
    }
  }

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return

    try {
      toast.success(`Restore initiated for backup: ${selectedBackup.name}`)
      setRestoreDialogOpen(false)
      setSelectedBackup(null)
    } catch (error) {
      toast.error('Failed to initiate restore')
    }
  }

  const handleDeleteBackup = async (backupId: string) => {
    try {
      setBackups(backups.filter(b => b.id !== backupId))
      toast.success('Backup deleted successfully')
    } catch (error) {
      toast.error('Failed to delete backup')
    }
  }

  const handleToggleSchedule = async (scheduleId: string) => {
    try {
      setSchedules(schedules.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, enabled: !schedule.enabled }
          : schedule
      ))
      toast.success('Schedule updated')
    } catch (error) {
      toast.error('Failed to update schedule')
    }
  }

  const getNextRunTime = (frequency: string, time: string) => {
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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '0s'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'failed': return 'bg-red-500'
      case 'scheduled': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'scheduled': return <Calendar className="h-4 w-4 text-gray-500" />
      default: return <Archive className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full': return <HardDrive className="h-4 w-4" />
      case 'incremental': return <RefreshCw className="h-4 w-4" />
      case 'database': return <Database className="h-4 w-4" />
      case 'files': return <FileText className="h-4 w-4" />
      default: return <Archive className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout title="Backup Management" subtitle="Manage system backups and recovery operations">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end gap-2">
          <Dialog open={createScheduleOpen} onOpenChange={setCreateScheduleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                New Schedule
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={createBackupOpen} onOpenChange={setCreateBackupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Backup
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backups.length}</div>
            <p className="text-xs text-muted-foreground">
              {formatSize(backups.reduce((total, b) => total + b.size, 0))} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {backups.filter(b => b.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((backups.filter(b => b.status === 'completed').length / backups.length) * 100)}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedules.filter(s => s.enabled).length}/{schedules.length}
            </div>
            <p className="text-xs text-muted-foreground">Automated backups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSize(backups.reduce((total, b) => total + b.sizeCompressed, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Compressed size</p>
          </CardContent>
        </Card>
      </div>

      {/* Backup Progress */}
      {isBackupRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Backup In Progress
            </CardTitle>
            <CardDescription>
              Creating backup... {Math.round(currentBackupProgress)}% complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={currentBackupProgress} className="w-full" />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backups">Backup History</TabsTrigger>
          <TabsTrigger value="schedules">Backup Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search backups..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="incremental">Incremental</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="files">Files</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Backups Table */}
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>
                {filteredBackups.length} backup{filteredBackups.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading backups...</div>
              ) : filteredBackups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No backups found matching your criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Backup</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBackups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium truncate">{backup.name}</div>
                            {backup.customerName && (
                              <div className="text-sm text-muted-foreground">
                                {backup.customerName} - {backup.siteName}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(backup.type)}
                            <Badge variant="outline" className="capitalize">
                              {backup.type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(backup.status)}
                            <Badge className={getStatusColor(backup.status)}>
                              {backup.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatSize(backup.sizeCompressed)}</div>
                            {backup.size > 0 && (
                              <div className="text-sm text-muted-foreground">
                                {formatSize(backup.size)} raw
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDuration(backup.duration)}</TableCell>
                        <TableCell>{formatTimestamp(backup.createdAt)}</TableCell>
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
                              {backup.status === 'completed' && (
                                <>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedBackup(backup)
                                      setRestoreDialogOpen(true)
                                    }}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    Restore
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteBackup(backup.id)}
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

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup Schedules</CardTitle>
              <CardDescription>Automated backup configurations</CardDescription>
            </CardHeader>
            <CardContent>
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
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="capitalize">{schedule.frequency}</span> at {schedule.time}
                            • Retention: {schedule.retention} days
                            • Targets: {schedule.targets.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Next: {formatTimestamp(schedule.nextRun)}
                      </div>
                      {schedule.lastRun && (
                        <div className="text-sm text-muted-foreground">
                          Last: {formatTimestamp(schedule.lastRun)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Backup Dialog */}
      <Dialog open={createBackupOpen} onOpenChange={setCreateBackupOpen}>
        <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Backup</DialogTitle>
          <DialogDescription>
            Create an immediate backup of your system or specific components
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="backupName">Backup Name *</Label>
            <Input
              id="backupName"
              value={newBackup.name}
              onChange={(e) => setNewBackup({ ...newBackup, name: e.target.value })}
              placeholder="Emergency backup - Pre-deployment"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backupType">Backup Type</Label>
            <Select value={newBackup.type} onValueChange={(value) => setNewBackup({ ...newBackup, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full System Backup</SelectItem>
                <SelectItem value="database">Database Only</SelectItem>
                <SelectItem value="files">Files Only</SelectItem>
                <SelectItem value="incremental">Incremental Backup</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Backup Targets *</Label>
            <div className="grid grid-cols-2 gap-2">
              {['System Config', 'Databases', 'Customer Files', 'Logs'].map((target) => (
                <div key={target} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={target}
                    onChange={(e) => {
                      const targets = e.target.checked 
                        ? [...newBackup.targets, target]
                        : newBackup.targets.filter(t => t !== target)
                      setNewBackup({ ...newBackup, targets })
                    }}
                  />
                  <Label htmlFor={target}>{target}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="compression">Enable Compression</Label>
            <Switch
              id="compression"
              checked={newBackup.compression}
              onCheckedChange={(checked) => setNewBackup({ ...newBackup, compression: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setCreateBackupOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateBackup}>
            <Plus className="mr-2 h-4 w-4" />
            Create Backup
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Schedule Dialog */}
      <Dialog open={createScheduleOpen} onOpenChange={setCreateScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Backup Schedule</DialogTitle>
            <DialogDescription>
              Set up automated backup scheduling
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
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="incremental">Incremental</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="files">Files</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleTime">Time</Label>
                <Input
                  id="scheduleTime"
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention">Retention (days)</Label>
                <Input
                  id="retention"
                  type="number"
                  value={newSchedule.retention}
                  onChange={(e) => setNewSchedule({ ...newSchedule, retention: parseInt(e.target.value) || 30 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Backup Targets *</Label>
              <div className="grid grid-cols-2 gap-2">
                {['System Config', 'Databases', 'Customer Files', 'Logs'].map((target) => (
                  <div key={target} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`schedule-${target}`}
                      onChange={(e) => {
                        const targets = e.target.checked 
                          ? [...newSchedule.targets, target]
                          : newSchedule.targets.filter(t => t !== target)
                        setNewSchedule({ ...newSchedule, targets })
                      }}
                    />
                    <Label htmlFor={`schedule-${target}`}>{target}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule}>
              <Calendar className="mr-2 h-4 w-4" />
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              Are you sure you want to restore this backup? This action may overwrite current data.
            </DialogDescription>
          </DialogHeader>
          {selectedBackup && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="font-medium">{selectedBackup.name}</div>
                <div className="text-sm text-muted-foreground">
                  Size: {formatSize(selectedBackup.size)} • 
                  Created: {formatTimestamp(selectedBackup.createdAt)}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Warning</div>
                    <div className="text-sm text-yellow-700">
                      This operation will overwrite current system data. Make sure you have a recent backup before proceeding.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRestoreBackup}>
              <Upload className="mr-2 h-4 w-4" />
              Restore Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  )
}