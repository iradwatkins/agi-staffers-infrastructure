'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SectionProps, Product, ProductVariant } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Info
} from 'lucide-react'
import { useCurrencyConversion } from '@/components/ui/currency-converter'

export default function ProductDetailsSection({ section, settings, data }: SectionProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const { formatPrice } = useCurrencyConversion()

  const {
    show_vendor = true,
    show_product_type = true,
    show_sku = true,
    show_availability = true,
    show_quantity_selector = true,
    show_dynamic_checkout = true,
    enable_image_zoom = true,
    show_social_sharing = true,
    show_reviews = true,
    show_related_products = true,
    enable_size_guide = true,
    show_shipping_info = true,
    show_product_tabs = true
  } = section.settings

  // Mock product data - would come from props in real implementation
  const product: Product = data?.product || {
    id: '1',
    title: 'Premium Cotton T-Shirt',
    handle: 'premium-cotton-tshirt',
    vendor: 'AGI Apparel',
    product_type: 'T-Shirts',
    description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this shirt offers a perfect blend of softness and durability. Ideal for everyday wear or special occasions.',
    price: 2999,
    compare_at_price: 3999,
    available: true,
    images: [
      '/api/placeholder/600/800',
      '/api/placeholder/600/800',
      '/api/placeholder/600/800',
      '/api/placeholder/600/800'
    ],
    variants: [
      {
        id: '1-1',
        title: 'Small / Black',
        price: 2999,
        compare_at_price: 3999,
        available: true,
        inventory_quantity: 10,
        sku: 'AGI-TS-S-BLK',
        option1: 'Small',
        option2: 'Black'
      },
      {
        id: '1-2',
        title: 'Medium / Black',
        price: 2999,
        compare_at_price: 3999,
        available: true,
        inventory_quantity: 15,
        sku: 'AGI-TS-M-BLK',
        option1: 'Medium',
        option2: 'Black'
      },
      {
        id: '1-3',
        title: 'Large / White',
        price: 2999,
        compare_at_price: 3999,
        available: true,
        inventory_quantity: 8,
        sku: 'AGI-TS-L-WHT',
        option1: 'Large',
        option2: 'White'
      }
    ],
    options: [
      { name: 'Size', values: ['Small', 'Medium', 'Large', 'XL'] },
      { name: 'Color', values: ['Black', 'White', 'Gray', 'Navy'] }
    ],
    rating: 4.8,
    reviews_count: 124,
    tags: ['organic', 'sustainable', 'bestseller']
  }

  React.useEffect(() => {
    if (product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0])
      // Initialize selected options
      const initialOptions: Record<string, string> = {}
      product.options.forEach((option, index) => {
        const variantOption = product.variants[0][`option${index + 1}` as keyof ProductVariant] as string
        if (variantOption) {
          initialOptions[option.name] = variantOption
        }
      })
      setSelectedOptions(initialOptions)
    }
  }, [product, selectedVariant])

  const handleOptionChange = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value }
    setSelectedOptions(newOptions)

    // Find variant that matches all selected options
    const matchingVariant = product.variants.find(variant => {
      return product.options.every((option, index) => {
        const variantOption = variant[`option${index + 1}` as keyof ProductVariant] as string
        return variantOption === newOptions[option.name]
      })
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }

  const handleAddToCart = () => {
    console.log('Add to cart:', selectedVariant, quantity)
  }

  const handleBuyNow = () => {
    console.log('Buy now:', selectedVariant, quantity)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.inventory_quantity || 1)) {
      setQuantity(newQuantity)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {enable_image_zoom && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            )}
            
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                  disabled={selectedImage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                  disabled={selectedImage === product.images.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {hasDiscount && (
                <Badge variant="destructive">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.tags.includes('bestseller') && (
                <Badge variant="secondary">
                  Bestseller
                </Badge>
              )}
              {product.tags.includes('organic') && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Organic
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            {show_vendor && (
              <p className="text-sm text-muted-foreground mb-2">{product.vendor}</p>
            )}
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {show_product_type && (
              <p className="text-muted-foreground">{product.product_type}</p>
            )}
          </div>

          {/* Reviews */}
          {show_reviews && product.rating && (
            <div className="flex items-center gap-3">
              {renderStars(product.rating)}
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews_count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">
              {formatPrice(selectedVariant?.price || product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(selectedVariant?.compare_at_price || product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* SKU and Availability */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {show_sku && selectedVariant?.sku && (
              <span>SKU: {selectedVariant.sku}</span>
            )}
            {show_availability && (
              <span className={selectedVariant?.available ? 'text-green-600' : 'text-red-600'}>
                {selectedVariant?.available ? 'In Stock' : 'Out of Stock'}
                {selectedVariant?.inventory_quantity && selectedVariant.inventory_quantity <= 5 && (
                  <span className="text-orange-600 ml-1">
                    (Only {selectedVariant.inventory_quantity} left)
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            {product.options.map((option) => (
              <div key={option.name}>
                <label className="block text-sm font-medium mb-2">
                  {option.name}: {selectedOptions[option.name]}
                </label>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selectedOptions[option.name] === value
                    const isAvailable = product.variants.some(variant => {
                      const optionIndex = product.options.findIndex(opt => opt.name === option.name)
                      const variantOption = variant[`option${optionIndex + 1}` as keyof ProductVariant]
                      return variantOption === value && variant.available
                    })

                    return (
                      <Button
                        key={value}
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleOptionChange(option.name, value)}
                        disabled={!isAvailable}
                        className={!isAvailable ? 'opacity-50' : ''}
                      >
                        {value}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Size Guide */}
          {enable_size_guide && product.options.some(opt => opt.name.toLowerCase().includes('size')) && (
            <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
              <Info className="h-4 w-4 mr-1" />
              Size Guide
            </Button>
          )}

          {/* Quantity */}
          {show_quantity_selector && (
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (selectedVariant?.inventory_quantity || 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.available}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - {formatPrice((selectedVariant?.price || product.price) * quantity)}
            </Button>

            {show_dynamic_checkout && (
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleBuyNow}
                disabled={!selectedVariant?.available}
              >
                Buy it now
              </Button>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="flex-1">
                <Heart className="h-4 w-4" />
              </Button>
              {show_social_sharing && (
                <Button variant="outline" size="icon" className="flex-1">
                  <Share2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          {show_shipping_info && (
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Secure checkout guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-4 w-4 text-orange-600" />
                <span>30-day easy returns</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Tabs */}
      {show_product_tabs && (
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews_count})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p>{product.description}</p>
                <h4>Features:</h4>
                <ul>
                  <li>100% organic cotton construction</li>
                  <li>Pre-shrunk for consistent fit</li>
                  <li>Reinforced seams for durability</li>
                  <li>Tagless design for comfort</li>
                  <li>Machine washable</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Materials</h4>
                  <p className="text-sm text-muted-foreground mb-4">100% Organic Cotton</p>
                  
                  <h4 className="font-medium mb-2">Care Instructions</h4>
                  <p className="text-sm text-muted-foreground">Machine wash cold, tumble dry low</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Dimensions</h4>
                  <p className="text-sm text-muted-foreground mb-4">See size chart for detailed measurements</p>
                  
                  <h4 className="font-medium mb-2">Origin</h4>
                  <p className="text-sm text-muted-foreground">Made in USA</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {renderStars(product.rating!)}
                    <span className="text-lg font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">
                      Based on {product.reviews_count} reviews
                    </span>
                  </div>
                  <Button>Write a Review</Button>
                </div>
                
                {/* Sample reviews */}
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <Card key={review}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {renderStars(5)}
                              <span className="font-medium">John D.</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Verified Buyer</p>
                          </div>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm">
                          Great quality shirt! The material is soft and comfortable. 
                          Fits exactly as expected and the color is vibrant.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Shipping Information</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Free standard shipping on orders over $50</li>
                    <li>• Express shipping available for $9.99</li>
                    <li>• Orders ship within 1-2 business days</li>
                    <li>• Tracking information provided via email</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Returns & Exchanges</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 30-day return policy</li>
                    <li>• Items must be unworn with tags attached</li>
                    <li>• Free return shipping on exchanges</li>
                    <li>• Refunds processed within 5-7 business days</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

// Section Schema
export const schema = {
  name: 'Product Details',
  settings: [
    {
      type: 'header',
      content: 'Product Information Display'
    },
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show product vendor',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_product_type',
      label: 'Show product type',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_sku',
      label: 'Show SKU',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_availability',
      label: 'Show availability status',
      default: true
    },
    {
      type: 'header',
      content: 'Purchase Options'
    },
    {
      type: 'checkbox',
      id: 'show_quantity_selector',
      label: 'Show quantity selector',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_dynamic_checkout',
      label: 'Show dynamic checkout button',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_size_guide',
      label: 'Enable size guide',
      default: true
    },
    {
      type: 'header',
      content: 'Media & Interaction'
    },
    {
      type: 'checkbox',
      id: 'enable_image_zoom',
      label: 'Enable image zoom',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_social_sharing',
      label: 'Show social sharing',
      default: true
    },
    {
      type: 'header',
      content: 'Additional Content'
    },
    {
      type: 'checkbox',
      id: 'show_reviews',
      label: 'Show product reviews',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_related_products',
      label: 'Show related products',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_shipping_info',
      label: 'Show shipping information',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_product_tabs',
      label: 'Show product information tabs',
      default: true
    }
  ]
}