'use client'

import { useState, useEffect } from 'react'
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { ContainerStatus } from '@/components/dashboard/ContainerStatus'
import { BackupManager } from '@/components/dashboard/BackupManager'
import { PushNotificationUI } from '@/components/dashboard/PushNotificationUI'
import { FoldAwareLayout } from '@/components/dashboard/FoldAwareLayout'
import { MemoryOptimization } from '@/components/dashboard/MemoryOptimization'
import { ThemeToggle } from '@/components/theme-toggle'
import { AlertThresholds } from '@/components/dashboard/AlertThresholds'
import { HistoricalDataCharts } from '@/components/dashboard/HistoricalDataCharts'
import { CustomerManagement } from '@/components/dashboard/CustomerManagement'
import { SiteManagement } from '@/components/dashboard/SiteManagement'
import { AdminSidebar } from '@/components/dashboard/AdminSidebar'
import { ServicePortalGrid } from '@/components/dashboard/ServicePortalGrid'
import { SystemHealthWidget } from '@/components/dashboard/SystemHealthWidget'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Users, Globe, DollarSign, Package, Activity, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center gap-4 flex-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                AGI Staffers Admin
              </h1>
              <Badge variant="outline" className="hidden md:inline-flex">
                Enterprise Hosting Platform
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <FoldAwareLayout>
          <main className="flex-1 space-y-4 p-4 md:p-6">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-2 lg:grid-cols-8 w-full lg:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="backup">Backup</TabsTrigger>
                <TabsTrigger value="memory">Memory</TabsTrigger>
                <TabsTrigger value="notifications">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Welcome to your hosting infrastructure control center</p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+12%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">245</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+18</span> new this week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+20.1%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">System Health</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.5%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">Optimal</span> performance
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* System Health */}
                <SystemHealthWidget />
                
                {/* Metrics Cards */}
                <DashboardMetrics />

                {/* Container Status and Recent Activity */}
                <div className="grid gap-4 md:grid-cols-2">
                  <ContainerStatus />
                  
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest system events and deployments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-green-600">
                            Deploy
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium">techstartup.com deployed</p>
                            {mounted && <p className="text-xs text-muted-foreground">2 minutes ago</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-blue-600">
                            Customer
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium">New customer: Acme Corp</p>
                            {mounted && <p className="text-xs text-muted-foreground">15 minutes ago</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-yellow-600">
                            Backup
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Automated backup completed</p>
                            {mounted && <p className="text-xs text-muted-foreground">1 hour ago</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-purple-600">
                            Update
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium">System update installed</p>
                            {mounted && <p className="text-xs text-muted-foreground">3 hours ago</p>}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Button className="justify-start" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Add New Customer
                      </Button>
                      <Button className="justify-start" variant="outline">
                        <Globe className="mr-2 h-4 w-4" />
                        Deploy New Site
                      </Button>
                      <Button className="justify-start" variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        Create Backup
                      </Button>
                      <Button className="justify-start" variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Scan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-4">
                <ServicePortalGrid />
              </TabsContent>

              <TabsContent value="customers" className="space-y-4">
                <CustomerManagement />
              </TabsContent>

              <TabsContent value="sites" className="space-y-4">
                <SiteManagement />
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <BackupManager />
              </TabsContent>

              <TabsContent value="monitoring" className="space-y-4">
                <div className="flex items-center justify-between space-y-2">
                  <h2 className="text-3xl font-bold tracking-tight">Real-time Monitoring</h2>
                </div>
                <SystemHealthWidget />
                <div className="grid gap-4 md:grid-cols-2">
                  <ContainerStatus />
                  <AlertThresholds />
                </div>
                <HistoricalDataCharts />
              </TabsContent>

              <TabsContent value="memory" className="space-y-4">
                <div className="flex items-center justify-between space-y-2 mb-6">
                  <h2 className="text-3xl font-bold tracking-tight">Memory Optimization</h2>
                </div>
                <MemoryOptimization />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <div className="flex items-center justify-between space-y-2 mb-6">
                  <h2 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <PushNotificationUI />
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                        <CardDescription>
                          System alerts and notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-yellow-600">Warning</Badge>
                            <span className="text-sm">High memory usage detected (93%)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-blue-600">Info</Badge>
                            <span className="text-sm">Backup completed successfully</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </FoldAwareLayout>
      </div>
    </div>
  )
}