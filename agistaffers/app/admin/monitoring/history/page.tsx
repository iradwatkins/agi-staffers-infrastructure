'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, DatePickerWithRange } from '@/components/ui/calendar'
import { toast } from 'sonner'
import { 
  Search,
  Calendar as CalendarIcon,
  Download,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Zap,
  Globe,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface MonitoringEvent {
  id: string
  siteName: string
  siteUrl: string
  customerName: string
  eventType: 'uptime_check' | 'ssl_check' | 'performance_test' | 'security_scan'
  status: 'success' | 'warning' | 'error' | 'info'
  message: string
  responseTime?: number
  timestamp: string
  metadata?: Record<string, any>
}

export default function MonitoringHistoryPage() {
  const [events, setEvents] = useState<MonitoringEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    fetchEvents()
  }, [dateRange])

  const fetchEvents = async () => {
    try {
      // Mock data for demonstration
      setEvents([
        {
          id: '1',
          siteName: 'Tech Startup Main Site',
          siteUrl: 'https://techstartup.com',
          customerName: 'Tech Startup Inc',
          eventType: 'uptime_check',
          status: 'success',
          message: 'Site is responding normally',
          responseTime: 127,
          timestamp: '2025-01-11T12:00:00Z',
          metadata: { statusCode: 200, size: 1024576 }
        },
        {
          id: '2',
          siteName: 'Acme Corporate Portal',
          siteUrl: 'https://portal.acmecorp.com',
          customerName: 'Acme Corporation',
          eventType: 'ssl_check',
          status: 'success',
          message: 'SSL certificate is valid',
          timestamp: '2025-01-11T11:30:00Z',
          metadata: { expiresAt: '2025-08-20', issuer: 'Let\'s Encrypt' }
        },
        {
          id: '3',
          siteName: 'Local Restaurant Menu',
          siteUrl: 'https://localrestaurant.com',
          customerName: 'Local Restaurant',
          eventType: 'performance_test',
          status: 'warning',
          message: 'Response time exceeds recommended threshold',
          responseTime: 2340,
          timestamp: '2025-01-11T11:15:00Z',
          metadata: { threshold: 1000, ttfb: 1890 }
        },
        {
          id: '4',
          siteName: 'Design Portfolio',
          siteUrl: 'https://designstudio.com',
          customerName: 'Design Studio LLC',
          eventType: 'uptime_check',
          status: 'error',
          message: 'Site is not responding',
          timestamp: '2025-01-11T11:00:00Z',
          metadata: { error: 'Connection timeout', attempts: 3 }
        },
        {
          id: '5',
          siteName: 'Design Portfolio',
          siteUrl: 'https://designstudio.com',
          customerName: 'Design Studio LLC',
          eventType: 'ssl_check',
          status: 'error',
          message: 'SSL certificate has expired',
          timestamp: '2025-01-11T10:45:00Z',
          metadata: { expiredAt: '2024-12-15', daysExpired: 27 }
        },
        {
          id: '6',
          siteName: 'Real Estate Listings',
          siteUrl: 'https://wilsonrealty.com',
          customerName: 'Wilson Real Estate',
          eventType: 'security_scan',
          status: 'info',
          message: 'Security scan completed successfully',
          timestamp: '2025-01-11T10:30:00Z',
          metadata: { vulnerabilities: 0, score: 'A+' }
        },
        {
          id: '7',
          siteName: 'Tech Startup Main Site',
          siteUrl: 'https://techstartup.com',
          customerName: 'Tech Startup Inc',
          eventType: 'performance_test',
          status: 'success',
          message: 'Performance metrics within acceptable range',
          responseTime: 89,
          timestamp: '2025-01-11T10:15:00Z',
          metadata: { score: 92, lcp: 1.2, fid: 45, cls: 0.08 }
        },
        {
          id: '8',
          siteName: 'Local Restaurant Menu',
          siteUrl: 'https://localrestaurant.com',
          customerName: 'Local Restaurant',
          eventType: 'ssl_check',
          status: 'warning',
          message: 'SSL certificate expires in 14 days',
          timestamp: '2025-01-11T10:00:00Z',
          metadata: { expiresAt: '2025-01-25', daysUntilExpiry: 14 }
        }
      ])
    } catch (error) {
      console.error('Failed to fetch monitoring events:', error)
      toast.error('Failed to load monitoring history')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.siteUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || event.eventType === typeFilter
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleExportData = () => {
    // In production, this would export the filtered data
    toast.success('Monitoring data exported successfully')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      case 'info': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'uptime_check': return <Globe className="h-4 w-4" />
      case 'ssl_check': return <CheckCircle className="h-4 w-4" />
      case 'performance_test': return <Zap className="h-4 w-4" />
      case 'security_scan': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <AdminLayout title="Monitoring History" subtitle="View historical monitoring events and performance data">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {Math.round((events.filter(e => e.status === 'success').length / events.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2.1% from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues Detected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {events.filter(e => e.status === 'error').length}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingDown className="inline h-3 w-3 mr-1" />
                -1 from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(events.filter(e => e.responseTime).reduce((sum, e) => sum + (e.responseTime || 0), 0) / 
                          events.filter(e => e.responseTime).length || 0)}ms
              </div>
              <p className="text-xs text-muted-foreground">Performance checks</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Search and filter monitoring events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="uptime_check">Uptime Check</SelectItem>
                  <SelectItem value="ssl_check">SSL Check</SelectItem>
                  <SelectItem value="performance_test">Performance Test</SelectItem>
                  <SelectItem value="security_scan">Security Scan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monitoring Events</CardTitle>
            <CardDescription>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading monitoring history...</div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No monitoring events found matching your criteria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site</TableHead>
                    <TableHead>Event Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.siteName}</div>
                          <div className="text-sm text-muted-foreground">
                            {event.customerName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventTypeIcon(event.eventType)}
                          <span className="text-sm">{formatEventType(event.eventType)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(event.status)}
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{event.message}</div>
                      </TableCell>
                      <TableCell>
                        {event.responseTime ? (
                          <span className="font-mono">{event.responseTime}ms</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatTimestamp(event.timestamp)}</span>
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