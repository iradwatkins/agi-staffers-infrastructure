'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  ShoppingCart,
  Building2,
  Zap,
  BookOpen,
  Briefcase,
  Plus,
  Settings,
  Eye,
  Trash2,
  RefreshCw,
  Monitor,
  Palette,
  Code,
  Globe,
  Activity,
  Users
} from 'lucide-react'

interface CustomerSite {
  id: string
  customer_id: string
  domain: string
  status: string
  theme_type?: string
  theme_settings?: Record<string, any>
  customization?: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    companyName: string
    customCSS?: string
  }
  container_id?: string
  container_status?: string
  ssl_enabled?: boolean
  created_at: string
}

interface Customer {
  id: string
  company_name: string
  contact_email: string
  plan_tier: string
  status: string
  customer_sites: CustomerSite[]
}

const THEME_TYPES = {
  'dawn': {
    name: 'Dawn E-commerce',
    icon: ShoppingCart,
    color: 'bg-blue-500',
    description: 'Complete e-commerce solution with cart and checkout'
  },
  'service-business': {
    name: 'Service Business',
    icon: Building2,
    color: 'bg-green-500',
    description: 'Professional services with booking and team profiles'
  },
  'landing-page': {
    name: 'Landing Page',
    icon: Zap,
    color: 'bg-orange-500',
    description: 'High-conversion landing page with urgency messaging'
  },
  'blog': {
    name: 'Blog Website',
    icon: BookOpen,
    color: 'bg-purple-500',
    description: 'Content-focused blog with article management'
  },
  'corporate': {
    name: 'Corporate Website',
    icon: Briefcase,
    color: 'bg-gray-500',
    description: 'Enterprise website with company information'
  }
} as const

