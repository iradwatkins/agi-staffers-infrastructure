'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SectionProps, Cart, CartItem } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingBag, 
  Truck, 
  Shield, 
  Tag,
  ArrowRight,
  Gift,
  CreditCard,
  Lock
} from 'lucide-react'
import { useCurrencyConversion } from '@/components/ui/currency-converter'

export default function CartSection({ section, settings, data }: SectionProps) {
  const [cart, setCart] = useState<Cart>(data?.cart || {
    id: 'cart-1',
    items: [
      {
        id: '1',
        product_id: '1',
        variant_id: '1-1',
        title: 'Premium Cotton T-Shirt',
        variant_title: 'Small / Black',
        vendor: 'AGI Apparel',
        price: 2999,
        compare_at_price: 3999,
        quantity: 2,
        image: '/api/placeholder/300/400',
        url: '/products/premium-cotton-tshirt',
        sku: 'AGI-TS-S-BLK',
        properties: {}
      },
      {
        id: '2',
        product_id: '2',
        variant_id: '2-1',
        title: 'Wireless Bluetooth Headphones',
        variant_title: 'Black',
        vendor: 'TechGear',
        price: 15999,
        compare_at_price: 19999,
        quantity: 1,
        image: '/api/placeholder/300/400',
        url: '/products/wireless-bluetooth-headphones',
        sku: 'TG-BT-BLK',
        properties: {}
      }
    ],
    total_price: 21997,
    original_total_price: 27997,
    item_count: 3,
    requires_shipping: true,
    currency: 'USD'
  })

  const [promoCode, setPromoCode] = useState('')
  const [isPromoApplied, setIsPromoApplied] = useState(false)
  const { formatPrice } = useCurrencyConversion()

  const {
    show_vendor = true,
    show_sku = true,
    enable_quantity_changes = true,
    show_item_savings = true,
    enable_promo_codes = true,
    show_shipping_calculator = true,
    show_checkout_buttons = true,
    enable_notes = true,
    show_recommendations = true,
    free_shipping_threshold = 5000, // $50.00
    show_trust_badges = true,
    enable_cart_notes = true
  } = section.settings

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }

    setCart(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ),
      item_count: prev.items.reduce((total, item) => 
        item.id === itemId ? total - item.quantity + newQuantity : total + item.quantity, 0
      ),
      total_price: prev.items.reduce((total, item) => 
        item.id === itemId ? total - (item.price * item.quantity) + (item.price * newQuantity) : total + (item.price * item.quantity), 0
      )
    }))
  }

  const removeItem = (itemId: string) => {
    setCart(prev => {
      const itemToRemove = prev.items.find(item => item.id === itemId)
      if (!itemToRemove) return prev

      return {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId),
        item_count: prev.item_count - itemToRemove.quantity,
        total_price: prev.total_price - (itemToRemove.price * itemToRemove.quantity)
      }
    })
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setIsPromoApplied(true)
      // Apply 10% discount logic here
    }
  }

  const totalSavings = cart.original_total_price - cart.total_price
  const shippingProgress = cart.total_price / free_shipping_threshold
  const isEligibleForFreeShipping = cart.total_price >= free_shipping_threshold
  const amountForFreeShipping = Math.max(0, free_shipping_threshold - cart.total_price)

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild>
            <Link href="/collections/all">
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <span className="text-muted-foreground">
              {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Free Shipping Progress */}
          {!isEligibleForFreeShipping && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    Add {formatPrice(amountForFreeShipping)} more for free shipping!
                  </span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, shippingProgress * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {isEligibleForFreeShipping && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">You qualify for free shipping!</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cart Items List */}
          <div className="space-y-4">
            {cart.items.map((item) => {
              const itemSavings = item.compare_at_price 
                ? (item.compare_at_price - item.price) * item.quantity
                : 0

              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={item.url} className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {show_vendor && (
                              <p className="text-xs text-muted-foreground">{item.vendor}</p>
                            )}
                            <Link href={item.url}>
                              <h3 className="font-medium hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                            </Link>
                            {item.variant_title && (
                              <p className="text-sm text-muted-foreground">{item.variant_title}</p>
                            )}
                            {show_sku && item.sku && (
                              <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {formatPrice(item.price)}
                              </span>
                              {item.compare_at_price && show_item_savings && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.compare_at_price)}
                                </span>
                              )}
                            </div>
                            {itemSavings > 0 && show_item_savings && (
                              <p className="text-xs text-green-600">
                                You save {formatPrice(itemSavings)}
                              </p>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          {enable_quantity_changes ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm">Qty: {item.quantity}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Cart Notes */}
          {enable_cart_notes && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Special instructions for your order..."
                  className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cart.total_price)}</span>
              </div>

              {/* Savings */}
              {totalSavings > 0 && show_item_savings && (
                <div className="flex justify-between text-green-600">
                  <span>Total Savings</span>
                  <span>-{formatPrice(totalSavings)}</span>
                </div>
              )}

              {/* Promo Code */}
              {enable_promo_codes && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                  {isPromoApplied && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Tag className="h-3 w-3" />
                      <span>Promo code applied</span>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Shipping */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{isEligibleForFreeShipping ? 'Free' : 'Calculated at checkout'}</span>
                </div>
                {show_shipping_calculator && !isEligibleForFreeShipping && (
                  <p className="text-xs text-muted-foreground">
                    Shipping calculated at checkout
                  </p>
                )}
              </div>

              {/* Tax */}
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cart.total_price)}</span>
              </div>

              {/* Checkout Buttons */}
              {show_checkout_buttons && (
                <div className="space-y-3 pt-4">
                  <Button className="w-full" size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Secure Checkout
                  </Button>
                  
                  <Button variant="secondary" className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Express Checkout
                  </Button>

                  <div className="text-center">
                    <Button variant="ghost" asChild>
                      <Link href="/collections/all">
                        Continue Shopping
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              {show_trust_badges && (
                <div className="pt-4 border-t space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Secure SSL encrypted checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Free shipping on orders over {formatPrice(free_shipping_threshold)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <span>Easy 30-day returns</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommended Products */}
      {show_recommendations && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sample recommended products */}
            {[1, 2, 3, 4].map((product) => (
              <Card key={product} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative overflow-hidden">
                  <img
                    src={`/api/placeholder/300/400`}
                    alt={`Recommended Product ${product}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Quick Add
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">Recommended Product {product}</h3>
                  <p className="text-lg font-semibold">{formatPrice(2999)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Section Schema
export const schema = {
  name: 'Cart',
  settings: [
    {
      type: 'header',
      content: 'Product Display'
    },
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show product vendor',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_sku',
      label: 'Show product SKU',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_item_savings',
      label: 'Show individual item savings',
      default: true
    },
    {
      type: 'header',
      content: 'Cart Features'
    },
    {
      type: 'checkbox',
      id: 'enable_quantity_changes',
      label: 'Enable quantity changes',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_promo_codes',
      label: 'Enable promo codes',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_cart_notes',
      label: 'Enable cart notes',
      default: true
    },
    {
      type: 'header',
      content: 'Checkout & Shipping'
    },
    {
      type: 'checkbox',
      id: 'show_checkout_buttons',
      label: 'Show checkout buttons',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_shipping_calculator',
      label: 'Show shipping calculator',
      default: true
    },
    {
      type: 'number',
      id: 'free_shipping_threshold',
      label: 'Free shipping threshold (cents)',
      default: 5000
    },
    {
      type: 'checkbox',
      id: 'show_trust_badges',
      label: 'Show trust badges',
      default: true
    },
    {
      type: 'header',
      content: 'Recommendations'
    },
    {
      type: 'checkbox',
      id: 'show_recommendations',
      label: 'Show recommended products',
      default: true
    }
  ]
}