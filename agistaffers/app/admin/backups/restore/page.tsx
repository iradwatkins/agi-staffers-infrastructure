'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/safe-dialog'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { 
  Upload,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  FileText,
  Archive,
  Search,
  Filter
} from 'lucide-react'

interface BackupFile {
  id: string
  name: string
  type: 'full' | 'incremental' | 'database' | 'files'
  size: number
  sizeCompressed: number
  createdAt: string
  customerName?: string
  siteName?: string
  location: string
  checksum: string
  status: 'available' | 'archived' | 'corrupted'
}

interface RestoreJob {
  id: string
  backupId: string
  backupName: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  startedAt: string
  completedAt?: string
  restorePoint: string
  selectedComponents: string[]
}

export default function BackupRestorePage() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [restoreJobs, setRestoreJobs] = useState<RestoreJob[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null)
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [restoreOptions, setRestoreOptions] = useState({
    restorePoint: 'original',
    components: [] as string[],
    overwriteExisting: false
  })
  const [currentRestore, setCurrentRestore] = useState<RestoreJob | null>(null)

  useEffect(() => {
    fetchBackups()
    fetchRestoreJobs()
  }, [])

  const fetchBackups = async () => {
    try {
      // Mock data for demonstration
      setBackups([
        {
          id: '1',
          name: 'Daily Full Backup - 2025-01-11',
          type: 'full',
          size: 2147483648, // 2GB
          sizeCompressed: 858993459, // ~800MB
          createdAt: '2025-01-11T03:00:00Z',
          customerName: 'Tech Startup Inc',
          siteName: 'main-website',
          location: 's3://backups/full/2025-01-11-030000.tar.gz',
          checksum: 'sha256:abc123def456...',
          status: 'available'
        },
        {
          id: '2',
          name: 'Database Backup - PostgreSQL',
          type: 'database',
          size: 524288000, // 500MB
          sizeCompressed: 104857600, // ~100MB
          createdAt: '2025-01-11T02:00:00Z',
          location: 's3://backups/db/postgres-2025-01-11-020000.sql.gz',
          checksum: 'sha256:def456abc123...',
          status: 'available'
        },
        {
          id: '3',
          name: 'Weekly Archive - 2025-01-05',
          type: 'full',
          size: 3221225472, // 3GB
          sizeCompressed: 1073741824, // 1GB
          createdAt: '2025-01-05T01:00:00Z',
          customerName: 'All Customers',
          location: 's3://backups/archive/2025-01-05-010000.tar.gz',
          checksum: 'sha256:ghi789jkl012...',
          status: 'archived'
        },
        {
          id: '4',
          name: 'Pre-deployment Backup',
          type: 'full',
          size: 1610612736, // 1.5GB
          sizeCompressed: 644245094, // ~600MB
          createdAt: '2025-01-10T16:30:00Z',
          customerName: 'Acme Corporation',
          siteName: 'corporate-site',
          location: 's3://backups/deploy/2025-01-10-163000.tar.gz',
          checksum: 'sha256:mno345pqr678...',
          status: 'available'
        },
        {
          id: '5',
          name: 'Customer Files Backup',
          type: 'files',
          size: 805306368, // 768MB
          sizeCompressed: 322122547, // ~300MB
          createdAt: '2025-01-09T12:00:00Z',
          customerName: 'Design Studio LLC',
          siteName: 'portfolio-site',
          location: 's3://backups/files/2025-01-09-120000.tar.gz',
          checksum: 'sha256:stu901vwx234...',
          status: 'available'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch backups:', error)
      toast.error('Failed to load backup files')
    }
  }

  const fetchRestoreJobs = async () => {
    try {
      // Mock data for demonstration
      setRestoreJobs([
        {
          id: '1',
          backupId: '2',
          backupName: 'Database Backup - PostgreSQL',
          status: 'completed',
          progress: 100,
          startedAt: '2025-01-11T10:00:00Z',
          completedAt: '2025-01-11T10:05:00Z',
          restorePoint: 'original',
          selectedComponents: ['database']
        },
        {
          id: '2',
          backupId: '4',
          backupName: 'Pre-deployment Backup',
          status: 'running',
          progress: 65,
          startedAt: '2025-01-11T14:30:00Z',
          restorePoint: 'test-environment',
          selectedComponents: ['files', 'database', 'config']
        }
      ])
    } catch (error) {
      console.error('Failed to fetch restore jobs:', error)
      toast.error('Failed to load restore jobs')
    } finally {
      setLoading(false)
    }
  }

  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (backup.customerName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (backup.siteName?.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = typeFilter === 'all' || backup.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleStartRestore = async () => {
    if (!selectedBackup) return

    if (restoreOptions.components.length === 0) {
      toast.error('Please select at least one component to restore')
      return
    }

    try {
      const restoreJob: RestoreJob = {
        id: Math.random().toString(36).substr(2, 9),
        backupId: selectedBackup.id,
        backupName: selectedBackup.name,
        status: 'running',
        progress: 0,
        startedAt: new Date().toISOString(),
        restorePoint: restoreOptions.restorePoint,
        selectedComponents: restoreOptions.components
      }

      setRestoreJobs([restoreJob, ...restoreJobs])
      setCurrentRestore(restoreJob)
      setRestoreDialogOpen(false)
      setSelectedBackup(null)
      setRestoreOptions({
        restorePoint: 'original',
        components: [],
        overwriteExisting: false
      })
      
      toast.success('Restore process started')

      // Simulate restore progress
      const progressInterval = setInterval(() => {
        setCurrentRestore(prev => {
          if (!prev) return null
          const newProgress = Math.min(prev.progress + Math.random() * 15, 100)
          
          const updatedRestore = { ...prev, progress: newProgress }
          
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            updatedRestore.status = 'completed'
            updatedRestore.completedAt = new Date().toISOString()
            toast.success('Restore completed successfully')
            setCurrentRestore(null)
          }

          // Update restore jobs list
          setRestoreJobs(prevJobs => prevJobs.map(job => 
            job.id === prev.id ? updatedRestore : job
          ))

          return updatedRestore
        })
      }, 1000)

    } catch (error) {
      toast.error('Failed to start restore process')
    }
  }

  const handleToggleComponent = (component: string) => {
    setRestoreOptions(prev => ({
      ...prev,
      components: prev.components.includes(component)
        ? prev.components.filter(c => c !== component)
        : [...prev.components, component]
    }))
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50'
      case 'archived': return 'text-blue-600 bg-blue-50'
      case 'corrupted': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
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

  const getRestoreStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-500'
      case 'running': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
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

  const availableComponents = ['database', 'files', 'config', 'logs', 'uploads']

  return (
    <AdminLayout title="Backup Restore" subtitle="Restore data from backup files">
      <div className="space-y-6">
        {/* Current Restore Progress */}
        {currentRestore && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Restore In Progress
              </CardTitle>
              <CardDescription>
                Restoring {currentRestore.backupName}... {Math.round(currentRestore.progress)}% complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={currentRestore.progress} className="w-full" />
              <div className="mt-2 text-sm text-muted-foreground">
                Components: {currentRestore.selectedComponents.join(', ')}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Available Backups</CardTitle>
            <CardDescription>Select a backup file to restore from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full">Full Backup</SelectItem>
                  <SelectItem value="incremental">Incremental</SelectItem>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="files">Files Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading backups...</div>
            ) : filteredBackups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No backup files found matching your criteria
              </div>
            ) : (
              <div className="space-y-3">
                {filteredBackups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      {getTypeIcon(backup.type)}
                      <div>
                        <div className="font-medium">{backup.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {backup.customerName && `${backup.customerName}${backup.siteName ? ' - ' + backup.siteName : ''}`}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Size: {formatSize(backup.sizeCompressed)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Created: {formatTimestamp(backup.createdAt)}
                          </span>
                          <Badge variant="outline" className={getStatusColor(backup.status)}>
                            {backup.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedBackup(backup)
                          setRestoreDialogOpen(true)
                        }}
                        disabled={backup.status !== 'available'}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Restore
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Restore Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Restore Jobs</CardTitle>
            <CardDescription>History of restore operations</CardDescription>
          </CardHeader>
          <CardContent>
            {restoreJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No restore jobs found
              </div>
            ) : (
              <div className="space-y-3">
                {restoreJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {job.status === 'running' && <RefreshCw className="h-4 w-4 animate-spin" />}
                        {job.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {job.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {job.status === 'pending' && <Clock className="h-4 w-4 text-gray-500" />}
                      </div>
                      <div>
                        <div className="font-medium">{job.backupName}</div>
                        <div className="text-sm text-muted-foreground">
                          Components: {job.selectedComponents.join(', ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started: {formatTimestamp(job.startedAt)}
                          {job.completedAt && ` • Completed: ${formatTimestamp(job.completedAt)}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={getRestoreStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.status === 'running' && (
                          <div className="text-sm mt-1">
                            {Math.round(job.progress)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Restore Configuration Dialog */}
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Restore Backup</DialogTitle>
              <DialogDescription>
                Configure restore options for {selectedBackup?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedBackup && (
              <div className="space-y-6">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="font-medium">{selectedBackup.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Size: {formatSize(selectedBackup.size)} (compressed: {formatSize(selectedBackup.sizeCompressed)})
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {formatTimestamp(selectedBackup.createdAt)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Restore Point</Label>
                  <Select value={restoreOptions.restorePoint} onValueChange={(value) => setRestoreOptions({...restoreOptions, restorePoint: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original Location</SelectItem>
                      <SelectItem value="test-environment">Test Environment</SelectItem>
                      <SelectItem value="staging">Staging Environment</SelectItem>
                      <SelectItem value="custom">Custom Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Components to Restore</Label>
                  <div className="space-y-2">
                    {availableComponents.map((component) => (
                      <div key={component} className="flex items-center space-x-2">
                        <Checkbox
                          id={component}
                          checked={restoreOptions.components.includes(component)}
                          onCheckedChange={() => handleToggleComponent(component)}
                        />
                        <Label htmlFor={component} className="capitalize">
                          {component}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="overwrite"
                    checked={restoreOptions.overwriteExisting}
                    onCheckedChange={(checked) => setRestoreOptions({...restoreOptions, overwriteExisting: !!checked})}
                  />
                  <Label htmlFor="overwrite">
                    Overwrite existing files
                  </Label>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">Warning</div>
                      <div className="text-sm text-yellow-700">
                        This operation will restore data from the selected backup. 
                        {restoreOptions.overwriteExisting && ' Existing files will be overwritten.'}
                        Make sure you have a recent backup before proceeding.
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
              <Button onClick={handleStartRestore}>
                <Upload className="mr-2 h-4 w-4" />
                Start Restore
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}