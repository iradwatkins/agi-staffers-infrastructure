import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics'
import { ContainerStatus } from '@/components/dashboard/ContainerStatus'
import { BackupManager } from '@/components/dashboard/BackupManager'
import { PushNotificationUI } from '@/components/dashboard/PushNotificationUI'
import { FoldAwareLayout } from '@/components/dashboard/FoldAwareLayout'
import { MemoryOptimization } from '@/components/dashboard/MemoryOptimization'
import { PWAInstallPrompt } from '@/components/dashboard/PWAInstallPrompt'
import { PWAInstallButton } from '@/components/pwa-install-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { AlertThresholds } from '@/components/dashboard/AlertThresholds'
import { HistoricalDataCharts } from '@/components/dashboard/HistoricalDataCharts'
import { CustomerManagement } from '@/components/dashboard/CustomerManagement'
import { SiteManagement } from '@/components/dashboard/SiteManagement'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            AGI Staffers - Admin Dashboard
          </h1>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <PWAInstallButton />
            <span className="text-sm text-muted-foreground">Admin Only!</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <FoldAwareLayout>
        <main className="flex-1 space-y-4">
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="grid grid-cols-2 lg:grid-cols-7 w-full lg:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="sites">Sites</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            
            {/* PWA Install Prompt */}
            <PWAInstallPrompt />
            
            {/* Metrics Cards */}
            <DashboardMetrics />

            {/* Container Status Section */}
            <div className="grid gap-4 md:grid-cols-2 mt-8">
              <ContainerStatus />
              
              {/* Website Management */}
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Deployed Websites</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">stepperslife.com</span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">agistaffers.com</span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold mb-2">Pending Websites</h3>
                  <p className="text-sm text-muted-foreground">No pending deployments</p>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Service Management</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { name: 'PgAdmin', url: 'https://pgadmin.agistaffers.com' },
                  { name: 'n8n Automation', url: 'https://n8n.agistaffers.com' },
                  { name: 'AI Chat', url: 'https://chat.agistaffers.com' },
                  { name: 'Flowise AI', url: 'https://flowise.agistaffers.com' },
                  { name: 'Portainer', url: 'https://portainer.agistaffers.com' },
                  { name: 'SearXNG', url: 'https://searxng.agistaffers.com' },
                ].map((service) => (
                  <a
                    key={service.name}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <h4 className="font-semibold">{service.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{service.url}</p>
                  </a>
                ))}
              </div>
            </div>
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
            <DashboardMetrics />
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
              <h2 className="text-3xl font-bold tracking-tight">Notification Settings</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <PushNotificationUI />
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>
                      Your notification history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      No recent notifications
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        </main>
      </FoldAwareLayout>
    </div>
  )
}