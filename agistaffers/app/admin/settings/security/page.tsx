'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Shield,
  Key,
  Lock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Clock,
  Activity,
  Globe,
  RefreshCw,
  Save,
  Download,
  Settings
} from 'lucide-react'

interface SecuritySettings {
  // Password Policy
  passwordMinLength: number
  passwordRequireSpecialChars: boolean
  passwordRequireNumbers: boolean
  passwordRequireUppercase: boolean
  passwordRequireLowercase: boolean
  passwordHistoryCount: number
  passwordExpiryDays: number

  // Session Security
  sessionTimeout: number
  sessionSecure: boolean
  sessionSameSite: 'strict' | 'lax' | 'none'
  multipleSessionsAllowed: boolean
  sessionInactivityTimeout: number

  // Authentication
  twoFactorRequired: boolean
  twoFactorGracePeriod: number
  maxLoginAttempts: number
  lockoutDuration: number
  requireEmailVerification: boolean

  // Network Security
  corsEnabled: boolean
  corsOrigins: string[]
  rateLimitEnabled: boolean
  rateLimitRequests: number
  rateLimitWindow: number
  ipWhitelist: string[]
  ipBlacklist: string[]

  // Security Headers
  hsts: boolean
  xssProtection: boolean
  contentTypeNosniff: boolean
  frameOptions: 'deny' | 'sameorigin' | 'allowall'
  cspEnabled: boolean
  cspPolicy: string

  // Audit & Monitoring
  auditLogging: boolean
  logFailedLogins: boolean
  logSuccessfulLogins: boolean
  securityAlerts: boolean
  alertThreshold: number
}

interface SecurityEvent {
  id: string
  type: 'login_failed' | 'login_success' | 'password_changed' | 'security_alert' | 'policy_violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  user: string
  ipAddress: string
  timestamp: string
  resolved: boolean
}

