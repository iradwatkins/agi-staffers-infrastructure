#!/bin/bash

# BMAD Complete Platform Setup Script
# Sets up Gmail Magic Link Authentication + Square/Cash App/PayPal Payments

set -e

echo "🎭 BMAD Platform Setup - Authentication & Payments"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if .env.local exists
if [ ! -f agistaffers/.env.local ]; then
    print_warning "Creating .env.local file..."
    cat > agistaffers/.env.local << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/agistaffers"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"

# Gmail SMTP Configuration for Magic Links
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-specific-password"

# Square/Cash App Configuration
SQUARE_ACCESS_TOKEN=""
SQUARE_LOCATION_ID=""
SQUARE_ENVIRONMENT="sandbox"
SQUARE_WEBHOOK_SIGNATURE=""

# PayPal Configuration
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
PAYPAL_ENVIRONMENT="sandbox"
PAYPAL_WEBHOOK_ID=""

# Push Notifications (existing)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""
VAPID_SUBJECT="mailto:admin@agistaffers.com"

# Redis (for rate limiting)
REDIS_URL="redis://localhost:6379"
EOF
    print_status "Created .env.local template"
    echo ""
    print_warning "IMPORTANT: Configure the following in .env.local:"
    echo "  1. GMAIL_USER - Your Gmail address"
    echo "  2. GMAIL_APP_PASSWORD - Generate at https://myaccount.google.com/apppasswords"
    echo "  3. NEXTAUTH_SECRET - Run: openssl rand -base64 32"
    echo "  4. Square/PayPal credentials from their developer portals"
    echo ""
else
    print_status ".env.local already exists"
fi

# Install dependencies
print_status "Installing dependencies..."
cd agistaffers

# Check if pnpm is available
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
else
    PKG_MANAGER="npm"
fi

print_status "Using $PKG_MANAGER to install packages..."

# Install payment SDKs
$PKG_MANAGER add square @paypal/checkout-server-sdk @paypal/react-paypal-js

print_status "Dependencies installed"

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Create database migrations
print_status "Creating database migration for auth tables..."
npx prisma migrate dev --name add-nextauth-tables --create-only

print_status "Setup complete! Next steps:"
echo ""
echo "📋 Configuration Checklist:"
echo "----------------------------"
echo "[ ] 1. Configure Gmail App Password:"
echo "       - Go to https://myaccount.google.com/apppasswords"
echo "       - Generate an app-specific password"
echo "       - Add to GMAIL_USER and GMAIL_APP_PASSWORD in .env.local"
echo ""
echo "[ ] 2. Generate NextAuth Secret:"
echo "       - Run: openssl rand -base64 32"
echo "       - Add to NEXTAUTH_SECRET in .env.local"
echo ""
echo "[ ] 3. Configure Square (for Square + Cash App):"
echo "       - Sign up at https://developer.squareup.com"
echo "       - Get sandbox credentials"
echo "       - Add to SQUARE_* variables in .env.local"
echo ""
echo "[ ] 4. Configure PayPal:"
echo "       - Sign up at https://developer.paypal.com"
echo "       - Create sandbox app"
echo "       - Add to PAYPAL_* variables in .env.local"
echo ""
echo "[ ] 5. Run database migration:"
echo "       cd agistaffers && npx prisma migrate deploy"
echo ""
echo "[ ] 6. Start development server:"
echo "       cd agistaffers && $PKG_MANAGER run dev"
echo ""
echo "🚀 Your authentication and payment system is ready!"
echo ""
echo "Test URLs:"
echo "  - Login: http://localhost:3000/login"
echo "  - Admin: http://localhost:3000/admin"
echo "  - Billing: http://localhost:3000/admin/billing"