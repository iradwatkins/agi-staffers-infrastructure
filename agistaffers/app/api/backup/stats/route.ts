import { NextResponse } from 'next/server'
import { backupService } from '@/lib/backup-service'

// Force dynamic rendering for routes that fetch from external APIs
export const dynamic = "force-dynamic"

interface BackupStats {
  totalBackups: number
  totalSize: number
  lastBackup: string | null
  backupsByType: Record<string, number>
  recentFailures: number
  automatedBackupsEnabled: boolean
  nextScheduledBackup: string | null
  retentionSummary: {
    toExpireThisWeek: number
    totalRetained: number
  }
}

export async function GET() {
  try {
    const backups = await backupService.listBackups()
    
    // Calculate statistics
    const totalBackups = backups.length
    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0)
    const availableBackups = backups.filter(b => b.status === 'available')
    const lastBackup = availableBackups.length > 0 
      ? availableBackups.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())[0].created
      : null

    // Group backups by type
    const backupsByType = backups.reduce((acc, backup) => {
      acc[backup.type] = (acc[backup.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Count recent failures (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentFailures = backups.filter(
      b => b.status === 'failed' && new Date(b.created) > oneDayAgo
    ).length

    // Mock next scheduled backup (would come from n8n in real implementation)
    const nextHour = new Date(Date.now() + 60 * 60 * 1000)
    nextHour.setMinutes(0, 0, 0)
    
    const stats: BackupStats = {
      totalBackups,
      totalSize,
      lastBackup,
      backupsByType,
      recentFailures,
      automatedBackupsEnabled: true,
      nextScheduledBackup: nextHour.toISOString(),
      retentionSummary: {
        toExpireThisWeek: Math.floor(Math.random() * 5), // Mock data
        totalRetained: totalBackups
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to get backup stats:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve backup statistics' },
      { status: 500 }
    )
  }
}