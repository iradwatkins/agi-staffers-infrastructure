/**
 * AGI Staffers Push Notification Router
 * Manages push subscriptions and notification delivery at the edge
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Only handle push endpoints
    if (!url.pathname.startsWith('/api/push')) {
      return new Response('Not Found', { status: 404 });
    }
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    try {
      // Handle different push endpoints
      switch (url.pathname) {
        case '/api/push/subscribe':
          return await handleSubscribe(request, env, corsHeaders);
          
        case '/api/push/unsubscribe':
          return await handleUnsubscribe(request, env, corsHeaders);
          
        case '/api/push/send':
          return await handleSendNotification(request, env, corsHeaders);
          
        case '/api/push/subscriptions':
          return await handleListSubscriptions(request, env, corsHeaders);
          
        default:
          // Proxy to origin for other push endpoints
          const originUrl = `https://admin.agistaffers.com${url.pathname}${url.search}`;
          const response = await fetch(originUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body
          });
          
          const modifiedResponse = new Response(response.body, response);
          Object.entries(corsHeaders).forEach(([key, value]) => {
            modifiedResponse.headers.set(key, value);
          });
          
          return modifiedResponse;
      }
    } catch (error) {
      console.error('Push router error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

async function handleSubscribe(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }
  
  const subscription = await request.json();
  
  // Validate subscription object
  if (!subscription.endpoint || !subscription.keys) {
    return new Response(JSON.stringify({ error: 'Invalid subscription' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  // Generate unique ID for subscription
  const subId = crypto.randomUUID();
  const subKey = `push_sub:${subId}`;
  
  // Store subscription in KV
  await env.PUSH_SUBSCRIPTIONS.put(subKey, JSON.stringify({
    ...subscription,
    id: subId,
    created: new Date().toISOString()
  }), {
    expirationTtl: 60 * 60 * 24 * 30 // 30 days
  });
  
  // Also store endpoint-to-ID mapping for easy lookup
  await env.PUSH_SUBSCRIPTIONS.put(
    `push_endpoint:${btoa(subscription.endpoint)}`,
    subId,
    { expirationTtl: 60 * 60 * 24 * 30 }
  );
  
  return new Response(JSON.stringify({ 
    success: true, 
    subscriptionId: subId 
  }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

async function handleUnsubscribe(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }
  
  const { endpoint } = await request.json();
  
  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Endpoint required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  // Find subscription ID by endpoint
  const subId = await env.PUSH_SUBSCRIPTIONS.get(`push_endpoint:${btoa(endpoint)}`);
  
  if (subId) {
    // Delete subscription and endpoint mapping
    await env.PUSH_SUBSCRIPTIONS.delete(`push_sub:${subId}`);
    await env.PUSH_SUBSCRIPTIONS.delete(`push_endpoint:${btoa(endpoint)}`);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  return new Response(JSON.stringify({ error: 'Subscription not found' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

async function handleSendNotification(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }
  
  // Check authorization
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { 
      status: 401,
      headers: corsHeaders
    });
  }
  
  const { title, body, data, tag } = await request.json();
  
  if (!title || !body) {
    return new Response(JSON.stringify({ error: 'Title and body required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
  
  // Get all subscriptions
  const subscriptions = [];
  const listResult = await env.PUSH_SUBSCRIPTIONS.list({ prefix: 'push_sub:' });
  
  for (const key of listResult.keys) {
    const sub = await env.PUSH_SUBSCRIPTIONS.get(key.name);
    if (sub) {
      subscriptions.push(JSON.parse(sub));
    }
  }
  
  // Send to origin push API for actual delivery
  const originUrl = 'https://admin.agistaffers.com/api/push/send';
  const response = await fetch(originUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify({
      notification: { title, body, data, tag },
      subscriptions
    })
  });
  
  const result = await response.json();
  
  return new Response(JSON.stringify(result), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

async function handleListSubscriptions(request, env, corsHeaders) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders
    });
  }
  
  // Check authorization
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { 
      status: 401,
      headers: corsHeaders
    });
  }
  
  const subscriptions = [];
  const listResult = await env.PUSH_SUBSCRIPTIONS.list({ prefix: 'push_sub:' });
  
  for (const key of listResult.keys) {
    const sub = await env.PUSH_SUBSCRIPTIONS.get(key.name);
    if (sub) {
      const parsed = JSON.parse(sub);
      // Don't send sensitive key information
      subscriptions.push({
        id: parsed.id,
        endpoint: parsed.endpoint,
        created: parsed.created
      });
    }
  }
  
  return new Response(JSON.stringify({ 
    subscriptions,
    count: subscriptions.length
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}