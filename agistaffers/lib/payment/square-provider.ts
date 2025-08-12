import { Client, Environment, ApiError } from 'square'
import crypto from 'crypto'
import type {
  PaymentProvider,
  CheckoutParams,
  CheckoutResult,
  PaymentParams,
  PaymentResult,
  WebhookResult,
  SubscriptionParams,
  SubscriptionResult,
  PaymentStatus
} from './provider'

export class SquareProvider implements PaymentProvider {
  name = 'Square'
  id = 'square' as const
  private client: Client
  private locationId: string

  constructor() {
    const accessToken = process.env.SQUARE_ACCESS_TOKEN
    const locationId = process.env.SQUARE_LOCATION_ID

    if (!accessToken || !locationId) {
      throw new Error('Square credentials not configured')
    }

    this.locationId = locationId
    this.client = new Client({
      accessToken,
      environment: process.env.SQUARE_ENVIRONMENT === 'production' 
        ? Environment.Production 
        : Environment.Sandbox,
    })
  }

  async initialize(): Promise<void> {
    try {
      const { result } = await this.client.locationsApi.retrieveLocation(this.locationId)
      console.log(`Square initialized for location: ${result.location?.name}`)
    } catch (error) {
      console.error('Failed to initialize Square:', error)
      throw new Error('Failed to initialize Square provider')
    }
  }

  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    try {
      const { result } = await this.client.checkoutApi.createPaymentLink({
        idempotencyKey: crypto.randomUUID(),
        quickPay: {
          name: params.description || 'AGI Staffers Subscription',
          priceMoney: {
            amount: BigInt(Math.round(params.amount * 100)),
            currency: params.currency.toUpperCase(),
          },
          locationId: this.locationId,
        },
        checkoutOptions: {
          redirectUrl: params.returnUrl,
          askForShippingAddress: false,
          acceptedPaymentMethods: {
            applePay: true,
            googlePay: true,
            cashApp: true,
            afterpayClearpay: false,
          },
        },
        prePopulatedData: {
          buyerEmail: params.customerEmail,
        },
      })

      return {
        checkoutUrl: result.paymentLink?.url,
        checkoutId: result.paymentLink?.id || '',
        status: 'pending',
      }
    } catch (error) {
      console.error('Square checkout error:', error)
      throw new Error('Failed to create Square checkout')
    }
  }

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    try {
      const { result } = await this.client.paymentsApi.createPayment({
        idempotencyKey: crypto.randomUUID(),
        sourceId: params.paymentMethodId || 'EXTERNAL',
        amountMoney: {
          amount: BigInt(Math.round(params.amount * 100)),
          currency: params.currency.toUpperCase(),
        },
        locationId: this.locationId,
        referenceId: params.customerId,
        note: `Payment for customer ${params.customerId}`,
      })

      return {
        paymentId: result.payment?.id || '',
        status: this.mapPaymentStatus(result.payment?.status),
        amount: Number(result.payment?.amountMoney?.amount || 0) / 100,
        currency: result.payment?.amountMoney?.currency || params.currency,
        receiptUrl: result.payment?.receiptUrl,
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          paymentId: '',
          status: 'failed',
          amount: params.amount,
          currency: params.currency,
          error: error.errors?.[0]?.detail || 'Payment failed',
        }
      }
      throw error
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookResult> {
    const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE

    if (!webhookSignatureKey) {
      throw new Error('Square webhook signature key not configured')
    }

    const isValid = this.verifyWebhookSignature(
      JSON.stringify(payload),
      signature,
      webhookSignatureKey
    )

    if (!isValid) {
      throw new Error('Invalid webhook signature')
    }

    const event = payload.type
    const data = payload.data?.object

    return {
      event,
      paymentId: data?.payment?.id,
      customerId: data?.payment?.reference_id,
      status: data?.payment?.status || 'unknown',
      data,
    }
  }

  async createSubscription(params: SubscriptionParams): Promise<SubscriptionResult> {
    try {
      const { result } = await this.client.subscriptionsApi.createSubscription({
        idempotencyKey: crypto.randomUUID(),
        locationId: this.locationId,
        planVariationId: params.priceId,
        customerId: params.customerId,
        startDate: new Date().toISOString().split('T')[0],
      })

      return {
        subscriptionId: result.subscription?.id || '',
        status: this.mapSubscriptionStatus(result.subscription?.status),
        currentPeriodEnd: new Date(result.subscription?.chargedThroughDate || Date.now()),
      }
    } catch (error) {
      console.error('Square subscription error:', error)
      throw new Error('Failed to create Square subscription')
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await this.client.subscriptionsApi.cancelSubscription(subscriptionId)
    } catch (error) {
      console.error('Failed to cancel Square subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const { result } = await this.client.paymentsApi.getPayment(paymentId)
      
      return {
        paymentId: result.payment?.id || paymentId,
        status: this.mapPaymentStatus(result.payment?.status),
        amount: Number(result.payment?.amountMoney?.amount || 0) / 100,
        currency: result.payment?.amountMoney?.currency || 'USD',
        createdAt: new Date(result.payment?.createdAt || Date.now()),
      }
    } catch (error) {
      console.error('Failed to get payment status:', error)
      throw new Error('Failed to retrieve payment status')
    }
  }

  private mapPaymentStatus(status?: string): 'succeeded' | 'pending' | 'failed' {
    switch (status) {
      case 'COMPLETED':
        return 'succeeded'
      case 'PENDING':
      case 'APPROVED':
        return 'pending'
      case 'FAILED':
      case 'CANCELED':
      default:
        return 'failed'
    }
  }

  private mapSubscriptionStatus(status?: string): 'active' | 'trialing' | 'past_due' | 'canceled' {
    switch (status) {
      case 'ACTIVE':
        return 'active'
      case 'PAUSED':
        return 'past_due'
      case 'CANCELED':
        return 'canceled'
      default:
        return 'active'
    }
  }

  private verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    const hash = crypto.createHmac('sha256', secret)
      .update(payload)
      .digest('base64')
    
    return hash === signature
  }
}

export class CashAppProvider extends SquareProvider {
  name = 'Cash App'
  id = 'cashapp' as const

  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    const result = await super.createCheckout({
      ...params,
      metadata: {
        ...params.metadata,
        paymentMethod: 'cashapp',
      },
    })

    return result
  }
}