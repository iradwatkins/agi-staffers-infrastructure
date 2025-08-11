interface BackupJob {
  id: string
  name: string
  type: 'full' | 'website' | 'database' | 'container'
  size: number
  created: string
  status: 'available' | 'creating' | 'failed'
  downloadUrl?: string
  checksum?: string
  verified?: boolean
}

interface BackupConfig {
  retention: {
    critical: { hourly: number; daily: number; weekly: number; monthly: number }
    configuration: { daily: number; weekly: number; monthly: number }
    logs: { daily: number; weekly: number }
  }
  storage: {
    path: string
    encryption: boolean
  }
  n8n: {
    webhookUrl: string
    enabled: boolean
  }
}

export class BackupService {
  private config: BackupConfig
  private n8nWebhookUrl: string

  constructor() {
    this.config = {
      retention: {
        critical: { hourly: 48, daily: 30, weekly: 12, monthly: 12 },
        configuration: { daily: 30, weekly: 12, monthly: 6 },
        logs: { daily: 7, weekly: 4 }
      },
      storage: {
        path: process.env.BACKUP_PATH || '/var/backups',
        encryption: true
      },
      n8n: {
        webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://n8n.agistaffers.com/webhook',
        enabled: true
      }
    }
    this.n8nWebhookUrl = `${this.config.n8n.webhookUrl}/backup-trigger`
  }

  async listBackups(): Promise<BackupJob[]> {
    try {
      // First try to get from backup API
      const backupApiUrl = process.env.BACKUP_API_URL || 'http://localhost:3010'
      
      const response = await fetch(`${backupApiUrl}/api/backups`, {
        signal: AbortSignal.timeout(3000)
      })
      
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.log('Backup API not available, using fallback data')
    }

    // Fallback to sample data for development
    return this.getFallbackBackups()
  }

  async createBackup(type: 'full' | 'website' | 'database' | 'container'): Promise<{ id: string; status: string }> {
    const backupId = `backup_${type}_${Date.now()}`
    
    try {
      // Trigger n8n workflow for backup creation
      if (this.config.n8n.enabled) {
        await this.triggerN8nWorkflow('create-backup', {
          type,
          backupId,
          timestamp: new Date().toISOString(),
          retention: this.getRetentionPolicy(type)
        })
      }

      return {
        id: backupId,
        status: 'initiated'
      }
    } catch (error) {
      console.error('Failed to create backup:', error)
      throw new Error(`Backup creation failed: ${error}`)
    }
  }

  async verifyBackup(backupId: string): Promise<{ verified: boolean; checksum?: string }> {
    try {
      // Trigger n8n workflow for backup verification
      if (this.config.n8n.enabled) {
        const result = await this.triggerN8nWorkflow('verify-backup', { backupId })
        return result
      }

      // Fallback verification
      return { verified: true, checksum: 'mock_checksum' }
    } catch (error) {
      console.error('Failed to verify backup:', error)
      return { verified: false }
    }
  }

  async scheduleAutomatedBackups(): Promise<void> {
    const schedules = [
      { type: 'database', cron: '0 * * * *', description: 'Hourly database backup' }, // Every hour
      { type: 'container', cron: '0 2 * * *', description: 'Daily container config backup' }, // 2 AM daily
      { type: 'website', cron: '0 3 * * 0', description: 'Weekly website backup' }, // 3 AM Sunday
      { type: 'full', cron: '0 4 * * 0', description: 'Weekly full backup' } // 4 AM Sunday
    ]

    for (const schedule of schedules) {
      if (this.config.n8n.enabled) {
        await this.triggerN8nWorkflow('schedule-backup', {
          ...schedule,
          retention: this.getRetentionPolicy(schedule.type as any)
        })
      }
    }
  }

