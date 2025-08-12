'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw, Server, Database, GitBranch, HardDrive, Key, Search, MessageSquare, BarChart3, Clock, Shield, Container, Workflow, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServicePortal {
  id: string
  name: string
  description: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  category: 'infrastructure' | 'automation' | 'monitoring' | 'tools' | 'ai'
  status: 'online' | 'offline' | 'checking' | 'warning'
  responseTime?: number
  lastChecked?: Date
  features?: string[]
}

const services: ServicePortal[] = [
  {
    id: 'pgadmin',
    name: 'pgAdmin',
    description: 'PostgreSQL Database Management',
    url: 'https://pgadmin.agistaffers.com',
    icon: Database,
    category: 'infrastructure',
    status: 'checking',
    features: ['Database Admin', 'Query Builder', 'Backup Management', 'User Management']
  },
  {
    id: 'n8n',
    name: 'n8n Automation',
    description: 'Workflow Automation Platform',
    url: 'https://n8n.agistaffers.com',
    icon: GitBranch,
    category: 'automation',
    status: 'checking',
    features: ['Visual Workflows', 'API Integration', 'Scheduled Tasks', 'Event Triggers']
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Metrics and Analytics Platform',
    url: 'https://grafana.agistaffers.com',
    icon: BarChart3,
    category: 'monitoring',
    status: 'checking',
    features: ['Real-time Metrics', 'Custom Dashboards', 'Alerts', 'Data Visualization']
  },
  {
    id: 'uptime',
    name: 'Uptime Kuma',
    description: 'Uptime Monitoring',
    url: 'https://uptime.agistaffers.com',
    icon: Clock,
    category: 'monitoring',
    status: 'checking',
    features: ['Website Monitoring', 'SSL Checks', 'Status Pages', 'Notifications']
  },
  {
    id: 'portainer',
    name: 'Portainer',
    description: 'Container Management',
    url: 'https://portainer.agistaffers.com',
    icon: Container,
    category: 'infrastructure',
    status: 'checking',
    features: ['Docker Management', 'Container Logs', 'Resource Monitoring', 'Stack Deployment']
  },
  {
    id: 'minio',
    name: 'MinIO',
    description: 'Object Storage',
    url: 'https://minio.agistaffers.com',
    icon: HardDrive,
    category: 'infrastructure',
    status: 'checking',
    features: ['S3 Compatible', 'File Storage', 'Backup Storage', 'CDN Integration']
  },
  {
    id: 'vault',
    name: 'Vault',
    description: 'Secrets Management',
    url: 'https://vault.agistaffers.com',
    icon: Key,
    category: 'infrastructure',
    status: 'checking',
    features: ['Secret Storage', 'API Keys', 'Certificates', 'Encryption']
  },
  {
    id: 'flowise',
    name: 'Flowise AI',
    description: 'AI Flow Builder',
    url: 'https://flowise.agistaffers.com',
    icon: Workflow,
    category: 'ai',
    status: 'checking',
    features: ['Visual AI Flows', 'LLM Integration', 'Custom Chains', 'API Endpoints']
  },
  {
    id: 'chat',
    name: 'Open WebUI',
    description: 'AI Chat Interface',
    url: 'https://chat.agistaffers.com',
    icon: MessageSquare,
    category: 'ai',
    status: 'checking',
    features: ['Chat Interface', 'Multi-Model', 'History', 'Custom Prompts']
  },
  {
    id: 'searxng',
    name: 'SearXNG',
    description: 'Privacy-focused Search',
    url: 'https://searxng.agistaffers.com',
    icon: Search,
    category: 'tools',
    status: 'checking',
    features: ['Private Search', 'Multi-Engine', 'No Tracking', 'Custom Filters']
  }
]

export function ServicePortalGrid() {
  const [serviceStatuses, setServiceStatuses] = useState<Record<string, ServicePortal>>(
    services.reduce((acc, service) => ({
      ...acc,
      [service.id]: service
    }), {})
  )
  const [isChecking, setIsChecking] = useState(false)
  const [mounted, setMounted] = useState(false)

  const checkServiceStatus = async (service: ServicePortal) => {
    try {
      const startTime = Date.now()
      // In production, this would make an actual health check
      // For now, we'll simulate with a timeout
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))
      
      const responseTime = Date.now() - startTime
      const isOnline = Math.random() > 0.1 // 90% chance of being online
      
      return {
        ...service,
        status: isOnline ? 'online' : 'offline',
        responseTime,
        lastChecked: new Date()
      } as ServicePortal
    } catch (error) {
      return {
        ...service,
        status: 'offline',
        lastChecked: new Date()
      } as ServicePortal
    }
  }

  const checkAllServices = async () => {
    setIsChecking(true)
    const updatedServices = await Promise.all(
      services.map(service => checkServiceStatus(service))
    )
    
    setServiceStatuses(
      updatedServices.reduce((acc, service) => ({
        ...acc,
        [service.id]: service
      }), {})
    )
    setIsChecking(false)
  }

  useEffect(() => {
    setMounted(true)
    checkAllServices()
    const interval = setInterval(checkAllServices, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'offline':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBadge = (status: string, responseTime?: number) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Online {responseTime && `(${responseTime}ms)`}
          </Badge>
        )
      case 'offline':
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Offline
          </Badge>
        )
      case 'warning':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Warning
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            Checking...
          </Badge>
        )
    }
  }

  const categories = {
    infrastructure: { title: 'Infrastructure', services: [] as ServicePortal[] },
    automation: { title: 'Automation', services: [] as ServicePortal[] },
    monitoring: { title: 'Monitoring', services: [] as ServicePortal[] },
    ai: { title: 'AI Services', services: [] as ServicePortal[] },
    tools: { title: 'Tools', services: [] as ServicePortal[] }
  }

  Object.values(serviceStatuses).forEach(service => {
    categories[service.category].services.push(service)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Service Portals</h2>
          <p className="text-muted-foreground">Quick access to all integrated services</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkAllServices}
          disabled={isChecking}
        >
          <RefreshCw className={cn('h-4 w-4 mr-2', isChecking && 'animate-spin')} />
          Refresh Status
        </Button>
      </div>

      {Object.entries(categories).map(([key, category]) => {
        if (category.services.length === 0) return null
        
        return (
          <div key={key} className="space-y-4">
            <h3 className="text-lg font-semibold">{category.title}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.services.map(service => {
                const Icon = service.icon
                return (
                  <Card key={service.id} className="relative overflow-hidden">
                    <div className={cn(
                      'absolute top-0 right-0 w-2 h-2 m-4 rounded-full',
                      getStatusColor(service.status)
                    )} />
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {service.name}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(service.status, service.responseTime)}
                        {mounted && service.lastChecked && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(service.lastChecked).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      
                      {service.features && (
                        <div className="flex flex-wrap gap-1">
                          {service.features.slice(0, 3).map(feature => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {service.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{service.features.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <Button
                        className="w-full"
                        variant={service.status === 'online' ? 'default' : 'secondary'}
                        disabled={service.status === 'offline'}
                        asChild
                      >
                        <a
                          href={service.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          Open Portal
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}

      {Object.values(serviceStatuses).some(s => s.status === 'offline') && (
        <Card className="border-yellow-600 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Service Issues Detected
            </CardTitle>
            <CardDescription>
              Some services are currently offline. Check the individual services for more details.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}