\# STRICT BUILD REQUIREMENTS \- DO NOT DEVIATE

You are converting the existing agistaffers.com vanilla JavaScript to React. The website is already created and functional \- it just needs to be re-coded in React. SteppersLife.com will be converted after agistaffers.com is complete. Use ONLY the tools listed below.

\#\# PROJECT PRIORITY  
1\. **\*\*FIRST\*\***: Convert agistaffers.com   
2\. **\*\*SECOND\*\***: Convert SteppersLife.com (after agistaffers.com is complete)

\#\# MANDATORY TECH STACK

\#\#\# Framework  
\- Next.js 14 (App Router)
\- Vite + React (for specific React components/modules)

\#\#\# Database  
\- PostgreSQL  
\- Prisma

\#\#\# UI  
\- shadcn/ui  
\- Tailwind CSS

\#\#\# PWA  
\- next-pwa

\#\#\# Data Fetching  
\- TanStack Query

\#\#\# Forms  
\- React Hook Form  
\- Zod

\#\#\# Authentication  
\- NextAuth.js

\#\#\# Language  
\- TypeScript

\#\#\# Build Tools
\- Vite (for fast development and optimized production builds)

\#\#\# Package Manager  
\- pnpm

\#\#\# Deployment  
\- Railway

\#\# STRICT RULES

1\. **\*\*DO NOT\*\*** use any alternative libraries or tools not listed above  
2\. **\*\*DO NOT\*\*** combine different solutions (e.g., no mixing Firebase with PostgreSQL)  
3\. **\*\*DO NOT\*\*** add "helpful" extras not in this list  
4\. **\*\*DO NOT\*\*** suggest alternatives even if they seem better  
5\. **\*\*DO NOT\*\*** use npm or yarn \- use pnpm only  
6\. **\*\*DO NOT\*\*** use Pages Router \- use App Router only  
7\. **\*\*DO NOT\*\*** use vanilla CSS or CSS modules \- use Tailwind CSS only  
8\. **\*\*DO NOT\*\*** write custom UI components if shadcn/ui has them  
9\. **\*\*DO NOT\*\*** use fetch directly \- use TanStack Query for all API calls  
10\. **\*\*DO NOT\*\*** use useState for form state \- use React Hook Form

\#\# PROJECT STRUCTURE

Use this exact structure for agistaffers.com:

agistaffers/ ├── app/ │ ├── (auth)/ │ │ ├── login/ │ │ └── register/ │ ├── api/ │ │ ├── auth/ │ │ └── \[...nextauth\]/ │ ├── layout.tsx │ ├── page.tsx │ └── manifest.ts ├── components/ │ ├── ui/ (shadcn/ui components only) │ └── ... (custom components) ├── lib/ │ ├── prisma.ts │ ├── auth.ts │ ├── queries.ts │ └── utils.ts ├── prisma/ │ └── schema.prisma ├── public/ │ ├── manifest.json │ ├── sw.js │ ├── icons/ │ └── images/ ├── hooks/ │ └── use-\*.ts ├── types/ │ └── index.ts └── .env.local (copy existing ENV values)

\#\# INSTALLATION COMMANDS

Execute in this exact order:

