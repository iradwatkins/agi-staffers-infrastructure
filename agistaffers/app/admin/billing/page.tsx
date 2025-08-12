'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { DollarSign, CreditCard, TrendingUp, Download, RefreshCw, AlertCircle } from 'lucide-react'

interface Invoice {
  id: string
  customerName: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  invoiceNumber: string
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      // Mock data
      setInvoices([
        {
          id: '1',
          customerName: 'Tech Startup Inc',
          amount: 299,
          status: 'paid',
          dueDate: '2025-01-05',
          invoiceNumber: 'INV-2025-001'
        },
        {
          id: '2',
          customerName: 'Acme Corporation',
          amount: 999,
          status: 'pending',
          dueDate: '2025-01-15',
          invoiceNumber: 'INV-2025-002'
        },
        {
          id: '3',
          customerName: 'Local Restaurant',
          amount: 49,
          status: 'overdue',
          dueDate: '2024-12-31',
          invoiceNumber: 'INV-2024-145'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'overdue': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter)

  return (
    <AdminLayout 
      title="Billing & Subscriptions" 
      subtitle="Manage customer billing and payment processing"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">12 new this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,248</div>
            <p className="text-xs text-muted-foreground">5 invoices pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <p className="text-xs text-muted-foreground">-0.8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Manage and track customer invoices</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.customerName}</TableCell>
                  <TableCell>${invoice.amount}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Current pricing tiers and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Starter</CardTitle>
                <div className="text-3xl font-bold">$49<span className="text-sm font-normal">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>1 Website</li>
                  <li>10GB Storage</li>
                  <li>100GB Bandwidth</li>
                  <li>Email Support</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional</CardTitle>
                <div className="text-3xl font-bold">$199<span className="text-sm font-normal">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>5 Websites</li>
                  <li>50GB Storage</li>
                  <li>500GB Bandwidth</li>
                  <li>Priority Support</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enterprise</CardTitle>
                <div className="text-3xl font-bold">$999<span className="text-sm font-normal">/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li>Unlimited Websites</li>
                  <li>500GB Storage</li>
                  <li>Unlimited Bandwidth</li>
                  <li>24/7 Phone Support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  )
}