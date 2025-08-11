'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Database,
  Zap,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Brain,
  Box,
} from 'lucide-react'
import { toast } from 'sonner'

interface Service {
  name: string
  displayName: string
  limit: number
  reservation: number
  current?: number
  status?: string
  features: string[]
  critical: boolean
}

interface OptimizationStatus {
  lastCleanup: string | null
  totalSaved: number
  activeOptimizations: string[]
  modelUnloads: number
  cacheClears: number
}

const services: Record<string, Service> = {
  ollama: {
    name: 'ollama',
    displayName: 'Ollama AI',
    limit: 512,
    reservation: 256,
    features: ['auto-unload', 'model-tracking'],
    critical: false,
  },
  'open-webui': {
    name: 'open-webui',
    displayName: 'Open WebUI',
    limit: 768,
    reservation: 512,
    features: ['cache-management', 'session-tracking'],
    critical: true,
  },
  flowise: {
    name: 'flowise',
    displayName: 'Flowise AI',
    limit: 512,
    reservation: 256,
    features: ['workflow-optimization'],
    critical: false,
  },
  neo4j: {
    name: 'neo4j',
    displayName: 'Neo4j Graph DB',
    limit: 512,
    reservation: 384,
    features: ['jvm-tuning', 'heap-optimization'],
    critical: true,
  },
  n8n: {
    name: 'n8n',
    displayName: 'N8N Automation',
    limit: 512,
    reservation: 256,
    features: ['workflow-caching'],
    critical: true,
  },
}

async function fetchOptimizationStatus() {
  const response = await fetch('/api/metrics')
  if (!response.ok) {
    throw new Error('Failed to fetch metrics')
  }
  const data = await response.json()
  
  // Update service current memory usage
  const updatedServices = { ...services }
  if (data.containers) {
    data.containers.forEach((container: { name: string; memory?: number; status?: string }) => {
      if (updatedServices[container.name]) {
        updatedServices[container.name].current = container.memory || 0
        updatedServices[container.name].status = container.status
      }
    })
  }
  
  return {
    services: updatedServices,
    optimization: {
      lastCleanup: null,
      totalSaved: 0,
      activeOptimizations: [],
      modelUnloads: 0,
      cacheClears: 0,
    } as OptimizationStatus,
  }
}

async function optimizeService(service: string, action: string) {
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service, action }),
  })
  if (!response.ok) {
    throw new Error('Failed to optimize service')
  }
  return response.json()
}

export function MemoryOptimization() {
  const queryClient = useQueryClient()
  const [activeOptimizations, setActiveOptimizations] = useState<Set<string>>(new Set())
  
  const { data, isLoading } = useQuery({
    queryKey: ['optimization-status'],
    queryFn: fetchOptimizationStatus,
    refetchInterval: 10000, // Refresh every 10 seconds
  })
  
  const optimizeMutation = useMutation({
    mutationFn: ({ service, action }: { service: string; action: string }) =>
      optimizeService(service, action),
    onMutate: ({ service, action }) => {
      setActiveOptimizations(prev => new Set(prev).add(`${service}-${action}`))
    },
    onSuccess: (_, { service, action }) => {
      toast.success(`${action} completed for ${service}`)
      queryClient.invalidateQueries({ queryKey: ['optimization-status'] })
    },
    onError: (error, { service, action }) => {
      toast.error(`Failed to ${action} for ${service}`)
      console.error(error)
    },
    onSettled: (_, __, { service, action }) => {
      setActiveOptimizations(prev => {
        const next = new Set(prev)
        next.delete(`${service}-${action}`)
        return next
      })
    },
  })
  
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'ollama':
        return Brain
      case 'neo4j':
        return Database
      default:
        return Box
    }
  }
  
  const getMemoryPercentage = (current?: number, limit?: number) => {
    if (!current || !limit) return 0
    return (current / limit) * 100
  }
  
  const formatMemory = (mb?: number) => {
    if (!mb) return '0 MB'
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`
    return `${mb.toFixed(0)} MB`
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memory Optimization</CardTitle>
          <CardDescription>Loading optimization status...</CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  const { services: currentServices, optimization } = data || { services: {}, optimization: {} }
  
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Memory Optimization Dashboard
          </CardTitle>
          <CardDescription>
            Monitor and optimize service memory usage in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{optimization.totalSaved || 0} MB</p>
              <p className="text-sm text-muted-foreground">Total Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{optimization.modelUnloads || 0}</p>
              <p className="text-sm text-muted-foreground">Model Unloads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{optimization.cacheClears || 0}</p>
              <p className="text-sm text-muted-foreground">Cache Clears</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {optimization.activeOptimizations?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Service Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(currentServices).map((service) => {
          const Icon = getServiceIcon(service.name)
          const memoryPercentage = getMemoryPercentage(service.current, service.limit)
          const isOptimizing = activeOptimizations.has(`${service.name}-unload`) ||
                             activeOptimizations.has(`${service.name}-clear-cache`)
          
          return (
            <Card key={service.name}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">{service.displayName}</CardTitle>
                      <CardDescription className="text-xs">
                        {service.critical ? 'Critical Service' : 'Non-Critical'}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={service.status === 'running' ? 'default' : 'secondary'}>
                    {service.status || 'unknown'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span className="font-medium">
                      {formatMemory(service.current)} / {formatMemory(service.limit)}
                    </span>
                  </div>
                  <Progress value={memoryPercentage} />
                  <p className="text-xs text-muted-foreground">
                    Reserved: {formatMemory(service.reservation)}
                  </p>
                </div>
                
                {memoryPercentage > 80 && (
                  <Alert className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      High memory usage detected
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  {service.name === 'ollama' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => optimizeMutation.mutate({ 
                        service: service.name, 
                        action: 'unload-models' 
                      })}
                      disabled={isOptimizing}
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Unload Models
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => optimizeMutation.mutate({ 
                      service: service.name, 
                      action: 'clear-cache' 
                    })}
                    disabled={isOptimizing}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            System-wide optimization actions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => optimizeMutation.mutate({ 
              service: 'system', 
              action: 'clear-all-caches' 
            })}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Caches
          </Button>
          <Button
            variant="outline"
            onClick={() => optimizeMutation.mutate({ 
              service: 'ollama', 
              action: 'unload-all-models' 
            })}
          >
            <Brain className="h-4 w-4 mr-2" />
            Unload All Models
          </Button>
          <Button
            variant="outline"
            onClick={() => optimizeMutation.mutate({ 
              service: 'system', 
              action: 'restart-non-critical' 
            })}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Restart Non-Critical
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}