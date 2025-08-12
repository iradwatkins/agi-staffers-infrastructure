'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { SectionProps, Product, Collection } from '@/shopify-themes/engine/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Grid3X3, 
  List, 
  ShoppingCart, 
  Eye, 
  Heart,
  Star,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import { useCurrencyConversion } from '@/components/ui/currency-converter'

export default function CollectionsSection({ section, settings, data }: SectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [filterBy, setFilterBy] = useState('all')
  const { formatPrice } = useCurrencyConversion()

  const {
    collection_id = 'all',
    products_per_page = 12,
    show_vendor = true,
    show_product_type = true,
    show_price = true,
    show_compare_price = true,
    enable_quick_add = true,
    enable_wishlist = true,
    enable_product_reviews = true,
    enable_filtering = true,
    enable_sorting = true,
    enable_view_toggle = true,
    show_pagination = true,
    section_heading = 'Shop All Products',
    section_description = 'Discover our complete collection of premium products'
  } = section.settings

  // Mock data - would be replaced with real data
  const collection: Collection = {
    id: collection_id,
    title: section_heading,
    description: section_description,
    handle: 'all-products',
    image: '',
    products_count: 48,
    sort_order: 'best-selling'
  }

  const products: Product[] = data?.products || [
    {
      id: '1',
      title: 'Premium Cotton T-Shirt',
      handle: 'premium-cotton-tshirt',
      vendor: 'AGI Apparel',
      product_type: 'T-Shirts',
      price: 2999,
      compare_at_price: 3999,
      available: true,
      images: ['/api/placeholder/300/400'],
      variants: [
        {
          id: '1-1',
          title: 'Small / Black',
          price: 2999,
          compare_at_price: 3999,
          available: true,
          inventory_quantity: 10,
          option1: 'Small',
          option2: 'Black'
        }
      ],
      options: [
        { name: 'Size', values: ['Small', 'Medium', 'Large'] },
        { name: 'Color', values: ['Black', 'White', 'Gray'] }
      ],
      rating: 4.8,
      reviews_count: 124
    },
    {
      id: '2',
      title: 'Wireless Bluetooth Headphones',
      handle: 'wireless-bluetooth-headphones',
      vendor: 'TechGear',
      product_type: 'Electronics',
      price: 15999,
      compare_at_price: 19999,
      available: true,
      images: ['/api/placeholder/300/400'],
      variants: [
        {
          id: '2-1',
          title: 'Black',
          price: 15999,
          compare_at_price: 19999,
          available: true,
          inventory_quantity: 5,
          option1: 'Black'
        }
      ],
      options: [
        { name: 'Color', values: ['Black', 'White', 'Silver'] }
      ],
      rating: 4.6,
      reviews_count: 89
    },
    {
      id: '3',
      title: 'Organic Cotton Hoodie',
      handle: 'organic-cotton-hoodie',
      vendor: 'EcoWear',
      product_type: 'Hoodies',
      price: 7999,
      compare_at_price: null,
      available: true,
      images: ['/api/placeholder/300/400'],
      variants: [
        {
          id: '3-1',
          title: 'Medium / Green',
          price: 7999,
          available: true,
          inventory_quantity: 8,
          option1: 'Medium',
          option2: 'Green'
        }
      ],
      options: [
        { name: 'Size', values: ['Small', 'Medium', 'Large', 'XL'] },
        { name: 'Color', values: ['Green', 'Blue', 'Gray'] }
      ],
      rating: 4.9,
      reviews_count: 156
    }
  ]

  const handleQuickAdd = (product: Product) => {
    // Quick add to cart logic
    console.log('Quick add:', product.title)
  }

  const handleWishlist = (product: Product) => {
    // Add to wishlist logic
    console.log('Add to wishlist:', product.title)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
    const discountPercentage = hasDiscount 
      ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
      : 0

    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {!product.available && (
              <Badge variant="secondary" className="text-xs">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {enable_wishlist && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={() => handleWishlist(product)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8"
              asChild
            >
              <Link href={`/products/${product.handle}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Quick Add */}
          {enable_quick_add && product.available && (
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                className="w-full"
                onClick={() => handleQuickAdd(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Vendor */}
          {show_vendor && (
            <p className="text-xs text-muted-foreground mb-1">{product.vendor}</p>
          )}

          {/* Title */}
          <Link href={`/products/${product.handle}`}>
            <h3 className="font-medium mb-2 hover:text-primary transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Product Type */}
          {show_product_type && (
            <p className="text-xs text-muted-foreground mb-2">{product.product_type}</p>
          )}

          {/* Reviews */}
          {enable_product_reviews && product.rating && (
            <div className="flex items-center gap-2 mb-2">
              {renderStars(product.rating)}
              <span className="text-xs text-muted-foreground">
                ({product.reviews_count})
              </span>
            </div>
          )}

          {/* Price */}
          {show_price && (
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {formatPrice(product.price)}
              </span>
              {show_compare_price && product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const ProductListItem = ({ product }: { product: Product }) => {
    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price

    return (
      <Card className="group">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover rounded"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  {show_vendor && (
                    <p className="text-xs text-muted-foreground">{product.vendor}</p>
                  )}
                  <Link href={`/products/${product.handle}`}>
                    <h3 className="font-medium hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  {show_product_type && (
                    <p className="text-sm text-muted-foreground">{product.product_type}</p>
                  )}
                </div>

                {/* Price */}
                {show_price && (
                  <div className="text-right">
                    <div className="font-semibold">
                      {formatPrice(product.price)}
                    </div>
                    {show_compare_price && product.compare_at_price && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Reviews */}
              {enable_product_reviews && product.rating && (
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(product.rating)}
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews_count})
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                {enable_quick_add && product.available && (
                  <Button size="sm" onClick={() => handleQuickAdd(product)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
                {enable_wishlist && (
                  <Button size="sm" variant="outline" onClick={() => handleWishlist(product)}>
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/products/${product.handle}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">{collection.title}</h1>
        {collection.description && (
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {collection.description}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {/* Filter */}
          {enable_filtering && (
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Sort */}
          {enable_sorting && (
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="best-selling">Best Selling</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="date-new-old">Date: New to Old</SelectItem>
                <SelectItem value="date-old-new">Date: Old to New</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {products.length} of {collection.products_count} products
          </span>

          {/* View Toggle */}
          {enable_view_toggle && (
            <div className="flex border rounded-md">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {show_pagination && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

// Section Schema
export const schema = {
  name: 'Collections',
  settings: [
    {
      type: 'collection',
      id: 'collection_id',
      label: 'Collection',
      default: 'all'
    },
    {
      type: 'text',
      id: 'section_heading',
      label: 'Section heading',
      default: 'Shop All Products'
    },
    {
      type: 'textarea',
      id: 'section_description',
      label: 'Section description',
      default: 'Discover our complete collection of premium products'
    },
    {
      type: 'range',
      id: 'products_per_page',
      label: 'Products per page',
      min: 4,
      max: 50,
      step: 2,
      default: 12
    },
    {
      type: 'header',
      content: 'Product Information'
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
      id: 'show_price',
      label: 'Show price',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_compare_price',
      label: 'Show compare at price',
      default: true
    },
    {
      type: 'header',
      content: 'Features'
    },
    {
      type: 'checkbox',
      id: 'enable_quick_add',
      label: 'Enable quick add to cart',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_wishlist',
      label: 'Enable wishlist',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_product_reviews',
      label: 'Enable product reviews',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_filtering',
      label: 'Enable product filtering',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_sorting',
      label: 'Enable product sorting',
      default: true
    },
    {
      type: 'checkbox',
      id: 'enable_view_toggle',
      label: 'Enable grid/list view toggle',
      default: true
    },
    {
      type: 'checkbox',
      id: 'show_pagination',
      label: 'Show pagination',
      default: true
    }
  ]
}