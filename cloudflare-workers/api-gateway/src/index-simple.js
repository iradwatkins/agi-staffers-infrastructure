export default {
  async fetch(request, env, ctx) {
    return new Response(JSON.stringify({
      message: "AGI Staffers API Gateway is working",
      timestamp: new Date().toISOString(),
      url: request.url
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
};