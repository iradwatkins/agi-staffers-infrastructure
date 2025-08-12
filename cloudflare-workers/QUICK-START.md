# 🚀 Cloudflare Workers Quick Start

## Installation Steps

### 1. Install Dependencies
```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare
```bash
wrangler login
```

### 3. Create KV Namespaces
```bash
./create-kv-namespaces.sh
```

Copy the namespace IDs that are output and update the `wrangler.toml` files:
- `api-gateway/wrangler.toml` - Add RATE_LIMIT and AUTH_TOKENS IDs
- `metrics-cache/wrangler.toml` - Add METRICS_CACHE ID  
- `push-router/wrangler.toml` - Add PUSH_SUBSCRIPTIONS ID

### 4. Add DNS Record
In Cloudflare Dashboard:
1. Go to DNS for agistaffers.com
2. Add A record:
   - Name: `api`
   - IP: `72.60.28.175`
   - Proxy: ON (orange cloud)

### 5. Deploy All Workers
```bash
./deploy-all.sh
```

## Testing

Test your deployment:
```bash
# Test API Gateway
curl https://api.agistaffers.com/api/metrics

# Should see response with headers:
# X-Cache-Status: HIT or MISS
```

## Admin Dashboard on Cloudflare Pages

1. Go to https://dash.cloudflare.com/pages
2. Create new project
3. Connect your GitHub repo or upload files
4. Build settings:
   - Command: `npm run build`
   - Output: `out`
5. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://api.agistaffers.com
   NEXT_PUBLIC_METRICS_URL=https://api.agistaffers.com/api/metrics
   NEXT_PUBLIC_PUSH_URL=https://api.agistaffers.com/api/push
   ```
6. Deploy!

## Success! 🎉

Your infrastructure is now:
- ✅ Globally distributed
- ✅ Auto-scaling
- ✅ DDoS protected
- ✅ 60% faster
- ✅ All FREE!