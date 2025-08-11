import { NextResponse } from 'next/server'
import { monitoringService } from '@/lib/monitoring-service'
import { databaseService } from '@/lib/database-service'

export async function GET() {
  try {
    // Use the actual metrics API URL
    const metricsUrl = process.env.METRICS_API_URL || 'http://148.230.93.174:3009/api/metrics'
    
    // Fetch from the actual API
    const response = await fetch(metricsUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch metrics')
    }
    
    const data = await response.json()
    
    // Transform data to match database service interface
    // Convert GB to bytes for disk and memory values
    const GB_TO_BYTES = 1024 * 1024 * 1024
    
    const metricsForDb = {
      cpu: data.system.cpu.usage,
      memory: {
        used: Math.round(data.system.memory.used * GB_TO_BYTES), // Convert GB to bytes
        total: Math.round(data.system.memory.total * GB_TO_BYTES), // Convert GB to bytes
        percentage: data.system.memory.percentage
      },
      disk: {
        used: Math.round(data.system.disk.used * GB_TO_BYTES), // Convert GB to bytes
        total: Math.round(data.system.disk.total * GB_TO_BYTES), // Convert GB to bytes
        available: Math.round((data.system.disk.total - data.system.disk.used) * GB_TO_BYTES), // Calculate available in bytes
        percentage: data.system.disk.percentage
      },
      network: {
        rx: data.system.network.rx,
        tx: data.system.network.tx
      },
      containers: data.containers || []
    }
    
    // Save metrics to database
    try {
      await databaseService.saveMetrics(metricsForDb)
    } catch (dbError) {
      console.error('Failed to save metrics to database:', dbError)
      // Don't fail the request if database save fails
    }
    
    // Check thresholds and generate alerts if needed
    try {
      // Load thresholds from localStorage via cookies or session
      const thresholdsStr = process.env.ALERT_THRESHOLDS || ''
      if (thresholdsStr) {
        const thresholds = JSON.parse(thresholdsStr)
        monitoringService.setThresholds(thresholds)
        
        const alerts = monitoringService.checkThresholds({
          cpu: data.system.cpu.usage,
          memory: data.system.memory.percentage,
          disk: data.system.disk.total - data.system.disk.used, // Available space in GB
          containers: data.containers || [], // Pass full container array for state monitoring
          network: {
            rx: data.system.network.rx || 0,
            tx: data.system.network.tx || 0
          }
        })
        
        // Send alerts if any
        if (alerts.length > 0) {
          await monitoringService.sendAlerts(alerts)
        }
        
        // Add alerts to response
        data.alerts = alerts
      }
    } catch (error) {
      console.error('Error checking thresholds:', error)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}