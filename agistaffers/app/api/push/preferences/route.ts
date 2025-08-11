import { NextRequest, NextResponse } from 'next/server'

const PUSH_API_URL = process.env.PUSH_API_URL || 'http://localhost:3011'

export async function GET() {
  try {
    // Get preferences from push API server
    const response = await fetch(`${PUSH_API_URL}/api/preferences/default`)
    
    if (!response.ok) {
      throw new Error('Failed to get preferences from push API')
    }

    const data = await response.json()
    return NextResponse.json({ 
      success: true, 
      preferences: data.preferences 
    })
  } catch (error) {
    console.error('Error getting preferences:', error)
    return NextResponse.json(
      { error: 'Failed to get preferences' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json()
    
    if (!preferences) {
      return NextResponse.json(
        { error: 'Preferences are required' },
        { status: 400 }
      )
    }

    // Update preferences on push API server
    const response = await fetch(`${PUSH_API_URL}/api/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'default',
        preferences: {
          notify_container_down: preferences.container_down,
          notify_high_cpu: preferences.performance,
          notify_low_memory: preferences.performance,
          notify_low_disk: preferences.performance,
          notify_deployments: preferences.deployments,
          notify_security: preferences.security,
          notify_alerts: preferences.alerts,
          notify_backups: preferences.backups,
          notify_updates: preferences.updates,
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to update preferences on push API')
    }

    const data = await response.json()
    console.log('Push preferences updated:', data)
    
    return NextResponse.json({ 
      success: true, 
      preferences: data.preferences 
    })
  } catch (error) {
    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}