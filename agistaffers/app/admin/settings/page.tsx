'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Settings,
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Server,
  Users,
  Key,
  AlertTriangle,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Zap,
  Activity,
  Lock,
  Unlock,
  MessageSquare
} from 'lucide-react'

interface SystemSettings {
  siteName: string
  siteDescription: string
  adminEmail: string
  timezone: string
  language: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean
  twoFactorAuthRequired: boolean
  maxFileUploadSize: number
  sessionTimeout: number
  maxLoginAttempts: number
}

interface NotificationSettings {
  emailNotifications: boolean
  slackNotifications: boolean
  webhookNotifications: boolean
  slackWebhookUrl: string
  emailFrom: string
  emailReplyTo: string
  webhookUrl: string
  alertThresholds: {
    cpu: number
    memory: number
    disk: number
    responseTime: number
  }
}

interface SecuritySettings {
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  passwordRequireNumbers: boolean
  passwordRequireUppercase: boolean
  sessionSecure: boolean
  corsEnabled: boolean
  corsOrigins: string
  rateLimitEnabled: boolean
  rateLimitRequests: number
  rateLimitWindow: number
  ipWhitelist: string
  ipBlacklist: string
}

interface ApiSettings {
  apiEnabled: boolean
  apiRateLimit: number
  apiKeyExpiryDays: number
  webhooksEnabled: boolean
  maxWebhookRetries: number
  webhookTimeout: number
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKey] = useState('agi_sk_1234567890abcdef...')

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'AGI Staffers',
    siteDescription: 'Enterprise Hosting Platform',
    adminEmail: 'admin@agistaffers.com',
    timezone: 'UTC',
    language: 'en',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    twoFactorAuthRequired: false,
    maxFileUploadSize: 100,
    sessionTimeout: 3600,
    maxLoginAttempts: 5
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    slackNotifications: false,
    webhookNotifications: false,
    slackWebhookUrl: '',
    emailFrom: 'noreply@agistaffers.com',
    emailReplyTo: 'support@agistaffers.com',
    webhookUrl: '',
    alertThresholds: {
      cpu: 85,
      memory: 90,
      disk: 95,
      responseTime: 1000
    }
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionSecure: true,
    corsEnabled: true,
    corsOrigins: 'https://agistaffers.com',
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 3600,
    ipWhitelist: '',
    ipBlacklist: ''
  })

  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    apiEnabled: true,
    apiRateLimit: 1000,
    apiKeyExpiryDays: 365,
    webhooksEnabled: true,
    maxWebhookRetries: 3,
    webhookTimeout: 30
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // In production, this would fetch from API
      // const response = await fetch('/api/settings')
      // const data = await response.json()
      // setSystemSettings(data.system)
      // setNotificationSettings(data.notifications)
      // setSecuritySettings(data.security)
      // setApiSettings(data.api)
      
      setLoading(false)
    } catch (error) {
      console.error('Failed to load settings:', error)
      toast.error('Failed to load settings')
      setLoading(false)
    }
  }

  const saveSettings = async (category: string) => {
    setSaving(true)
    try {
      // In production, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${category} settings saved successfully`)
    } catch (error) {
      toast.error(`Failed to save ${category} settings`)
    } finally {
      setSaving(false)
    }
  }

  const generateNewApiKey = () => {
    // In production, this would generate a new API key
    toast.success('New API key generated successfully')
  }

  const testNotification = async (type: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Test ${type} notification sent successfully`)
    } catch (error) {
      toast.error(`Failed to send test ${type} notification`)
    }
  }

  const resetToDefaults = (category: string) => {
    if (category === 'system') {
      setSystemSettings({
        siteName: 'AGI Staffers',
        siteDescription: 'Enterprise Hosting Platform',
        adminEmail: 'admin@agistaffers.com',
        timezone: 'UTC',
        language: 'en',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        twoFactorAuthRequired: false,
        maxFileUploadSize: 100,
        sessionTimeout: 3600,
        maxLoginAttempts: 5
      })
    } else if (category === 'notifications') {
      setNotificationSettings({
        emailNotifications: true,
        slackNotifications: false,
        webhookNotifications: false,
        slackWebhookUrl: '',
        emailFrom: 'noreply@agistaffers.com',
        emailReplyTo: 'support@agistaffers.com',
        webhookUrl: '',
        alertThresholds: {
          cpu: 85,
          memory: 90,
          disk: 95,
          responseTime: 1000
        }
      })
    }
    toast.success(`${category} settings reset to defaults`)
  }

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    toast.success('API key copied to clipboard')
  }

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'America/Chicago',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo',
    'Asia/Shanghai', 'Australia/Sydney'
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' }
  ]

  if (loading) {
    return (
      <AdminLayout title="System Settings" subtitle="Configure system-wide settings and preferences">
        <div className="text-center py-8">Loading settings...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="System Settings" 
      subtitle="Configure system-wide settings and preferences"
      badge={
        <Badge variant="outline" className="text-green-600">
          <Activity className="mr-1 h-3 w-3" />
          System Operational
        </Badge>
      }
    >
      <div className="space-y-6">

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="api">API & Webhooks</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>Basic site information and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={systemSettings.adminEmail}
                    onChange={(e) => setSystemSettings({ ...systemSettings, adminEmail: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={systemSettings.siteDescription}
                  onChange={(e) => setSystemSettings({ ...systemSettings, siteDescription: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({ ...systemSettings, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map(tz => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({ ...systemSettings, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Settings
              </CardTitle>
              <CardDescription>User registration and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable site access for maintenance
                  </p>
                </div>
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register accounts
                  </p>
                </div>
                <Switch
                  checked={systemSettings.registrationEnabled}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, registrationEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Verification Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch
                  checked={systemSettings.emailVerificationRequired}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, emailVerificationRequired: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication Required</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all user accounts
                  </p>
                </div>
                <Switch
                  checked={systemSettings.twoFactorAuthRequired}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, twoFactorAuthRequired: checked })}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileUpload">Max File Upload (MB)</Label>
                  <Input
                    id="maxFileUpload"
                    type="number"
                    value={systemSettings.maxFileUploadSize}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxFileUploadSize: parseInt(e.target.value) || 100 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: parseInt(e.target.value) || 3600 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                  />
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => resetToDefaults('system')}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => saveSettings('General')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Channels
              </CardTitle>
              <CardDescription>Configure how you receive system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label>Email Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                  />
                  <Button variant="outline" size="sm" onClick={() => testNotification('email')}>
                    Test
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <Label>Slack Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to Slack channel
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings.slackNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, slackNotifications: checked })}
                  />
                  <Button variant="outline" size="sm" onClick={() => testNotification('Slack')}>
                    Test
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Label>Webhook Notifications</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to external webhook
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={notificationSettings.webhookNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, webhookNotifications: checked })}
                  />
                  <Button variant="outline" size="sm" onClick={() => testNotification('webhook')}>
                    Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Configuration</CardTitle>
              <CardDescription>Email and webhook endpoint configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Email From Address</Label>
                  <Input
                    id="emailFrom"
                    type="email"
                    value={notificationSettings.emailFrom}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailFrom: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailReplyTo">Email Reply-To Address</Label>
                  <Input
                    id="emailReplyTo"
                    type="email"
                    value={notificationSettings.emailReplyTo}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailReplyTo: e.target.value })}
                  />
                </div>
              </div>

              {notificationSettings.slackNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                  <Input
                    id="slackWebhook"
                    type="url"
                    value={notificationSettings.slackWebhookUrl}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, slackWebhookUrl: e.target.value })}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              )}

              {notificationSettings.webhookNotifications && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    value={notificationSettings.webhookUrl}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, webhookUrl: e.target.value })}
                    placeholder="https://your-app.com/webhook"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>Configure when to send alert notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpuThreshold">CPU Usage Threshold (%)</Label>
                  <Input
                    id="cpuThreshold"
                    type="number"
                    value={notificationSettings.alertThresholds.cpu}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      alertThresholds: { ...notificationSettings.alertThresholds, cpu: parseInt(e.target.value) || 85 }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memoryThreshold">Memory Usage Threshold (%)</Label>
                  <Input
                    id="memoryThreshold"
                    type="number"
                    value={notificationSettings.alertThresholds.memory}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      alertThresholds: { ...notificationSettings.alertThresholds, memory: parseInt(e.target.value) || 90 }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diskThreshold">Disk Usage Threshold (%)</Label>
                  <Input
                    id="diskThreshold"
                    type="number"
                    value={notificationSettings.alertThresholds.disk}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      alertThresholds: { ...notificationSettings.alertThresholds, disk: parseInt(e.target.value) || 95 }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="responseTimeThreshold">Response Time Threshold (ms)</Label>
                  <Input
                    id="responseTimeThreshold"
                    type="number"
                    value={notificationSettings.alertThresholds.responseTime}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      alertThresholds: { ...notificationSettings.alertThresholds, responseTime: parseInt(e.target.value) || 1000 }
                    })}
                  />
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => resetToDefaults('notifications')}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
                <Button onClick={() => saveSettings('Notification')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Password Policy
              </CardTitle>
              <CardDescription>Configure password requirements and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passwordLength">Minimum Password Length</Label>
                <Input
                  id="passwordLength"
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) || 8 })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch
                    checked={securitySettings.passwordRequireSpecialChars}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireSpecialChars: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Numbers</Label>
                  <Switch
                    checked={securitySettings.passwordRequireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireNumbers: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Uppercase Letters</Label>
                  <Switch
                    checked={securitySettings.passwordRequireUppercase}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, passwordRequireUppercase: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Session Security
              </CardTitle>
              <CardDescription>Session and CORS configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Secure Session Cookies</Label>
                  <p className="text-sm text-muted-foreground">
                    Require HTTPS for session cookies
                  </p>
                </div>
                <Switch
                  checked={securitySettings.sessionSecure}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, sessionSecure: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable CORS</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow cross-origin resource sharing
                  </p>
                </div>
                <Switch
                  checked={securitySettings.corsEnabled}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, corsEnabled: checked })}
                />
              </div>

              {securitySettings.corsEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="corsOrigins">Allowed CORS Origins</Label>
                  <Input
                    id="corsOrigins"
                    value={securitySettings.corsOrigins}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, corsOrigins: e.target.value })}
                    placeholder="https://example.com, https://app.example.com"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rate Limiting & IP Control
              </CardTitle>
              <CardDescription>Control request rates and IP access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit requests per IP address
                  </p>
                </div>
                <Switch
                  checked={securitySettings.rateLimitEnabled}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, rateLimitEnabled: checked })}
                />
              </div>

              {securitySettings.rateLimitEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rateLimitRequests">Max Requests</Label>
                    <Input
                      id="rateLimitRequests"
                      type="number"
                      value={securitySettings.rateLimitRequests}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, rateLimitRequests: parseInt(e.target.value) || 100 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rateLimitWindow">Time Window (seconds)</Label>
                    <Input
                      id="rateLimitWindow"
                      type="number"
                      value={securitySettings.rateLimitWindow}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, rateLimitWindow: parseInt(e.target.value) || 3600 })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label>
                <Textarea
                  id="ipWhitelist"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                  placeholder="192.168.1.1, 10.0.0.0/8"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipBlacklist">IP Blacklist (comma-separated)</Label>
                <Textarea
                  id="ipBlacklist"
                  value={securitySettings.ipBlacklist}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipBlacklist: e.target.value })}
                  placeholder="192.168.1.100, 203.0.113.0/24"
                  rows={2}
                />
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <div className="flex justify-end">
                <Button onClick={() => saveSettings('Security')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Configuration
              </CardTitle>
              <CardDescription>Manage API access and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable API Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow external API access to the system
                  </p>
                </div>
                <Switch
                  checked={apiSettings.apiEnabled}
                  onCheckedChange={(checked) => setApiSettings({ ...apiSettings, apiEnabled: checked })}
                />
              </div>

              {apiSettings.apiEnabled && (
                <>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="icon" onClick={copyApiKey}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={generateNewApiKey}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={apiSettings.apiRateLimit}
                        onChange={(e) => setApiSettings({ ...apiSettings, apiRateLimit: parseInt(e.target.value) || 1000 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiKeyExpiry">API Key Expiry (days)</Label>
                      <Input
                        id="apiKeyExpiry"
                        type="number"
                        value={apiSettings.apiKeyExpiryDays}
                        onChange={(e) => setApiSettings({ ...apiSettings, apiKeyExpiryDays: parseInt(e.target.value) || 365 })}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>Configure outgoing webhook settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Webhooks</Label>
                  <p className="text-sm text-muted-foreground">
                    Send event notifications to external endpoints
                  </p>
                </div>
                <Switch
                  checked={apiSettings.webhooksEnabled}
                  onCheckedChange={(checked) => setApiSettings({ ...apiSettings, webhooksEnabled: checked })}
                />
              </div>

              {apiSettings.webhooksEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookRetries">Max Webhook Retries</Label>
                    <Input
                      id="webhookRetries"
                      type="number"
                      value={apiSettings.maxWebhookRetries}
                      onChange={(e) => setApiSettings({ ...apiSettings, maxWebhookRetries: parseInt(e.target.value) || 3 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookTimeout">Webhook Timeout (seconds)</Label>
                    <Input
                      id="webhookTimeout"
                      type="number"
                      value={apiSettings.webhookTimeout}
                      onChange={(e) => setApiSettings({ ...apiSettings, webhookTimeout: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <div className="px-6 pb-6">
              <div className="flex justify-end">
                <Button onClick={() => saveSettings('API')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>View system status and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">System Version</Label>
                  <p className="text-sm text-muted-foreground">v2.1.0</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">January 11, 2025</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Uptime</Label>
                  <p className="text-sm text-muted-foreground">15 days, 4 hours</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Node.js Version</Label>
                  <p className="text-sm text-muted-foreground">v18.19.0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Information
              </CardTitle>
              <CardDescription>Database connection and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Database Type</Label>
                  <p className="text-sm text-muted-foreground">PostgreSQL</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Database Version</Label>
                  <p className="text-sm text-muted-foreground">15.3</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Connection Status</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-muted-foreground">Connected</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Pool Size</Label>
                  <p className="text-sm text-muted-foreground">25/100</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Database className="mr-2 h-4 w-4" />
                  Test Connection
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Actions
              </CardTitle>
              <CardDescription>System maintenance and administrative actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restart Services
                </Button>
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Backup Database
                </Button>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Security Scan
                </Button>
                <Button variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Performance Test
                </Button>
              </div>
              
              <Separator />
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Maintenance Mode</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      System is currently {systemSettings.maintenanceMode ? 'in maintenance mode' : 'operational'}.
                      {systemSettings.maintenanceMode && ' Users cannot access the system.'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AdminLayout>
  )
}