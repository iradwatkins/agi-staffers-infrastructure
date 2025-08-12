import { NextRequest, NextResponse } from 'next/server'
import { getPaymentManager } from '@/lib/payment/payment-manager'
import { BankDepositProvider } from '@/lib/payment/bank-deposit-provider'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, currency, plan, customerId } = body

    // Validate input
    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency' },
        { status: 400 }
      )
    }

    // Only accept DOP or USD for Dominican Republic
    if (!['DOP', 'USD'].includes(currency)) {
      return NextResponse.json(
        { error: 'Invalid currency. Only DOP and USD are supported for bank deposits' },
        { status: 400 }
      )
    }

    // Get payment manager
    const paymentManager = await getPaymentManager()
    const bankProvider = paymentManager.getProvider('bank_deposit') as BankDepositProvider

    // Create payment with bank deposit details
    const result = await bankProvider.createPayment({
      amount,
      currency,
      customerId: customerId || session.user.id || 'guest',
      description: plan ? `AGI Staffers - Plan ${plan}` : 'AGI Staffers Payment',
      metadata: {
        plan: plan || 'custom',
        userEmail: session.user.email || '',
        userId: session.user.id || ''
      }
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to create bank deposit payment' },
        { status: 500 }
      )
    }

    // Get deposit details for display
    const depositDetails = bankProvider.getDepositDetails(
      result.transactionId,
      amount,
      currency as 'DOP' | 'USD'
    )

    return NextResponse.json({
      success: true,
      paymentId: result.transactionId,
      depositDetails,
      message: 'Bank deposit instructions generated successfully'
    })
  } catch (error) {
    console.error('Bank deposit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const currency = searchParams.get('currency') as 'DOP' | 'USD' | null

    // Get payment manager
    const paymentManager = await getPaymentManager()
    const bankProvider = paymentManager.getProvider('bank_deposit') as BankDepositProvider

    // Get active bank accounts
    const accounts = bankProvider.getActiveBankAccounts(currency || undefined)

    return NextResponse.json({
      success: true,
      accounts,
      supportedCurrencies: ['DOP', 'USD'],
      message: 'Bank accounts retrieved successfully'
    })
  } catch (error) {
    console.error('Bank deposit GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}