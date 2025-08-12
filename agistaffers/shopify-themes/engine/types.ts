// Shopify Theme Engine Types

export interface ThemeSection {
  id: string
  type: string
  settings: Record<string, any>
  blocks?: ThemeBlock[]
  disabled?: boolean
}

export interface ThemeBlock {
  id: string
  type: string
  settings: Record<string, any>
  blocks?: ThemeBlock[] // Nested blocks (up to 8 levels)
}

export interface ThemeTemplate {
  name: string
  sections: string[] // Section IDs in order
  settings?: Record<string, any>
}

export interface ThemeSettings {
  // Typography
  font_heading: string
  font_body: string
  
  // Colors
  colors_solid_button_labels: string
  colors_accent_1: string
  colors_accent_2: string
  colors_text: string
  colors_outline_button_labels: string
  colors_background_1: string
  colors_background_2: string
  
  // Layout
  page_width: number
  spacing_sections: number
  
  // Buttons
  buttons_radius: number
  buttons_border_thickness: number
  buttons_shadow_opacity: number
  
  // Cards
  card_style: 'standard' | 'card' | 'text'
  card_corner_radius: number
  card_shadow_opacity: number
  card_border_thickness: number
  
  // Collection cards
  collection_card_style: 'standard' | 'card' | 'text'
  
  // Blog cards
  blog_card_style: 'standard' | 'card' | 'text'
  
  // Search
  predictive_search_enabled: boolean
  
  // Cart
  cart_type: 'drawer' | 'page' | 'popup'
  
  // Social media
  social_twitter_link?: string
  social_facebook_link?: string
  social_instagram_link?: string
  social_youtube_link?: string
  social_tiktok_link?: string
  
  // Favicon
  favicon?: string
  
  // Checkout
  checkout_logo?: string
  checkout_logo_size?: number
  
  // Custom code injection
  custom_css?: string
  custom_javascript?: string
  custom_head_html?: string
  custom_body_html?: string
}

export interface SectionSchema {
  name: string
  tag?: string
  class?: string
  max_blocks?: number
  settings?: SettingSchema[]
  blocks?: BlockSchema[]
  presets?: SectionPreset[]
}

export interface BlockSchema {
  type: string
  name: string
  limit?: number
  settings?: SettingSchema[]
}

export interface SettingSchema {
  type: 'text' | 'textarea' | 'richtext' | 'select' | 'checkbox' | 'range' | 
        'color' | 'font_picker' | 'collection' | 'product' | 'blog' | 
        'page' | 'link_list' | 'url' | 'video_url' | 'image_picker' | 
        'html' | 'article' | 'radio'
  id: string
  label: string
  default?: any
  info?: string
  placeholder?: string
  options?: Array<{
    value: string
    label: string
  }>
  min?: number
  max?: number
  step?: number
  unit?: string
}

export interface SectionPreset {
  name: string
  settings?: Record<string, any>
  blocks?: Array<{
    type: string
    settings?: Record<string, any>
  }>
}

export interface ThemeManifest {
  name: string
  version: string
  author: string
  documentation_url?: string
  support_url?: string
}

export interface StoreTheme {
  id: string
  storeId: string
  theme: string // dawn, debut, etc.
  settings: ThemeSettings
  customCSS?: string
  customJS?: string
  headScripts?: string
  bodyScripts?: string
  sections: ThemeSection[]
  templates: Record<string, ThemeTemplate>
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  handle: string // URL slug
  price: number
  compareAtPrice?: number
  currency: 'USD' | 'DOP'
  images: ProductImage[]
  variants: ProductVariant[]
  options: ProductOption[]
  tags: string[]
  vendor?: string
  productType?: string
  seo?: {
    title?: string
    description?: string
  }
  status: 'active' | 'draft' | 'archived'
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
  width?: number
  height?: number
  position: number
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  sku?: string
  barcode?: string
  inventoryQuantity: number
  weight?: number
  weightUnit?: 'lb' | 'oz' | 'kg' | 'g'
  options: Record<string, string> // { "Size": "Large", "Color": "Red" }
  imageId?: string
  position: number
}

export interface ProductOption {
  id: string
  name: string // "Size", "Color", etc.
  position: number
  values: string[] // ["Small", "Medium", "Large"]
}

export interface Collection {
  id: string
  title: string
  description?: string
  handle: string
  image?: {
    url: string
    altText?: string
  }
  products: string[] // Product IDs
  sortOrder: 'manual' | 'best-selling' | 'title-asc' | 'title-desc' | 
            'price-asc' | 'price-desc' | 'created-desc' | 'created-asc'
  seo?: {
    title?: string
    description?: string
  }
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Cart {
  id: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: 'USD' | 'DOP'
  discountCodes?: string[]
  note?: string
}

export interface CartItem {
  id: string
  productId: string
  variantId: string
  quantity: number
  price: number
  title: string
  variantTitle?: string
  image?: string
  properties?: Record<string, string>
}

export interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  acceptsMarketing: boolean
  addresses: Address[]
  defaultAddress?: string // Address ID
  orders: string[] // Order IDs
  tags?: string[]
  note?: string
  verifiedEmail: boolean
  taxExempt: boolean
  currency: 'USD' | 'DOP'
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  firstName?: string
  lastName?: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string // State/Province
  country: string
  zip?: string
  phone?: string
  isDefault?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  customerId?: string
  email: string
  phone?: string
  lineItems: OrderLineItem[]
  shippingAddress?: Address
  billingAddress?: Address
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: 'USD' | 'DOP'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded'
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled'
  financialStatus: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 
                   'refunded' | 'partially_refunded' | 'voided'
  discountCodes?: string[]
  note?: string
  tags?: string[]
  cancelReason?: string
  cancelledAt?: Date
  processedAt?: Date
  closedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface OrderLineItem {
  id: string
  productId: string
  variantId: string
  title: string
  variantTitle?: string
  quantity: number
  price: number
  totalDiscount: number
  image?: string
  sku?: string
  vendor?: string
  properties?: Record<string, string>
  fulfillmentStatus?: 'fulfilled' | 'unfulfilled' | 'partially_fulfilled'
}

// Section Component Props
export interface SectionProps {
  section: ThemeSection
  settings: ThemeSettings
  products?: Product[]
  collections?: Collection[]
  cart?: Cart
  customer?: Customer
}