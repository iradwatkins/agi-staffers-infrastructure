import { SquareProvider, CashAppProvider } from './square-provider'
import { PayPalProvider } from './paypal-provider'
import { BankDepositProvider } from './bank-deposit-provider'
import type {
  PaymentProvider,
  CheckoutParams,
  CheckoutResult,
  PaymentParams,
  PaymentResult,
  WebhookResult,
  PaymentStatus
} from './provider'

export type PaymentMethod = 'square' | 'cashapp' | 'paypal' | 'bank_deposit'

export class PaymentManager {
  private providers: Map<PaymentMethod, PaymentProvider>
  private initialized = false

  constructor() {
    this.providers = new Map()
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Initialize Square
      if (process.env.SQUARE_ACCESS_TOKEN) {
        const squareProvider = new SquareProvider()
        await squareProvider.initialize()
        this.providers.set('square', squareProvider)
        console.log('✅ Square provider initialized')
      }

      // Initialize Cash App (uses Square SDK)
      if (process.env.SQUARE_ACCESS_TOKEN) {
        const cashAppProvider = new CashAppProvider()
        await cashAppProvider.initialize()
        this.providers.set('cashapp', cashAppProvider)
        console.log('✅ Cash App provider initialized')
      }

      // Initialize PayPal
      if (process.env.PAYPAL_CLIENT_ID) {
        const paypalProvider = new PayPalProvider()
        await paypalProvider.initialize()
        this.providers.set('paypal', paypalProvider)
        console.log('✅ PayPal provider initialized')
      }

      // Initialize Bank Deposit (always available for DR)
      const bankDepositProvider = new BankDepositProvider()
      await bankDepositProvider.initialize()
      this.providers.set('bank_deposit', bankDepositProvider)
      console.log('✅ Bank Deposit provider initialized')

      this.initialized = true
      console.log(`Payment manager initialized with ${this.providers.size} providers`)
    } catch (error) {
      console.error('Failed to initialize payment manager:', error)
      throw error
    }
  }

  getProvider(method: PaymentMethod): PaymentProvider {
    const provider = this.providers.get(method)
    if (!provider) {
      throw new Error(`Payment provider ${method} not available`)
    }
    return provider
  }

  getAvailableProviders(): PaymentMethod[] {
    return Array.from(this.providers.keys())
  }

  async createCheckout(
    method: PaymentMethod,
    params: CheckoutParams
  ): Promise<CheckoutResult> {
    const provider = this.getProvider(method)
    return provider.createCheckout(params)
  }

  async processPayment(
    method: PaymentMethod,
    params: PaymentParams
  ): Promise<PaymentResult> {
    const provider = this.getProvider(method)
    return provider.processPayment(params)
  }

  async handleWebhook(
    method: PaymentMethod,
    payload: any,
    signature: string
  ): Promise<WebhookResult> {
    const provider = this.getProvider(method)
    return provider.handleWebhook(payload, signature)
  }

  async getPaymentStatus(
    method: PaymentMethod,
    paymentId: string
  ): Promise<PaymentStatus> {
    const provider = this.getProvider(method)
    return provider.getPaymentStatus(paymentId)
  }

  async createSubscription(
    method: PaymentMethod,
    params: {
      customerId: string
      plan: 'starter' | 'professional' | 'enterprise'
    }
  ) {
    const provider = this.getProvider(method)
    
    if (!provider.createSubscription) {
      throw new Error(`Subscriptions not supported for ${method}`)
    }

    // Map plan to provider-specific IDs
    const planMapping: Record<string, { square: string; paypal: string }> = {
      starter: {
        square: process.env.SQUARE_PLAN_STARTER_ID || '',
        paypal: process.env.PAYPAL_PLAN_STARTER_ID || '',
      },
      professional: {
        square: process.env.SQUARE_PLAN_PRO_ID || '',
        paypal: process.env.PAYPAL_PLAN_PRO_ID || '',
      },
      enterprise: {
        square: process.env.SQUARE_PLAN_ENTERPRISE_ID || '',
        paypal: process.env.PAYPAL_PLAN_ENTERPRISE_ID || '',
      },
    }

    const mapping = planMapping[params.plan]
    if (!mapping) {
      throw new Error(`Invalid plan: ${params.plan}`)
    }

    const priceId = method === 'paypal' ? mapping.paypal : mapping.square

    return provider.createSubscription({
      customerId: params.customerId,
      planId: priceId,
      priceId: priceId,
    })
  }

  async cancelSubscription(
    method: PaymentMethod,
    subscriptionId: string
  ): Promise<void> {
    const provider = this.getProvider(method)
    
    if (!provider.cancelSubscription) {
      throw new Error(`Subscription cancellation not supported for ${method}`)
    }

    return provider.cancelSubscription(subscriptionId)
  }

  // Helper method to determine best payment method based on criteria
  recommendPaymentMethod(params: {
    amount: number
    currency: string
    country?: string
    preferredMethod?: PaymentMethod
  }): PaymentMethod {
    const available = this.getAvailableProviders()

    // Use preferred method if available
    if (params.preferredMethod && available.includes(params.preferredMethod)) {
      return params.preferredMethod
    }

    // Bank deposit for Dominican Republic
    if (params.country === 'DO' && params.currency === 'DOP' && available.includes('bank_deposit')) {
      return 'bank_deposit'
    }

    // PayPal for international
    if (params.country && params.country !== 'US' && available.includes('paypal')) {
      return 'paypal'
    }

    // Square for US transactions (lower fees)
    if (available.includes('square')) {
      return 'square'
    }

    // Fallback to first available
    if (available.length > 0) {
      return available[0]
    }

    throw new Error('No payment providers available')
  }
}

// Singleton instance
let paymentManager: PaymentManager | null = null

export async function getPaymentManager(): Promise<PaymentManager> {
  if (!paymentManager) {
    paymentManager = new PaymentManager()
    await paymentManager.initialize()
  }
  return paymentManager
}