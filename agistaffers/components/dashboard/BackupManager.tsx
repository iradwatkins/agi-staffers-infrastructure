'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Server,
  Globe,
  Database,
  HardDrive,
  DownloadCloud,
  Archive,
  Package,
  RefreshCw,
  Check,
  X,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface Backup {
  id: string
  name: string
  type: 'full' | 'website' | 'database' | 'container'
  size: number
  created: string
  status: 'available' | 'creating' | 'failed'
  downloadUrl?: string
}

async function fetchBackups(): Promise<Backup[]> {
  const response = await fetch('/api/backup/list')
  if (!response.ok) {
    throw new Error('Failed to fetch backups')
  }
  return response.json()
}

async function fetchBackupStats() {
  const response = await fetch('/api/backup/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch backup stats')
  }
  return response.json()
}

async function createBackup(type: string) {
  const response = await fetch('/api/backup/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  })
  if (!response.ok) {
    throw new Error('Failed to create backup')
  }
  return response.json()
}

export function BackupManager() {
  const [activeTab, setActiveTab] = useState('all')
  const queryClient = useQueryClient()

  const { data: backups = [], isLoading, refetch } = useQuery({
    queryKey: ['backups'],
    queryFn: fetchBackups,
    refetchInterval: 30000,
  })

  const { data: backupStats } = useQuery({
    queryKey: ['backup-stats'],
    queryFn: fetchBackupStats,
    refetchInterval: 60000,
  })

  const createBackupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
    },
  })

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    if (gb >= 1) return `${gb.toFixed(2)} GB`
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'full':
        return Server
      case 'website':
        return Globe
      case 'database':
        return Database
      case 'container':
        return HardDrive
      default:
        return Archive
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'text-blue-600 dark:text-blue-400'
      case 'website':
        return 'text-green-600 dark:text-green-400'
      case 'database':
        return 'text-purple-600 dark:text-purple-400'
      case 'container':
        return 'text-orange-600 dark:text-orange-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'bg-blue-100 dark:bg-blue-900'
      case 'website':
        return 'bg-green-100 dark:bg-green-900'
      case 'database':
        return 'bg-purple-100 dark:bg-purple-900'
      case 'container':
        return 'bg-orange-100 dark:bg-orange-900'
      default:
        return 'bg-gray-100 dark:bg-gray-900'
    }
  }

  const filteredBackups = activeTab === 'all' 
    ? backups 
    : backups.filter(b => b.type === activeTab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Backup & Recovery Center</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-muted-foreground">Manage and download your server backups</p>
          {backupStats && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">
                  {backupStats.totalBackups} Total
                </Badge>
              </div>
              {backupStats.nextScheduledBackup && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Next: {new Date(backupStats.nextScheduledBackup).toLocaleTimeString()}</span>
                </div>
              )}
              {backupStats.recentFailures > 0 && (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {backupStats.recentFailures} Failed
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Full Server Backup */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${getBgColor('full')} rounded-lg`}>
                <Server className={`h-6 w-6 ${getIconColor('full')}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">Full Backup</CardTitle>
                <CardDescription>Complete server</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~35GB</div>
            <p className="text-xs text-muted-foreground mb-4">Compressed size</p>
            <Button 
              className="w-full" 
              onClick={() => createBackupMutation.mutate('full')}
              disabled={createBackupMutation.isPending}
            >
              <DownloadCloud className="mr-2 h-4 w-4" />
              Create & Download
            </Button>
          </CardContent>
        </Card>

        {/* Website Backup */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${getBgColor('website')} rounded-lg`}>
                <Globe className={`h-6 w-6 ${getIconColor('website')}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">Websites</CardTitle>
                <CardDescription>Site files</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Sites</div>
            <p className="text-xs text-muted-foreground mb-4">Available</p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => createBackupMutation.mutate('website')}
              disabled={createBackupMutation.isPending}
            >
              <Archive className="mr-2 h-4 w-4" />
              Backup Sites
            </Button>
          </CardContent>
        </Card>

        {/* Database Backup */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${getBgColor('database')} rounded-lg`}>
                <Database className={`h-6 w-6 ${getIconColor('database')}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">Database</CardTitle>
                <CardDescription>PostgreSQL</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~500MB</div>
            <p className="text-xs text-muted-foreground mb-4">All databases</p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => createBackupMutation.mutate('database')}
              disabled={createBackupMutation.isPending}
            >
              <Package className="mr-2 h-4 w-4" />
              Export DB
            </Button>
          </CardContent>
        </Card>

        {/* Container Backup */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-4">
              <div className={`p-3 ${getBgColor('container')} rounded-lg`}>
                <HardDrive className={`h-6 w-6 ${getIconColor('container')}`} />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base">Containers</CardTitle>
                <CardDescription>Docker configs</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19 Active</div>
            <p className="text-xs text-muted-foreground mb-4">Containers</p>
            <Button 
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => createBackupMutation.mutate('container')}
              disabled={createBackupMutation.isPending}
            >
              <Package className="mr-2 h-4 w-4" />
              Backup Configs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Backup History</CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Backups</TabsTrigger>
              <TabsTrigger value="full">Full</TabsTrigger>
              <TabsTrigger value="website">Websites</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="container">Containers</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading backups...
                </div>
              ) : filteredBackups.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No backups found</p>
                  <p className="text-sm text-muted-foreground">Create your first backup using the quick actions above</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredBackups.map((backup) => {
                    const Icon = getIcon(backup.type)
                    return (
                      <div
                        key={backup.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 ${getBgColor(backup.type)} rounded-lg`}>
                            <Icon className={`h-5 w-5 ${getIconColor(backup.type)}`} />
                          </div>
                          <div>
                            <p className="font-medium">{backup.name}</p>
                            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                              <span>{formatBytes(backup.size)}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(backup.created).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {backup.status === 'available' ? (
                            <>
                              <Badge variant="outline" className="text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Available
                              </Badge>
                              <Button size="sm" variant="outline">
                                <DownloadCloud className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </>
                          ) : backup.status === 'creating' ? (
                            <Badge variant="outline" className="text-blue-600">
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Creating...
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600">
                              <X className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}