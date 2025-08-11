'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Metrics {
  system: {
    cpu: {
      usage: number
      cores: number
    }
    memory: {
      total: number
      used: number
      available: number
      cached: number
      percentage: number
    }
    disk: {
      total: number
      used: number
      percentage: number
    }
    network: {
      rx: number
      tx: number
    }
    uptime: number
  }
  containers: Array<{
    name: string
    status: string
    memory: number
  }>
  timestamp: string
}

async function fetchMetrics(): Promise<Metrics> {
  const response = await fetch('/api/metrics')
  if (!response.ok) {
    throw new Error('Failed to fetch metrics')
  }
  return response.json()
}

export function DashboardMetrics() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium h-4 bg-gray-200 rounded w-20"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        Failed to load metrics
      </div>
    )
  }

  if (!metrics) return null

  const formatMbps = (bytes: number) => {
    const mbps = (bytes * 8) / (1024 * 1024)
    return `${mbps.toFixed(2)} Mbps`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            CPU Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(metrics?.system?.cpu?.usage ?? 0).toFixed(1)}%
          </div>
          <Progress value={metrics?.system?.cpu?.usage ?? 0} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Cores: {metrics?.system?.cpu?.cores ?? 'Unknown'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Memory Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(metrics?.system?.memory?.percentage ?? 0).toFixed(1)}%
          </div>
          <Progress value={metrics?.system?.memory?.percentage ?? 0} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics?.system?.memory?.used ?? 0} GB / {metrics?.system?.memory?.total ?? 0} GB
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Disk Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(metrics?.system?.disk?.percentage ?? 0).toFixed(1)}%
          </div>
          <Progress value={metrics?.system?.disk?.percentage ?? 0} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics?.system?.disk?.used ?? 0} GB / {metrics?.system?.disk?.total ?? 0} GB
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Network I/O
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">RX:</span>
              <span className="font-medium">{formatMbps(metrics?.system?.network?.rx ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TX:</span>
              <span className="font-medium">{formatMbps(metrics?.system?.network?.tx ?? 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}