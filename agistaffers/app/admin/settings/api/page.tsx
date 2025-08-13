'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/safe-dialog'
import { toast } from 'sonner'
import { 
  Plus,
  Key,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Settings,
  Trash2,
  Globe,
  Activity,
  Calendar,
  MoreVertical,
  CheckCircle,
  AlertTriangle,
  Save
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  fullKey: string
  permissions: string[]
  status: 'active' | 'disabled' | 'expired'
  rateLimit: number
  usageCount: number
  lastUsed?: string
  expiresAt?: string
  createdAt: string
  createdBy: string
}

interface ApiSettings {
  enabled: boolean
  defaultRateLimit: number
  maxKeysPerUser: number
  keyExpiryDays: number
  requireApiKeyExpiry: boolean
  logApiRequests: boolean
  enableCors: boolean
  corsOrigins: string[]
  webhooksEnabled: boolean
  maxWebhookRetries: number
  webhookTimeout: number
}

export default function ApiSettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [createKeyOpen, setCreateKeyOpen] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    enabled: true,
    defaultRateLimit: 1000,
    maxKeysPerUser: 10,
    keyExpiryDays: 365,
    requireApiKeyExpiry: false,
    logApiRequests: true,
    enableCors: true,
    corsOrigins: ['https://agistaffers.com'],
    webhooksEnabled: true,
    maxWebhookRetries: 3,
    webhookTimeout: 30
  })

  const [newKey, setNewKey] = useState({
    name: '',
    permissions: [] as string[],
    rateLimit: 1000,
    expiresInDays: 365
  })

  useEffect(() => {
    fetchApiKeys()
    fetchApiSettings()
  }, [])

  const fetchApiKeys = async () => {
    try {
      // Mock data for demonstration
      setApiKeys([
        {
          id: '1',
          name: 'Production API Key',
          keyPrefix: 'agi_sk_prod',
          fullKey: 'agi_sk_prod_1234567890abcdef1234567890abcdef',
          permissions: ['read', 'write', 'deploy'],
          status: 'active',
          rateLimit: 5000,
          usageCount: 15420,
          lastUsed: '2025-01-11T10:30:00Z',
          expiresAt: '2025-12-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          createdBy: 'John Admin'
        },
        {
          id: '2',
          name: 'Development API Key',
          keyPrefix: 'agi_sk_dev',
          fullKey: 'agi_sk_dev_abcdef1234567890abcdef1234567890',
          permissions: ['read', 'write'],
          status: 'active',
          rateLimit: 1000,
          usageCount: 2345,
          lastUsed: '2025-01-11T09:15:00Z',
          expiresAt: '2025-06-01T00:00:00Z',
          createdAt: '2024-06-01T00:00:00Z',
          createdBy: 'Sarah Developer'
        },
        {
          id: '3',
          name: 'Mobile App API Key',
          keyPrefix: 'agi_sk_mobile',
          fullKey: 'agi_sk_mobile_xyz789abc123def456ghi789jkl012',
          permissions: ['read'],
          status: 'active',
          rateLimit: 500,
          usageCount: 8765,
          lastUsed: '2025-01-11T11:45:00Z',
          createdAt: '2024-03-15T00:00:00Z',
          createdBy: 'Mike Mobile'
        },
        {
          id: '4',
          name: 'Legacy Integration',
          keyPrefix: 'agi_sk_legacy',
          fullKey: 'agi_sk_legacy_old123key456legacy789integration',
          permissions: ['read'],
          status: 'disabled',
          rateLimit: 100,
          usageCount: 45,
          lastUsed: '2024-12-20T15:30:00Z',
          expiresAt: '2024-12-31T23:59:59Z',
          createdAt: '2024-01-01T00:00:00Z',
          createdBy: 'Legacy System'
        },
        {
          id: '5',
          name: 'Monitoring Service',
          keyPrefix: 'agi_sk_monitor',
          fullKey: 'agi_sk_monitor_monitoring123service456key789',
          permissions: ['read', 'monitor'],
          status: 'expired',
          rateLimit: 2000,
          usageCount: 125000,
          lastUsed: '2024-11-30T23:59:59Z',
          expiresAt: '2024-11-30T23:59:59Z',
          createdAt: '2023-11-30T00:00:00Z',
          createdBy: 'Monitoring Team'
        }
      ])
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      toast.error('Failed to load API keys')
    }
  }

  const fetchApiSettings = async () => {
    try {
      // Settings are already set as mock data above
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch API settings:', error)
      toast.error('Failed to load API settings')
      setLoading(false)
    }
  }

  const handleCreateKey = async () => {
    if (!newKey.name || newKey.permissions.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const keyId = Math.random().toString(36).substr(2, 9)
      const keyPrefix = `agi_sk_${keyId.substr(0, 4)}`
      const fullKey = `${keyPrefix}_${Math.random().toString(36).substr(2, 32)}`
      
      const apiKey: ApiKey = {
        id: keyId,
        name: newKey.name,
        keyPrefix,
        fullKey,
        permissions: newKey.permissions,
        status: 'active',
        rateLimit: newKey.rateLimit,
        usageCount: 0,
        expiresAt: new Date(Date.now() + newKey.expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: 'Current User'
      }

      setApiKeys([apiKey, ...apiKeys])
      setCreateKeyOpen(false)
      setNewKey({
        name: '',
        permissions: [],
        rateLimit: 1000,
        expiresInDays: 365
      })
      toast.success('API key created successfully')
    } catch (error) {
      toast.error('Failed to create API key')
    }
  }

  const handleToggleKeyStatus = async (keyId: string) => {
    try {
      setApiKeys(apiKeys.map(key => 
        key.id === keyId 
          ? { ...key, status: key.status === 'active' ? 'disabled' : 'active' as any }
          : key
      ))
      toast.success('API key status updated')
    } catch (error) {
      toast.error('Failed to update API key status')
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    try {
      setApiKeys(apiKeys.filter(key => key.id !== keyId))
      toast.success('API key deleted successfully')
    } catch (error) {
      toast.error('Failed to delete API key')
    }
  }

  const handleRegenerateKey = async (keyId: string) => {
    try {
      const newFullKey = `agi_sk_regen_${Math.random().toString(36).substr(2, 32)}`
      setApiKeys(apiKeys.map(key => 
        key.id === keyId 
          ? { ...key, fullKey: newFullKey, usageCount: 0, createdAt: new Date().toISOString() }
          : key
      ))
      toast.success('API key regenerated successfully')
    } catch (error) {
      toast.error('Failed to regenerate API key')
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('API settings saved successfully')
    } catch (error) {
      toast.error('Failed to save API settings')
    } finally {
      setSaving(false)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys)
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId)
    } else {
      newVisibleKeys.add(keyId)
    }
    setVisibleKeys(newVisibleKeys)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('API key copied to clipboard')
  }

  const handleTogglePermission = (permission: string) => {
    setNewKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'disabled': return 'text-gray-600 bg-gray-50'
      case 'expired': return 'text-red-600 bg-red-50'
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const availablePermissions = ['read', 'write', 'deploy', 'monitor', 'admin']

  return (
    <AdminLayout title="API Settings" subtitle="Manage API keys, permissions, and configuration">
      <div className="space-y-6">
        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>Global API settings and security configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable API Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow external API access to the system
                </p>
              </div>
              <Switch
                checked={apiSettings.enabled}
                onCheckedChange={(checked) => setApiSettings({ ...apiSettings, enabled: checked })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultRateLimit">Default Rate Limit (requests/hour)</Label>
                <Input
                  id="defaultRateLimit"
                  type="number"
                  value={apiSettings.defaultRateLimit}
                  onChange={(e) => setApiSettings({ ...apiSettings, defaultRateLimit: parseInt(e.target.value) || 1000 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxKeysPerUser">Max Keys per User</Label>
                <Input
                  id="maxKeysPerUser"
                  type="number"
                  value={apiSettings.maxKeysPerUser}
                  onChange={(e) => setApiSettings({ ...apiSettings, maxKeysPerUser: parseInt(e.target.value) || 10 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyExpiryDays">Default Key Expiry (days)</Label>
                <Input
                  id="keyExpiryDays"
                  type="number"
                  value={apiSettings.keyExpiryDays}
                  onChange={(e) => setApiSettings({ ...apiSettings, keyExpiryDays: parseInt(e.target.value) || 365 })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Require Key Expiry</Label>
                <Switch
                  checked={apiSettings.requireApiKeyExpiry}
                  onCheckedChange={(checked) => setApiSettings({ ...apiSettings, requireApiKeyExpiry: checked })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Log API Requests</Label>
                <p className="text-sm text-muted-foreground">
                  Log all API requests for monitoring and debugging
                </p>
              </div>
              <Switch
                checked={apiSettings.logApiRequests}
                onCheckedChange={(checked) => setApiSettings({ ...apiSettings, logApiRequests: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable CORS</Label>
                <p className="text-sm text-muted-foreground">
                  Allow cross-origin requests from specified domains
                </p>
              </div>
              <Switch
                checked={apiSettings.enableCors}
                onCheckedChange={(checked) => setApiSettings({ ...apiSettings, enableCors: checked })}
              />
            </div>

            {apiSettings.enableCors && (
              <div className="space-y-2">
                <Label htmlFor="corsOrigins">Allowed CORS Origins</Label>
                <Input
                  id="corsOrigins"
                  value={apiSettings.corsOrigins.join(', ')}
                  onChange={(e) => setApiSettings({ ...apiSettings, corsOrigins: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="https://example.com, https://app.example.com"
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Keys Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys and their permissions</CardDescription>
            </div>
            <Dialog open={createKeyOpen} onOpenChange={setCreateKeyOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardHeader>
          <CardContent>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{apiKeys.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {apiKeys.filter(k => k.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(apiKeys.reduce((sum, k) => sum + k.usageCount, 0))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {apiKeys.filter(k => k.expiresAt && new Date(k.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading API keys...</div>
            ) : apiKeys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No API keys found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{key.name}</div>
                          <div className="text-sm text-muted-foreground">
                            by {key.createdBy}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {visibleKeys.has(key.id) ? key.fullKey : `${key.keyPrefix}_${'*'.repeat(16)}`}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleKeyVisibility(key.id)}
                          >
                            {visibleKeys.has(key.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(key.fullKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {key.permissions.map(permission => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(key.status)}>
                          {key.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{formatNumber(key.usageCount)}</div>
                          <div className="text-xs text-muted-foreground">
                            {key.lastUsed ? `Last: ${formatTimestamp(key.lastUsed)}` : 'Never used'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.expiresAt ? (
                          <div className="text-sm">
                            {formatTimestamp(key.expiresAt)}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No expiry</span>
                        )}
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
                            <DropdownMenuItem onClick={() => handleToggleKeyStatus(key.id)}>
                              {key.status === 'active' ? 'Disable' : 'Enable'} Key
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRegenerateKey(key.id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Regenerate Key
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteKey(key.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Key
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

        {/* Create API Key Dialog */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key with specific permissions and rate limits
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name *</Label>
              <Input
                id="keyName"
                value={newKey.name}
                onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                placeholder="Production API Key"
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions *</Label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={newKey.permissions.includes(permission)}
                      onChange={() => handleTogglePermission(permission)}
                    />
                    <Label htmlFor={permission} className="capitalize">
                      {permission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests/hour)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={newKey.rateLimit}
                  onChange={(e) => setNewKey({ ...newKey, rateLimit: parseInt(e.target.value) || 1000 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresInDays">Expires in (days)</Label>
                <Input
                  id="expiresInDays"
                  type="number"
                  value={newKey.expiresInDays}
                  onChange={(e) => setNewKey({ ...newKey, expiresInDays: parseInt(e.target.value) || 365 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateKeyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateKey}>
              <Key className="mr-2 h-4 w-4" />
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </AdminLayout>
  )
}