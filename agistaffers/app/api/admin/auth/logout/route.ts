import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSession, getAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for routes that use cookies
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get current session to clear it from database
    const session = await getAdminSession()
    
    if (session) {
      // Clear session from database
      await prisma.adminSession.deleteMany({
        where: {
          adminId: session.id,
        },
      })
    }

    // Clear session cookie
    await clearAdminSession()

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
}