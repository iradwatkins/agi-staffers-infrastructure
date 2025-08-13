import { NextResponse } from 'next/server'

// Force dynamic rendering for routes that fetch from external APIs
export const dynamic = "force-dynamic"

const API_BASE_URL = process.env.BACKUP_API_URL || 'http://localhost:3010'

export async function GET(
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

    // Stream the backup file from the API
    const response = await fetch(`${API_BASE_URL}/api/backups/${id}/download`, {
      headers: {
        'Accept': 'application/octet-stream',
      },
      // Longer timeout for large file downloads
      signal: AbortSignal.timeout(300000), // 5 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Backup download error:', response.status, errorText)
      return NextResponse.json(
        { error: `Backup download error: ${response.status}` },
        { status: response.status }
      )
    }

    // Get headers from the backup API response
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const contentDisposition = response.headers.get('content-disposition') || `attachment; filename="backup-${id}.tar.gz"`
    const contentLength = response.headers.get('content-length')

    // Create response headers
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': contentDisposition,
    })

    if (contentLength) {
      headers.set('Content-Length', contentLength)
    }

    // Stream the response body
    if (!response.body) {
      return NextResponse.json(
        { error: 'No response body from backup API' },
        { status: 500 }
      )
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Error downloading backup:', error)
    
    // Differentiate between timeout and other errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backup download timed out' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to connect to backup API' },
      { status: 503 }
    )
  }
}