# 🚀 Cloudflare Setup Guide - BMAD METHOD COMPLIANT

## 🚨 MANDATORY: ALL CLOUDFLARE WORK MUST FOLLOW BMAD METHOD

### Required Tool Usage:
- **NO manual dashboard work** - Use Wrangler CLI and APIs
- **NO manual testing** - Use playwright and fetch MCPs
- **NO manual configuration** - Use automation scripts
- **MAXIMUM tool usage** - MCPs and Cursor extensions ONLY

---

## 📋 BMAD-COMPLIANT CLOUDFLARE SETUP

### 🔥 PHASE 1: BENCHMARK (Analyze Current State)

**Use Tools to Assess:**
```bash
# Use fetch MCP to test current endpoints
fetch MCP: Test https://agistaffers.com status
fetch MCP: Test https://admin.agistaffers.com status

# Use firecrawl to analyze Cloudflare features
firecrawl MCP: Extract Cloudflare Workers documentation
firecrawl MCP: Analyze competitor API gateways

# Use exa for research
exa MCP: Search "Cloudflare Workers best practices 2025"
```

**Required Outputs:**
- Current endpoint performance metrics
- Cloudflare feature comparison
- Competitive analysis report
- Gap identification document

### 🏗️ PHASE 2: MODEL (Design Solution)

**Use Tools to Design:**
```bash
# Use ref-tools for documentation
ref-tools MCP: Get Cloudflare Workers API reference
ref-tools MCP: Get Wrangler CLI documentation

# Use shadcn-ui for dashboard components
shadcn-ui MCP: Generate Cloudflare monitoring dashboard

# Use filesystem MCP to create structure
filesystem MCP: Create worker templates
filesystem MCP: Generate wrangler.toml configs
```

**Required Architecture:**
```
cloudflare-workers/
├── api-gateway/          # Rate limiting, auth
├── metrics-cache/        # Performance caching
├── push-router/          # Push notification routing
└── automated-setup.sh    # BMAD-compliant automation
```

### 🔍 PHASE 3: ANALYZE (Verify Quality)

**Use Tools to Analyze:**
```bash
# Use semgrep for security scanning
semgrep MCP: Scan all Worker code for vulnerabilities
semgrep MCP: Check for exposed secrets

# Use serena for code quality
serena MCP: Analyze Worker JavaScript
serena MCP: Check complexity metrics

# Use playwright for testing
playwright MCP: Test Worker endpoints
playwright MCP: Verify rate limiting
```

**Required Checks:**
- [ ] Security scan passed (semgrep)
- [ ] Code quality A+ (serena)
- [ ] All tests passing (playwright)
- [ ] Performance benchmarks met

### 🚀 PHASE 4: DELIVER (Deploy with Automation)

**Use Tools to Deploy:**
```bash
# Use git MCP for version control
git MCP: Commit all Worker code
git MCP: Tag release version

# Use filesystem MCP for automation
filesystem MCP: Execute deployment scripts
filesystem MCP: Update configuration files

# NO MANUAL STEPS - Use automation:
./automated-setup.sh  # Runs all commands automatically
```

---

## 🛠️ AUTOMATED SETUP SCRIPT (BMAD-COMPLIANT)

```bash
#!/bin/bash
# BMAD-COMPLIANT CLOUDFLARE SETUP
# NO MANUAL STEPS ALLOWED

# BENCHMARK: Check prerequisites
echo "🔥 BENCHMARK PHASE: Checking current state..."
wrangler whoami || { echo "❌ Wrangler not logged in"; exit 1; }

# MODEL: Create KV namespaces
echo "🏗️ MODEL PHASE: Creating infrastructure..."
RATE_LIMIT_ID=$(wrangler kv:namespace create "RATE_LIMIT" --preview false | grep -oP 'id = "\K[^"]+')
AUTH_TOKENS_ID=$(wrangler kv:namespace create "AUTH_TOKENS" --preview false | grep -oP 'id = "\K[^"]+')
METRICS_CACHE_ID=$(wrangler kv:namespace create "METRICS_CACHE" --preview false | grep -oP 'id = "\K[^"]+')
PUSH_SUBS_ID=$(wrangler kv:namespace create "PUSH_SUBSCRIPTIONS" --preview false | grep -oP 'id = "\K[^"]+')

# Update configs automatically
sed -i "s/YOUR_RATE_LIMIT_KV_ID/$RATE_LIMIT_ID/g" api-gateway/wrangler.toml
sed -i "s/YOUR_AUTH_TOKENS_KV_ID/$AUTH_TOKENS_ID/g" api-gateway/wrangler.toml
sed -i "s/YOUR_METRICS_CACHE_KV_ID/$METRICS_CACHE_ID/g" metrics-cache/wrangler.toml
sed -i "s/YOUR_PUSH_SUBSCRIPTIONS_KV_ID/$PUSH_SUBS_ID/g" push-router/wrangler.toml

# ANALYZE: Test configurations
echo "🔍 ANALYZE PHASE: Testing configurations..."
cd api-gateway && wrangler dev --test && cd ..
cd metrics-cache && wrangler dev --test && cd ..
cd push-router && wrangler dev --test && cd ..

# DELIVER: Deploy all workers
echo "🚀 DELIVER PHASE: Deploying to production..."
cd api-gateway && wrangler publish && cd ..
cd metrics-cache && wrangler publish && cd ..
cd push-router && wrangler publish && cd ..

echo "✅ BMAD-COMPLIANT DEPLOYMENT COMPLETE"
```

