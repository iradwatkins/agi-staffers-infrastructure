# 📚 AGI STAFFERS - COMPLETE PLATFORM DOCUMENTATION

## 🚀 Platform Overview

AGI Staffers is a complete website building and hosting platform similar to Shopify, designed to serve customers in the United States and Dominican Republic. The platform allows customers to create e-commerce stores with multiple payment options and custom themes.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14.0.4 with React 19.1.0
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Authentication**: NextAuth 5.0 (Google OAuth + Magic Links)
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Square, Cash App, PayPal, Bank Deposits
- **Deployment**: Docker containers on VPS

## 🔐 Authentication System

### Supported Methods
1. **Google OAuth 2.0** - One-click Google sign-in
2. **Magic Links** - Passwordless email authentication

### Configuration

#### Google OAuth Setup
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add to `.env.local`:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret"
```

#### Authorized URLs
- Development: `http://localhost:3002/api/auth/callback/google`
- Production: `https://agistaffers.com/api/auth/callback/google`

### Implementation Files
- `/auth.ts` - NextAuth configuration
- `/app/(auth)/login/page.tsx` - Login UI with both methods
- `/lib/email/magic-link.ts` - Magic link provider
- `/lib/email/templates.tsx` - Email templates

### Usage Example
```typescript
import { signIn } from 'next-auth/react'

// Google sign-in
await signIn('google', { callbackUrl: '/admin' })

// Magic link sign-in
await signIn('gmail-magic-link', { 
  email: 'user@example.com',
  callbackUrl: '/admin' 
})
```

## 💰 Payment Systems

### Overview
AGI Staffers supports different payment methods based on customer location:
- **US Customers**: Square, Cash App, PayPal (USD only)
- **DR Customers**: Bank Deposits, PayPal (DOP only)

### Payment Providers

#### 1. Square Integration
- **File**: `/lib/payment/square-provider.ts`
- **Features**: One-time payments, subscriptions, refunds
- **Configuration**:
```env
SQUARE_ACCESS_TOKEN="your-square-token"
SQUARE_LOCATION_ID="your-location-id"
SQUARE_ENVIRONMENT="sandbox" # or "production"
```

#### 2. PayPal Integration
- **File**: `/lib/payment/paypal-provider.ts`
- **Features**: International payments, 135+ currencies
- **Configuration**:
```env
PAYPAL_CLIENT_ID="your-client-id"
PAYPAL_CLIENT_SECRET="your-secret"
PAYPAL_ENVIRONMENT="sandbox" # or "production"
```

#### 3. Bank Deposits (Dominican Republic)
- **File**: `/lib/payment/bank-deposit-provider.ts`
- **Supported Banks**:
  - Banco Popular Dominicano
  - BHD León
  - Banreservas
- **Features**:
  - Reference code generation
  - Receipt upload
  - Manual verification
  - Bilingual instructions (Spanish/English)

### Payment Manager
```typescript
import { getPaymentManager } from '@/lib/payment/payment-manager'

const manager = await getPaymentManager()

// Create checkout
const result = await manager.createCheckout('square', {
  amount: 49.99,
  currency: 'USD',
  customerId: 'cust_123'
})

// For DR bank deposits
const bankResult = await manager.createPayment('bank_deposit', {
  amount: 2950,
  currency: 'DOP',
  customerId: 'cust_456'
})
```

### API Endpoints
- `POST /api/payment/checkout` - Create payment session
- `POST /api/payment/bank-deposit` - Generate bank deposit instructions
- `GET /api/payment/bank-deposit` - Get active bank accounts

## 💱 Currency System

### Currency Converter Widget
- **File**: `/components/ui/currency-converter.tsx`
- **Features**:
  - Display-only conversion (like language toggle)
  - DOP ↔ USD real-time rates
  - No actual payment conversion

### Usage
```tsx
import { CurrencyConverter } from '@/components/ui/currency-converter'

<CurrencyConverter 
  amount={2950} 
  fromCurrency="DOP"
  showRate={true}
  compact={false}
/>
```

### Currency Hook
```typescript
import { useCurrencyConversion } from '@/components/ui/currency-converter'

const { convert, format, exchangeRate } = useCurrencyConversion()

const usdAmount = convert(2950, 'DOP', 'USD') // Returns ~49
const formatted = format(2950, 'DOP') // Returns "RD$ 2,950"
```

## 🏪 Store Builder System (Shopify Clone)

### Theme Architecture
```
/shopify-themes/
├── dawn/              # Dawn theme clone
├── engine/           # Theme rendering engine
└── themes.json      # Theme registry
```