export default function SecuritySettingsPage() {
  const [settings, setSettings] = useState<SecuritySettings>({
    // Password Policy
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordHistoryCount: 5,
    passwordExpiryDays: 90,

    // Session Security
    sessionTimeout: 3600,
    sessionSecure: true,
    sessionSameSite: 'strict',
    multipleSessionsAllowed: false,
    sessionInactivityTimeout: 1800,

    // Authentication
    twoFactorRequired: false,
    twoFactorGracePeriod: 7,
    maxLoginAttempts: 5,
    lockoutDuration: 300,
    requireEmailVerification: true,

    // Network Security
    corsEnabled: true,
    corsOrigins: ['https://agistaffers.com'],
    rateLimitEnabled: true,
    rateLimitRequests: 100,
    rateLimitWindow: 3600,
    ipWhitelist: [],
    ipBlacklist: [],

    // Security Headers
    hsts: true,
    xssProtection: true,
    contentTypeNosniff: true,
    frameOptions: 'deny',
    cspEnabled: true,
    cspPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",

    // Audit & Monitoring
    auditLogging: true,
    logFailedLogins: true,
    logSuccessfulLogins: false,
    securityAlerts: true,
    alertThreshold: 5
  })

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(85)

  useEffect(() => {
    fetchSecurityEvents()
    calculatePasswordStrength()
  }, [settings])

  const fetchSecurityEvents = async () => {
    try {
      // Mock data for demonstration
      setSecurityEvents([
        {
          id: '1',
          type: 'login_failed',
          severity: 'medium',
          description: 'Multiple failed login attempts from suspicious IP',
          user: 'unknown',
          ipAddress: '192.168.1.100',
          timestamp: '2025-01-11T10:30:00Z',
          resolved: false
        },
        {
          id: '2',
          type: 'security_alert',
          severity: 'high',
          description: 'Unusual login pattern detected - login from new country',
          user: 'john@agistaffers.com',
          ipAddress: '203.0.113.45',
          timestamp: '2025-01-11T09:15:00Z',
          resolved: true
        },
        {
          id: '3',
          type: 'password_changed',
          severity: 'low',
          description: 'User password changed successfully',
          user: 'sarah@agistaffers.com',
          ipAddress: '192.168.1.50',
          timestamp: '2025-01-11T08:45:00Z',
          resolved: true
        },
        {
          id: '4',
          type: 'policy_violation',
          severity: 'medium',
          description: 'Rate limit exceeded for API endpoint',
          user: 'api_user',
          ipAddress: '10.0.0.100',
          timestamp: '2025-01-11T08:20:00Z',
          resolved: false
        }
      ])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch security events:', error)
      toast.error('Failed to load security events')
      setLoading(false)
    }
  }

  const calculatePasswordStrength = () => {
    let score = 0
    const maxScore = 100

    // Length requirement
    if (settings.passwordMinLength >= 8) score += 20
    if (settings.passwordMinLength >= 12) score += 10

    // Character requirements
    if (settings.passwordRequireUppercase) score += 15
    if (settings.passwordRequireLowercase) score += 15
    if (settings.passwordRequireNumbers) score += 15
    if (settings.passwordRequireSpecialChars) score += 15

    // Password history
    if (settings.passwordHistoryCount >= 3) score += 5
    if (settings.passwordHistoryCount >= 5) score += 5

    // Expiry
    if (settings.passwordExpiryDays <= 90 && settings.passwordExpiryDays > 0) score += 10

    setPasswordStrength(Math.min(score, maxScore))
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Security settings saved successfully')
    } catch (error) {
      toast.error('Failed to save security settings')
    } finally {
      setSaving(false)
    }
  }

  const handleRunSecurityScan = async () => {
    try {
      toast.success('Security scan started. Results will be available shortly.')
    } catch (error) {
      toast.error('Failed to start security scan')
    }
  }

  const handleExportAuditLog = () => {
    toast.success('Audit log export started. Download will begin shortly.')
  }

  const getEventSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength >= 80) return 'bg-green-500'
    if (strength >= 60) return 'bg-yellow-500'
    if (strength >= 40) return 'bg-orange-500'
    return 'bg-red-500'
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
    <AdminLayout title="Security Settings" subtitle="Configure security policies, authentication, and monitoring">
      <div className="space-y-6">
        {/* Security Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Password Strength</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passwordStrength}%</div>
              <Progress value={passwordStrength} className={`mt-2 ${getPasswordStrengthColor(passwordStrength)}`} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Current user sessions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {securityEvents.filter(e => !e.resolved && (e.severity === 'high' || e.severity === 'critical')).length}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">2FA Adoption</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground">Users with 2FA enabled</p>
            </CardContent>
          </Card>
        </div>

        {/* Password Policy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Policy
            </CardTitle>
            <CardDescription>Configure password requirements and security policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) || 8 })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Require Uppercase Letters</Label>
                <Switch
                  checked={settings.passwordRequireUppercase}
                  onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireUppercase: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Require Lowercase Letters</Label>
                <Switch
                  checked={settings.passwordRequireLowercase}
                  onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireLowercase: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Require Numbers</Label>
                <Switch
                  checked={settings.passwordRequireNumbers}
                  onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireNumbers: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Require Special Characters</Label>
                <Switch
                  checked={settings.passwordRequireSpecialChars}
                  onCheckedChange={(checked) => setSettings({ ...settings, passwordRequireSpecialChars: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passwordHistory">Password History Count</Label>
                <Input
                  id="passwordHistory"
                  type="number"
                  value={settings.passwordHistoryCount}
                  onChange={(e) => setSettings({ ...settings, passwordHistoryCount: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => setSettings({ ...settings, passwordExpiryDays: parseInt(e.target.value) || 90 })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
            <CardDescription>Configure login security and two-factor authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Force all users to enable 2FA for enhanced security
                </p>
              </div>
              <Switch
                checked={settings.twoFactorRequired}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorRequired: checked })}
              />
            </div>

            {settings.twoFactorRequired && (
              <div className="space-y-2">
                <Label htmlFor="twoFactorGrace">2FA Grace Period (days)</Label>
                <Input
                  id="twoFactorGrace"
                  type="number"
                  value={settings.twoFactorGracePeriod}
                  onChange={(e) => setSettings({ ...settings, twoFactorGracePeriod: parseInt(e.target.value) || 7 })}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) || 5 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lockoutDuration">Lockout Duration (seconds)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  value={settings.lockoutDuration}
                  onChange={(e) => setSettings({ ...settings, lockoutDuration: parseInt(e.target.value) || 300 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require users to verify their email address before account activation
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Session Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Security
            </CardTitle>
            <CardDescription>Configure session management and timeout settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 3600 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inactivityTimeout">Inactivity Timeout (seconds)</Label>
                <Input
                  id="inactivityTimeout"
                  type="number"
                  value={settings.sessionInactivityTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionInactivityTimeout: parseInt(e.target.value) || 1800 })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Secure Session Cookies</Label>
                <p className="text-sm text-muted-foreground">
                  Require HTTPS for session cookies
                </p>
              </div>
              <Switch
                checked={settings.sessionSecure}
                onCheckedChange={(checked) => setSettings({ ...settings, sessionSecure: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Multiple Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to be logged in from multiple devices simultaneously
                </p>
              </div>
              <Switch
                checked={settings.multipleSessionsAllowed}
                onCheckedChange={(checked) => setSettings({ ...settings, multipleSessionsAllowed: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Security Monitoring
            </CardTitle>
            <CardDescription>Configure audit logging and security alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label>Audit Logging</Label>
                <Switch
                  checked={settings.auditLogging}
                  onCheckedChange={(checked) => setSettings({ ...settings, auditLogging: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Security Alerts</Label>
                <Switch
                  checked={settings.securityAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, securityAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Log Failed Logins</Label>
                <Switch
                  checked={settings.logFailedLogins}
                  onCheckedChange={(checked) => setSettings({ ...settings, logFailedLogins: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Log Successful Logins</Label>
                <Switch
                  checked={settings.logSuccessfulLogins}
                  onCheckedChange={(checked) => setSettings({ ...settings, logSuccessfulLogins: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertThreshold">Alert Threshold (failed attempts)</Label>
              <Input
                id="alertThreshold"
                type="number"
                value={settings.alertThreshold}
                onChange={(e) => setSettings({ ...settings, alertThreshold: parseInt(e.target.value) || 5 })}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRunSecurityScan}>
                <Shield className="mr-2 h-4 w-4" />
                Run Security Scan
              </Button>
              <Button variant="outline" onClick={handleExportAuditLog}>
                <Download className="mr-2 h-4 w-4" />
                Export Audit Log
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Latest security-related activities and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading security events...</div>
            ) : securityEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No security events found
              </div>
            ) : (
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getEventSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <div>
                        <div className="font-medium">{event.description}</div>
                        <div className="text-sm text-muted-foreground">
                          User: {event.user} • IP: {event.ipAddress}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm">{formatTimestamp(event.timestamp)}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {event.resolved ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                          <span className="text-xs">
                            {event.resolved ? 'Resolved' : 'Open'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Security Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}