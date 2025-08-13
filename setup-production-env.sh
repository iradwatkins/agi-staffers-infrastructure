#!/bin/bash

# Setup production environment for AGI Staffers
echo "🔧 Setting up production environment..."

cat > /root/agistaffers/.env.production << 'ENVFILE'
# Production Mode
NODE_ENV=production
PORT=3003

# Database (PostgreSQL on VPS)
DATABASE_URL="postgresql://postgres:password@localhost:5432/agistaffers?schema=public"

# NextAuth Configuration
NEXTAUTH_URL=https://agistaffers.com
NEXTAUTH_SECRET="generate-a-secure-32-char-random-string-here-2025"

# Google OAuth (Replace with your actual credentials)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# PWA
NEXT_PUBLIC_APP_URL=https://agistaffers.com

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BEs3xU7S5tmysUPqGvc7Y7ixokn-UHf9IHBaEgZ-e-Y0Oo_E7N1JWQhK1aLCo6lFjkY0SJPw-1R-o6U0ubr4kg8"
NEXT_PUBLIC_PUSH_API_URL="https://agistaffers.com:3011"
PUSH_API_URL="http://localhost:3011"

# Gmail SMTP (for magic links)
GMAIL_USER="your-gmail@gmail.com"
GMAIL_APP_PASSWORD="your-app-specific-password"
ENVFILE

# Copy to .env for build process
cp /root/agistaffers/.env.production /root/agistaffers/.env

echo "✅ Environment files created"
echo ""
echo "⚠️  IMPORTANT: You need to update these values:"
echo "   1. GOOGLE_CLIENT_ID"
echo "   2. GOOGLE_CLIENT_SECRET"
echo "   3. GMAIL_USER"
echo "   4. GMAIL_APP_PASSWORD"
echo "   5. NEXTAUTH_SECRET (generate a random string)"
echo ""
echo "Edit the file: nano /root/agistaffers/.env"