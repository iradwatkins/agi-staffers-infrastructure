'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'

interface ContainerInfo {
  name: string
  displayName: string
  icon: string
  status: string
  cpu: number
  memory: number
  uptime: string
}

interface MonitoringData {
  cpu: {
    usage: number
    cores: number
  }
  memory: {
    total: number
    free: number
    used: number
    percentage: number
  }
  disk: {
    total: number
    free: number
    used: number
    percentage: number
  }
  network: {
    rx: number
    tx: number
  }
  containers: ContainerInfo[]
  timestamp: number
}

interface HistoricalData {
  cpu: number[]
  memory: number[]
  disk: number[]
  networkIn: number[]
  networkOut: number[]
  timestamps: number[]
}

const containerMapping = {
  'pgadmin': { displayName: 'PgAdmin', icon: 'database' },
  'n8n': { displayName: 'n8n Automation', icon: 'git-branch' },
  'open-webui': { displayName: 'AI Chat', icon: 'message-square' },
  'flowise': { displayName: 'Flowise AI', icon: 'cpu' },
  'portainer': { displayName: 'Portainer', icon: 'box' },
  'searxng': { displayName: 'SearXNG', icon: 'search' },
  'admin-dashboard': { displayName: 'Admin Dashboard', icon: 'layout' },
  'stepperslife': { displayName: 'SteppersLife', icon: 'globe' },
  'caddy': { displayName: 'Caddy Server', icon: 'shield' },
  'ollama': { displayName: 'Ollama AI', icon: 'brain' },
  'metrics-api': { displayName: 'Metrics API', icon: 'activity' },
  'postgresql': { displayName: 'PostgreSQL', icon: 'database' },
  'stepperslife-db': { displayName: 'SteppersLife DB', icon: 'database' },
  'localai-neo4j-1': { displayName: 'Neo4j Graph', icon: 'share-2' }
}

const MAX_DATA_POINTS = 50

async function fetchMetrics(): Promise<MonitoringData> {
  const response = await fetch('/api/metrics')
  if (!response.ok) {
    throw new Error('Failed to fetch metrics')
  }
  const data = await response.json()
  
  // Map containers with display names and icons
  const containers = (data.containers || []).map((container: any) => {
    const mapping = containerMapping[container.name as keyof typeof containerMapping] || {
      displayName: container.name,
      icon: 'box'
    }
    
    return {
      ...container,
      displayName: mapping.displayName,
      icon: mapping.icon
    }
  })
  
  return {
    ...data,
    containers,
    timestamp: Date.now()
  }
}

export function useMonitoring() {
  const [historicalData, setHistoricalData] = useState<HistoricalData>({
    cpu: [],
    memory: [],
    disk: [],
    networkIn: [],
    networkOut: [],
    timestamps: []
  })
  
  const { data: currentData, isLoading, error, isSuccess } = useQuery({
    queryKey: ['monitoring'],
    queryFn: fetchMetrics,
    refetchInterval: 5000, // Refresh every 5 seconds
  })
  
  // Update historical data when new data arrives
  useEffect(() => {
    if (currentData && isSuccess) {
      setHistoricalData(prev => {
        const newCpu = [...prev.cpu, currentData.cpu.usage]
        const newMemory = [...prev.memory, currentData.memory.percentage]
        const newDisk = [...prev.disk, currentData.disk.percentage]
        const newNetworkIn = [...prev.networkIn, currentData.network.rx]
        const newNetworkOut = [...prev.networkOut, currentData.network.tx]
        const newTimestamps = [...prev.timestamps, currentData.timestamp]
        
        // Keep only the last MAX_DATA_POINTS
        if (newCpu.length > MAX_DATA_POINTS) {
          newCpu.shift()
          newMemory.shift()
          newDisk.shift()
          newNetworkIn.shift()
          newNetworkOut.shift()
          newTimestamps.shift()
        }
        
        return {
          cpu: newCpu,
          memory: newMemory,
          disk: newDisk,
          networkIn: newNetworkIn,
          networkOut: newNetworkOut,
          timestamps: newTimestamps
        }
      })
    }
  }, [currentData, isSuccess])
  
  const formatBytes = useCallback((bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(2)} GB`
  }, [])
  
  const formatMbps = useCallback((bytes: number) => {
    const mbps = (bytes * 8) / (1024 * 1024)
    return `${mbps.toFixed(2)} Mbps`
  }, [])
  
  return {
    currentData,
    historicalData,
    isLoading,
    error,
    formatBytes,
    formatMbps,
  }
}