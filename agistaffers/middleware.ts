import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Simple domain-based routing without complex dependencies
  if (hostname.includes('admin.agistaffers.com') || hostname.includes('admin.localhost')) {
    // Admin subdomain
    if (url.pathname === '/') {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
    if (url.pathname === '/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }
  }
  
  // Allow all other requests
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}