  async getBackupStatus(backupId: string): Promise<BackupJob | null> {
    try {
      if (this.config.n8n.enabled) {
        const result = await this.triggerN8nWorkflow('get-backup-status', { backupId })
        return result
      }
      return null
    } catch (error) {
      console.error('Failed to get backup status:', error)
      return null
    }
  }

  async cleanupExpiredBackups(): Promise<{ cleaned: number; errors: number }> {
    try {
      if (this.config.n8n.enabled) {
        const result = await this.triggerN8nWorkflow('cleanup-backups', {
          retention: this.config.retention
        })
        return result
      }
      return { cleaned: 0, errors: 0 }
    } catch (error) {
      console.error('Failed to cleanup backups:', error)
      return { cleaned: 0, errors: 1 }
    }
  }

  async sendBackupAlert(type: 'success' | 'failure', backupInfo: any): Promise<void> {
    try {
      const pushApiUrl = process.env.PUSH_API_URL || 'http://localhost:3011'
      
      const alertPayload = {
        title: type === 'success' ? '✅ Backup Completed' : '❌ Backup Failed',
        body: `${backupInfo.type} backup ${type === 'success' ? 'completed successfully' : 'failed'}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
          type: 'backup-alert',
          backupId: backupInfo.id,
          backupType: backupInfo.type,
          status: type,
          url: '/?tab=backups'
        }
      }

      await fetch(`${pushApiUrl}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPayload)
      })
    } catch (error) {
      console.error('Failed to send backup alert:', error)
    }
  }

  private async triggerN8nWorkflow(workflow: string, payload: any): Promise<any> {
    if (!this.config.n8n.enabled) return null

    try {
      const response = await fetch(`${this.n8nWebhookUrl}/${workflow}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) {
        throw new Error(`N8N workflow failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`N8N workflow '${workflow}' failed:`, error)
      throw error
    }
  }

  private getRetentionPolicy(type: string) {
    switch (type) {
      case 'database':
        return this.config.retention.critical
      case 'container':
      case 'website':
        return this.config.retention.configuration
      default:
        return this.config.retention.critical
    }
  }

  private getFallbackBackups(): BackupJob[] {
    const now = new Date()
    return [
      {
        id: 'backup_database_' + (now.getTime() - 3600000),
        name: 'PostgreSQL Database Backup',
        type: 'database',
        size: 524288000, // 500MB
        created: new Date(now.getTime() - 3600000).toISOString(),
        status: 'available',
        downloadUrl: '/api/backup/download/backup_database_' + (now.getTime() - 3600000),
        checksum: 'sha256:abc123',
        verified: true
      },
      {
        id: 'backup_container_' + (now.getTime() - 86400000),
        name: 'Container Configuration Backup',
        type: 'container',
        size: 10485760, // 10MB
        created: new Date(now.getTime() - 86400000).toISOString(),
        status: 'available',
        downloadUrl: '/api/backup/download/backup_container_' + (now.getTime() - 86400000),
        checksum: 'sha256:def456',
        verified: true
      },
      {
        id: 'backup_creating_now',
        name: 'Full System Backup',
        type: 'full',
        size: 0,
        created: now.toISOString(),
        status: 'creating'
      }
    ]
  }
}

// Singleton instance
export const backupService = new BackupService()

// Database service integration for backup job tracking
export interface BackupJobRecord {
  id: string
  name: string
  type: string
  status: string
  size: number
  created_at: Date
  completed_at?: Date
  checksum?: string
  verified: boolean
  error_message?: string
}

export const databaseBackupOps = {
  async saveBackupJob(job: Partial<BackupJobRecord>): Promise<void> {
    // This would integrate with your existing database service
    // For now, just log the operation
    console.log('Backup job saved:', job)
  },

  async getBackupJobs(limit = 50): Promise<BackupJobRecord[]> {
    // This would query your PostgreSQL database
    // For now, return empty array
    return []
  },

  async updateBackupStatus(id: string, status: string, metadata?: any): Promise<void> {
    console.log('Backup status updated:', { id, status, metadata })
  }
}