---

## 📊 TOOL USAGE FOR CLOUDFLARE

### Required MCP Servers:
| Task | MCP Server | Manual Alternative | Status |
|------|------------|-------------------|--------|
| Test endpoints | `fetch` | curl | ❌ FORBIDDEN |
| Get documentation | `ref-tools` | Browser | ❌ FORBIDDEN |
| Analyze competitors | `firecrawl` | Copy/paste | ❌ FORBIDDEN |
| Security scan | `semgrep` | Manual review | ❌ FORBIDDEN |
| Code quality | `serena` | Visual check | ❌ FORBIDDEN |
| Version control | `git` | File copies | ❌ FORBIDDEN |

### Required Cursor Extensions:
| Task | Extension | Manual Alternative | Status |
|------|-----------|-------------------|--------|
| API testing | Thunder Client | Postman/curl | ❌ FORBIDDEN |
| Code formatting | Prettier | Manual format | ❌ FORBIDDEN |
| JavaScript linting | ESLint | Manual review | ❌ FORBIDDEN |
| Git operations | GitLens | Command line | ⚠️ Use both |

---

## 🔐 CLOUDFLARE CREDENTIALS (Store in Vault)

```bash
# Use postgres MCP to store credentials
postgres MCP: INSERT INTO credentials (service, key, value) VALUES
  ('cloudflare', 'account_id', 'YOUR_ACCOUNT_ID'),
  ('cloudflare', 'api_token', 'YOUR_API_TOKEN'),
  ('cloudflare', 'zone_id', 'YOUR_ZONE_ID');

# NEVER hardcode credentials
# ALWAYS use environment variables or Vault
```

---

## 📋 DNS CONFIGURATION (AUTOMATED)

### ❌ WRONG: Manual Dashboard Configuration
```
1. Login to Cloudflare dashboard
2. Click DNS
3. Add record manually
4. Save
```

### ✅ RIGHT: BMAD Tool Approach
```bash
# Use Cloudflare API with fetch MCP
fetch MCP: POST https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records
{
  "type": "A",
  "name": "api",
  "content": "72.60.28.175",
  "proxied": true
}

# Or use automated script
./create-dns-record.sh api A 72.60.28.175 true
```

---

## 🚀 CLOUDFLARE PAGES DEPLOYMENT

### BMAD-Compliant Pages Setup:
```bash
# BENCHMARK: Test current site
playwright MCP: Test https://admin.agistaffers.com performance

# MODEL: Build optimized version
npm run build  # Automated build

# ANALYZE: Verify build
serena MCP: Analyze build output
semgrep MCP: Security scan dist/

# DELIVER: Deploy with Wrangler
wrangler pages publish dist/ --project-name=admin-dashboard
```

---

## 📊 MONITORING & ALERTS

### Use Tools for Monitoring:
```bash
# Don't check dashboard manually
# Use fetch MCP for API monitoring
fetch MCP: GET https://api.cloudflare.com/client/v4/zones/{zone_id}/analytics

# Automate with cron + fetch
*/5 * * * * fetch MCP check-cloudflare-metrics.js
```

---

## ⚠️ BMAD COMPLIANCE CHECKLIST

### For Every Cloudflare Task:
- [ ] BENCHMARK: Used fetch/firecrawl to analyze
- [ ] MODEL: Used ref-tools for documentation
- [ ] ANALYZE: Used semgrep/serena for quality
- [ ] DELIVER: Used automation scripts

### Tool Usage Verification:
- [ ] NO manual dashboard clicks
- [ ] NO curl commands (use fetch MCP)
- [ ] NO manual testing (use playwright)
- [ ] NO visual code review (use serena)
- [ ] ALL changes through git MCP

---

## 🔴 ENFORCEMENT

**VIOLATIONS:**
- Opening Cloudflare dashboard = VIOLATION
- Using curl instead of fetch MCP = VIOLATION
- Manual DNS configuration = VIOLATION
- Clicking "Deploy" button = VIOLATION
- Manual testing = VIOLATION

**COMPLIANT WORKFLOW:**
1. ALL configuration through Wrangler CLI
2. ALL testing through playwright/fetch MCPs
3. ALL deployment through automation scripts
4. ALL monitoring through API + tools

---

**THIS GUIDE ENFORCES BMAD METHOD**
**MAXIMUM TOOL USAGE REQUIRED**
**NO MANUAL CLOUDFLARE WORK**

**Last Updated:** January 11, 2025
**Compliance Status:** MANDATORY