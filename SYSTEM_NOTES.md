# SYSTEM NOTES - CRITICAL REMINDERS

## 🎯 **IMPORTANT DOMAIN STRUCTURE**

### **PRIMARY DOMAINS:**
- **agistaffers.com** = PUBLIC HOMEPAGE (Apple-like design with AI website building company info)
- **admin.agistaffers.com** = ADMIN-ONLY DASHBOARD (system monitoring, container management, push notifications)

### **CURRENT STATUS:**
- ✅ **Push Notifications**: COMPLETE - Subscription working (1 subscriber)
- ✅ **AGI Staffers Homepage**: COMPLETE - Exceptional Apple-like design with:
  - Floating navigation with theme toggle
  - Parallax hero section with animated backgrounds  
  - Interactive feature showcase (auto-rotating every 3 seconds)
  - Hover effects with 3D transforms and shadows
  - Light/Dark theme support
  - Framer Motion animations throughout
  - Professional gradients and glass morphism

## 🏢 **COMPANY DESCRIPTION - AGI STAFFERS**

**Business Focus:**
- AI-powered website development company
- Specializes in automation and AI integration
- SEO optimization for AI search engines (Claude, Perplexity, ChatGPT)
- Complete website stack deployment with one-click creation

**Services Offered:**
- Modern tech stack (Next.js, React, TypeScript, Tailwind, PostgreSQL)
- Magic link authentication systems
- AI chatbot integration
- Complete CI/CD pipeline setup
- GitHub integration ready for Cursor IDE
- Real-time monitoring and analytics

## 🎨 **DESIGN STANDARDS - APPLE-LIKE AESTHETICS**

**Visual Elements:**
- Large, bold typography with gradient effects
- Rounded corners (rounded-2xl, rounded-3xl)
- Layered shadows with multiple depths
- Glass morphism and backdrop blur effects
- Smooth Framer Motion animations
- Interactive hover states with scale/rotation
- Professional color palette adapting to light/dark themes

**Interactive Features:**
- Theme toggle (light/dark mode)
- Parallax scrolling effects
- Auto-rotating content showcases
- 3D hover transformations
- Animated progress bars and counters
- Click-to-switch interactive cards

## 🚀 **NEXT PRIORITIES**

### **Phase 2: Complete Website Stack Template**
1. **Setup data management** (TanStack Query + React Hook Form)
2. **Implement authentication** (Magic Link + Google OAuth optional)  
3. **Setup PostgreSQL + Prisma ORM**
4. **Configure deployment** (Railway/Render)
5. **Add monitoring** (Google Analytics + Sentry)

### **Phase 3: One-Click Website Creation**
1. **Create deployment API** for website generation
2. **Build admin interface** with "Create Website" button  
3. **Implement client resource monitoring**
4. **Add scaling controls** (expand/limit resources per client)

## 🔧 **TECHNICAL INFRASTRUCTURE**

**VPS Details:**
- Host: 148.230.93.174 (Hostinger KVM4)
- Database: PostgreSQL (localhost:5432) 
- 18+ Docker containers running
- Caddy reverse proxy with automatic SSL
- 12 subdomains configured with HTTPS

**Key Services:**
- Push notifications API (port 3011) - ✅ Working
- Metrics API (port 3009) - ✅ Working  
- Admin dashboard (port 3007) - ✅ Working
- All AI services operational (n8n, flowise, chat, etc.)

## 📋 **DEPLOYMENT CHECKLIST**

**Before Deploying Homepage Updates:**
1. Fix dependency conflicts in package.json
2. Install framer-motion dependency  
3. Ensure theme provider is configured
4. Test light/dark theme switching
5. Verify all animations work properly
6. Restart container on correct port (3007)

**Container Management:**
- Main homepage: agistaffers-web container (port 3007→3000)
- Fix port conflicts (port 3000 used by open-webui)
- Use `--legacy-peer-deps` for npm install if needed

## 💡 **KEY REMINDERS**

1. **agistaffers.com** = Public website (NOT admin dashboard)
2. **admin.agistaffers.com** = Admin-only area  
3. **Company focus**: AI website building with automation
4. **Design standard**: Apple-like aesthetics with exceptional UX
5. **Next goal**: Complete website stack template creation
6. **Final goal**: One-click website deployment for clients

## 🎯 **SUCCESS METRICS**

- ✅ Push notifications: 1 subscriber, delivery working
- ✅ Homepage design: Apple-like quality achieved
- ✅ Theme support: Light/dark mode working
- 🔄 Container status: Needs dependency fixes for deployment
- 🔄 Next: Complete website stack template system