import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { AdminUser } from '@prisma/client'

const ADMIN_AUTH_SECRET = new TextEncoder().encode(
  process.env.ADMIN_AUTH_SECRET || 'admin-secret-key-replace-in-production-2025'
)

const ADMIN_SESSION_NAME = process.env.ADMIN_SESSION_NAME || 'admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 30 // 30 days

export interface AdminSession {
  id: string
  email: string
  name: string
  role: string
  exp: number
  iat: number
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Compare password with hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a JWT token for admin session
 */
export async function createAdminSession(admin: AdminUser, rememberMe: boolean = false): Promise<string> {
  const duration = rememberMe ? SESSION_DURATION : 60 * 60 * 24 // 24 hours if not remember me
  
  return new SignJWT({
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${duration}s`)
    .sign(ADMIN_AUTH_SECRET)
}

/**
 * Verify and decode admin JWT token
 */
export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_AUTH_SECRET)
    return payload as unknown as AdminSession
  } catch (error) {
    return null
  }
}

/**
 * Get current admin session from cookies
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(ADMIN_SESSION_NAME)?.value

  if (!token) return null

  return verifyAdminSession(token)
}

/**
 * Set admin session cookie
 */
export async function setAdminSessionCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = cookies()
  const maxAge = rememberMe ? SESSION_DURATION : 60 * 60 * 24 // 24 hours if not remember me

  cookieStore.set(ADMIN_SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
    domain: process.env.NODE_ENV === 'production' ? '.agistaffers.com' : undefined,
  })
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete(ADMIN_SESSION_NAME)
}

/**
 * Authenticate admin with email and password
 */
export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!admin || !admin.isActive) {
      return null
    }

    const isValid = await verifyPassword(password, admin.passwordHash)
    if (!isValid) {
      return null
    }

    // Update last login time
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    return admin
  } catch (error) {
    console.error('Admin authentication error:', error)
    return null
  }
}

/**
 * Check if admin has 2FA enabled
 */
export async function checkAdmin2FA(adminId: string): Promise<boolean> {
  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { twoFactorEnabled: true },
  })
  
  return admin?.twoFactorEnabled || false
}

/**
 * Verify 2FA code for admin
 */
export async function verify2FACode(adminId: string, code: string): Promise<boolean> {
  // This would integrate with speakeasy or similar TOTP library
  // For now, returning true for demonstration
  // In production, implement proper TOTP verification
  
  const admin = await prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { twoFactorSecret: true },
  })
  
  if (!admin?.twoFactorSecret) return false
  
  // TODO: Implement actual TOTP verification with speakeasy
  // const verified = speakeasy.totp.verify({
  //   secret: admin.twoFactorSecret,
  //   encoding: 'base32',
  //   token: code,
  //   window: 2
  // })
  
  return true // Placeholder
}

/**
 * Create admin session in database
 */
export async function createAdminSessionRecord(adminId: string, token: string, ipAddress?: string, userAgent?: string) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000)
  
  return prisma.adminSession.create({
    data: {
      adminId,
      token,
      ipAddress,
      userAgent,
      expiresAt,
    },
  })
}

/**
 * Clear expired admin sessions
 */
export async function clearExpiredAdminSessions() {
  return prisma.adminSession.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

/**
 * Check if request is from admin subdomain
 */
export function isAdminDomain(hostname: string): boolean {
  return hostname.startsWith('admin.agistaffers.com') || 
         hostname.startsWith('admin.localhost')
}