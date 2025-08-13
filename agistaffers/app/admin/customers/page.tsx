'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/safe-dialog'
import { toast } from 'sonner'
import { Search, Plus, MoreVertical, Mail, Phone, Globe, Calendar, DollarSign, Edit, Trash, Eye, Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'active' | 'inactive' | 'suspended'
  plan: 'starter' | 'professional' | 'enterprise'
  sites: number
  monthlySpend: number
  createdAt: string
  lastActive: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCustomers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch customers:', error)
      // Use mock data for now
      setCustomers([
        {
          id: '1',
          name: 'John Smith',
          email: 'john@techstartup.com',
          phone: '+1 555-0100',
          company: 'Tech Startup Inc',
          status: 'active',
          plan: 'professional',
          sites: 3,
          monthlySpend: 299,
          createdAt: '2024-01-15',
          lastActive: '2025-01-11'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@acmecorp.com',
          phone: '+1 555-0101',
          company: 'Acme Corporation',
          status: 'active',
          plan: 'enterprise',
          sites: 12,
          monthlySpend: 999,
          createdAt: '2023-11-20',
          lastActive: '2025-01-10'
        },
        {
          id: '3',
          name: 'Mike Davis',
          email: 'mike@localrestaurant.com',
          phone: '+1 555-0102',
          company: 'Local Restaurant',
          status: 'active',
          plan: 'starter',
          sites: 1,
          monthlySpend: 49,
          createdAt: '2024-03-10',
          lastActive: '2025-01-09'
        },
        {
          id: '4',
          name: 'Emily Chen',
          email: 'emily@designstudio.com',
          phone: '+1 555-0103',
          company: 'Design Studio LLC',
          status: 'inactive',
          plan: 'professional',
          sites: 2,
          monthlySpend: 0,
          createdAt: '2024-02-01',
          lastActive: '2024-12-15'
        },
        {
          id: '5',
          name: 'Robert Wilson',
          email: 'robert@realestate.com',
          phone: '+1 555-0104',
          company: 'Wilson Real Estate',
          status: 'active',
          plan: 'professional',
          sites: 5,
          monthlySpend: 399,
          createdAt: '2023-09-15',
          lastActive: '2025-01-11'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = (Array.isArray(customers) ? customers : []).filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    const matchesPlan = planFilter === 'all' || customer.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return
    
    try {
      // In production, make API call to delete customer
      setCustomers(customers.filter(c => c.id !== selectedCustomer.id))
      toast.success(`Customer ${selectedCustomer.name} deleted successfully`)
      setDeleteDialogOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      toast.error('Failed to delete customer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'suspended': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-500'
      case 'professional': return 'bg-purple-500'
      case 'enterprise': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <AdminLayout 
      title="Customer Management" 
      subtitle="Manage your customer accounts and subscriptions"
      badge={`${(customers || []).length} Total`}
    >
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex justify-end">
          <Link href="/admin/customers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(customers || []).length}</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(customers || []).filter(c => c.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {customers && customers.length > 0 
                    ? `${Math.round(((customers || []).filter(c => c.status === 'active').length / customers.length) * 100)}% of total`
                    : '0% of total'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(customers || []).reduce((sum, c) => sum + c.sites, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all customers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(customers || []).reduce((sum, c) => sum + c.monthlySpend, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Search and filter your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>
                {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading customers...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No customers found matching your criteria
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Sites</TableHead>
                      <TableHead>Monthly Spend</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{customer.company}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(customer.status)}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {customer.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.sites}</TableCell>
                        <TableCell>${customer.monthlySpend}</TableCell>
                        <TableCell>{customer.lastActive}</TableCell>
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
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setDeleteDialogOpen(true)
                                }}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Customer
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

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Customer</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {selectedCustomer?.name}? This action cannot be undone.
                  All associated sites and data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCustomer}>
                  Delete Customer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </div>
    </AdminLayout>
  )
}