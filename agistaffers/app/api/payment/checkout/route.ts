import { NextRequest, NextResponse } from 'next/server'
import { getPaymentManager } from '@/lib/payment/payment-manager'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { PaymentMethod } from '@/lib/payment/payment-manager'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      paymentMethod,
      plan,
      amount,
      currency = 'USD',
    } = body

    if (!paymentMethod || !plan || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { email: session.user.email }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: session.user.email,
          contactName: session.user.name || 'Customer',
          plan,
          status: 'active',
        }
      })
    }

    // Get payment manager
    const paymentManager = await getPaymentManager()

    // Create checkout session
    const checkout = await paymentManager.createCheckout(
      paymentMethod as PaymentMethod,
      {
        amount,
        currency,
        customerId: customer.id,
        customerEmail: customer.email,
        description: `AGI Staffers ${plan} Plan`,
        plan,
        returnUrl: `${process.env.NEXTAUTH_URL}/admin/billing/success`,
        cancelUrl: `${process.env.NEXTAUTH_URL}/admin/billing`,
        metadata: {
          customerId: customer.id,
          plan,
        }
      }
    )

    // Store checkout ID in database for tracking
    await prisma.invoice.create({
      data: {
        customerId: customer.id,
        invoiceNumber: `INV-${Date.now()}`,
        amount,
        currency,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        billingPeriod: 'monthly',
        items: {
          plan,
          paymentMethod,
          checkoutId: checkout.checkoutId,
        }
      }
    })

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      checkoutId: checkout.checkoutId,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}