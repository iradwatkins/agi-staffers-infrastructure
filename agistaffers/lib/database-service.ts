import { Pool } from 'pg'

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

interface MetricsData {
  cpu: number
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    available: number
    percentage: number
  }
  network: {
    rx: number
    tx: number
  }
  containers: Array<{
    id: string
    name: string
    status: string
    cpuPercent?: number
    memoryUsage?: number
    memoryLimit?: number
  }>
}

interface AlertData {
  id: string
  thresholdId: string
  name: string
  metric: string
  value: number
  threshold: number
  operator: string
  severity: string
  message: string
}

interface HourlyMetrics {
  hour: Date
  avg_cpu: number
  avg_memory: number
  avg_disk: number
  avg_network_rx: number
  avg_network_tx: number
  avg_containers_running: number
  sample_count: number
}

interface DailyMetrics {
  day: Date
  avg_cpu: number
  max_cpu: number
  avg_memory: number
  max_memory: number
  avg_disk: number
  min_disk_available: number
  total_network_rx: number
  total_network_tx: number
  avg_containers_running: number
  sample_count: number
}

export class DatabaseService {
  async saveMetrics(metrics: MetricsData): Promise<void> {
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Save main metrics
      const metricsResult = await client.query(
        `INSERT INTO metrics_history (
          cpu_usage, 
          memory_used, memory_total, memory_percentage,
          disk_used, disk_total, disk_available, disk_percentage,
          network_rx, network_tx,
          containers_running, containers_total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, timestamp`,
        [
          metrics.cpu,
          metrics.memory.used,
          metrics.memory.total,
          metrics.memory.percentage,
          metrics.disk.used,
          metrics.disk.total,
          metrics.disk.available,
          metrics.disk.percentage,
          metrics.network.rx,
          metrics.network.tx,
          metrics.containers.filter(c => c.status === 'running').length,
          metrics.containers.length
        ]
      )
      
      // Save container metrics
      for (const container of metrics.containers) {
        await client.query(
          `INSERT INTO container_metrics (
            timestamp, container_id, container_name, status,
            cpu_percentage, memory_used, memory_limit
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            metricsResult.rows[0].timestamp,
            container.id,
            container.name,
            container.status,
            container.cpuPercent || 0,
            container.memoryUsage || 0,
            container.memoryLimit || 0
          ]
        )
      }
      
      await client.query('COMMIT')
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error saving metrics:', error)
      throw error
    } finally {
      client.release()
    }
  }

  async saveAlert(alert: AlertData): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO alerts_history (
          alert_id, threshold_id, alert_name, metric_name,
          metric_value, threshold_value, operator, severity, message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          alert.id,
          alert.thresholdId,
          alert.name,
          alert.metric,
          alert.value,
          alert.threshold,
          alert.operator,
          alert.severity,
          alert.message
        ]
      )
    } catch (error) {
      console.error('Error saving alert:', error)
      throw error
    }
  }

  async getMetricsHistory(hours: number = 24): Promise<MetricsData[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM metrics_history 
         WHERE timestamp > NOW() - INTERVAL '${hours} hours'
         ORDER BY timestamp DESC`,
      )
      return result.rows
    } catch (error) {
      console.error('Error fetching metrics history:', error)
      return []
    }
  }

  async getHourlyMetrics(hours: number = 24): Promise<HourlyMetrics[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM metrics_hourly 
         WHERE hour > NOW() - INTERVAL '${hours} hours'
         ORDER BY hour DESC`,
      )
      return result.rows
    } catch (error) {
      console.error('Error fetching hourly metrics:', error)
      return []
    }
  }

  async getDailyMetrics(days: number = 7): Promise<DailyMetrics[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM metrics_daily 
         WHERE day > NOW() - INTERVAL '${days} days'
         ORDER BY day DESC`,
      )
      return result.rows
    } catch (error) {
      console.error('Error fetching daily metrics:', error)
      return []
    }
  }

  async getAlertsHistory(days: number = 7): Promise<AlertData[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM alerts_history 
         WHERE timestamp > NOW() - INTERVAL '${days} days'
         ORDER BY timestamp DESC`,
      )
      return result.rows
    } catch (error) {
      console.error('Error fetching alerts history:', error)
      return []
    }
  }

  async cleanOldData(): Promise<void> {
    try {
      await pool.query('SELECT clean_old_metrics()')
    } catch (error) {
      console.error('Error cleaning old data:', error)
    }
  }
}

// Singleton instance
export const databaseService = new DatabaseService()

// Clean old data daily
if (typeof window === 'undefined') {
  setInterval(() => {
    databaseService.cleanOldData()
  }, 24 * 60 * 60 * 1000) // 24 hours
}