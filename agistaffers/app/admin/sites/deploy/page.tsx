'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/dashboard/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { 
  Globe, 
  Upload, 
  Github, 
  GitBranch, 
  Settings, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Loader2, 
  Rocket,
  Database,
  Shield,
  Zap,
  Code2
} from 'lucide-react'

interface DeploymentStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
  duration?: number
}

interface DeploymentConfig {
  siteName: string
  customerId: string
  deploymentType: 'git' | 'zip' | 'docker'
  gitRepository?: string
  gitBranch?: string
  buildCommand?: string
  outputDirectory?: string
  environmentVariables: { key: string; value: string }[]
  domain?: string
  enableSSL: boolean
  enableCDN: boolean
  enableAnalytics: boolean
  nodeVersion?: string
}

export default function DeployPage() {
  const [step, setStep] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [config, setConfig] = useState<DeploymentConfig>({
    siteName: '',
    customerId: '',
    deploymentType: 'git',
    gitRepository: '',
    gitBranch: 'main',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    environmentVariables: [{ key: '', value: '' }],
    domain: '',
    enableSSL: true,
    enableCDN: true,
    enableAnalytics: true,
    nodeVersion: '18'
  })

  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: '1',
      title: 'Repository Clone',
      description: 'Cloning repository from Git provider',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Dependencies Installation',
      description: 'Installing project dependencies',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Build Process',
      description: 'Building the application',
      status: 'pending'
    },
    {
      id: '4',
      title: 'Asset Optimization',
      description: 'Optimizing assets and static files',
      status: 'pending'
    },
    {
      id: '5',
      title: 'SSL Certificate',
      description: 'Configuring SSL certificate',
      status: 'pending'
    },
    {
      id: '6',
      title: 'CDN Configuration',
      description: 'Setting up Content Delivery Network',
      status: 'pending'
    },
    {
      id: '7',
      title: 'DNS Configuration',
      description: 'Configuring domain and DNS settings',
      status: 'pending'
    },
    {
      id: '8',
      title: 'Final Deployment',
      description: 'Deploying to production servers',
      status: 'pending'
    }
  ])

  const customers = [
    { id: '1', name: 'Tech Startup Inc', email: 'john@techstartup.com' },
    { id: '2', name: 'Acme Corporation', email: 'sarah@acmecorp.com' },
    { id: '3', name: 'Local Restaurant', email: 'mike@localrestaurant.com' },
    { id: '4', name: 'Design Studio LLC', email: 'emily@designstudio.com' },
    { id: '5', name: 'Wilson Real Estate', email: 'robert@realestate.com' }
  ]

  const handleAddEnvironmentVariable = () => {
    setConfig({
      ...config,
      environmentVariables: [...config.environmentVariables, { key: '', value: '' }]
    })
  }

  const handleRemoveEnvironmentVariable = (index: number) => {
    setConfig({
      ...config,
      environmentVariables: config.environmentVariables.filter((_, i) => i !== index)
    })
  }

  const handleEnvironmentVariableChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...config.environmentVariables]
    newEnvVars[index][field] = value
    setConfig({
      ...config,
      environmentVariables: newEnvVars
    })
  }

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return !!(config.siteName && config.customerId && config.deploymentType)
      case 2:
        if (config.deploymentType === 'git') {
          return !!(config.gitRepository && config.gitBranch)
        }
        return true
      case 3:
        return !!(config.buildCommand && config.outputDirectory)
      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1)
      } else {
        handleDeploy()
      }
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    setDeploymentProgress(0)
    
    try {
      for (let i = 0; i < deploymentSteps.length; i++) {
        setDeploymentSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'in-progress' } : step
        ))
        
        // Simulate deployment step
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
        
        setDeploymentSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, status: 'completed' } : step
        ))
        
        setDeploymentProgress(((i + 1) / deploymentSteps.length) * 100)
      }
      
      toast.success('Site deployed successfully!')
    } catch (error) {
      toast.error('Deployment failed. Please try again.')
    } finally {
      setIsDeploying(false)
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name *</Label>
              <Input
                id="siteName"
                value={config.siteName}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                placeholder="my-awesome-site"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={config.customerId} onValueChange={(value) => setConfig({ ...config, customerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deploymentType">Deployment Type *</Label>
              <Select value={config.deploymentType} onValueChange={(value) => setConfig({ ...config, deploymentType: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="git">
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      Git Repository
                    </div>
                  </SelectItem>
                  <SelectItem value="zip">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      ZIP Upload
                    </div>
                  </SelectItem>
                  <SelectItem value="docker">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4" />
                      Docker Image
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {config.deploymentType === 'git' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gitRepository">Git Repository *</Label>
                  <Input
                    id="gitRepository"
                    value={config.gitRepository}
                    onChange={(e) => setConfig({ ...config, gitRepository: e.target.value })}
                    placeholder="https://github.com/username/repo.git"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gitBranch">Branch *</Label>
                  <div className="flex gap-2">
                    <GitBranch className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="gitBranch"
                      value={config.gitBranch}
                      onChange={(e) => setConfig({ ...config, gitBranch: e.target.value })}
                      placeholder="main"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="nodeVersion">Node.js Version</Label>
              <Select value={config.nodeVersion} onValueChange={(value) => setConfig({ ...config, nodeVersion: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">Node.js 16</SelectItem>
                  <SelectItem value="18">Node.js 18</SelectItem>
                  <SelectItem value="20">Node.js 20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="buildCommand">Build Command *</Label>
              <Input
                id="buildCommand"
                value={config.buildCommand}
                onChange={(e) => setConfig({ ...config, buildCommand: e.target.value })}
                placeholder="npm run build"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="outputDirectory">Output Directory *</Label>
              <Input
                id="outputDirectory"
                value={config.outputDirectory}
                onChange={(e) => setConfig({ ...config, outputDirectory: e.target.value })}
                placeholder="dist"
              />
            </div>

            <div className="space-y-4">
              <Label>Environment Variables</Label>
              {config.environmentVariables.map((envVar, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="KEY"
                    value={envVar.key}
                    onChange={(e) => handleEnvironmentVariableChange(index, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="value"
                    value={envVar.value}
                    onChange={(e) => handleEnvironmentVariableChange(index, 'value', e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleRemoveEnvironmentVariable(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleAddEnvironmentVariable}>
                Add Variable
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="domain">Custom Domain (Optional)</Label>
              <Input
                id="domain"
                value={config.domain}
                onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                placeholder="example.com"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <Label>Enable SSL Certificate</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically provision and manage SSL certificates
                  </p>
                </div>
                <Switch
                  checked={config.enableSSL}
                  onCheckedChange={(checked) => setConfig({ ...config, enableSSL: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <Label>Enable CDN</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Global content delivery for faster loading times
                  </p>
                </div>
                <Switch
                  checked={config.enableCDN}
                  onCheckedChange={(checked) => setConfig({ ...config, enableCDN: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <Label>Enable Analytics</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track visitor analytics and performance metrics
                  </p>
                </div>
                <Switch
                  checked={config.enableAnalytics}
                  onCheckedChange={(checked) => setConfig({ ...config, enableAnalytics: checked })}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isDeploying) {
    return (
      <AdminLayout title={`Deploying ${config.siteName}`} subtitle="Please wait while we deploy your site">
        <div className="space-y-6">

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Deployment Progress
            </CardTitle>
            <CardDescription>
              {Math.round(deploymentProgress)}% complete
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={deploymentProgress} className="w-full" />
            
            <div className="space-y-4">
              {deploymentSteps.map((deployStep, index) => (
                <div key={deployStep.id} className="flex items-center gap-3">
                  {getStepIcon(deployStep.status)}
                  <div>
                    <div className="font-medium">{deployStep.title}</div>
                    <div className="text-sm text-muted-foreground">{deployStep.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Deploy New Site" subtitle="Deploy your application to our global hosting platform">
      <div className="space-y-6">

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step >= stepNumber 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-gray-300 bg-white text-gray-300'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-20 h-0.5 ${
                  step > stepNumber ? 'bg-primary' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            Step {step}: {
              step === 1 ? 'Basic Configuration' :
              step === 2 ? 'Source Configuration' :
              step === 3 ? 'Build Configuration' :
              'Advanced Settings'
            }
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Set up the basic details for your deployment'}
            {step === 2 && 'Configure your source code repository or upload'}
            {step === 3 && 'Define build commands and environment variables'}
            {step === 4 && 'Configure domain and additional features'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}
        </CardContent>
        <div className="px-6 pb-6">
          <Separator className="mb-4" />
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNextStep}>
              {step === 4 ? (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Deploy Site
                </>
              ) : (
                'Next Step'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Configuration Summary */}
      {step > 1 && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Site Name:</span>
              <span>{config.siteName || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deployment Type:</span>
              <Badge variant="outline" className="capitalize">{config.deploymentType}</Badge>
            </div>
            {config.gitRepository && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repository:</span>
                <span className="truncate max-w-xs">{config.gitRepository}</span>
              </div>
            )}
            {config.domain && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Custom Domain:</span>
                <span>{config.domain}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">SSL Enabled:</span>
              <Badge variant={config.enableSSL ? "default" : "secondary"}>
                {config.enableSSL ? 'Yes' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </AdminLayout>
  )
}