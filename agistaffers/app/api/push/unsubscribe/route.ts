import { NextResponse } from 'next/server'

const PUSH_API_URL = process.env.PUSH_API_URL || 'http://148.230.93.174:3011'

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    
    // Forward unsubscribe request to push API
    const response = await fetch(`${PUSH_API_URL}/api/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription })
    })

    if (!response.ok) {
      throw new Error('Failed to forward unsubscribe to push API')
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}