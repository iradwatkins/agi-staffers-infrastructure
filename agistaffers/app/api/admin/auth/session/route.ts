import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: session.id,
        email: session.email,
        name: session.name,
        role: session.role,
      }
    })
  } catch (error) {
    console.error('Admin session check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}