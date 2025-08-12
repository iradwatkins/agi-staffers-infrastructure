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
import { toast } from 'sonner'
import { 
  Search, 
  Plus, 
  Globe, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Settings, 
  ExternalLink,
  Copy,
  Trash2,
  RefreshCw,
  Zap,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Domain {
  id: string
  name: string
  customerId: string
  customerName: string
  siteName: string
  status: 'active' | 'pending' | 'failed' | 'expired'
  sslStatus: 'active' | 'pending' | 'failed' | 'expired'
  cdnEnabled: boolean
  autoRenew: boolean
  createdAt: string
  expiresAt: string
  dnsRecords: DNSRecord[]
}

interface DNSRecord {
  type: 'A' | 'CNAME' | 'MX' | 'TXT'
  name: string
  value: string
  ttl: number
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addDomainOpen, setAddDomainOpen] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [dnsDialogOpen, setDnsDialogOpen] = useState(false)
  const [newDomain, setNewDomain] = useState({
    name: '',
    customerId: '',
    siteName: '',
    cdnEnabled: true,
    autoRenew: true
  })

  const customers = [
    { id: '1', name: 'Tech Startup Inc', sites: ['techstartup.com', 'app.techstartup.com'] },
    { id: '2', name: 'Acme Corporation', sites: ['acmecorp.com', 'portal.acmecorp.com'] },
    { id: '3', name: 'Local Restaurant', sites: ['localrestaurant.com'] },
    { id: '4', name: 'Design Studio LLC', sites: ['designstudio.com', 'portfolio.designstudio.com'] },
    { id: '5', name: 'Wilson Real Estate', sites: ['wilsonrealty.com', 'listings.wilsonrealty.com'] }
  ]

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      // In production, this would be a real API call
      // const response = await fetch('/api/domains')
      // const data = await response.json()
      
      // Mock data for demonstration
      setDomains([
        {
          id: '1',
          name: 'techstartup.com',
          customerId: '1',
          customerName: 'Tech Startup Inc',
          siteName: 'main-website',
          status: 'active',
          sslStatus: 'active',
          cdnEnabled: true,
          autoRenew: true,
          createdAt: '2024-01-15T10:00:00Z',
          expiresAt: '2025-01-15T10:00:00Z',
          dnsRecords: [
            { type: 'A', name: '@', value: '192.168.1.100', ttl: 300 },
            { type: 'CNAME', name: 'www', value: 'techstartup.com', ttl: 300 },
            { type: 'MX', name: '@', value: '10 mail.techstartup.com', ttl: 3600 },
            { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600 }
          ]
        },
        {
          id: '2',
          name: 'acmecorp.com',
          customerId: '2',
          customerName: 'Acme Corporation',
          siteName: 'corporate-site',
          status: 'active',
          sslStatus: 'active',
          cdnEnabled: true,
          autoRenew: true,
          createdAt: '2023-11-20T14:30:00Z',
          expiresAt: '2024-11-20T14:30:00Z',
          dnsRecords: [
            { type: 'A', name: '@', value: '192.168.1.101', ttl: 300 },
            { type: 'CNAME', name: 'www', value: 'acmecorp.com', ttl: 300 }
          ]
        },
        {
          id: '3',
          name: 'localrestaurant.com',
          customerId: '3',
          customerName: 'Local Restaurant',
          siteName: 'restaurant-menu',
          status: 'active',
          sslStatus: 'pending',
          cdnEnabled: false,
          autoRenew: true,
          createdAt: '2024-03-10T09:15:00Z',
          expiresAt: '2025-03-10T09:15:00Z',
          dnsRecords: [
            { type: 'A', name: '@', value: '192.168.1.102', ttl: 300 }
          ]
        },
        {
          id: '4',
          name: 'designstudio.com',
          customerId: '4',
          customerName: 'Design Studio LLC',
          siteName: 'portfolio-site',
          status: 'pending',
          sslStatus: 'failed',
          cdnEnabled: true,
          autoRenew: false,
          createdAt: '2024-02-01T16:20:00Z',
          expiresAt: '2025-02-01T16:20:00Z',
          dnsRecords: [
            { type: 'A', name: '@', value: '192.168.1.103', ttl: 300 }
          ]
        },
        {
          id: '5',
          name: 'wilsonrealty.com',
          customerId: '5',
          customerName: 'Wilson Real Estate',
          siteName: 'listings-site',
          status: 'active',
          sslStatus: 'active',
          cdnEnabled: true,
          autoRenew: true,
          createdAt: '2023-09-15T12:45:00Z',
          expiresAt: '2024-09-15T12:45:00Z',
          dnsRecords: [
            { type: 'A', name: '@', value: '192.168.1.104', ttl: 300 },
            { type: 'CNAME', name: 'www', value: 'wilsonrealty.com', ttl: 300 }
          ]
        }
      ])
    } catch (error) {
      console.error('Failed to fetch domains:', error)
      toast.error('Failed to load domains')
    } finally {
      setLoading(false)
    }
  }

  const filteredDomains = domains.filter(domain => {
    const matchesSearch = domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         domain.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         domain.siteName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || domain.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddDomain = async () => {
    if (!newDomain.name || !newDomain.customerId || !newDomain.siteName) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const customer = customers.find(c => c.id === newDomain.customerId)
      if (!customer) return

      const domain: Domain = {
        id: Math.random().toString(36).substr(2, 9),
        name: newDomain.name,
        customerId: newDomain.customerId,
        customerName: customer.name,
        siteName: newDomain.siteName,
        status: 'pending',
        sslStatus: 'pending',
        cdnEnabled: newDomain.cdnEnabled,
        autoRenew: newDomain.autoRenew,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        dnsRecords: [
          { type: 'A', name: '@', value: '192.168.1.100', ttl: 300 }
        ]
      }

      setDomains([...domains, domain])
      setAddDomainOpen(false)
      setNewDomain({
        name: '',
        customerId: '',
        siteName: '',
        cdnEnabled: true,
        autoRenew: true
      })
      toast.success(`Domain ${newDomain.name} added successfully`)
    } catch (error) {
      toast.error('Failed to add domain')
    }
  }

  const handleDeleteDomain = async (domainId: string) => {
    try {
      setDomains(domains.filter(d => d.id !== domainId))
      toast.success('Domain deleted successfully')
    } catch (error) {
      toast.error('Failed to delete domain')
    }
  }

  const handleRenewSSL = async (domainId: string) => {
    try {
      setDomains(domains.map(domain => 
        domain.id === domainId 
          ? { ...domain, sslStatus: 'pending' }
          : domain
      ))
      toast.success('SSL certificate renewal initiated')
      
      // Simulate SSL renewal process
      setTimeout(() => {
        setDomains(prev => prev.map(domain => 
          domain.id === domainId 
            ? { ...domain, sslStatus: 'active' }
            : domain
        ))
        toast.success('SSL certificate renewed successfully')
      }, 3000)
    } catch (error) {
      toast.error('Failed to renew SSL certificate')
    }
  }

  const handleToggleCDN = async (domainId: string) => {
    try {
      setDomains(domains.map(domain => 
        domain.id === domainId 
          ? { ...domain, cdnEnabled: !domain.cdnEnabled }
          : domain
      ))
      toast.success('CDN settings updated')
    } catch (error) {
      toast.error('Failed to update CDN settings')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      case 'expired': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getSSLStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'expired': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return days
  }

  return (
    <AdminLayout title="Domain Management" subtitle="Manage domains, SSL certificates, and DNS settings">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-end">
          <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Domain
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Domains</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.filter(d => d.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Operational</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SSL Secured</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.filter(d => d.sslStatus === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((domains.filter(d => d.sslStatus === 'active').length / domains.length) * 100)}% of domains
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDN Enabled</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.filter(d => d.cdnEnabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Performance optimized</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Search and filter domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domains..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Domains Table */}
      <Card>
        <CardHeader>
          <CardTitle>Domains</CardTitle>
          <CardDescription>
            {filteredDomains.length} domain{filteredDomains.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading domains...</div>
          ) : filteredDomains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No domains found matching your criteria
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SSL Status</TableHead>
                  <TableHead>CDN</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDomains.map((domain) => {
                  const daysUntilExpiry = getDaysUntilExpiry(domain.expiresAt)
                  return (
                    <TableRow key={domain.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {domain.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => copyToClipboard(domain.name)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Site: {domain.siteName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{domain.customerName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(domain.status)}>
                          {domain.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSSLStatusColor(domain.sslStatus)}>
                          <Shield className="mr-1 h-3 w-3" />
                          {domain.sslStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={domain.cdnEnabled}
                            onCheckedChange={() => handleToggleCDN(domain.id)}
                            size="sm"
                          />
                          <span className="text-sm">
                            {domain.cdnEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatDate(domain.expiresAt)}</span>
                          {daysUntilExpiry < 30 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {daysUntilExpiry} days left
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedDomain(domain)
                                setDnsDialogOpen(true)
                              }}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Manage DNS
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRenewSSL(domain.id)}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Renew SSL
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Visit Domain
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteDomain(domain.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Domain
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Domain Dialog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Domain</DialogTitle>
          <DialogDescription>
            Configure a new domain for hosting
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domainName">Domain Name *</Label>
            <Input
              id="domainName"
              value={newDomain.name}
              onChange={(e) => setNewDomain({ ...newDomain, name: e.target.value })}
              placeholder="example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer">Customer *</Label>
            <Select value={newDomain.customerId} onValueChange={(value) => setNewDomain({ ...newDomain, customerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name *</Label>
            <Input
              id="siteName"
              value={newDomain.siteName}
              onChange={(e) => setNewDomain({ ...newDomain, siteName: e.target.value })}
              placeholder="main-website"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cdnEnabled">Enable CDN</Label>
            <Switch
              id="cdnEnabled"
              checked={newDomain.cdnEnabled}
              onCheckedChange={(checked) => setNewDomain({ ...newDomain, cdnEnabled: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoRenew">Auto-renew SSL</Label>
            <Switch
              id="autoRenew"
              checked={newDomain.autoRenew}
              onCheckedChange={(checked) => setNewDomain({ ...newDomain, autoRenew: checked })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setAddDomainOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddDomain}>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* DNS Management Dialog */}
      <Dialog open={dnsDialogOpen} onOpenChange={setDnsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>DNS Records for {selectedDomain?.name}</DialogTitle>
            <DialogDescription>
              Manage DNS records for your domain
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>TTL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDomain?.dnsRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">{record.type}</Badge>
                    </TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{record.value}</TableCell>
                    <TableCell>{record.ttl}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(record.value)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDnsDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  )
}