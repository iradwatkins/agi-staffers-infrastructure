'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Container {
  name: string
  status: string
  cpu: number
  memory: number
  uptime: string
}

async function fetchContainers(): Promise<Container[]> {
  const response = await fetch('/api/metrics')
  if (!response.ok) {
    throw new Error('Failed to fetch containers')
  }
  const data = await response.json()
  return data.containers || []
}

export function ContainerStatus() {
  const { data: containers = [], isLoading } = useQuery({
    queryKey: ['containers'],
    queryFn: fetchContainers,
    refetchInterval: 5000,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Container Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Container Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {containers.length === 0 ? (
            <p className="text-muted-foreground">No containers found</p>
          ) : (
            containers.map((container) => (
              <div key={container.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{container.name}</h4>
                  <Badge
                    variant={container.status === 'running' ? 'default' : 'secondary'}
                  >
                    {container.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>CPU: {container.cpu.toFixed(1)}%</span>
                    <span>Memory: {container.memory.toFixed(1)}%</span>
                  </div>
                  <div>Uptime: {container.uptime}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}