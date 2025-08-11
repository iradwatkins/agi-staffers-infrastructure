import { NextResponse } from 'next/server'

// In production, these would be stored in a database
interface AlertThreshold {
  id: string
  name: string
  metric: string
  operator: 'above' | 'below'
  value: number
  unit: string
  enabled: boolean
}

let alertThresholds: AlertThreshold[] = []

export async function GET() {
  return NextResponse.json({ thresholds: alertThresholds })
}

export async function POST(request: Request) {
  try {
    const { thresholds } = await request.json()
    
    // Store thresholds (in production, save to database)
    alertThresholds = thresholds
    
    // If push notification API is available, update it
    if (process.env.PUSH_API_URL) {
      try {
        await fetch(`${process.env.PUSH_API_URL}/api/alerts/thresholds`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thresholds })
        })
      } catch (error) {
        console.error('Failed to update push API thresholds:', error)
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving thresholds:', error)
    return NextResponse.json(
      { error: 'Failed to save thresholds' },
      { status: 500 }
    )
  }
}