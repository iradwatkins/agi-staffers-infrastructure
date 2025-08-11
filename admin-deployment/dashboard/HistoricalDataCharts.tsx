"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Loader2, Download, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { toast } from 'sonner'


interface ChartData {
  time: string
  cpu: number
  memory: number
  disk: number
  networkIn: number
  networkOut: number
}

export function HistoricalDataCharts() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'cpu' | 'memory' | 'disk' | 'network'>('all')

  const fetchHistoricalData = async () => {
    setLoading(true)
    try {
      const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720
      const aggregation = timeRange === '24h' ? 'raw' : timeRange === '7d' ? 'hourly' : 'daily'
      
      const response = await fetch(`/api/metrics/history?hours=${hours}&aggregation=${aggregation}`)
      if (!response.ok) throw new Error('Failed to fetch historical data')
      
      const result = await response.json()
      
      // Transform data for charts
      const chartData: ChartData[] = result.data.map((item: {
        timestamp?: string
        hour?: string
        date?: string
        cpu_usage?: string | number
        avg_cpu?: string | number
        memory_usage?: string | number
        avg_memory?: string | number
        disk_used?: number
        avg_disk_used?: number
        network_rx?: number
        avg_network_rx?: number
        network_tx?: number
        avg_network_tx?: number
      }) => ({
        time: formatTime(item.timestamp || item.hour || item.date || '', timeRange),
        cpu: parseFloat(String(item.cpu_usage || item.avg_cpu || 0)),
        memory: parseFloat(String(item.memory_usage || item.avg_memory || 0)),
        disk: item.disk_used ? (item.disk_used / (1024 * 1024 * 1024)) : 
              (item.avg_disk_used ? item.avg_disk_used / (1024 * 1024 * 1024) : 0),
        networkIn: (item.network_rx || item.avg_network_rx || 0) / (1024 * 1024), // Convert to MB
        networkOut: (item.network_tx || item.avg_network_tx || 0) / (1024 * 1024) // Convert to MB
      }))
      
      setData(chartData)
    } catch (error) {
      console.error('Error fetching historical data:', error)
      toast.error('Failed to load historical data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoricalData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  const formatTime = (timestamp: string, range: '24h' | '7d' | '30d') => {
    const date = new Date(timestamp)
    if (range === '24h') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (range === '7d') {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const calculateTrend = (metric: 'cpu' | 'memory' | 'disk' | 'network') => {
    if (data.length < 2) return { value: 0, direction: 'stable' as const }
    
    const recent = data.slice(-Math.ceil(data.length * 0.2)) // Last 20% of data
    const older = data.slice(0, Math.floor(data.length * 0.2)) // First 20% of data
    
    let recentAvg = 0
    let olderAvg = 0
    
    switch (metric) {
      case 'cpu':
        recentAvg = recent.reduce((sum, d) => sum + d.cpu, 0) / recent.length
        olderAvg = older.reduce((sum, d) => sum + d.cpu, 0) / older.length
        break
      case 'memory':
        recentAvg = recent.reduce((sum, d) => sum + d.memory, 0) / recent.length
        olderAvg = older.reduce((sum, d) => sum + d.memory, 0) / older.length
        break
      case 'disk':
        recentAvg = recent.reduce((sum, d) => sum + d.disk, 0) / recent.length
        olderAvg = older.reduce((sum, d) => sum + d.disk, 0) / older.length
        break
      case 'network':
        recentAvg = recent.reduce((sum, d) => sum + d.networkIn + d.networkOut, 0) / recent.length
        olderAvg = older.reduce((sum, d) => sum + d.networkIn + d.networkOut, 0) / older.length
        break
    }
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100
    return {
      value: Math.abs(change),
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable'
    }
  }

  const TrendIndicator = ({ metric }: { metric: 'cpu' | 'memory' | 'disk' | 'network' }) => {
    const trend = calculateTrend(metric)
    const Icon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus
    const color = trend.direction === 'up' ? 'text-red-500' : trend.direction === 'down' ? 'text-green-500' : 'text-gray-500'
    
    return (
      <div className={`flex items-center gap-1 text-sm ${color}`}>
        <Icon className="h-4 w-4" />
        <span>{trend.value.toFixed(1)}%</span>
      </div>
    )
  }

  const exportData = (format: 'csv' | 'json') => {
    if (data.length === 0) {
      toast.error('No data to export')
      return
    }

    if (format === 'csv') {
      const headers = ['Time', 'CPU %', 'Memory %', 'Disk GB', 'Network In MB', 'Network Out MB']
      const rows = data.map(d => [
        d.time,
        d.cpu.toFixed(2),
        d.memory.toFixed(2),
        d.disk.toFixed(2),
        d.networkIn.toFixed(2),
        d.networkOut.toFixed(2)
      ])
      
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metrics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported as CSV')
    } else {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `metrics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported as JSON')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historical Data & Trends</CardTitle>
            <CardDescription>Monitor system performance over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as typeof selectedMetric)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="cpu">CPU Only</SelectItem>
                <SelectItem value="memory">Memory Only</SelectItem>
                <SelectItem value="disk">Disk Only</SelectItem>
                <SelectItem value="network">Network Only</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => exportData('csv')}
              title="Export as CSV"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => exportData('json')}
              title="Export as JSON"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchHistoricalData}
              title="Refresh data"
            >
              <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="30d">30 Days</TabsTrigger>
          </TabsList>

          {data.length > 0 && (
            <>
              <TabsContent value={timeRange} className="space-y-4">
                {/* CPU & Memory Chart */}
                {(selectedMetric === 'all' || selectedMetric === 'cpu' || selectedMetric === 'memory') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">CPU & Memory Usage</h3>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">CPU</span>
                          <TrendIndicator metric="cpu" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Memory</span>
                          <TrendIndicator metric="memory" />
                        </div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                        />
                        <Legend />
                        {(selectedMetric === 'all' || selectedMetric === 'cpu') && (
                          <Line 
                            type="monotone" 
                            dataKey="cpu" 
                            stroke="hsl(var(--chart-1))" 
                            name="CPU"
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'memory') && (
                          <Line 
                            type="monotone" 
                            dataKey="memory" 
                            stroke="hsl(var(--chart-2))" 
                            name="Memory"
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Disk Usage Chart */}
                {(selectedMetric === 'all' || selectedMetric === 'disk') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Disk Usage (GB)</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Disk</span>
                        <TrendIndicator metric="disk" />
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                          formatter={(value: number) => `${value.toFixed(2)} GB`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="disk" 
                          stroke="hsl(var(--chart-3))" 
                          fill="hsl(var(--chart-3))"
                          fillOpacity={0.3}
                          name="Disk Used"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Network I/O Chart */}
                {(selectedMetric === 'all' || selectedMetric === 'network') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Network I/O (MB)</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Network</span>
                        <TrendIndicator metric="network" />
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="time" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                          formatter={(value: number) => `${value.toFixed(2)} MB`}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="networkIn" 
                          stackId="1"
                          stroke="hsl(var(--chart-4))" 
                          fill="hsl(var(--chart-4))"
                          name="Network In"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="networkOut" 
                          stackId="1"
                          stroke="hsl(var(--chart-5))" 
                          fill="hsl(var(--chart-5))"
                          name="Network Out"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </TabsContent>
            </>
          )}

          {data.length === 0 && !loading && (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              No historical data available
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}