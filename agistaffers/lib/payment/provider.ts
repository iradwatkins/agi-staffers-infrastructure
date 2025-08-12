export interface PaymentProvider {
  name: string
  id: 'square' | 'cashapp' | 'paypal'
  initialize(): Promise<void>
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>
  processPayment(params: PaymentParams): Promise<PaymentResult>
  handleWebhook(payload: any, signature: string): Promise<WebhookResult>
  createSubscription?(params: SubscriptionParams): Promise<SubscriptionResult>
  cancelSubscription?(subscriptionId: string): Promise<void>
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>
}

export interface CheckoutParams {
  amount: number
  currency: string
  customerId: string
  customerEmail: string
  description?: string
  metadata?: Record<string, any>
  plan?: 'starter' | 'professional' | 'enterprise'
  returnUrl: string
  cancelUrl: string
}

export interface CheckoutResult {
  checkoutUrl?: string
  checkoutId: string
  paymentIntentId?: string
  status: 'pending' | 'completed' | 'failed'
}

export interface PaymentParams {
  amount: number
  currency: string
  paymentMethodId?: string
  customerId: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  paymentId: string
  status: 'succeeded' | 'pending' | 'failed'
  amount: number
  currency: string
  receiptUrl?: string
  error?: string
}

export interface WebhookResult {
  event: string
  paymentId?: string
  customerId?: string
  status: string
  data: any
}

export interface SubscriptionParams {
  customerId: string
  planId: string
  priceId: string
  trialDays?: number
}

export interface SubscriptionResult {
  subscriptionId: string
  status: 'active' | 'trialing' | 'past_due' | 'canceled'
  currentPeriodEnd: Date
}

export interface PaymentStatus {
  paymentId: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  amount: number
  currency: string
  createdAt: Date
}