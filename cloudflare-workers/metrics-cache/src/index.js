/**
 * AGI Staffers Metrics Cache Worker
 * Optimizes metrics API performance with edge caching
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Only handle metrics endpoints
    if (!url.pathname.startsWith('/api/metrics')) {
      return new Response('Not Found', { status: 404 });
    }
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { 
        status: 405,
        headers: corsHeaders
      });
    }
    
    try {
      // Create cache key based on endpoint
      const cacheKey = `metrics:${url.pathname}`;
      
      // Check KV cache first (faster than cache API for small data)
      const cachedData = await env.METRICS_CACHE.get(cacheKey);
      
      if (cachedData) {
        return new Response(cachedData, {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache-Status': 'HIT',
            'Cache-Control': 'public, max-age=5', // Very short browser cache
            ...corsHeaders
          }
        });
      }
      
      // Fetch from origin
      const originUrl = `https://admin.agistaffers.com${url.pathname}`;
      const response = await fetch(originUrl);
      
      if (response.ok) {
        const data = await response.text();
        
        // Cache in KV for 5 seconds (metrics update frequently)
        ctx.waitUntil(
          env.METRICS_CACHE.put(cacheKey, data, {
            expirationTtl: 5
          })
        );
        
        return new Response(data, {
          headers: {
            'Content-Type': 'application/json',
            'X-Cache-Status': 'MISS',
            'Cache-Control': 'public, max-age=5',
            ...corsHeaders
          }
        });
      }
      
      return new Response('Metrics unavailable', {
        status: response.status,
        headers: corsHeaders
      });
      
    } catch (error) {
      console.error('Metrics cache error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch metrics' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};