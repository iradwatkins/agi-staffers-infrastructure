import paypal from '@paypal/checkout-server-sdk'
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

export class PayPalProvider implements PaymentProvider {
  name = 'PayPal'
  id = 'paypal' as const
  private client: paypal.core.PayPalHttpClient

  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured')
    }

    const environment = process.env.PAYPAL_ENVIRONMENT === 'production'
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret)

    this.client = new paypal.core.PayPalHttpClient(environment)
  }

  async initialize(): Promise<void> {
    console.log('PayPal provider initialized')
  }

  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: params.currency.toUpperCase(),
          value: params.amount.toFixed(2),
        },
        description: params.description || 'AGI Staffers Subscription',
        custom_id: params.customerId,
      }],
      application_context: {
        brand_name: 'AGI Staffers',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    })

    try {
      const response = await this.client.execute(request)
      const approveLink = response.result.links?.find(
        (link: any) => link.rel === 'approve'
      )

      return {
        checkoutUrl: approveLink?.href,
        checkoutId: response.result.id,
        status: 'pending',
      }
    } catch (error) {
      console.error('PayPal checkout error:', error)
      throw new Error('Failed to create PayPal checkout')
    }
  }

  async processPayment(params: PaymentParams): Promise<PaymentResult> {
    if (!params.paymentMethodId) {
      throw new Error('PayPal order ID required')
    }

    const request = new paypal.orders.OrdersCaptureRequest(params.paymentMethodId)
    request.requestBody({})

    try {
      const response = await this.client.execute(request)
      const capture = response.result.purchase_units[0].payments.captures[0]

      return {
        paymentId: capture.id,
        status: this.mapPaymentStatus(capture.status),
        amount: parseFloat(capture.amount.value),
        currency: capture.amount.currency_code,
      }
    } catch (error: any) {
      return {
        paymentId: '',
        status: 'failed',
        amount: params.amount,
        currency: params.currency,
        error: error.message || 'Payment failed',
      }
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookResult> {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID

    if (!webhookId) {
      throw new Error('PayPal webhook ID not configured')
    }

    const verification = {
      auth_algo: signature.split(',')[0]?.split('=')[1],
      cert_url: signature.split(',')[1]?.split('=')[1],
      transmission_id: signature.split(',')[2]?.split('=')[1],
      transmission_sig: signature.split(',')[3]?.split('=')[1],
      transmission_time: signature.split(',')[4]?.split('=')[1],
      webhook_id: webhookId,
      webhook_event: payload,
    }

    try {
      const request = new paypal.webhooks.WebhooksVerifySignatureRequest()
      request.requestBody(verification)
      
      const response = await this.client.execute(request)
      
      if (response.result.verification_status !== 'SUCCESS') {
        throw new Error('Invalid webhook signature')
      }

      return {
        event: payload.event_type,
        paymentId: payload.resource?.id,
        customerId: payload.resource?.custom_id,
        status: payload.resource?.status || 'unknown',
        data: payload.resource,
      }
    } catch (error) {
      console.error('PayPal webhook verification error:', error)
      throw new Error('Failed to verify PayPal webhook')
    }
  }

  async createSubscription(params: SubscriptionParams): Promise<SubscriptionResult> {
    const request = new paypal.subscriptions.SubscriptionsCreateRequest()
    request.requestBody({
      plan_id: params.planId,
      subscriber: {
        name: {
          given_name: 'Customer',
          surname: params.customerId,
        },
      },
      application_context: {
        brand_name: 'AGI Staffers',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
      },
    })

    try {
      const response = await this.client.execute(request)
      
      return {
        subscriptionId: response.result.id,
        status: this.mapSubscriptionStatus(response.result.status),
        currentPeriodEnd: new Date(response.result.billing_info?.next_billing_time || Date.now()),
      }
    } catch (error) {
      console.error('PayPal subscription error:', error)
      throw new Error('Failed to create PayPal subscription')
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    const request = new paypal.subscriptions.SubscriptionsCancelRequest(subscriptionId)
    request.requestBody({
      reason: 'Customer requested cancellation',
    })

    try {
      await this.client.execute(request)
    } catch (error) {
      console.error('Failed to cancel PayPal subscription:', error)
      throw new Error('Failed to cancel subscription')
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const request = new paypal.payments.CapturesGetRequest(paymentId)

    try {
      const response = await this.client.execute(request)
      
      return {
        paymentId: response.result.id,
        status: this.mapPaymentStatus(response.result.status),
        amount: parseFloat(response.result.amount.value),
        currency: response.result.amount.currency_code,
        createdAt: new Date(response.result.create_time),
      }
    } catch (error) {
      console.error('Failed to get payment status:', error)
      throw new Error('Failed to retrieve payment status')
    }
  }

  private mapPaymentStatus(status: string): 'succeeded' | 'pending' | 'failed' {
    switch (status) {
      case 'COMPLETED':
      case 'APPROVED':
        return 'succeeded'
      case 'PENDING':
      case 'CREATED':
        return 'pending'
      case 'FAILED':
      case 'DECLINED':
      case 'VOIDED':
      default:
        return 'failed'
    }
  }

  private mapSubscriptionStatus(status: string): 'active' | 'trialing' | 'past_due' | 'canceled' {
    switch (status) {
      case 'ACTIVE':
        return 'active'
      case 'SUSPENDED':
        return 'past_due'
      case 'CANCELLED':
      case 'EXPIRED':
        return 'canceled'
      default:
        return 'active'
    }
  }
}