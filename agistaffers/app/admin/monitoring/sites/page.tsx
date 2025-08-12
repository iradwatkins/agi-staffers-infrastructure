'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { 
  Search,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Eye,
  MoreVertical,
  Activity,
  Clock,
  Zap,
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

interface SiteMonitoring {
  id: string
  name: string
  url: string
  customerName: string
  status: 'online' | 'offline' | 'degraded' | 'maintenance'
  uptime: number
  responseTime: number
  lastCheck: string
  sslStatus: 'valid' | 'expired' | 'warning' | 'none'
  sslExpiry?: string
  cdnEnabled: boolean
  monitoring: boolean
}

export default function SitesMonitoringPage() {
  const [sites, setSites] = useState<SiteMonitoring[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchSites()
  }, [])

  const fetchSites = async () => {
    try {
      // Mock data for demonstration
      setSites([
        {
          id: '1',
          name: 'Tech Startup Main Site',
          url: 'https://techstartup.com',
          customerName: 'Tech Startup Inc',
          status: 'online',
          uptime: 99.9,
          responseTime: 127,
          lastCheck: '2025-01-11T12:00:00Z',
          sslStatus: 'valid',
          sslExpiry: '2025-06-15',
          cdnEnabled: true,
          monitoring: true
        },
        {
          id: '2',
          name: 'Acme Corporate Portal',
          url: 'https://portal.acmecorp.com',
          customerName: 'Acme Corporation',
          status: 'online',
          uptime: 99.8,
          responseTime: 89,
          lastCheck: '2025-01-11T12:00:00Z',
          sslStatus: 'valid',
          sslExpiry: '2025-08-20',
          cdnEnabled: true,
          monitoring: true
        },
        {
          id: '3',
          name: 'Local Restaurant Menu',
          url: 'https://localrestaurant.com',
          customerName: 'Local Restaurant',
          status: 'degraded',
          uptime: 97.2,
          responseTime: 2340,
          lastCheck: '2025-01-11T12:00:00Z',
          sslStatus: 'warning',
          sslExpiry: '2025-01-25',
          cdnEnabled: false,
          monitoring: true
        },
        {
          id: '4',
          name: 'Design Portfolio',
          url: 'https://designstudio.com',
          customerName: 'Design Studio LLC',
          status: 'offline',
          uptime: 85.4,
          responseTime: 0,
          lastCheck: '2025-01-11T12:00:00Z',
          sslStatus: 'expired',
          sslExpiry: '2024-12-15',
          cdnEnabled: true,
          monitoring: true
        },
        {
          id: '5',
          name: 'Real Estate Listings',
          url: 'https://wilsonrealty.com',
          customerName: 'Wilson Real Estate',
          status: 'maintenance',
          uptime: 99.5,
          responseTime: 0,
          lastCheck: '2025-01-11T12:00:00Z',
          sslStatus: 'valid',
          sslExpiry: '2025-04-10',
          cdnEnabled: true,
          monitoring: false
        }
      ])
    } catch (error) {
      console.error('Failed to fetch sites:', error)
      toast.error('Failed to load site monitoring data')
    } finally {
      setLoading(false)
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         site.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggleMonitoring = async (siteId: string) => {
    try {
      setSites(sites.map(site => 
        site.id === siteId 
          ? { ...site, monitoring: !site.monitoring }
          : site
      ))
      toast.success('Monitoring settings updated')
    } catch (error) {
      toast.error('Failed to update monitoring settings')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'offline': return 'bg-red-500'
      case 'degraded': return 'bg-yellow-500'
      case 'maintenance': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'maintenance': return <Clock className="h-4 w-4 text-blue-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSSLStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'expired': return 'text-red-600 bg-red-50'
      case 'none': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
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
    <AdminLayout title="Site Monitoring" subtitle="Monitor website uptime, performance, and SSL certificates">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sites.length}</div>
              <p className="text-xs text-muted-foreground">Under monitoring</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Online</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {sites.filter(s => s.status === 'online').length}
              </div>
              <p className="text-xs text-muted-foreground">Sites operational</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {sites.filter(s => s.status === 'offline' || s.status === 'degraded').length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(sites.filter(s => s.responseTime > 0).reduce((sum, s) => sum + s.responseTime, 0) / 
                          sites.filter(s => s.responseTime > 0).length || 0)}ms
              </div>
              <p className="text-xs text-muted-foreground">Across all sites</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter monitored sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="degraded">Degraded</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sites Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monitored Sites</CardTitle>
            <CardDescription>
              {filteredSites.length} site{filteredSites.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading sites...</div>
            ) : filteredSites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No sites found matching your criteria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>SSL Status</TableHead>
                    <TableHead>CDN</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {site.customerName}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {site.url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(site.status)}
                          <Badge className={getStatusColor(site.status)}>
                            {site.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{site.uptime}%</div>
                        <div className="text-xs text-muted-foreground">Last 30 days</div>
                      </TableCell>
                      <TableCell>
                        {site.responseTime > 0 ? (
                          <div className="font-medium">{site.responseTime}ms</div>
                        ) : (
                          <div className="text-muted-foreground">-</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSSLStatusColor(site.sslStatus)}>
                          <Shield className="mr-1 h-3 w-3" />
                          {site.sslStatus}
                        </Badge>
                        {site.sslExpiry && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Expires {new Date(site.sslExpiry).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {site.cdnEnabled ? (
                          <Badge variant="outline" className="text-green-600">Enabled</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-600">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatTimestamp(site.lastCheck)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Check Now
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleMonitoring(site.id)}
                            >
                              {site.monitoring ? 'Disable' : 'Enable'} Monitoring
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
      </div>
    </AdminLayout>
  )
}