\`\`\`bash  
\# 1\. Create Next.js app for agistaffers.com  
pnpm create next-app@latest agistaffers \--typescript \--tailwind \--app \--eslint

\# 2\. Navigate to project  
cd agistaffers

\# 3\. Install exact dependencies  
pnpm add @tanstack/react-query@5.17.0  
pnpm add react-hook-form@7.48.0 zod@3.22.4  
pnpm add next-auth@5.0.0-beta.4 @auth/prisma-adapter  
pnpm add prisma@5.8.0 @prisma/client@5.8.0  
pnpm add next-pwa@5.6.0

\# 4\. Install Vite for specific React components
pnpm add -D vite @vitejs/plugin-react

\# 5\. Setup shadcn/ui  
pnpm dlx shadcn-ui@latest init \-y

\# 6\. Initialize Prisma

pnpm dlx prisma init \--datasource-provider postgresql

## **PWA CONFIGURATION**

Create `next.config.js`:

javascript  
const withPWA \= require('next-pwa')({  
  dest: 'public',  
  register: true,  
  skipWaiting: true,  
  disable: process.env.NODE\_ENV \=== 'development'  
})

module.exports \= withPWA({  
  reactStrictMode: true,  
  typescript: {  
    ignoreBuildErrors: false,  
  },  
  eslint: {  
    ignoreDuringBuilds: false,  
  }

})

Create `public/manifest.json`:

json  
{  
  "name": "AGI Staffers",  
  "short\_name": "AGIStaffers",  
  "description": "Professional VPS Hosting Services",  
  "theme\_color": "\#000000",  
  "background\_color": "\#ffffff",  
  "display": "standalone",  
  "orientation": "portrait",  
  "scope": "/",  
  "start\_url": "/",  
  "icons": \[  
    {  
      "src": "/icons/icon-192x192.png",  
      "sizes": "192x192",  
      "type": "image/png"  
    },  
    {  
      "src": "/icons/icon-512x512.png",  
      "sizes": "512x512",  
      "type": "image/png"  
    }  
  \]

}

## **ENVIRONMENT VARIABLES**

Copy the existing .env values to `.env.local`:

env  
\# Database (PostgreSQL on VPS) \- USE EXISTING VALUES  
DATABASE\_URL="\[COPY EXISTING DATABASE URL FROM CURRENT ENV\]"

\# NextAuth \- USE EXISTING OR GENERATE NEW  
NEXTAUTH\_URL="https://agistaffers.com"  
NEXTAUTH\_SECRET="\[COPY EXISTING OR GENERATE NEW\]"

\# PWA  
NEXT\_PUBLIC\_APP\_URL="https://agistaffers.com"

\# Copy ALL other existing ENV variables from the current vanilla JS site

## **CONVERSION STEPS FOR AGISTAFFERS.COM**

### **Phase 1: Setup**

1. Create new Next.js project in `agistaffers` directory  
2. Install ALL dependencies listed above  
3. Copy all ENV variables from existing vanilla JS site  
4. Configure next-pwa for PWA support  
5. Set up Prisma with existing PostgreSQL database

### **Phase 2: Migration**

1. Map all existing vanilla JS pages to Next.js App Router pages  
2. Convert all vanilla JS components to React components  
3. Replace all DOM manipulation with React state management  
4. Convert all API endpoints to Next.js API routes  
5. Replace all forms with React Hook Form \+ Zod validation  
6. Implement NextAuth.js using existing user database

### **Phase 3: UI Conversion**

1. Initialize shadcn/ui  
2. Replace custom UI components with shadcn/ui equivalents  
3. Convert all existing styles to Tailwind CSS classes  
4. Ensure responsive design matches current site

### **Phase 4: Data Layer**

1. Replace all fetch calls with TanStack Query  
2. Create Prisma schema matching existing database structure  
3. Generate Prisma client  
4. Test all database operations

### **Phase 5: PWA Features**

1. Configure service worker for offline functionality  
2. Set up app manifest with AGI Staffers branding  
3. Test install prompt on mobile and desktop  
4. Ensure offline page functionality

### **Phase 6: Testing & Deployment**

1. Test all existing functionality works in React version  
2. Verify all passwords and authentication work  
3. Test PWA features (offline, install)  
4. Deploy to VPS server  
5. Configure Nginx for agistaffers.com domain

## **EXISTING FEATURES TO PRESERVE**

Make sure to maintain ALL existing functionality including:

* User authentication system  
* Hosting package selection  
* Payment processing  
* Customer dashboard  
* Admin panel  
* Support ticket system  
* Domain management  
* Any other existing features

## **VPS DEPLOYMENT**

The converted React site will replace the current vanilla JS site:

* Main domain: agistaffers.com  
* Keep existing database (just connect via Prisma)  
* Use PM2 for process management  
* Configure Nginx reverse proxy

## **IMPORTANT NOTES**

* **PRESERVE** all existing functionality \- this is a re-code, not a redesign  
* **COPY** existing ENV values \- don't create new ones unless necessary  
* **MAINTAIN** current database structure \- use Prisma to connect to existing PostgreSQL  
* **MATCH** current site behavior exactly in React  
* **TEST** thoroughly before replacing the live vanilla JS site  
* SteppersLife.com conversion starts ONLY after agistaffers.com is fully converted and live

Remember: This is a 1:1 conversion from vanilla JavaScript to React. The site should look and work EXACTLY the same, just built with React instead of vanilla JS. If it's not in the tech stack list above, DON'T USE IT.

## **FILE MIGRATION PROTOCOL**

As you convert each vanilla JavaScript file to React:

1. **CREATE** a folder called `_COMPLETED_VANILLA_JS` in the project root  
2. **MOVE** each converted vanilla JS file into this folder immediately after its React equivalent is working

**ORGANIZE** the folder with the same structure as the original:  
 \_COMPLETED\_VANILLA\_JS/  
├── js/  
├── css/  
├── html/

3. └── api/

4. **DOCUMENT** each moved file with a comment at the top showing:  
   * Date moved  
   * New React location  
   * Example: `// Moved: 2025-08-08 | React equivalent: app/page.tsx`

This `_COMPLETED_VANILLA_JS` folder serves as a reference archive. Once the entire site is converted and tested, this folder will be deleted, leaving only the React codebase. The vanilla JavaScript will no longer exist on the hard drive except temporarily in this completion folder during the conversion process.

**DO NOT** delete vanilla JS files until their React replacements are fully tested and working. The completion folder is your safety net during conversion.

Retry  
[Claude can make mistakes.](https://support.anthropic.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on)  
[Please double-check responses.](https://support.anthropic.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on)  
