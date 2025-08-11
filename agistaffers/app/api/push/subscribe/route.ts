import { NextResponse } from 'next/server'

const PUSH_API_URL = process.env.PUSH_API_URL || 'http://148.230.93.174:3011'

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    
    // Forward subscription to push API
    const response = await fetch(`${PUSH_API_URL}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        preferences: {
          alerts: true,
          updates: true,
          maintenance: true
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to forward subscription to push API')
    }

    const data = await response.json()
    console.log('Push subscription registered:', data.id)
    
    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Error subscribing:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}