# PWA Development Guide - AGI Staffers

## 🎯 BMAD Method for PWA Development

### BENCHMARK Phase
- **Performance Metrics**:
  - Lighthouse PWA score > 90
  - Service worker cache hit rate > 80%
  - Offline functionality response < 100ms
  - Push notification delivery > 95%

### MODEL Phase
- **Component Architecture**:
  - Use shadcn-ui MCP for UI components
  - Service worker with smart caching
  - Push notification preferences UI
  - Install prompt component

### ANALYZE Phase
- **Quality Checks**:
  - PWA Studio extension for debugging
  - Service worker version tracking
  - Network request monitoring
  - Cache strategy validation

### DELIVER Phase
- **Deployment Process**:
  1. Increment service worker version
  2. Test on Samsung Fold 6
  3. Validate push notifications
  4. Deploy with cache clearing

## 📱 Service Worker Best Practices

### Version Management
```javascript
const CACHE_VERSION = 'v2.0.X'; // INCREMENT ON EVERY CHANGE
const CACHE_NAME = `agi-staffers-${CACHE_VERSION}`;
```

### Smart Caching Strategy
```javascript
// Skip HTML caching to prevent stale content
if (request.headers.get('accept')?.includes('text/html')) {
  return fetch(request);
}
```

### Update Notifications
```javascript
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
```

## 🔔 Push Notification Implementation

### API Endpoints
- **Subscribe**: `POST /api/push/subscribe`
- **Send**: `POST /api/push/send`
- **Preferences**: `GET/POST /api/push/preferences`

### Testing Workflow
1. Generate VAPID keys
2. Request notification permission
3. Subscribe user
4. Send test notification
5. Verify delivery

## 📊 Historical Data Storage

### Database Schema (PostgreSQL)
```sql
CREATE TABLE metrics_history (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  cpu_usage FLOAT,
  memory_usage FLOAT,
  network_rx BIGINT,
  network_tx BIGINT,
  container_stats JSONB
);
```

### Data Retention
- 5-minute intervals for 24 hours
- Hourly averages for 7 days
- Daily averages for 30 days

## 🧪 Testing Checklist

### Pre-Deployment
- [ ] Service worker version incremented
- [ ] Lighthouse PWA audit passed
- [ ] Samsung Fold 6 viewport tested
- [ ] Push notifications working
- [ ] Offline mode functional
- [ ] API endpoints responding < 200ms

### Post-Deployment
- [ ] Clear browser cache
- [ ] Verify service worker update
- [ ] Test install prompt
- [ ] Check push delivery
- [ ] Monitor error logs

## 🛠️ Tool Integration

### VS Code Extensions
- **PWA Studio**: Service worker debugging
- **Thunder Client**: API testing collections
- **Turbo Console Log**: Debug logging

### MCP Servers
- **postgres**: Historical data queries
- **fetch**: API endpoint testing
- **shadcn-ui**: Component generation

## 📝 Common Issues & Solutions

### Service Worker Not Updating
```bash
# Clear all caches
DevTools → Application → Storage → Clear site data
```

### Push Notifications Not Working
1. Check VAPID keys configuration
2. Verify SSL certificates
3. Test with real device tokens
4. Monitor push API logs

### PWA Not Installing
1. Validate manifest.json
2. Check HTTPS requirement
3. Verify service worker registration
4. Test on multiple browsers

## 🚀 Deployment Commands

### Update Admin Dashboard
```bash
# Deploy and restart
./deploy-admin-dashboard.sh
ssh agi-vps 'docker restart admin-dashboard'

# Verify deployment
ssh agi-vps 'docker logs admin-dashboard --tail 50'
```

### Monitor Real-time Logs
```bash
ssh agi-vps 'docker logs -f metrics-api'
ssh agi-vps 'docker logs -f push-api'
```

Remember: Every PWA feature must enhance the user experience and support the multi-tenant architecture goals of AGI Staffers.