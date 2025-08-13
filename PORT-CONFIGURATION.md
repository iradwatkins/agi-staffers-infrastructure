# 🔌 AGI STAFFERS PORT CONFIGURATION
**Last Updated:** January 12, 2025
**Status:** PRODUCTION STANDARD

## ✅ FIXED PORT ASSIGNMENTS

| Service | Port | Domain | Description | Status |
|---------|------|--------|-------------|--------|
| **AGI Staffers Main** | 3003 | agistaffers.com + admin.agistaffers.com | Main Next.js application (Consumer + Admin) | ✅ PRIMARY |
| Push Notifications API | 3011 | - | WebPush notification service | ✅ ACTIVE |
| Metrics API | 3010 | - | Real-time metrics collection | ✅ ACTIVE |
| Database (PostgreSQL) | 5432 | - | Main database | ✅ ACTIVE |
| Redis Cache | 6379 | - | Session & cache storage | ✅ ACTIVE |

## 🚫 DEPRECATED/OLD PORTS (DO NOT USE)
- ~~3000~~ - Old default Next.js port
- ~~3008~~ - Old deployment attempt
- ~~3009~~ - Old deployment attempt  
- ~~3020~~ - Temporary port (migrate to 3003)

## 📝 IMPLEMENTATION PLAN

### 1. Update PM2 Configuration
```bash
# Stop all old processes
pm2 delete all

# Start main app on port 3003
cd /root/agistaffers
PORT=3003 pm2 start npm --name "agistaffers-main" -- run dev

# Keep auxiliary services on their ports
pm2 start /root/push-api/server.js --name "push-api" 
pm2 start /root/metrics-api/server.js --name "metrics-api"

pm2 save
pm2 startup
```

### 2. Update Caddy Configuration
```caddy
# Consumer site - Port 3003
agistaffers.com {
    reverse_proxy localhost:3003
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    encode gzip
}

# Admin dashboard - Port 3003 with /admin routing
admin.agistaffers.com {
    reverse_proxy localhost:3003
    handle /* {
        rewrite * /admin{uri}
    }
    handle / {
        rewrite * /admin
    }
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
    encode gzip
}
```

### 3. Environment Variables Update
```env
# .env.production
PORT=3003
NEXT_PUBLIC_APP_URL=https://agistaffers.com
NEXTAUTH_URL=https://agistaffers.com
NEXT_PUBLIC_PUSH_API_URL=https://agistaffers.com:3011
PUSH_API_URL=http://localhost:3011
METRICS_API_URL=http://localhost:3010
```

## 🎯 BENEFITS OF FIXED PORTS

1. **No Confusion:** Always know which port = which service
2. **Easy Debugging:** Can quickly identify services by port
3. **Firewall Rules:** Can set permanent firewall rules
4. **Documentation:** Clear reference for team members
5. **Monitoring:** Can set up permanent monitoring for specific ports

## 🔧 MIGRATION COMMANDS

To migrate from current setup to standardized ports:

```bash
# On VPS (72.60.28.175)
ssh root@72.60.28.175

# 1. Stop current processes
pm2 stop agistaffers
pm2 delete agistaffers

# 2. Update to port 3003
cd /root/agistaffers
PORT=3003 pm2 start npm --name "agistaffers-main" -- run dev

# 3. Update Caddy
nano /etc/caddy/Caddyfile
# Change all localhost:3020 to localhost:3003
docker exec caddy caddy reload --config /etc/caddy/Caddyfile --force

# 4. Save PM2 config
pm2 save
pm2 startup
```

## ⚠️ IMPORTANT NOTES

- **NEVER** use random ports
- **ALWAYS** use port 3003 for main AGI Staffers app
- **DOCUMENT** any port changes in this file
- **TEST** after any port configuration change

---

**This is the SOURCE OF TRUTH for port configuration**