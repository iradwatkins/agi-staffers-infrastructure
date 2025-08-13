import { NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-service'

// Force dynamic rendering for routes that use request.url
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'raw'
    const hours = parseInt(searchParams.get('hours') || '24')
    const days = parseInt(searchParams.get('days') || '7')
    const format = searchParams.get('format') || 'json'
    const prediction = searchParams.get('prediction') === 'true'

    let data: unknown[]

    switch (type) {
      case 'raw':
        data = await databaseService.getMetricsHistory(hours)
        break
      case 'hourly':
        data = await databaseService.getHourlyMetrics(hours)
        break
      case 'daily':
        data = await databaseService.getDailyMetrics(days)
        break
      case 'weekly':
        data = await databaseService.getWeeklyMetrics(Math.ceil(days / 7))
        break
      case 'monthly':
        data = await databaseService.getMonthlyMetrics(Math.ceil(days / 30))
        break
      case 'alerts':
        data = await databaseService.getAlertsHistory(days)
        break
      case 'trends':
        data = await databaseService.getTrendAnalysis(days)
        break
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    // Add predictions if requested
    let predictions = null
    if (prediction && (type === 'hourly' || type === 'daily')) {
      predictions = generatePredictions(data as any[], type)
    }

    // Handle different export formats
    const response = {
      data,
      type,
      count: data.length,
      timestamp: new Date().toISOString(),
      ...(predictions && { predictions })
    }

    if (format === 'csv') {
      const csv = convertToCSV(data as any[], type)
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="metrics-${type}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching metrics history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics history' },
      { status: 500 }
    )
  }
}

function generatePredictions(data: any[], type: string) {
  if (data.length < 3) return null

  // Simple linear regression for trend prediction
  const recentData = data.slice(-10) // Last 10 data points
  const predictions = {
    cpu: predictTrend(recentData.map((d, i) => ({ x: i, y: d.avg_cpu || d.cpu || 0 }))),
    memory: predictTrend(recentData.map((d, i) => ({ x: i, y: d.avg_memory || d.memory_percentage || 0 }))),
    disk: predictTrend(recentData.map((d, i) => ({ x: i, y: d.avg_disk || d.disk_percentage || 0 })))
  }

  return predictions
}

function predictTrend(points: { x: number; y: number }[]) {
  const n = points.length
  const sumX = points.reduce((sum, p) => sum + p.x, 0)
  const sumY = points.reduce((sum, p) => sum + p.y, 0)
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0)
  const sumXX = points.reduce((sum, p) => sum + p.x * p.x, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Predict next 3 points
  const nextPoints = []
  for (let i = 1; i <= 3; i++) {
    const nextX = n + i
    const nextY = slope * nextX + intercept
    nextPoints.push({ x: nextX, y: Math.max(0, nextY) })
  }

  return {
    trend: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable',
    slope: slope,
    predictions: nextPoints
  }
}

function convertToCSV(data: any[], type: string): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}