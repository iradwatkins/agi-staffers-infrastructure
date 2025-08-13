import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { multiTenantThemeService } from '@/lib/multi-tenant-theme-service'
import { auth } from '@/lib/auth'

// Force dynamic rendering for routes that use auth and request.url
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 })
    }

    const sites = await multiTenantThemeService.getCustomerSites(customerId)
    return NextResponse.json({ sites })

  } catch (error) {
    console.error('Failed to fetch customer sites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customerId, siteName, domain, themeType, customization } = body

    // Validate required fields
    if (!customerId || !siteName || !domain || !themeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate theme type
    const validThemeTypes = ['dawn', 'service-business', 'landing-page', 'blog', 'corporate']
    if (!validThemeTypes.includes(themeType)) {
      return NextResponse.json(
        { error: 'Invalid theme type' },
        { status: 400 }
      )
    }

    // Check if domain is already taken
    const existingSite = await prisma.customerSite.findFirst({
      where: { domain }
    })

    if (existingSite) {
      return NextResponse.json(
        { error: 'Domain already in use' },
        { status: 409 }
      )
    }

    // Create customer site with theme deployment
    const site = await multiTenantThemeService.createCustomerSite({
      customerId,
      siteName,
      domain,
      themeType,
      customization: {
        primaryColor: customization?.primaryColor || '#1f2937',
        secondaryColor: customization?.secondaryColor || '#3b82f6',
        companyName: customization?.companyName || siteName,
        logo: customization?.logo,
        customCSS: customization?.customCSS
      }
    })

    return NextResponse.json({ site }, { status: 201 })

  } catch (error) {
    console.error('Failed to create customer site:', error)
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { siteId, type, data } = body

    if (!siteId || !type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update based on type
    if (type === 'settings') {
      await multiTenantThemeService.updateSiteSettings(siteId, data)
    } else if (type === 'customization') {
      await multiTenantThemeService.updateSiteCustomization(siteId, data)
    } else {
      return NextResponse.json(
        { error: 'Invalid update type' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Failed to update customer site:', error)
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID required' }, { status: 400 })
    }

    await multiTenantThemeService.deleteCustomerSite(siteId)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Failed to delete customer site:', error)
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    )
  }
}