export default function ThemeManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedSite, setSelectedSite] = useState<CustomerSite | null>(null)
  const [loading, setLoading] = useState(true)
  const [siteMetrics, setSiteMetrics] = useState<Record<string, any>>({})

  // Load customers and their sites
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      const data = await response.json()
      
      if (data.success) {
        setCustomers(data.data.customers)
      }
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSiteMetrics = async (siteId: string) => {
    try {
      const response = await fetch(`/api/customer-sites/metrics?siteId=${siteId}`)
      const data = await response.json()
      
      if (data.success) {
        setSiteMetrics(prev => ({
          ...prev,
          [siteId]: data.metrics
        }))
      }
    } catch (error) {
      console.error('Failed to load site metrics:', error)
    }
  }

  const createSite = async (siteData: {
    customerId: string
    siteName: string
    domain: string
    themeType: keyof typeof THEME_TYPES
    customization: any
  }) => {
    try {
      const response = await fetch('/api/customer-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      })

      if (response.ok) {
        await loadCustomers() // Refresh data
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to create site:', error)
      return false
    }
  }

  const updateSiteSettings = async (siteId: string, settings: any) => {
    try {
      const response = await fetch('/api/customer-sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          type: 'settings',
          data: settings
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to update site settings:', error)
      return false
    }
  }

  const updateSiteCustomization = async (siteId: string, customization: any) => {
    try {
      const response = await fetch('/api/customer-sites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId,
          type: 'customization', 
          data: customization
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to update site customization:', error)
      return false
    }
  }

  const deleteSite = async (siteId: string) => {
    try {
      const response = await fetch(`/api/customer-sites?siteId=${siteId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadCustomers()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to delete site:', error)
      return false
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'running': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'creating': 'bg-blue-500',
      'stopped': 'bg-red-500',
      'error': 'bg-red-600'
    }
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-500'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading theme management...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Theme Management</h2>
          <p className="text-muted-foreground">Manage customer websites and themes</p>
        </div>
        
        <CreateSiteDialog onCreateSite={createSite} customers={customers} />
      </div>

      {/* Customer Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium">Total Customers</span>
            </div>
            <p className="text-2xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Active Sites</span>
            </div>
            <p className="text-2xl font-bold">
              {customers.reduce((acc, customer) => acc + customer.customer_sites.length, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Running Sites</span>
            </div>
            <p className="text-2xl font-bold">
              {customers.reduce((acc, customer) => 
                acc + customer.customer_sites.filter(site => site.container_status === 'running').length, 0
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Theme Types</span>
            </div>
            <p className="text-2xl font-bold">{Object.keys(THEME_TYPES).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Sites List */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Sites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{customer.company_name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.contact_email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{customer.plan_tier}</Badge>
                    <Badge variant="outline">{customer.status}</Badge>
                  </div>
                </div>

                {customer.customer_sites.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No sites created yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customer.customer_sites.map((site) => (
                      <SiteCard
                        key={site.id}
                        site={site}
                        onUpdateSettings={updateSiteSettings}
                        onUpdateCustomization={updateSiteCustomization}
                        onDelete={deleteSite}
                        onLoadMetrics={loadSiteMetrics}
                        metrics={siteMetrics[site.id]}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {customers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No customers found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Site Card Component
function SiteCard({ 
  site, 
  onUpdateSettings, 
  onUpdateCustomization, 
  onDelete,
  onLoadMetrics,
  metrics 
}: {
  site: CustomerSite
  onUpdateSettings: (siteId: string, settings: any) => Promise<boolean>
  onUpdateCustomization: (siteId: string, customization: any) => Promise<boolean>
  onDelete: (siteId: string) => Promise<boolean>
  onLoadMetrics: (siteId: string) => void
  metrics?: any
}) {
  const themeInfo = THEME_TYPES[site.theme_type as keyof typeof THEME_TYPES]
  const ThemeIcon = themeInfo?.icon || Globe

  useEffect(() => {
    if (site.container_status === 'running') {
      onLoadMetrics(site.id)
    }
  }, [site.id, site.container_status])

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <ThemeIcon className="h-4 w-4" />
            <span className="font-medium text-sm">{site.domain}</span>
          </div>
          {getStatusBadge(site.container_status || 'unknown')}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Theme:</span>
            <span>{themeInfo?.name || 'Unknown'}</span>
          </div>
          
          {site.ssl_enabled && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">SSL:</span>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
          )}

          {metrics && (
            <div className="pt-2 border-t">
              <div className="flex justify-between text-xs">
                <span>CPU:</span>
                <span>{metrics.cpu?.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Memory:</span>
                <span>{(metrics.memory / 1024 / 1024).toFixed(0)}MB</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={() => window.open(`https://${site.domain}`, '_blank')}>
            <Eye className="h-3 w-3" />
          </Button>
          
          <SiteSettingsDialog 
            site={site}
            onUpdateSettings={onUpdateSettings}
            onUpdateCustomization={onUpdateCustomization}
          />
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onDelete(site.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Create Site Dialog Component
function CreateSiteDialog({ 
  onCreateSite, 
  customers 
}: { 
  onCreateSite: (data: any) => Promise<boolean>
  customers: Customer[] 
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    customerId: '',
    siteName: '',
    domain: '',
    themeType: 'dawn' as keyof typeof THEME_TYPES,
    customization: {
      primaryColor: '#1f2937',
      secondaryColor: '#3b82f6',
      companyName: '',
      logo: '',
      customCSS: ''
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await onCreateSite(formData)
    if (success) {
      setOpen(false)
      setFormData({
        customerId: '',
        siteName: '',
        domain: '',
        themeType: 'dawn',
        customization: {
          primaryColor: '#1f2937',
          secondaryColor: '#3b82f6',
          companyName: '',
          logo: '',
          customCSS: ''
        }
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Site
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Customer Site</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Customer</Label>
            <Select value={formData.customerId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, customerId: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Site Name</Label>
            <Input
              value={formData.siteName}
              onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
              placeholder="My Awesome Site"
              required
            />
          </div>

          <div>
            <Label>Domain</Label>
            <Input
              value={formData.domain}
              onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
              placeholder="mysite.com"
              required
            />
          </div>

          <div>
            <Label>Theme Type</Label>
            <Select value={formData.themeType} onValueChange={(value) =>
              setFormData(prev => ({ ...prev, themeType: value as keyof typeof THEME_TYPES }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(THEME_TYPES).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <theme.icon className="h-4 w-4" />
                      {theme.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Company Name</Label>
            <Input
              value={formData.customization.companyName}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                customization: { ...prev.customization, companyName: e.target.value }
              }))}
              placeholder="Company Name"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={formData.customization.primaryColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customization: { ...prev.customization, primaryColor: e.target.value }
                }))}
              />
            </div>
            <div className="flex-1">
              <Label>Secondary Color</Label>
              <Input
                type="color"
                value={formData.customization.secondaryColor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customization: { ...prev.customization, secondaryColor: e.target.value }
                }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Site
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Site Settings Dialog Component
function SiteSettingsDialog({ 
  site, 
  onUpdateSettings, 
  onUpdateCustomization 
}: {
  site: CustomerSite
  onUpdateSettings: (siteId: string, settings: any) => Promise<boolean>
  onUpdateCustomization: (siteId: string, customization: any) => Promise<boolean>
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Settings className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Site Settings - {site.domain}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="customization" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="settings">Theme Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customization" className="space-y-4">
            <CustomizationSettings 
              site={site} 
              onUpdate={onUpdateCustomization} 
            />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <ThemeSettings 
              site={site} 
              onUpdate={onUpdateSettings} 
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <AdvancedSettings site={site} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Customization Settings Component
function CustomizationSettings({ 
  site, 
  onUpdate 
}: { 
  site: CustomerSite
  onUpdate: (siteId: string, customization: any) => Promise<boolean>
}) {
  const [customization, setCustomization] = useState(site.customization || {
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6',
    companyName: '',
    logo: '',
    customCSS: ''
  })

  const handleSave = async () => {
    await onUpdate(site.id, customization)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Company Name</Label>
        <Input
          value={customization.companyName || ''}
          onChange={(e) => setCustomization(prev => ({ ...prev, companyName: e.target.value }))}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Primary Color</Label>
          <Input
            type="color"
            value={customization.primaryColor}
            onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
          />
        </div>
        <div className="flex-1">
          <Label>Secondary Color</Label>
          <Input
            type="color"
            value={customization.secondaryColor}
            onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label>Logo URL</Label>
        <Input
          value={customization.logo || ''}
          onChange={(e) => setCustomization(prev => ({ ...prev, logo: e.target.value }))}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div>
        <Label>Custom CSS</Label>
        <Textarea
          value={customization.customCSS || ''}
          onChange={(e) => setCustomization(prev => ({ ...prev, customCSS: e.target.value }))}
          placeholder="/* Custom CSS */
.header { background: red; }"
          rows={6}
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Customization
      </Button>
    </div>
  )
}

// Theme Settings Component
function ThemeSettings({ 
  site, 
  onUpdate 
}: { 
  site: CustomerSite
  onUpdate: (siteId: string, settings: any) => Promise<boolean>
}) {
  const [settings, setSettings] = useState(site.theme_settings || {})

  const handleSave = async () => {
    await onUpdate(site.id, settings)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Theme-specific settings will appear here based on the selected theme type.
      </p>
      
      <div>
        <Label>Theme Configuration</Label>
        <Textarea
          value={JSON.stringify(settings, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value)
              setSettings(parsed)
            } catch {
              // Invalid JSON, don't update
            }
          }}
          placeholder="{}"
          rows={10}
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  )
}

// Advanced Settings Component
function AdvancedSettings({ site }: { site: CustomerSite }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-muted-foreground">Container ID:</Label>
          <p className="font-mono text-xs break-all">{site.container_id || 'Not assigned'}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Status:</Label>
          <p>{site.container_status}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">SSL:</Label>
          <p>{site.ssl_enabled ? 'Enabled' : 'Disabled'}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Created:</Label>
          <p>{new Date(site.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}