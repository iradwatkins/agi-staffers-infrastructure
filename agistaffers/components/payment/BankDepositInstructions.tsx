'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, CheckCircle, Info, Upload, Building } from 'lucide-react'
import { BankDepositDetails } from '@/lib/payment/bank-deposit-provider'

interface BankDepositInstructionsProps {
  depositDetails: BankDepositDetails
  onUploadReceipt?: (file: File) => void
}

export function BankDepositInstructions({ 
  depositDetails, 
  onUploadReceipt 
}: BankDepositInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      onUploadReceipt?.(file)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(currency === 'DOP' ? 'es-DO' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Payment Amount */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Monto a Pagar / Amount Due</CardTitle>
          <CardDescription>
            Referencia / Reference: <span className="font-mono font-bold">{depositDetails.referenceCode}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">
            {formatCurrency(depositDetails.amount, depositDetails.currency)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Vence / Due: {new Date(depositDetails.dueDate).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* Bank Account Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Información Bancaria / Bank Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="bhd">BHD León</TabsTrigger>
              <TabsTrigger value="banreservas">Banreservas</TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-4">
              <BankAccountCard
                bankName="Banco Popular Dominicano"
                accountNumber="792-45678-9"
                accountHolder="AGI Staffers SRL"
                rnc="1-31-12345-6"
                currency={depositDetails.currency}
                onCopy={copyToClipboard}
                copiedField={copiedField}
              />
            </TabsContent>

            <TabsContent value="bhd" className="space-y-4">
              <BankAccountCard
                bankName="BHD León"
                accountNumber="123-4567890-1"
                accountHolder="AGI Staffers SRL"
                rnc="1-31-12345-6"
                currency={depositDetails.currency}
                onCopy={copyToClipboard}
                copiedField={copiedField}
              />
            </TabsContent>

            <TabsContent value="banreservas" className="space-y-4">
              <BankAccountCard
                bankName="Banreservas"
                accountNumber="200-1234567-8"
                accountHolder="AGI Staffers SRL"
                rnc="1-31-12345-6"
                currency={depositDetails.currency}
                onCopy={copyToClipboard}
                copiedField={copiedField}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="whitespace-pre-line">
          {depositDetails.instructions}
        </AlertDescription>
      </Alert>

      {/* Receipt Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Subir Comprobante / Upload Receipt</CardTitle>
          <CardDescription>
            Suba una foto o escáner del comprobante de depósito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                <span className="text-primary hover:underline">
                  Click para seleccionar archivo
                </span>
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-muted-foreground mt-2">
                PNG, JPG o PDF (máx. 5MB)
              </p>
            </div>

            {receiptFile && (
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{receiptFile.name}</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            )}

            <Button className="w-full" disabled={!receiptFile}>
              Enviar Comprobante / Submit Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface BankAccountCardProps {
  bankName: string
  accountNumber: string
  accountHolder: string
  rnc: string
  currency: string
  onCopy: (text: string, field: string) => void
  copiedField: string | null
}

function BankAccountCard({
  bankName,
  accountNumber,
  accountHolder,
  rnc,
  currency,
  onCopy,
  copiedField
}: BankAccountCardProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Banco / Bank</span>
        <span className="font-medium">{bankName}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Cuenta / Account</span>
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium">{accountNumber}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopy(accountNumber, 'account')}
          >
            {copiedField === 'account' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Titular / Holder</span>
        <div className="flex items-center gap-2">
          <span className="font-medium">{accountHolder}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopy(accountHolder, 'holder')}
          >
            {copiedField === 'holder' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">RNC</span>
        <div className="flex items-center gap-2">
          <span className="font-mono">{rnc}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopy(rnc, 'rnc')}
          >
            {copiedField === 'rnc' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">Moneda / Currency</span>
        <Badge variant="secondary">{currency}</Badge>
      </div>
    </div>
  )
}