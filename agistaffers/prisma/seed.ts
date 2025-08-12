import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create website templates
  const templates = [
    {
      templateName: 'business-portfolio',
      displayName: 'Business Portfolio',
      description: 'Professional business portfolio with services showcase',
      category: 'business',
      thumbnailUrl: '/templates/business-portfolio.jpg',
      previewUrl: 'https://demo.agistaffers.com/business-portfolio',
      sourcePath: '/templates/business',
      features: ['Responsive Design', 'Contact Form', 'Service Gallery', 'About Section', 'SEO Optimized'],
      requiredEnvVars: [],
      defaultConfig: {
        primaryColor: '#007bff',
        companyName: 'Your Business',
        tagline: 'Professional Services'
      }
    },
    {
      templateName: 'ecommerce-starter',
      displayName: 'E-commerce Starter',
      description: 'Full-featured online store with shopping cart',
      category: 'ecommerce',
      thumbnailUrl: '/templates/ecommerce-starter.jpg',
      previewUrl: 'https://demo.agistaffers.com/ecommerce-starter',
      sourcePath: '/templates/ecommerce',
      features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Payment Integration', 'Inventory Management'],
      requiredEnvVars: ['STRIPE_PUBLIC_KEY', 'STRIPE_SECRET_KEY'],
      defaultConfig: {
        currency: 'USD',
        storeName: 'Your Store',
        enableReviews: true
      }
    },
    {
      templateName: 'restaurant-menu',
      displayName: 'Restaurant Menu',
      description: 'Beautiful restaurant website with menu display',
      category: 'restaurant',
      thumbnailUrl: '/templates/restaurant-menu.jpg',
      previewUrl: 'https://demo.agistaffers.com/restaurant-menu',
      sourcePath: '/templates/restaurant',
      features: ['Menu Display', 'Online Reservations', 'Gallery', 'Location Map', 'Special Offers'],
      requiredEnvVars: [],
      defaultConfig: {
        restaurantName: 'Your Restaurant',
        cuisine: 'International',
        enableReservations: true
      }
    },
    {
      templateName: 'landing-page-pro',
      displayName: 'Landing Page Pro',
      description: 'High-converting landing page for marketing campaigns',
      category: 'landing',
      thumbnailUrl: '/templates/landing-page-pro.jpg',
      previewUrl: 'https://demo.agistaffers.com/landing-page-pro',
      sourcePath: '/templates/landing',
      features: ['Hero Section', 'Lead Capture', 'Testimonials', 'CTA Buttons', 'A/B Testing Ready'],
      requiredEnvVars: [],
      defaultConfig: {
        headline: 'Your Amazing Product',
        ctaText: 'Get Started',
        enableAnalytics: true
      }
    },
    {
      templateName: 'personal-blog',
      displayName: 'Personal Blog',
      description: 'Clean and modern blog for content creators',
      category: 'blog',
      thumbnailUrl: '/templates/personal-blog.jpg',
      previewUrl: 'https://demo.agistaffers.com/personal-blog',
      sourcePath: '/templates/blog',
      features: ['Blog Posts', 'Categories', 'Comments', 'RSS Feed', 'Social Sharing'],
      requiredEnvVars: [],
      defaultConfig: {
        blogTitle: 'My Blog',
        postsPerPage: 10,
        enableComments: true
      }
    },
    {
      templateName: 'agency-showcase',
      displayName: 'Agency Showcase',
      description: 'Creative agency portfolio with project showcase',
      category: 'portfolio',
      thumbnailUrl: '/templates/agency-showcase.jpg',
      previewUrl: 'https://demo.agistaffers.com/agency-showcase',
      sourcePath: '/templates/agency',
      features: ['Portfolio Grid', 'Team Section', 'Client Logos', 'Case Studies', 'Contact Form'],
      requiredEnvVars: [],
      defaultConfig: {
        agencyName: 'Creative Agency',
        primaryColor: '#ff6b6b',
        showTeam: true
      }
    },
    {
      templateName: 'saas-product',
      displayName: 'SaaS Product',
      description: 'Software as a Service product landing page',
      category: 'saas',
      thumbnailUrl: '/templates/saas-product.jpg',
      previewUrl: 'https://demo.agistaffers.com/saas-product',
      sourcePath: '/templates/saas',
      features: ['Pricing Tables', 'Feature List', 'Demo Request', 'Documentation', 'API Reference'],
      requiredEnvVars: ['STRIPE_PUBLIC_KEY'],
      defaultConfig: {
        productName: 'Your SaaS',
        trialDays: 14,
        pricingPlans: ['Starter', 'Pro', 'Enterprise']
      }
    },
    {
      templateName: 'event-management',
      displayName: 'Event Management',
      description: 'Event website with registration and schedule',
      category: 'event',
      thumbnailUrl: '/templates/event-management.jpg',
      previewUrl: 'https://demo.agistaffers.com/event-management',
      sourcePath: '/templates/event',
      features: ['Event Schedule', 'Speaker Profiles', 'Registration', 'Venue Info', 'Countdown Timer'],
      requiredEnvVars: [],
      defaultConfig: {
        eventName: 'Your Event',
        eventDate: '2024-12-31',
        maxAttendees: 500
      }
    },
    {
      templateName: 'real-estate',
      displayName: 'Real Estate',
      description: 'Property listing website for real estate businesses',
      category: 'realestate',
      thumbnailUrl: '/templates/real-estate.jpg',
      previewUrl: 'https://demo.agistaffers.com/real-estate',
      sourcePath: '/templates/realestate',
      features: ['Property Listings', 'Search Filters', 'Virtual Tours', 'Agent Profiles', 'Mortgage Calculator'],
      requiredEnvVars: [],
      defaultConfig: {
        companyName: 'Your Realty',
        defaultCurrency: 'USD',
        enableVirtualTours: true
      }
    },
    {
      templateName: 'nonprofit-foundation',
      displayName: 'Non-Profit Foundation',
      description: 'Charity and non-profit organization website',
      category: 'nonprofit',
      thumbnailUrl: '/templates/nonprofit-foundation.jpg',
      previewUrl: 'https://demo.agistaffers.com/nonprofit-foundation',
      sourcePath: '/templates/nonprofit',
      features: ['Donation System', 'Volunteer Registration', 'Impact Stories', 'Events Calendar', 'Newsletter'],
      requiredEnvVars: ['STRIPE_PUBLIC_KEY'],
      defaultConfig: {
        organizationName: 'Your Foundation',
        causeType: 'General',
        enableDonations: true
      }
    }
  ]

  console.log('📝 Creating website templates...')
  for (const template of templates) {
    await prisma.siteTemplate.upsert({
      where: { templateName: template.templateName },
      update: template,
      create: template
    })
    console.log(`✅ Created template: ${template.displayName}`)
  }

  // Create default admin user
  console.log('👤 Creating default admin user...')
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@agistaffers.com' },
    update: {},
    create: {
      email: 'admin@agistaffers.com',
      name: 'Admin User',
      passwordHash: '$2a$10$K7L1OJ0TfSb6SYfJVu0X3.kP8FyI6MXgPbKtXJ5J9wZ7XHHHqH3Vy', // Default password: admin123
      role: 'super_admin'
    }
  })
  console.log('✅ Admin user created (email: admin@agistaffers.com, password: admin123)')

  // Create system settings
  console.log('⚙️ Creating system settings...')
  const settings = [
    {
      key: 'site_name',
      value: { name: 'AGI Staffers' },
      category: 'general',
      description: 'Main site name'
    },
    {
      key: 'max_sites_per_customer',
      value: { limit: 10 },
      category: 'deployment',
      description: 'Maximum number of sites per customer'
    },
    {
      key: 'backup_retention_days',
      value: { days: 30 },
      category: 'deployment',
      description: 'Number of days to retain backups'
    },
    {
      key: 'monitoring_interval',
      value: { seconds: 60 },
      category: 'monitoring',
      description: 'Monitoring check interval in seconds'
    },
    {
      key: 'email_from',
      value: { email: 'noreply@agistaffers.com', name: 'AGI Staffers' },
      category: 'email',
      description: 'Default from email address'
    }
  ]

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting
    })
    console.log(`✅ Created setting: ${setting.key}`)
  }

  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })