import { test, expect } from '@playwright/test'

/**
 * Dawn Theme Section Tests
 * Tests all sections of the Dawn theme (header, hero, footer, products, cart, collections)
 */

test.describe('Dawn Theme Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-store-dawn')
    await page.waitForSelector('[data-section-type]')
  })

  test.describe('Header Section', () => {
    test('should render header with navigation', async ({ page }) => {
      const header = page.locator('[data-section-type="header"]')
      await expect(header).toBeVisible()
      
      // Should have logo/brand
      const logo = header.locator('[data-testid="site-logo"], .site-logo, h1')
      await expect(logo).toBeVisible()
      
      // Should have main navigation
      const navigation = header.locator('nav, [role="navigation"]')
      await expect(navigation).toBeVisible()
      
      // Should have navigation items
      const navItems = navigation.locator('a, [role="menuitem"]')
      const navCount = await navItems.count()
      expect(navCount).toBeGreaterThan(0)
      
      // Should have cart icon
      const cartIcon = header.locator('[data-testid="cart-icon"], .cart-icon')
      await expect(cartIcon).toBeVisible()
    })

    test('should handle mobile navigation', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.setViewportSize({ width: 375, height: 667 })
      }
      
      const header = page.locator('[data-section-type="header"]')
      
      // Should show mobile menu toggle
      const menuToggle = header.locator('[data-testid="mobile-menu-toggle"], .mobile-menu-toggle')
      await expect(menuToggle).toBeVisible()
      
      // Click to open mobile menu
      await menuToggle.click()
      
      // Mobile menu should be visible
      const mobileMenu = header.locator('[data-testid="mobile-menu"], .mobile-menu')
      await expect(mobileMenu).toBeVisible()
      
      // Should have navigation items in mobile menu
      const mobileNavItems = mobileMenu.locator('a')
      const mobileNavCount = await mobileNavItems.count()
      expect(mobileNavCount).toBeGreaterThan(0)
    })

    test('should have search functionality', async ({ page }) => {
      const header = page.locator('[data-section-type="header"]')
      
      // Look for search input or search toggle
      const searchElement = header.locator('[data-testid="search"], .search, input[type="search"]')
      
      if (await searchElement.isVisible()) {
        // Test search functionality
        await searchElement.click()
        await searchElement.fill('test product')
        
        // Should show search suggestions or results
        const searchResults = page.locator('[data-testid="search-results"], .search-results')
        await expect(searchResults).toBeVisible({ timeout: 5000 })
      }
    })

    test('should be sticky on scroll', async ({ page }) => {
      const header = page.locator('[data-section-type="header"]')
      
      // Get initial header position
      const initialPosition = await header.boundingBox()
      
      // Scroll down
      await page.evaluate(() => window.scrollTo(0, 500))
      await page.waitForTimeout(500)
      
      // Header should still be visible (sticky)
      await expect(header).toBeVisible()
      
      // Check if header has sticky positioning
      const isSticky = await header.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.position === 'sticky' || style.position === 'fixed'
      })
      
      if (isSticky) {
        const newPosition = await header.boundingBox()
        expect(newPosition?.y).toBeLessThanOrEqual(initialPosition?.y || 0)
      }
    })
  })

  test.describe('Hero Section', () => {
    test('should render hero banner with content', async ({ page }) => {
      const hero = page.locator('[data-section-type="hero"]')
      await expect(hero).toBeVisible()
      
      // Should have background image or color
      const hasBackground = await hero.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.backgroundImage !== 'none' || style.backgroundColor !== 'rgba(0, 0, 0, 0)'
      })
      expect(hasBackground).toBe(true)
      
      // Should have heading
      const heading = hero.locator('h1, h2, [data-testid="hero-heading"]')
      await expect(heading).toBeVisible()
      
      // Should have call-to-action button
      const ctaButton = hero.locator('a, button, [data-testid="hero-cta"]')
      await expect(ctaButton).toBeVisible()
    })

    test('should handle slide transitions', async ({ page }) => {
      const hero = page.locator('[data-section-type="hero"]')
      
      // Check if hero has multiple slides
      const slides = hero.locator('[data-testid="slide"], .slide')
      const slideCount = await slides.count()
      
      if (slideCount > 1) {
        // Should have navigation arrows
        const prevArrow = hero.locator('[data-testid="prev-slide"], .prev-slide')
        const nextArrow = hero.locator('[data-testid="next-slide"], .next-slide')
        
        await expect(prevArrow).toBeVisible()
        await expect(nextArrow).toBeVisible()
        
        // Test slide navigation
        const firstSlide = slides.first()
        const secondSlide = slides.nth(1)
        
        // First slide should be active
        await expect(firstSlide).toHaveClass(/active|opacity-100/)
        
        // Click next arrow
        await nextArrow.click()
        await page.waitForTimeout(1000)
        
        // Second slide should be active
        await expect(secondSlide).toHaveClass(/active|opacity-100/)
        
        // Should have dots navigation
        const dots = hero.locator('[data-testid="slide-dots"] button, .slide-dots button')
        const dotCount = await dots.count()
        expect(dotCount).toBe(slideCount)
      }
    })

    test('should be responsive', async ({ page }) => {
      const hero = page.locator('[data-section-type="hero"]')
      
      // Test desktop view
      await page.setViewportSize({ width: 1200, height: 800 })
      await page.waitForTimeout(500)
      
      const desktopHeight = await hero.boundingBox()
      expect(desktopHeight?.height).toBeGreaterThan(400)
      
      // Test mobile view
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      
      const mobileHeight = await hero.boundingBox()
      expect(mobileHeight?.height).toBeGreaterThan(200)
      
      // Hero should still be visible and functional on mobile
      await expect(hero).toBeVisible()
      
      const heading = hero.locator('h1, h2')
      await expect(heading).toBeVisible()
    })
  })

  test.describe('Featured Products Section', () => {
    test('should display product grid', async ({ page }) => {
      const featuredProducts = page.locator('[data-section-type="featured-products"]')
      await expect(featuredProducts).toBeVisible()
      
      // Should have products
      const products = featuredProducts.locator('[data-testid="product-item"], .product-item')
      const productCount = await products.count()
      expect(productCount).toBeGreaterThan(0)
      
      // Each product should have required elements
      for (let i = 0; i < Math.min(productCount, 3); i++) {
        const product = products.nth(i)
        
        // Product image
        const productImage = product.locator('img')
        await expect(productImage).toBeVisible()
        
        // Product title
        const productTitle = product.locator('h3, h4, [data-testid="product-title"]')
        await expect(productTitle).toBeVisible()
        
        // Product price
        const productPrice = product.locator('[data-testid="product-price"], .price')
        await expect(productPrice).toBeVisible()
      }
    })

    test('should handle product interactions', async ({ page }) => {
      const featuredProducts = page.locator('[data-section-type="featured-products"]')
      const firstProduct = featuredProducts.locator('[data-testid="product-item"], .product-item').first()
      
      // Product should be clickable
      await firstProduct.click()
      
      // Should navigate to product page or show product modal
      await page.waitForTimeout(1000)
      
      const currentUrl = page.url()
      const isProductPage = currentUrl.includes('/products/') || 
                           await page.locator('[data-testid="product-modal"], .product-modal').isVisible()
      
      expect(isProductPage).toBe(true)
    })

    test('should show add to cart functionality', async ({ page }) => {
      const featuredProducts = page.locator('[data-section-type="featured-products"]')
      const products = featuredProducts.locator('[data-testid="product-item"], .product-item')
      
      const firstProduct = products.first()
      
      // Look for add to cart button (might be on hover or always visible)
      const addToCartButton = firstProduct.locator('[data-testid="add-to-cart"], .add-to-cart, button:has-text("Add to Cart")')
      
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click()
        
        // Should show cart notification or update cart count
        const cartNotification = page.locator('[data-testid="cart-notification"], .cart-notification')
        const cartCount = page.locator('[data-testid="cart-count"], .cart-count')
        
        const hasNotification = await cartNotification.isVisible({ timeout: 3000 }).catch(() => false)
        const hasCartCount = await cartCount.isVisible().catch(() => false)
        
        expect(hasNotification || hasCartCount).toBe(true)
      }
    })
  })

  test.describe('Collections Section', () => {
    test('should display collection grid', async ({ page }) => {
      // Navigate to collections page or find collection section
      await page.goto('/test-store-dawn/collections')
      
      const collections = page.locator('[data-section-type="collections"], [data-section-type="collection-list"]')
      await expect(collections).toBeVisible()
      
      // Should have collection items
      const collectionItems = collections.locator('[data-testid="collection-item"], .collection-item')
      const collectionCount = await collectionItems.count()
      expect(collectionCount).toBeGreaterThan(0)
      
      // Each collection should have image and title
      for (let i = 0; i < Math.min(collectionCount, 3); i++) {
        const collection = collectionItems.nth(i)
        
        const collectionImage = collection.locator('img')
        await expect(collectionImage).toBeVisible()
        
        const collectionTitle = collection.locator('h3, h4, [data-testid="collection-title"]')
        await expect(collectionTitle).toBeVisible()
      }
    })

    test('should handle collection filtering and sorting', async ({ page }) => {
      await page.goto('/test-store-dawn/collections/all')
      
      // Look for filter options
      const filters = page.locator('[data-testid="product-filters"], .product-filters')
      
      if (await filters.isVisible()) {
        // Test price filter
        const priceFilter = filters.locator('[data-testid="price-filter"], input[type="range"]')
        
        if (await priceFilter.isVisible()) {
          const initialProducts = await page.locator('[data-testid="product-item"]').count()
          
          await priceFilter.fill('50')
          await page.waitForTimeout(1000)
          
          const filteredProducts = await page.locator('[data-testid="product-item"]').count()
          // Products should be filtered (count might change)
        }
      }
      
      // Test sorting
      const sortSelect = page.locator('[data-testid="sort-select"], select:has(option:text-is("Price"))')
      
      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption('price-asc')
        await page.waitForTimeout(1000)
        
        // Verify products are sorted by price
        const prices = await page.locator('[data-testid="product-price"]').allTextContents()
        const numericPrices = prices.map(price => parseFloat(price.replace(/[^0-9.]/g, '')))
        
        for (let i = 1; i < numericPrices.length; i++) {
          expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1])
        }
      }
    })
  })

  test.describe('Cart Section', () => {
    test('should display cart items', async ({ page }) => {
      // Add item to cart first
      await page.goto('/test-store-dawn')
      const addToCartButton = page.locator('[data-testid="add-to-cart"]').first()
      
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click()
        await page.waitForTimeout(1000)
      }
      
      // Navigate to cart
      await page.goto('/test-store-dawn/cart')
      
      const cart = page.locator('[data-section-type="cart"], [data-section-type="main-cart"]')
      await expect(cart).toBeVisible()
      
      // Should show cart items
      const cartItems = cart.locator('[data-testid="cart-item"], .cart-item')
      
      if (await cartItems.count() > 0) {
        const firstItem = cartItems.first()
        
        // Should have product image
        const itemImage = firstItem.locator('img')
        await expect(itemImage).toBeVisible()
        
        // Should have product title
        const itemTitle = firstItem.locator('[data-testid="item-title"], .item-title')
        await expect(itemTitle).toBeVisible()
        
        // Should have quantity controls
        const quantityInput = firstItem.locator('[data-testid="quantity-input"], input[type="number"]')
        await expect(quantityInput).toBeVisible()
        
        // Should have remove button
        const removeButton = firstItem.locator('[data-testid="remove-item"], .remove-item')
        await expect(removeButton).toBeVisible()
      }
    })

    test('should update quantities', async ({ page }) => {
      // Ensure cart has items
      await page.goto('/test-store-dawn/cart')
      
      const cartItems = page.locator('[data-testid="cart-item"], .cart-item')
      
      if (await cartItems.count() > 0) {
        const firstItem = cartItems.first()
        const quantityInput = firstItem.locator('[data-testid="quantity-input"], input[type="number"]')
        
        if (await quantityInput.isVisible()) {
          const originalQuantity = await quantityInput.inputValue()
          const newQuantity = (parseInt(originalQuantity) + 1).toString()
          
          await quantityInput.fill(newQuantity)
          await quantityInput.blur()
          
          // Should update subtotal
          await page.waitForTimeout(1000)
          
          const updatedQuantity = await quantityInput.inputValue()
          expect(updatedQuantity).toBe(newQuantity)
        }
      }
    })

    test('should show cart totals', async ({ page }) => {
      await page.goto('/test-store-dawn/cart')
      
      const cart = page.locator('[data-section-type="cart"], [data-section-type="main-cart"]')
      
      // Should show subtotal
      const subtotal = cart.locator('[data-testid="cart-subtotal"], .cart-subtotal')
      await expect(subtotal).toBeVisible()
      
      // Should show total
      const total = cart.locator('[data-testid="cart-total"], .cart-total')
      await expect(total).toBeVisible()
      
      // Should have checkout button
      const checkoutButton = cart.locator('[data-testid="checkout-button"], .checkout-button')
      await expect(checkoutButton).toBeVisible()
    })
  })

  test.describe('Footer Section', () => {
    test('should render footer with links', async ({ page }) => {
      const footer = page.locator('[data-section-type="footer"]')
      await expect(footer).toBeVisible()
      
      // Should have footer navigation
      const footerNav = footer.locator('nav, [role="navigation"]')
      await expect(footerNav).toBeVisible()
      
      // Should have social media links
      const socialLinks = footer.locator('[data-testid="social-links"], .social-links a')
      const socialCount = await socialLinks.count()
      expect(socialCount).toBeGreaterThan(0)
      
      // Should have copyright or brand info
      const copyright = footer.locator('[data-testid="copyright"], .copyright')
      await expect(copyright).toBeVisible()
    })

    test('should have newsletter signup', async ({ page }) => {
      const footer = page.locator('[data-section-type="footer"]')
      
      // Look for newsletter signup
      const newsletter = footer.locator('[data-testid="newsletter"], .newsletter')
      
      if (await newsletter.isVisible()) {
        const emailInput = newsletter.locator('input[type="email"]')
        const submitButton = newsletter.locator('button[type="submit"], input[type="submit"]')
        
        await expect(emailInput).toBeVisible()
        await expect(submitButton).toBeVisible()
        
        // Test newsletter signup
        await emailInput.fill('test@example.com')
        await submitButton.click()
        
        // Should show confirmation message
        const confirmation = newsletter.locator('[data-testid="newsletter-success"], .newsletter-success')
        await expect(confirmation).toBeVisible({ timeout: 5000 })
      }
    })

    test('should be responsive', async ({ page }) => {
      const footer = page.locator('[data-section-type="footer"]')
      
      // Test mobile layout
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      
      await expect(footer).toBeVisible()
      
      // Footer content should stack on mobile
      const footerContent = footer.locator('.footer-content, [data-testid="footer-content"]')
      
      if (await footerContent.isVisible()) {
        const boundingBox = await footerContent.boundingBox()
        expect(boundingBox?.width).toBeLessThan(400)
      }
    })
  })
})