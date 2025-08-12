/**
 * AGI Staffers API Gateway Worker
 * Handles routing, caching, and rate limiting at the edge
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers for PWA
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Rate limiting check
      const ip = request.headers.get('CF-Connecting-IP') || 'anonymous';
      const rateLimitKey = `rate_limit:${ip}:${Math.floor(Date.now() / 60000)}`; // Per minute
      
      const currentCount = await env.RATE_LIMIT.get(rateLimitKey);
      const count = parseInt(currentCount || '0') + 1;
      
      if (count > 100) { // 100 requests per minute
        return new Response('Rate limit exceeded', { 
          status: 429,
          headers: {
            ...corsHeaders,
            'Retry-After': '60'
          }
        });
      }
      
      // Update rate limit counter
      ctx.waitUntil(
        env.RATE_LIMIT.put(rateLimitKey, count.toString(), {
          expirationTtl: 60 // 1 minute
        })
      );

      // Authentication check for protected routes
      if (url.pathname.startsWith('/api/admin') || url.pathname.startsWith('/api/protected')) {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response('Unauthorized', { 
            status: 401,
            headers: corsHeaders
          });
        }
        
        // Validate token (simplified for demo - implement proper JWT validation)
        const token = authHeader.substring(7);
        const isValid = await validateToken(token, env);
        if (!isValid) {
          return new Response('Invalid token', { 
            status: 401,
            headers: corsHeaders
          });
        }
      }

      // Cache GET requests
      if (request.method === 'GET') {
        const cacheKey = new Request(url.toString(), request);
        const cache = caches.default;
        
        // Check cache first
        let response = await cache.match(cacheKey);
        
        if (response) {
          response = new Response(response.body, response);
          response.headers.set('X-Cache-Status', 'HIT');
          Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
          return response;
        }
        
        // Cache miss - fetch from origin
        const originUrl = `https://admin.agistaffers.com${url.pathname}${url.search}`;
        const originRequest = new Request(originUrl, {
          method: request.method,
          headers: request.headers,
          body: request.body,
          redirect: 'follow'
        });
        
        response = await fetch(originRequest);
        
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          response = new Response(response.body, response);
          response.headers.set('X-Cache-Status', 'MISS');
          response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
          
          Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
          
          ctx.waitUntil(cache.put(cacheKey, responseToCache));
        }
        
        return response;
      }
      
      // For non-GET requests, proxy directly to origin
      const originUrl = `https://admin.agistaffers.com${url.pathname}${url.search}`;
      const response = await fetch(originUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // Add CORS headers to response
      const modifiedResponse = new Response(response.body, response);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        modifiedResponse.headers.set(key, value);
      });
      
      return modifiedResponse;
      
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// Simple token validation (implement proper JWT validation in production)
async function validateToken(token, env) {
  // For demo purposes - in production, validate JWT signature
  const validTokens = await env.AUTH_TOKENS.get('valid_tokens');
  if (validTokens) {
    const tokenList = JSON.parse(validTokens);
    return tokenList.includes(token);
  }
  return false;
}