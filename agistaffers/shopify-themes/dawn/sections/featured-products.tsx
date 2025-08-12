'use client'

import React from 'react'
import Link from 'next/link'
import { SectionProps, Product } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Eye } from 'lucide-react'
import { useCurrencyConversion } from '@/components/ui/currency-converter'

export default function FeaturedProductsSection({ section, settings, products = [] }: SectionProps) {
  const { format } = useCurrencyConversion()
  
  const {
    heading = 'Featured Products',
    subheading = '',
    products_to_show = 4,
    columns_desktop = 4,
    columns_mobile = 1,
    show_vendor = false,
    show_rating = true,
    enable_quick_add = true,
    image_ratio = 'square',
    show_secondary_image = true,
    show_badge = true
  } = section.settings

  // Get featured products or use first available products
  const featuredProducts = products.slice(0, products_to_show)

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
  }

  const imageRatios = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-12">
          {heading && (
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{heading}</h2>
          )}
          {subheading && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subheading}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${gridColumns[columns_desktop as keyof typeof gridColumns]}`}>
          {featuredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              settings={{
                show_vendor,
                show_rating,
                enable_quick_add,
                image_ratio,
                show_secondary_image,
                show_badge
              }}
              format={format}
            />
          ))}
        </div>

        {/* View All Button */}
        {products.length > products_to_show && (
          <div className="text-center mt-8">
            <Link href="/collections/all">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// Product Card Component
function ProductCard({ product, settings, format }: any) {
  const [hoveredImage, setHoveredImage] = React.useState(false)
  
  const {
    show_vendor,
    show_rating,
    enable_quick_add,
    image_ratio,
    show_secondary_image,
    show_badge
  } = settings

  const imageRatios = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  }

  // Calculate discount percentage
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <Card className="group overflow-hidden">
      <div className="relative">
        {/* Product Image */}
        <Link href={`/products/${product.handle}`}>
          <div 
            className={`relative overflow-hidden bg-gray-100 ${imageRatios[image_ratio]}`}
            onMouseEnter={() => setHoveredImage(true)}
            onMouseLeave={() => setHoveredImage(false)}
          >
            {product.images && product.images[0] && (
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            )}
            
            {/* Secondary Image on Hover */}
            {show_secondary_image && product.images && product.images[1] && hoveredImage && (
              <img
                src={product.images[1].url}
                alt={product.images[1].altText || product.title}
                className="absolute inset-0 object-cover w-full h-full"
              />
            )}

            {/* Badges */}
            {show_badge && (
              <div className="absolute top-2 left-2 flex flex-col gap-2">
                {discountPercentage > 0 && (
                  <Badge variant="destructive">
                    -{discountPercentage}%
                  </Badge>
                )}
                {product.tags?.includes('new') && (
                  <Badge>New</Badge>
                )}
                {product.tags?.includes('bestseller') && (
                  <Badge variant="secondary">Bestseller</Badge>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8">
                <Eye className="h-4 w-4" />
              </Button>
              {enable_quick_add && (
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <ShoppingCart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Link>
      </div>

      <CardContent className="p-4">
        {/* Vendor */}
        {show_vendor && product.vendor && (
          <p className="text-xs text-muted-foreground mb-1">{product.vendor}</p>
        )}

        {/* Title */}
        <Link href={`/products/${product.handle}`}>
          <h3 className="font-medium mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        {show_rating && (
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-muted-foreground">(24)</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">
            {format(product.price, product.currency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {format(product.compareAtPrice, product.currency)}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        {enable_quick_add && (
          <Button className="w-full mt-3" size="sm">
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Section Schema
export const schema = {
  name: 'Featured Products',
  settings: [
    {
      type: 'text',
      id: 'heading',
      label: 'Heading',
      default: 'Featured Products'
    },
    {
      type: 'textarea',
      id: 'subheading',
      label: 'Subheading',
      default: ''
    },
    {
      type: 'range',
      id: 'products_to_show',
      label: 'Products to show',
      min: 2,
      max: 12,
      step: 1,
      default: 4
    },
    {
      type: 'range',
      id: 'columns_desktop',
      label: 'Columns on desktop',
      min: 2,
      max: 5,
      step: 1,
      default: 4
    },
    {
      type: 'checkbox',
      id: 'show_vendor',
      label: 'Show vendor',
      default: false
    },
    {
      type: 'checkbox',
      id: 'show_rating',
      label: 'Show rating',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_quick_add',
      label: 'Enable quick add to cart',
      default: true
    },
    {
      type: 'select',
      id: 'image_ratio',
      label: 'Image ratio',
      options: [
        { value: 'square', label: 'Square' },
        { value: 'portrait', label: 'Portrait' },
        { value: 'landscape', label: 'Landscape' }
      ],
      default: 'square'
    },
    {
      type: 'checkbox',
      id: 'show_secondary_image',
      label: 'Show second image on hover',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_badge',
      label: 'Show badges',
      default: true
    }
  ]
}