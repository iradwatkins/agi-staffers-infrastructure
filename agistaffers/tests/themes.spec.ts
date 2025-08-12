import { test, expect } from '@playwright/test'

test.describe('Multi-Theme System Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to theme preview page
    await page.goto('http://localhost:3000/template-preview')
  })

  test.describe('Dawn E-commerce Theme', () => {
    test('should render header with navigation', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      await page.selectOption('[data-testid="section-selector"]', 'header')
      
      // Check header elements
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('[data-testid="navigation"]')).toBeVisible()
      await expect(page.locator('[data-testid="cart-icon"]')).toBeVisible()
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
    })

    test('should render hero section with CTAs', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      await page.selectOption('[data-testid="section-selector"]', 'hero')
      
      await expect(page.locator('h1')).toContainText('Shop the Latest Collection')
      await expect(page.locator('[data-testid="primary-cta"]')).toBeVisible()
      await expect(page.locator('[data-testid="secondary-cta"]')).toBeVisible()
    })

    test('should render product details with variants', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      await page.selectOption('[data-testid="section-selector"]', 'product-details')
      
      await expect(page.locator('[data-testid="product-title"]')).toBeVisible()
      await expect(page.locator('[data-testid="variant-selector"]')).toBeVisible()
      await expect(page.locator('[data-testid="add-to-cart"]')).toBeVisible()
      await expect(page.locator('[data-testid="quantity-selector"]')).toBeVisible()
    })

    test('should render collections grid', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      await page.selectOption('[data-testid="section-selector"]', 'collections')
      
      await expect(page.locator('[data-testid="collection-grid"]')).toBeVisible()
      await expect(page.locator('[data-testid="collection-card"]')).toHaveCount(4)
    })

    test('should render shopping cart', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      await page.selectOption('[data-testid="section-selector"]', 'cart')
      
      await expect(page.locator('[data-testid="cart-items"]')).toBeVisible()
      await expect(page.locator('[data-testid="cart-total"]')).toBeVisible()
      await expect(page.locator('[data-testid="checkout-button"]')).toBeVisible()
    })
  })

  test.describe('Service Business Theme', () => {
    test('should render service hero with booking CTA', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'service-business')
      await page.selectOption('[data-testid="section-selector"]', 'service-hero')
      
      await expect(page.locator('h1')).toContainText('Professional Services')
      await expect(page.locator('[data-testid="book-consultation"]')).toBeVisible()
      await expect(page.locator('[data-testid="stats-grid"]')).toBeVisible()
    })

    test('should render services showcase', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'service-business')
      await page.selectOption('[data-testid="section-selector"]', 'services-showcase')
      
      await expect(page.locator('[data-testid="service-card"]')).toHaveCount(6)
      await expect(page.locator('[data-testid="pricing-display"]')).toBeVisible()
    })

    test('should render team profiles', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'service-business')
      await page.selectOption('[data-testid="section-selector"]', 'team-profiles')
      
      await expect(page.locator('[data-testid="team-member"]')).toHaveCount(4)
      await expect(page.locator('[data-testid="team-bio"]')).toBeVisible()
    })

    test('should render contact form', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'service-business')
      await page.selectOption('[data-testid="section-selector"]', 'contact-form')
      
      await expect(page.locator('[data-testid="contact-form"]')).toBeVisible()
      await expect(page.locator('input[name="name"]')).toBeVisible()
      await expect(page.locator('input[name="email"]')).toBeVisible()
      await expect(page.locator('textarea[name="message"]')).toBeVisible()
    })
  })

  test.describe('Landing Page Theme', () => {
    test('should render conversion hero with urgency', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'landing-page')
      await page.selectOption('[data-testid="section-selector"]', 'conversion-hero')
      
      await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible()
      await expect(page.locator('[data-testid="urgency-message"]')).toBeVisible()
      await expect(page.locator('[data-testid="cta-button"]')).toBeVisible()
    })

    test('should render benefits features', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'landing-page')
      await page.selectOption('[data-testid="section-selector"]', 'benefits-features')
      
      await expect(page.locator('[data-testid="feature-grid"]')).toBeVisible()
      await expect(page.locator('[data-testid="feature-card"]')).toHaveCount(6)
    })

    test('should render social proof', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'landing-page')
      await page.selectOption('[data-testid="section-selector"]', 'social-proof')
      
      await expect(page.locator('[data-testid="testimonial"]')).toHaveCount(3)
      await expect(page.locator('[data-testid="trust-badges"]')).toBeVisible()
      await expect(page.locator('[data-testid="success-stats"]')).toBeVisible()
    })
  })

  test.describe('Blog Theme', () => {
    test('should render blog hero with search', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'blog')
      await page.selectOption('[data-testid="section-selector"]', 'blog-hero')
      
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible()
      await expect(page.locator('[data-testid="category-tags"]')).toBeVisible()
      await expect(page.locator('[data-testid="featured-post"]')).toBeVisible()
    })

    test('should render article listing with filters', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'blog')
      await page.selectOption('[data-testid="section-selector"]', 'article-listing')
      
      await expect(page.locator('[data-testid="view-toggle"]')).toBeVisible()
      await expect(page.locator('[data-testid="filter-select"]')).toBeVisible()
      await expect(page.locator('[data-testid="article-card"]')).toHaveCount(6)
    })

    test('should render article content with sharing', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'blog')
      await page.selectOption('[data-testid="section-selector"]', 'article-content')
      
      await expect(page.locator('[data-testid="article-content"]')).toBeVisible()
      await expect(page.locator('[data-testid="social-sharing"]')).toBeVisible()
      await expect(page.locator('[data-testid="author-bio"]')).toBeVisible()
      await expect(page.locator('[data-testid="related-articles"]')).toBeVisible()
    })
  })

  test.describe('Corporate Theme', () => {
    test('should render corporate hero with stats', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'corporate')
      await page.selectOption('[data-testid="section-selector"]', 'corporate-hero')
      
      await expect(page.locator('[data-testid="company-stats"]')).toBeVisible()
      await expect(page.locator('[data-testid="certifications"]')).toBeVisible()
      await expect(page.locator('[data-testid="contact-info"]')).toBeVisible()
    })

    test('should render about company with timeline', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'corporate')
      await page.selectOption('[data-testid="section-selector"]', 'about-company')
      
      await expect(page.locator('[data-testid="mission-vision"]')).toBeVisible()
      await expect(page.locator('[data-testid="company-values"]')).toBeVisible()
      await expect(page.locator('[data-testid="company-timeline"]')).toBeVisible()
      await expect(page.locator('[data-testid="leadership-team"]')).toBeVisible()
    })
  })

  test.describe('Security Testing', () => {
    test('should prevent XSS in customizable content', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      
      // Try to inject malicious script in customizable field
      await page.fill('[data-testid="custom-css-input"]', '<script>alert("xss")</script>')
      await page.click('[data-testid="apply-changes"]')
      
      // Verify script tag is sanitized
      const content = await page.content()
      expect(content).not.toContain('<script>alert("xss")</script>')
    })

    test('should sanitize HTML content', async ({ page }) => {
      await page.selectOption('[data-testid="theme-selector"]', 'blog')
      await page.selectOption('[data-testid="section-selector"]', 'article-content')
      
      // Content should be displayed but scripts should be stripped
      const articleContent = page.locator('[data-testid="article-content"]')
      await expect(articleContent).toBeVisible()
      
      // Check that no script tags are present
      const scripts = await page.locator('script[src*="malicious"]').count()
      expect(scripts).toBe(0)
    })
  })

  test.describe('Performance Testing', () => {
    test('should load theme sections quickly', async ({ page }) => {
      const startTime = Date.now()
      
      await page.selectOption('[data-testid="theme-selector"]', 'dawn')
      await page.selectOption('[data-testid="section-selector"]', 'header')
      
      await expect(page.locator('header')).toBeVisible()
      
      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    test('should handle theme switching efficiently', async ({ page }) => {
      // Test switching between all themes
      const themes = ['dawn', 'service-business', 'landing-page', 'blog', 'corporate']
      
      for (const theme of themes) {
        const startTime = Date.now()
        await page.selectOption('[data-testid="theme-selector"]', theme)
        await expect(page.locator('[data-testid="theme-container"]')).toBeVisible()
        
        const switchTime = Date.now() - startTime
        expect(switchTime).toBeLessThan(1000) // Theme switch should be under 1 second
      }
    })
  })
})