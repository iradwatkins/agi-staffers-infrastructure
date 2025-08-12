export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Basic CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Proxy to origin server
      const originUrl = `${env.ORIGIN_URL}${url.pathname}${url.search}`;
      console.log(`Proxying to: ${originUrl}`);
      
      const response = await fetch(originUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method === 'GET' || request.method === 'HEAD' ? null : await request.text()
      });
      
      // Clone response to add CORS headers
      const newResponse = new Response(await response.text(), {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          ...corsHeaders
        }
      });
      
      return newResponse;
      
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(JSON.stringify({
        error: 'Gateway Error',
        message: error.message,
        timestamp: new Date().toISOString()
      }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};