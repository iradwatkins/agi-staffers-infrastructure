# 🔐 Google OAuth 2.0 Setup Instructions for AGI Staffers

## 📋 Quick Setup Guide

Follow these steps to get your Google OAuth credentials:

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create or Select a Project
- Click on the project dropdown (top left)
- Click "New Project" or select existing
- Name it: "AGI Staffers"

### 3. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API"
- Click and Enable it

### 4. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields:
     - App name: AGI Staffers
     - User support email: iradwatkins@gmail.com
     - Developer contact: iradwatkins@gmail.com
   - Add scopes: email, profile, openid
   - Add test users: iradwatkins@gmail.com

### 5. Create OAuth Client ID
1. Application type: "Web application"
2. Name: "AGI Staffers Web Client"
3. Authorized JavaScript origins:
   ```
   http://localhost:3002
   https://agistaffers.com
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:3002/api/auth/callback/google
   https://agistaffers.com/api/auth/callback/google
   ```
5. Click "Create"

### 6. Copy Your Credentials
You'll receive:
- **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-1234567890abcdef`

### 7. Update .env.local
Replace the placeholder values in `/agistaffers/.env.local`:
```env
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

## 🧪 Testing

1. Start your development server:
```bash
cd agistaffers
pnpm run dev
```

2. Visit: http://localhost:3002/login

3. Click "Sign in with Google"

4. Complete Google authentication

5. You should be redirected to /admin

## 🚀 Production Setup

Before deploying to production:

1. Add production URLs to OAuth client:
   - JavaScript origins: `https://agistaffers.com`
   - Redirect URIs: `https://agistaffers.com/api/auth/callback/google`

2. Update OAuth consent screen:
   - Move from "Testing" to "Production"
   - Complete verification if required

3. Update production environment variables

## ⚠️ Important Notes

- Keep your Client Secret secure - never commit it to git
- Use environment variables for all credentials
- Test with your own Google account first
- Add other team members as test users during development

## 🔧 Troubleshooting

**Error: "Access blocked"**
- Make sure you've added your email as a test user
- Check that Google+ API is enabled

**Error: "Redirect URI mismatch"**
- Verify the redirect URIs match exactly (including http/https)
- Check for trailing slashes

**Error: "Invalid client"**
- Double-check Client ID and Secret in .env.local
- Restart the Next.js server after updating .env.local

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID added to .env.local
- [ ] Client Secret added to .env.local
- [ ] Test user added (your email)
- [ ] Redirect URIs configured correctly
- [ ] Google sign-in button working on login page

Once complete, users can sign in with Google OR Magic Link!