### Planned Features
1. **Theme Sections** - Drag & drop page builder
2. **Custom Code Injection** - CSS/JS per store
3. **Product Management** - Full e-commerce capabilities
4. **Multi-language** - English/Spanish support
5. **Mobile Responsive** - All themes mobile-first

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- pnpm package manager

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/agistaffers.git

# Install dependencies
cd agistaffers
pnpm install

# Setup database
npx prisma migrate dev

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/agistaffers"

# NextAuth
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-secret"

# Gmail (for magic links)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Square
SQUARE_ACCESS_TOKEN="your-token"
SQUARE_LOCATION_ID="your-location"

# PayPal
PAYPAL_CLIENT_ID="your-client-id"
PAYPAL_CLIENT_SECRET="your-secret"
```

## 📁 Project Structure

```
agistaffers/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── dashboard/         # Admin components
│   ├── payment/           # Payment UI
│   └── ui/                # Shadcn/ui components
├── lib/                   # Utilities
│   ├── auth.ts           # Auth helpers
│   ├── email/            # Email services
│   └── payment/          # Payment providers
├── prisma/               # Database schema
├── public/               # Static assets
└── shopify-themes/       # Store themes (new)
```

## 🔄 API Reference

### Authentication
```typescript
// Sign in
POST /api/auth/signin
Body: { email: string } or OAuth redirect

// Sign out
POST /api/auth/signout

// Get session
GET /api/auth/session
```

### Payments
```typescript
// Create checkout
POST /api/payment/checkout
Body: {
  paymentMethod: 'square' | 'cashapp' | 'paypal' | 'bank_deposit',
  amount: number,
  currency: 'USD' | 'DOP',
  plan?: string
}

// Bank deposit details
POST /api/payment/bank-deposit
Body: {
  amount: number,
  currency: 'DOP' | 'USD',
  customerId?: string
}
```

## 🌍 Market-Specific Features

### United States 🇺🇸
- **Currency**: USD only
- **Payments**: Square, Cash App, PayPal
- **Language**: English
- **Features**: Standard e-commerce

### Dominican Republic 🇩🇴
- **Currency**: DOP (with USD reference)
- **Payments**: Bank deposits, PayPal
- **Language**: Spanish/English
- **Features**: Bank transfer support, RNC for businesses

## 🚀 Deployment

### Production Checklist
- [ ] Configure production OAuth credentials
- [ ] Set up payment provider production keys
- [ ] Configure SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Test all payment flows
- [ ] Verify email delivery

### Docker Deployment
```bash
# Build image
docker build -t agistaffers .

# Run container
docker run -d \
  -p 3002:3002 \
  --env-file .env.production \
  --name agistaffers \
  agistaffers
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Type checking
pnpm type-check
```

### Test Credentials
- **Test Google Account**: Set up test users in Google Console
- **Square Sandbox**: Use sandbox credentials
- **PayPal Sandbox**: Use sandbox account

## 📞 Support

### Common Issues

**Google OAuth Error**
- Verify redirect URIs match exactly
- Check Google+ API is enabled
- Ensure test users are added

**Payment Provider Errors**
- Verify API credentials
- Check webhook URLs
- Ensure proper environment (sandbox/production)

**Database Connection**
- Check DATABASE_URL format
- Verify PostgreSQL is running
- Run migrations: `npx prisma migrate dev`

## 🔒 Security

### Best Practices
1. Never commit `.env.local` to git
2. Use strong NEXTAUTH_SECRET
3. Enable 2FA on Google Cloud Console
4. Rotate payment API keys regularly
5. Use webhook signatures for payment verification
6. Implement rate limiting on API routes

## 📈 Monitoring

### Recommended Tools
- **Uptime**: UptimeRobot or Pingdom
- **Analytics**: Google Analytics or Plausible
- **Error Tracking**: Sentry
- **Performance**: Lighthouse CI
- **Logs**: LogRocket or DataDog

## 🎯 Roadmap

### Completed ✅
- Google OAuth authentication
- Magic link authentication
- Square/Cash App integration
- PayPal integration
- Bank deposit system
- Currency converter
- Basic admin dashboard

### In Progress 🚧
- Shopify-style theme system
- Product management
- Customer stores

### Planned 📋
- Multi-vendor marketplace
- Mobile apps
- AI-powered features
- Advanced analytics

## 📄 License

Proprietary - AGI Staffers © 2024

---

**Last Updated**: August 12, 2025
**Version**: 1.0.0
**Maintained By**: AGI Staffers Development Team