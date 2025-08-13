import { NextRequest, NextResponse } from 'next/server'
import { 
  authenticateAdmin, 
  createAdminSession, 
  setAdminSessionCookie,
  checkAdmin2FA,
  verify2FACode,
  createAdminSessionRecord
} from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe, twoFactorCode } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate admin
    const admin = await authenticateAdmin(email, password)
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if 2FA is enabled
    const has2FA = await checkAdmin2FA(admin.id)
    
    if (has2FA) {
      // If no 2FA code provided, request it
      if (!twoFactorCode) {
        return NextResponse.json(
          { 
            requiresTwoFactor: true,
            message: 'Please enter your 2FA code' 
          },
          { status: 200 }
        )
      }

      // Verify 2FA code
      const is2FAValid = await verify2FACode(admin.id, twoFactorCode)
      
      if (!is2FAValid) {
        return NextResponse.json(
          { error: 'Invalid 2FA code' },
          { status: 401 }
        )
      }
    }

    // Create JWT session
    const token = await createAdminSession(admin, rememberMe)
    
    // Set session cookie
    await setAdminSessionCookie(token, rememberMe)
    
    // Store session in database
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined
    
    await createAdminSessionRecord(admin.id, token, ipAddress, userAgent)

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}