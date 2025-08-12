// BMAD: Rate Limiting Middleware
// Redis-backed rate limiting for API protection

import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client (use Upstash or local Redis)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

// Rate limit configurations
interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Maximum requests per window
  message: string;  // Error message
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // General API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later.'
  },
  // Authentication endpoints (stricter)
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later.'
  },
  // Metrics endpoint (moderate)
  metrics: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    message: 'Metrics rate limit exceeded.'
  },
  // Customer operations (moderate)
  customers: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50,
    message: 'Customer API rate limit exceeded.'
  }
};

// Get client identifier (IP address or user ID)
function getClientId(request: NextRequest): string {
  // Try to get real IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return ip;
}

// Determine rate limit config based on path
function getRateLimitConfig(pathname: string): RateLimitConfig {
  if (pathname.startsWith('/api/auth')) {
    return rateLimitConfigs.auth;
  }
  if (pathname.startsWith('/api/metrics')) {
    return rateLimitConfigs.metrics;
  }
  if (pathname.startsWith('/api/customers')) {
    return rateLimitConfigs.customers;
  }
  return rateLimitConfigs.api;
}

// Main rate limiting function
export async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  
  // Skip rate limiting for non-API routes
  if (!pathname.startsWith('/api')) {
    return null;
  }

  const clientId = getClientId(request);
  const config = getRateLimitConfig(pathname);
  
  // Create Redis key for this client and endpoint
  const key = `rate_limit:${pathname}:${clientId}`;
  
  try {
    // Get current request count
    const current = await redis.get(key) as number | null;
    
    if (current === null) {
      // First request in window
      await redis.setex(key, Math.floor(config.windowMs / 1000), 1);
      return null; // Allow request
    }
    
    if (current >= config.maxRequests) {
      // Rate limit exceeded
      return NextResponse.json(
        { 
          error: config.message,
          retryAfter: config.windowMs / 1000
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(config.windowMs / 1000),
            'X-RateLimit-Limit': String(config.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + config.windowMs)
          }
        }
      );
    }
    
    // Increment counter
    await redis.incr(key);
    
    // Add rate limit headers to successful response
    request.headers.set('X-RateLimit-Limit', String(config.maxRequests));
    request.headers.set('X-RateLimit-Remaining', String(config.maxRequests - current - 1));
    
    return null; // Allow request
  } catch (error) {
    console.error('Rate limiting error:', error);
    // On error, allow request but log issue
    return null;
  }
}

// Middleware export for Next.js
export async function middleware(request: NextRequest) {
  const rateLimitResponse = await rateLimit(request);
  
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  return NextResponse.next();
}

// Configuration for Next.js middleware
export const config = {
  matcher: [
    '/api/:path*',
    // Exclude static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
};