"use client"

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Loader2, Download, TrendingUp, TrendingDown, Minus, Activity, Cpu, MemoryStick, HardDrive } from 'lucide-react'
import { toast } from 'sonner'


interface HistoricalData {
  data: any[]
  type: string
  count: number
  timestamp: string
  predictions?: {
    cpu: TrendPrediction
    memory: TrendPrediction
    disk: TrendPrediction
  }
}

interface TrendPrediction {
  trend: 'increasing' | 'decreasing' | 'stable'
  slope: number
  predictions: { x: number; y: number }[]
}

interface ChartData {
  time: string
  cpu: number
  memory: number
  disk: number
  networkIn: number
  networkOut: number
}

async function fetchHistoricalData(type: string, timeRange: number, prediction = false): Promise<HistoricalData> {
  const params = new URLSearchParams({
    type,
    ...(type === 'hourly' ? { hours: timeRange.toString() } : { days: timeRange.toString() }),
    ...(prediction && { prediction: 'true' })
  })
  
  const response = await fetch(`/api/metrics/history?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch historical data')
  }
  return response.json()
}

async function downloadData(type: string, timeRange: number, format: 'csv' | 'json' = 'csv') {
  const params = new URLSearchParams({
    type,
    ...(type === 'hourly' ? { hours: timeRange.toString() } : { days: timeRange.toString() }),
    format
  })
  
  const response = await fetch(`/api/metrics/history?${params}`)
  if (response.ok) {
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `metrics-${type}-${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export function HistoricalDataCharts() {
  const [timeRange, setTimeRange] = useState('24')
  const [dataType, setDataType] = useState('hourly')
  
  const { data: historicalData, isLoading, refetch } = useQuery({
    queryKey: ['historical-data', dataType, timeRange],
    queryFn: () => fetchHistoricalData(dataType, parseInt(timeRange), true),
    refetchInterval: 30000,
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'destructive'
      case 'decreasing': return 'secondary' 
      default: return 'outline'
    }
  }

  const prepareChartData = (rawData: any[]): ChartData[] => {
    if (!rawData || rawData.length === 0) return []
    
    return rawData.map(item => ({
      time: new Date(item.timestamp || item.hour || item.created_at).toLocaleTimeString(),
      cpu: item.avg_cpu || item.cpu || 0,
      memory: item.avg_memory || item.memory_percentage || 0,
      disk: item.avg_disk || item.disk_percentage || 0,
      networkIn: (item.avg_network_rx || item.network_rx || 0) / (1024 * 1024), // Convert to MB
      networkOut: (item.avg_network_tx || item.network_tx || 0) / (1024 * 1024) // Convert to MB
    }))
  }

  const chartData = prepareChartData(historicalData?.data || [])

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historical Data & Trends</h2>
          <p className="text-muted-foreground">Performance analysis and predictive insights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 Hours</SelectItem>
              <SelectItem value="168">7 Days</SelectItem>
              <SelectItem value="720">30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => downloadData(dataType, parseInt(timeRange), 'csv')}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Trend Predictions Summary */}
      {historicalData?.predictions && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(historicalData.predictions).map(([metric, prediction]) => (
            <Card key={metric}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  {metric === 'cpu' && <Cpu className="h-4 w-4" />}
                  {metric === 'memory' && <MemoryStick className="h-4 w-4" />}
                  {metric === 'disk' && <HardDrive className="h-4 w-4" />}
                  <span className="capitalize">{metric} Trend</span>
                  {getTrendIcon(prediction.trend)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={getTrendColor(prediction.trend) as any}>
                    {prediction.trend}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {prediction.slope > 0 ? '+' : ''}{(prediction.slope * 100).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Main Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="disk">Disk</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Performance Overview</CardTitle>
              <CardDescription>
                {isLoading ? 'Loading...' : `${chartData.length} data points`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU %" />
                  <Line type="monotone" dataKey="memory" stroke="#10b981" name="Memory %" />
                  <Line type="monotone" dataKey="disk" stroke="#f59e0b" name="Disk %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cpu">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                CPU Usage Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'CPU Usage']} />
                  <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MemoryStick className="h-5 w-5" />
                Memory Usage Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Memory Usage']} />
                  <Area type="monotone" dataKey="memory" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disk">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Disk Usage Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Disk Usage']} />
                  <Area type="monotone" dataKey="disk" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} MB/s`]} />
                  <Legend />
                  <Line type="monotone" dataKey="networkIn" stroke="#3b82f6" name="Received" />
                  <Line type="monotone" dataKey="networkOut" stroke="#ef4444" name="Transmitted" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Summary */}
      {historicalData && (
        <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data Points</p>
                <p className="font-semibold">{historicalData.count}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time Range</p>
                <p className="font-semibold">{timeRange} {dataType === 'hourly' ? 'Hours' : 'Days'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Update</p>
                <p className="font-semibold">{new Date(historicalData.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data Type</p>
                <p className="font-semibold capitalize">{historicalData.type}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}