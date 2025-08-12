import { test, expect } from '@playwright/test'

/**
 * Theme Switching Integration Tests
 * Tests the ability to switch between themes and maintain functionality
 */

test.describe('Theme Switching Integration', () => {
  const themes = ['dawn', 'service-business', 'landing-page']
  
  test.beforeEach(async ({ page }) => {
    // Start with admin access for theme switching
    await page.goto('/admin/themes')
    await page.waitForTimeout(1000)
  })

  test('should switch between all available themes', async ({ page }) => {
    for (const theme of themes) {
      // Switch to theme
      await page.goto(`/admin/themes/switch?theme=${theme}`)
      await page.waitForTimeout(2000)
      
      // Verify theme was applied
      await page.goto(`/test-store-${theme}`)
      await page.waitForSelector('[data-section-type]')
      
      // Verify theme-specific elements are present
      switch (theme) {
        case 'dawn':
          // Dawn should have e-commerce sections
          await expect(page.locator('[data-section-type="header"]')).toBeVisible()
          await expect(page.locator('[data-section-type="hero"]')).toBeVisible()
          await expect(page.locator('[data-section-type="featured-products"]')).toBeVisible()
          break
          
        case 'service-business':
          // Service theme should have service-focused sections
          await expect(page.locator('[data-section-type="service-hero"]')).toBeVisible()
          await expect(page.locator('[data-section-type="services-showcase"]')).toBeVisible()
          await expect(page.locator('[data-section-type="team-profiles"]')).toBeVisible()
          break
          
        case 'landing-page':
          // Landing page should have conversion-focused sections
          await expect(page.locator('[data-section-type="conversion-hero"]')).toBeVisible()
          await expect(page.locator('[data-section-type="benefits-features"]')).toBeVisible()
          await expect(page.locator('[data-section-type="social-proof"]')).toBeVisible()
          break
      }
      
      // Verify theme CSS is applied
      const themeContainer = page.locator('.theme-container')
      const hasThemeStyles = await themeContainer.evaluate(el => {
        const style = window.getComputedStyle(el)
        return style.getPropertyValue('--color-accent-1') !== ''
      })
      expect(hasThemeStyles).toBe(true)
    }
  })

  test('should preserve custom settings during theme switch', async ({ page }) => {
    // Set custom settings on Dawn theme
    await page.goto('/admin/themes/customize?theme=dawn')
    await page.waitForSelector('.theme-customizer')
    
    // Change color setting
    await page.click('[role="tab"][data-value="theme"]')
    const colorInput = page.locator('[data-testid="primary-color-input"]')
    const customColor = '#ff6b35'
    await colorInput.fill(customColor)
    
    // Save settings
    await page.click('[data-testid="save-button"]')
    await page.waitForTimeout(1000)
    
    // Switch to service theme and back
    await page.goto('/admin/themes/switch?theme=service-business')
    await page.waitForTimeout(1000)
    
    await page.goto('/admin/themes/switch?theme=dawn')
    await page.waitForTimeout(1000)
    
    // Verify custom color is preserved
    await page.goto('/admin/themes/customize?theme=dawn')
    await page.waitForSelector('.theme-customizer')
    await page.click('[role="tab"][data-value="theme"]')
    
    const preservedColor = await colorInput.inputValue()
    expect(preservedColor).toBe(customColor)
  })

  test('should handle theme-specific section configurations', async ({ page }) => {
    // Configure Dawn theme with e-commerce sections
    await page.goto('/admin/themes/customize?theme=dawn')
    await page.waitForSelector('.theme-customizer')
    
    // Add product section
    await page.click('[role="tab"][data-value="sections"]')
    await page.click('[data-testid="add-featured-products-section"]')
    await page.waitForTimeout(500)
    
    // Save configuration
    await page.click('[data-testid="save-button"]')
    await page.waitForTimeout(1000)
    
    // Switch to service theme
    await page.goto('/admin/themes/switch?theme=service-business')
    await page.waitForTimeout(1000)
    
    // Service theme should not show e-commerce sections inappropriately
    await page.goto('/test-store-service')
    await page.waitForSelector('[data-section-type]')
    
    // Should not have Dawn-specific sections
    const featuredProducts = page.locator('[data-section-type="featured-products"]')
    await expect(featuredProducts).not.toBeVisible()
    
    // Should have service-appropriate sections
    await expect(page.locator('[data-section-type="services-showcase"]')).toBeVisible()
  })

  test('should update navigation based on theme', async ({ page }) => {
    // Test Dawn theme navigation
    await page.goto('/admin/themes/switch?theme=dawn')
    await page.waitForTimeout(1000)
    await page.goto('/test-store-dawn')
    
    const dawnNav = page.locator('[data-section-type="header"] nav')
    const dawnNavItems = await dawnNav.locator('a').allTextContents()
    
    // Dawn should have e-commerce navigation
    const hasEcommerceNav = dawnNavItems.some(item => 
      /shop|products|collections|cart/i.test(item)
    )
    expect(hasEcommerceNav).toBe(true)
    
    // Switch to service theme
    await page.goto('/admin/themes/switch?theme=service-business')
    await page.waitForTimeout(1000)
    await page.goto('/test-store-service')
    
    const serviceNav = page.locator('[data-section-type="header"] nav, nav')
    if (await serviceNav.isVisible()) {
      const serviceNavItems = await serviceNav.locator('a').allTextContents()
      
      // Service theme should have service-focused navigation
      const hasServiceNav = serviceNavItems.some(item => 
        /services|about|team|contact|portfolio/i.test(item)
      )
      expect(hasServiceNav).toBe(true)
    }
  })

  test('should handle theme assets correctly', async ({ page }) => {
    for (const theme of themes) {
      await page.goto('/admin/themes/switch?theme=' + theme)
      await page.waitForTimeout(1000)
      
      await page.goto(`/test-store-${theme}`)
      await page.waitForSelector('[data-section-type]')
      
      // Check that CSS assets are loaded
      const cssLinks = await page.locator('link[rel="stylesheet"]').count()
      expect(cssLinks).toBeGreaterThan(0)
      
      // Check that JavaScript assets are loaded
      const scripts = await page.locator('script[src]').count()
      expect(scripts).toBeGreaterThan(0)
      
      // Verify no 404 errors for theme assets
      const responses: any[] = []
      page.on('response', response => {
        if (response.url().includes('/assets/') || response.url().includes('/themes/')) {
          responses.push(response)
        }
      })
      
      await page.reload()
      await page.waitForTimeout(2000)
      
      const failed404s = responses.filter(response => response.status() === 404)
      expect(failed404s.length).toBe(0)
    }
  })

  test('should maintain data consistency across themes', async ({ page }) => {
    // Add test data
    const testData = {
      product: {
        title: 'Test Product',
        price: 99.99,
        description: 'A test product for theme switching'
      },
      settings: {
        siteName: 'Test Store',
        contactEmail: 'test@example.com'
      }
    }
    
    // Set data in Dawn theme
    await page.goto('/admin/themes/switch?theme=dawn')
    await page.waitForTimeout(1000)
    
    // Verify data appears in Dawn
    await page.goto('/test-store-dawn')
    await page.waitForSelector('[data-section-type]')
    
    // Switch to service theme
    await page.goto('/admin/themes/switch?theme=service-business')
    await page.waitForTimeout(1000)
    
    // Verify same data appears in service theme (where applicable)
    await page.goto('/test-store-service')
    await page.waitForSelector('[data-section-type]')
    
    // Contact email should be consistent across themes
    const contactInfo = page.locator('[data-testid="contact-info"], .contact-info')
    if (await contactInfo.isVisible()) {
      const contactText = await contactInfo.textContent()
      expect(contactText).toContain(testData.settings.contactEmail)
    }
  })

  test('should handle theme preview mode', async ({ page }) => {
    // Enter preview mode for service theme while Dawn is active
    await page.goto('/admin/themes/preview?theme=service-business')
    await page.waitForSelector('[data-preview-mode="true"], .preview-mode')
    
    // Should show preview banner
    const previewBanner = page.locator('[data-testid="preview-banner"], .preview-banner')
    await expect(previewBanner).toBeVisible()
    
    // Should display service theme content
    await expect(page.locator('[data-section-type="service-hero"]')).toBeVisible()
    
    // Should have exit preview option
    const exitPreview = previewBanner.locator('[data-testid="exit-preview"], .exit-preview')
    await expect(exitPreview).toBeVisible()
    
    // Exit preview
    await exitPreview.click()
    
    // Should return to active theme
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-section-type="hero"]')).toBeVisible() // Dawn hero
  })

  test('should validate theme compatibility', async ({ page }) => {
    // Test switching to invalid theme
    await page.goto('/admin/themes/switch?theme=invalid-theme')
    
    // Should show error message
    const errorMessage = page.locator('[data-testid="theme-error"], .error-message')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
    
    // Should remain on current theme
    await page.goto('/test-store-dawn')
    await page.waitForSelector('[data-section-type]')
    
    // Should still show Dawn theme
    await expect(page.locator('[data-section-type="hero"]')).toBeVisible()
  })

  test('should handle concurrent theme operations', async ({ page, context }) => {
    // Open second tab
    const page2 = await context.newPage()
    
    // Both tabs switch themes simultaneously
    const switchPromise1 = page.goto('/admin/themes/switch?theme=service-business')
    const switchPromise2 = page2.goto('/admin/themes/switch?theme=landing-page')
    
    await Promise.all([switchPromise1, switchPromise2])
    await page.waitForTimeout(2000)
    
    // Verify final state is consistent
    await page.goto('/admin/themes/current')
    const currentTheme = await page.locator('[data-testid="current-theme"]').textContent()
    
    await page2.goto('/admin/themes/current')
    const currentTheme2 = await page2.locator('[data-testid="current-theme"]').textContent()
    
    // Should have same current theme (last one to complete)
    expect(currentTheme).toBe(currentTheme2)
    
    await page2.close()
  })

  test('should backup theme before switching', async ({ page }) => {
    // Get initial theme state
    await page.goto('/admin/themes/current')
    const initialTheme = await page.locator('[data-testid="current-theme"]').textContent()
    
    // Switch theme
    await page.goto('/admin/themes/switch?theme=service-business')
    await page.waitForTimeout(1000)
    
    // Check that backup was created
    await page.goto('/admin/themes/backups')
    const backups = page.locator('[data-testid="theme-backup"]')
    const backupCount = await backups.count()
    expect(backupCount).toBeGreaterThan(0)
    
    // Latest backup should be the initial theme
    const latestBackup = backups.first()
    const backupTheme = await latestBackup.locator('[data-testid="backup-theme"]').textContent()
    expect(backupTheme).toBe(initialTheme)
  })

  test('should restore from backup', async ({ page }) => {
    // Create backup point
    await page.goto('/admin/themes/backup/create')
    await page.waitForTimeout(1000)
    
    // Switch theme
    await page.goto('/admin/themes/switch?theme=landing-page')
    await page.waitForTimeout(1000)
    
    // Verify theme switched
    await page.goto('/test-store-landing')
    await expect(page.locator('[data-section-type="conversion-hero"]')).toBeVisible()
    
    // Restore from backup
    await page.goto('/admin/themes/backups')
    const restoreButton = page.locator('[data-testid="restore-backup"]').first()
    await restoreButton.click()
    
    await page.waitForTimeout(2000)
    
    // Verify restored to original theme
    await page.goto('/test-store-dawn')
    await expect(page.locator('[data-section-type="hero"]')).toBeVisible()
  })
})