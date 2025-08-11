import { NextResponse } from 'next/server'

// VAPID public key for push notifications
const VAPID_PUBLIC_KEY = 'BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8'

export async function GET() {
  return NextResponse.json({ publicKey: VAPID_PUBLIC_KEY })
}