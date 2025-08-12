'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DollarSign, ArrowLeftRight, TrendingUp, TrendingDown } from 'lucide-react'

interface CurrencyConverterProps {
  amount: number
  fromCurrency: 'DOP' | 'USD'
  className?: string
  showRate?: boolean
  compact?: boolean
}

export function CurrencyConverter({ 
  amount, 
  fromCurrency, 
  className = '',
  showRate = true,
  compact = false
}: CurrencyConverterProps) {
  const [showConverted, setShowConverted] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(60) // Default DOP to USD rate
  const [rateDirection, setRateDirection] = useState<'up' | 'down' | 'stable'>('stable')

  // Simulate fetching exchange rate (in production, call an API)
  useEffect(() => {
    // This would be an API call in production
    const fetchExchangeRate = async () => {
      // Simulated rate with slight variations
      const baseRate = 60
      const variation = (Math.random() - 0.5) * 2 // +/- 1 peso variation
      const newRate = baseRate + variation
      
      if (newRate > exchangeRate) setRateDirection('up')
      else if (newRate < exchangeRate) setRateDirection('down')
      else setRateDirection('stable')
      
      setExchangeRate(newRate)
    }

    fetchExchangeRate()
    // Update rate every 30 minutes
    const interval = setInterval(fetchExchangeRate, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const convertAmount = (amt: number, from: 'DOP' | 'USD'): number => {
    if (from === 'DOP') {
      return amt / exchangeRate
    } else {
      return amt * exchangeRate
    }
  }

  const formatCurrency = (amt: number, currency: 'DOP' | 'USD'): string => {
    return new Intl.NumberFormat(currency === 'DOP' ? 'es-DO' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'DOP' ? 0 : 2,
      maximumFractionDigits: currency === 'DOP' ? 0 : 2
    }).format(amt)
  }

  const displayAmount = showConverted
    ? formatCurrency(convertAmount(amount, fromCurrency), fromCurrency === 'DOP' ? 'USD' : 'DOP')
    : formatCurrency(amount, fromCurrency)

  const displayCurrency = showConverted
    ? (fromCurrency === 'DOP' ? 'USD' : 'DOP')
    : fromCurrency

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="font-semibold text-lg">
          {displayAmount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConverted(!showConverted)}
          className="h-6 px-2"
        >
          <ArrowLeftRight className="h-3 w-3" />
        </Button>
        {showConverted && (
          <Badge variant="secondary" className="text-xs">
            ≈ {formatCurrency(amount, fromCurrency)}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {showConverted ? 'Equivalente en' : 'Precio en'} {displayCurrency}
            </p>
            <p className="text-2xl font-bold">
              {displayAmount}
            </p>
            {showConverted && (
              <p className="text-xs text-muted-foreground">
                Original: {formatCurrency(amount, fromCurrency)}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowLeftRight className="h-4 w-4 mr-2" />
                  {showConverted ? 'Ver Original' : 'Convertir'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowConverted(false)}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mostrar en {fromCurrency}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowConverted(true)}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Mostrar en {fromCurrency === 'DOP' ? 'USD' : 'DOP'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {showRate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>1 USD = {exchangeRate.toFixed(2)} DOP</span>
                {rateDirection === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
                {rateDirection === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Inline currency toggle for pricing displays
export function CurrencyToggle({ 
  className = '' 
}: { 
  className?: string 
}) {
  const [currency, setCurrency] = useState<'DOP' | 'USD'>('DOP')

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge 
        variant={currency === 'DOP' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => setCurrency('DOP')}
      >
        RD$
      </Badge>
      <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
      <Badge 
        variant={currency === 'USD' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => setCurrency('USD')}
      >
        US$
      </Badge>
    </div>
  )
}

// Hook for currency conversion
export function useCurrencyConversion() {
  const [exchangeRate] = useState(60) // In production, fetch from API

  const convert = (amount: number, from: 'DOP' | 'USD', to: 'DOP' | 'USD'): number => {
    if (from === to) return amount
    if (from === 'DOP' && to === 'USD') return amount / exchangeRate
    if (from === 'USD' && to === 'DOP') return amount * exchangeRate
    return amount
  }

  const format = (amount: number, currency: 'DOP' | 'USD'): string => {
    return new Intl.NumberFormat(currency === 'DOP' ? 'es-DO' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'DOP' ? 0 : 2,
      maximumFractionDigits: currency === 'DOP' ? 0 : 2
    }).format(amount)
  }

  return { convert, format, exchangeRate }
}