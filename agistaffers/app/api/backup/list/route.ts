import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.BACKUP_API_URL || 'http://localhost:3010'

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/backups`, {
      headers: {
        'Accept': 'application/json',
      },
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
    console.error('Error fetching backups:', error)
    
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