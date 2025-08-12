import { PaymentProvider, PaymentResult, SubscriptionResult, PaymentMethod } from './provider'

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  currency: 'DOP' | 'USD'
  country: 'DO'
  rnc?: string // RNC for business accounts in DR
  instructions?: string
  isActive: boolean
}

export interface BankDepositDetails {
  referenceCode: string
  amount: number
  currency: 'DOP' | 'USD'
  bankAccount: BankAccount
  dueDate: Date
  instructions: string
}

export class BankDepositProvider implements PaymentProvider {
  name = 'Bank Deposit'
  supportedCurrencies = ['DOP', 'USD']
  supportedCountries = ['DO']

  // Dominican Republic bank accounts for AGI Staffers
  private readonly bankAccounts: BankAccount[] = [
    {
      id: 'popular-dop',
      bankName: 'Banco Popular Dominicano',
      accountNumber: '792-45678-9',
      accountHolder: 'AGI Staffers SRL',
      currency: 'DOP',
      country: 'DO',
      rnc: '1-31-12345-6',
      instructions: 'Depositar en cualquier sucursal del Banco Popular',
      isActive: true
    },
    {
      id: 'bhd-dop',
      bankName: 'BHD León',
      accountNumber: '123-4567890-1',
      accountHolder: 'AGI Staffers SRL',
      currency: 'DOP',
      country: 'DO',
      rnc: '1-31-12345-6',
      instructions: 'Depositar en cualquier sucursal de BHD León',
      isActive: true
    },
    {
      id: 'banreservas-dop',
      bankName: 'Banreservas',
      accountNumber: '200-1234567-8',
      accountHolder: 'AGI Staffers SRL',
      currency: 'DOP',
      country: 'DO',
      rnc: '1-31-12345-6',
      instructions: 'Depositar en cualquier sucursal de Banreservas',
      isActive: true
    },
    {
      id: 'popular-usd',
      bankName: 'Banco Popular Dominicano',
      accountNumber: '792-45679-0',
      accountHolder: 'AGI Staffers SRL',
      currency: 'USD',
      country: 'DO',
      rnc: '1-31-12345-6',
      instructions: 'USD account - Deposit at any Banco Popular branch',
      isActive: false // Will be activated when client has USD account
    }
  ]

  async initialize(): Promise<void> {
    // No initialization needed for bank deposits
    return Promise.resolve()
  }

  async createPayment(options: {
    amount: number
    currency: string
    customerId: string
    description?: string
    metadata?: Record<string, string>
  }): Promise<PaymentResult> {
    const { amount, currency, customerId, description, metadata } = options

    // Validate currency
    if (!['DOP', 'USD'].includes(currency)) {
      throw new Error(`Currency ${currency} not supported for bank deposits`)
    }

    // Get active bank account for the currency
    const bankAccount = this.bankAccounts.find(
      acc => acc.currency === currency && acc.isActive
    )

    if (!bankAccount) {
      throw new Error(`No active bank account for ${currency}`)
    }

    // Generate reference code
    const referenceCode = this.generateReferenceCode()

    // Create bank deposit details
    const depositDetails: BankDepositDetails = {
      referenceCode,
      amount,
      currency: currency as 'DOP' | 'USD',
      bankAccount,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      instructions: this.generateInstructions(bankAccount, amount, currency, referenceCode)
    }

    return {
      success: true,
      transactionId: referenceCode,
      paymentMethod: 'bank_deposit' as PaymentMethod,
      amount,
      currency,
      status: 'pending',
      metadata: {
        ...metadata,
        depositDetails: JSON.stringify(depositDetails),
        customerId,
        description: description || 'Bank deposit payment'
      }
    }
  }

  async createSubscription(options: {
    customerId: string
    planId: string
    currency: string
    metadata?: Record<string, string>
  }): Promise<SubscriptionResult> {
    // Bank deposits don't support automatic subscriptions
    // Customer must make manual deposits each billing period
    const { customerId, planId, currency, metadata } = options

    const referenceCode = this.generateReferenceCode()

    return {
      success: true,
      subscriptionId: `bank_sub_${referenceCode}`,
      customerId,
      planId,
      status: 'requires_payment_method',
      metadata: {
        ...metadata,
        paymentMethod: 'bank_deposit',
        requiresManualPayment: 'true',
        currency
      }
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    // Mark subscription as cancelled in database
    return true
  }

  async verifyWebhook(payload: any, signature: string): Promise<boolean> {
    // Bank deposits don't have webhooks - manual verification required
    return false
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    // Bank deposit refunds must be processed manually
    // This would trigger a manual refund process
    console.log(`Manual refund requested for transaction ${transactionId}`)
    return true
  }

  // Helper methods
  private generateReferenceCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `AGI-${timestamp}-${random}`
  }

  private generateInstructions(
    bankAccount: BankAccount,
    amount: number,
    currency: string,
    referenceCode: string
  ): string {
    const formattedAmount = new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: currency
    }).format(amount)

    if (currency === 'DOP') {
      return `
Por favor realice el depósito con los siguientes datos:

Banco: ${bankAccount.bankName}
Cuenta: ${bankAccount.accountNumber}
Titular: ${bankAccount.accountHolder}
RNC: ${bankAccount.rnc}
Monto: ${formattedAmount}
Referencia: ${referenceCode}

${bankAccount.instructions}

IMPORTANTE: 
- Use la referencia ${referenceCode} en el depósito
- Envíe el comprobante a pagos@agistaffers.com
- Su servicio será activado en 24-48 horas después de confirmar el pago
      `.trim()
    } else {
      return `
Please make the deposit with the following details:

Bank: ${bankAccount.bankName}
Account: ${bankAccount.accountNumber}
Account Holder: ${bankAccount.accountHolder}
RNC: ${bankAccount.rnc}
Amount: ${formattedAmount}
Reference: ${referenceCode}

${bankAccount.instructions}

IMPORTANT:
- Include reference ${referenceCode} with your deposit
- Send receipt to pagos@agistaffers.com
- Service will be activated within 24-48 hours after payment confirmation
      `.trim()
    }
  }

  // Get all active bank accounts
  getActiveBankAccounts(currency?: 'DOP' | 'USD'): BankAccount[] {
    return this.bankAccounts.filter(acc => {
      const currencyMatch = currency ? acc.currency === currency : true
      return acc.isActive && currencyMatch
    })
  }

  // Get deposit details for display
  getDepositDetails(referenceCode: string, amount: number, currency: 'DOP' | 'USD'): BankDepositDetails | null {
    const bankAccount = this.bankAccounts.find(
      acc => acc.currency === currency && acc.isActive
    )

    if (!bankAccount) {
      return null
    }

    return {
      referenceCode,
      amount,
      currency,
      bankAccount,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      instructions: this.generateInstructions(bankAccount, amount, currency, referenceCode)
    }
  }
}