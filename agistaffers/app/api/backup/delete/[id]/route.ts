import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.BACKUP_API_URL || 'http://localhost:3010'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Backup ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/api/backups/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
      // Short timeout to fail fast if API is not available
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backup deletion error:', response.status, errorText)
      return NextResponse.json(
        { error: `Backup deletion error: ${response.status}` },
        { status: response.status }
      )
    }

    // Check if there's a response body
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // If no JSON response, return success
    return NextResponse.json({ success: true, message: 'Backup deleted successfully' })
  } catch (error) {
    console.error('Error deleting backup:', error)
    
    // Differentiate between timeout and other errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backup deletion request timed out' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to connect to backup API' },
      { status: 503 }
    )
  }
}