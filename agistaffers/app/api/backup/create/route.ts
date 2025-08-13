import { NextResponse } from 'next/server'

// Force dynamic rendering for routes that fetch from external APIs
export const dynamic = "force-dynamic"

const API_BASE_URL = process.env.BACKUP_API_URL || 'http://localhost:3010'

export async function POST(request: Request) {
  try {
    const { type } = await request.json()
    
    // Validate backup type
    if (!type || !['full', 'database', 'config'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid backup type' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/backups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ type }),
      // Short timeout to fail fast if API is not available
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backup API error:', response.status, errorText)
      return NextResponse.json(
        { error: `Backup API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating backup:', error)
    
    // Differentiate between timeout and other errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backup API request timed out' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to connect to backup API' },
      { status: 503 }
    )
  }
}