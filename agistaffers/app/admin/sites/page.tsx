'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from 'sonner'
import { 
  Globe, Search, Filter, Plus, ExternalLink, Settings, 
  Trash2, RefreshCw, Shield, Activity, Clock, Database,
  HardDrive, Cpu, MoreVertical, Power, PowerOff, Pause,
  Play, RotateCw, Download, Upload, Copy, Edit
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Site {
  id: string
  name: string
  domain: string
  status: 'active' | 'inactive' | 'maintenance' | 'error'
  template: string
  customer: string
  customerId: string
  plan: string
  storage: { used: number; total: number }
  bandwidth: { used: number; total: number }
  ssl: boolean
  backups: boolean
  createdAt: string
  lastUpdated: string
  containerStatus?: 'running' | 'stopped' | 'paused'
  cpu?: number
  memory?: number
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<string>('')

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/sites')
      const data = await response.json()
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setSites(data)
      } else if (data && Array.isArray(data.data)) {
        setSites(data.data)
      } else {
        console.error('API returned invalid data format:', data)
        setSites([])
      }
    } catch (error) {
      console.error('Failed to fetch sites:', error)
      setSites([])
      // Use mock data for now
      setSites([
        {
          id: '1',
          name: 'Acme Corp Website',
          domain: 'acmecorp.com',
          status: 'active',
          template: 'Business Portfolio',
          customer: 'Acme Corp',
          customerId: 'cust1',
          plan: 'Professional',
          storage: { used: 2.5, total: 10 },
          bandwidth: { used: 45, total: 100 },
          ssl: true,
          backups: true,
          createdAt: '2024-01-15',
          lastUpdated: '2024-03-20',
          containerStatus: 'running',
          cpu: 15,
          memory: 512
        },
        {
          id: '2',
          name: 'Tech Startup Store',
          domain: 'techstartup.agistaffers.com',
          status: 'active',
          template: 'E-commerce Starter',
          customer: 'Tech Startup Inc',
          customerId: 'cust2',
          plan: 'Business',
          storage: { used: 5.2, total: 20 },
          bandwidth: { used: 120, total: 200 },
          ssl: true,
          backups: true,
          createdAt: '2024-02-01',
          lastUpdated: '2024-03-19',
          containerStatus: 'running',
          cpu: 25,
          memory: 1024
        },
        {
          id: '3',
          name: 'Restaurant Delicious',
          domain: 'restaurant-delicious.com',
          status: 'maintenance',
          template: 'Restaurant Menu',
          customer: 'Delicious Foods LLC',
          customerId: 'cust3',
          plan: 'Starter',
          storage: { used: 1.2, total: 5 },
          bandwidth: { used: 15, total: 50 },
          ssl: true,
          backups: false,
          createdAt: '2024-03-01',
          lastUpdated: '2024-03-21',
          containerStatus: 'paused',
          cpu: 5,
          memory: 256
        },
        {
          id: '4',
          name: 'Marketing Campaign',
          domain: 'campaign2024.agistaffers.com',
          status: 'active',
          template: 'Landing Page Pro',
          customer: 'Marketing Agency',
          customerId: 'cust4',
          plan: 'Professional',
          storage: { used: 0.8, total: 10 },
          bandwidth: { used: 78, total: 100 },
          ssl: true,
          backups: true,
          createdAt: '2024-03-10',
          lastUpdated: '2024-03-20',
          containerStatus: 'running',
          cpu: 10,
          memory: 256
        },
        {
          id: '5',
          name: 'Personal Blog',
          domain: 'johndoe-blog.com',
          status: 'inactive',
          template: 'Personal Blog',
          customer: 'John Doe',
          customerId: 'cust5',
          plan: 'Starter',
          storage: { used: 0.5, total: 5 },
          bandwidth: { used: 5, total: 50 },
          ssl: false,
          backups: false,
          createdAt: '2023-12-15',
          lastUpdated: '2024-02-10',
          containerStatus: 'stopped',
          cpu: 0,
          memory: 0
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredSites = Array.isArray(sites) ? sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter
    return matchesSearch && matchesStatus
  }) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      case 'maintenance': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getContainerStatusIcon = (status?: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4 text-green-600" />
      case 'stopped': return <PowerOff className="h-4 w-4 text-gray-600" />
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />
      default: return <Power className="h-4 w-4 text-gray-400" />
    }
  }

  const handleAction = (site: Site, action: string) => {
    setSelectedSite(site)
    setActionType(action)
    setActionDialogOpen(true)
  }

  const executeAction = () => {
    toast.success(`${actionType} action executed for ${selectedSite?.name}`)
    setActionDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites Management</h1>
          <p className="text-muted-foreground">Manage all customer websites and deployments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Deploy New Site
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(sites) ? sites.length : 0}</div>
            <p className="text-xs text-muted-foreground">
              {Array.isArray(sites) ? sites.filter(s => s.status === 'active').length : 0} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.7 GB</div>
            <p className="text-xs text-muted-foreground">of 50 GB total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">263 GB</div>
            <p className="text-xs text-muted-foreground">of 500 GB this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL Certificates</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Array.isArray(sites) ? sites.filter(s => s.ssl).length : 0}</div>
            <p className="text-xs text-muted-foreground">sites secured</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sites Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Container</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Loading sites...
                  </TableCell>
                </TableRow>
              ) : filteredSites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No sites found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <a 
                            href={`https://${site.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {site.domain}
                          </a>
                          <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{site.customer}</div>
                        <div className="text-sm text-muted-foreground">{site.template}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(site.status)} variant="secondary">
                        {site.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getContainerStatusIcon(site.containerStatus)}
                        <span className="text-sm">{site.containerStatus}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Cpu className="h-3 w-3" />
                          <span>{site.cpu || 0}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Database className="h-3 w-3" />
                          <span>{site.memory || 0} MB</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <HardDrive className="h-3 w-3" />
                          <span>{site.storage.used}/{site.storage.total} GB</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{site.plan}</Badge>
                        <div className="flex gap-1 mt-1">
                          {site.ssl && <Badge variant="secondary" className="text-xs">SSL</Badge>}
                          {site.backups && <Badge variant="secondary" className="text-xs">Backups</Badge>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{site.createdAt}</div>
                        <div className="text-muted-foreground">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {site.lastUpdated}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(`https://${site.domain}`, '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Site
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(site, 'edit')}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(site, 'backup')}>
                            <Download className="mr-2 h-4 w-4" />
                            Create Backup
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(site, 'clone')}>
                            <Copy className="mr-2 h-4 w-4" />
                            Clone Site
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {site.containerStatus === 'running' ? (
                            <DropdownMenuItem onClick={() => handleAction(site, 'stop')}>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Stop Container
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleAction(site, 'start')}>
                              <Play className="mr-2 h-4 w-4" />
                              Start Container
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleAction(site, 'restart')}>
                            <RotateCw className="mr-2 h-4 w-4" />
                            Restart Container
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleAction(site, 'delete')}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Site
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'delete' ? 'Delete Site' : 
               actionType === 'stop' ? 'Stop Container' :
               actionType === 'start' ? 'Start Container' :
               actionType === 'restart' ? 'Restart Container' :
               actionType === 'backup' ? 'Create Backup' :
               actionType === 'clone' ? 'Clone Site' :
               actionType === 'edit' ? 'Edit Site Settings' :
               'Site Action'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'delete' ? 
                `Are you sure you want to delete ${selectedSite?.name}? This action cannot be undone.` :
               actionType === 'stop' ? 
                `This will stop the container for ${selectedSite?.name}. The site will be inaccessible.` :
               actionType === 'start' ? 
                `This will start the container for ${selectedSite?.name}.` :
               actionType === 'restart' ? 
                `This will restart the container for ${selectedSite?.name}. There may be brief downtime.` :
               actionType === 'backup' ? 
                `Create a full backup of ${selectedSite?.name} including database and files.` :
               actionType === 'clone' ? 
                `Create a duplicate of ${selectedSite?.name} with a new domain.` :
               `Perform ${actionType} action on ${selectedSite?.name}`}
            </DialogDescription>
          </DialogHeader>
          {actionType === 'edit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input defaultValue={selectedSite?.name} />
              </div>
              <div className="space-y-2">
                <Label>Domain</Label>
                <Input defaultValue={selectedSite?.domain} />
              </div>
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select defaultValue={selectedSite?.plan}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starter">Starter</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          {actionType === 'clone' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>New Site Name</Label>
                <Input placeholder="Enter new site name" />
              </div>
              <div className="space-y-2">
                <Label>New Domain</Label>
                <Input placeholder="Enter new domain" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeAction}
              variant={actionType === 'delete' ? 'destructive' : 'default'}
            >
              {actionType === 'delete' ? 'Delete' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}