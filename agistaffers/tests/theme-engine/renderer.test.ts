import { test, expect } from '@playwright/test'

/**
 * Theme Engine Renderer Tests
 * Tests the core theme rendering system functionality
 */

test.describe('Theme Renderer System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test store with Dawn theme
    await page.goto('/test-store-dawn')
  })

  test('should load and display sections properly', async ({ page }) => {
    // Wait for theme to load
    await page.waitForSelector('[data-section-type]', { timeout: 10000 })
    
    // Verify sections are rendered
    const sections = await page.locator('[data-section-type]').all()
    expect(sections.length).toBeGreaterThan(0)
    
    // Check that each section has proper structure
    for (const section of sections) {
      const sectionId = await section.getAttribute('data-section-id')
      const sectionType = await section.getAttribute('data-section-type')
      
      expect(sectionId).toBeTruthy()
      expect(sectionType).toBeTruthy()
      
      // Verify section has proper CSS classes
      const className = await section.getAttribute('class')
      expect(className).toContain('section')
      expect(className).toContain(`section-${sectionType}`)
    }
  })

  test('should apply theme settings correctly', async ({ page }) => {
    // Wait for theme container
    await page.waitForSelector('.theme-container')
    
    // Check CSS variables are applied
    const themeContainer = page.locator('.theme-container')
    const styles = await themeContainer.evaluate(el => {
      const computedStyle = window.getComputedStyle(el)
      return {
        colorAccent1: computedStyle.getPropertyValue('--color-accent-1'),
        colorBackground1: computedStyle.getPropertyValue('--color-background-1'),
        fontHeading: computedStyle.getPropertyValue('--font-heading'),
        pageWidth: computedStyle.getPropertyValue('--page-width')
      }
    })
    
    expect(styles.colorAccent1).toBeTruthy()
    expect(styles.colorBackground1).toBeTruthy()
    expect(styles.fontHeading).toBeTruthy()
    expect(styles.pageWidth).toBeTruthy()
  })

  test('should handle lazy loading of sections', async ({ page }) => {
    // Navigate to page with many sections
    await page.goto('/test-store-dawn/collections/all')
    
    // Initially only visible sections should be loaded
    await page.waitForSelector('[data-section-type="header"]')
    
    // Scroll down to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    
    // Wait for additional sections to load
    await page.waitForTimeout(2000)
    
    // Verify more sections are now loaded
    const sections = await page.locator('[data-section-type]').all()
    expect(sections.length).toBeGreaterThan(2)
  })

  test('should show loading state during section load', async ({ page }) => {
    // Intercept section loading to simulate slow network
    await page.route('**/sections/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })
    
    await page.goto('/test-store-dawn')
    
    // Should show loading skeleton
    const loader = page.locator('.section-loader')
    await expect(loader.first()).toBeVisible()
    
    // Should have loading animation
    const hasAnimation = await loader.first().evaluate(el => {
      const classes = el.className
      return classes.includes('animate-pulse')
    })
    expect(hasAnimation).toBe(true)
    
    // Wait for sections to load
    await page.waitForSelector('[data-section-type]', { timeout: 15000 })
    
    // Loading states should be gone
    await expect(loader.first()).not.toBeVisible()
  })

  test('should handle unknown section types gracefully', async ({ page }) => {
    // Mock a response with unknown section type
    await page.route('**/api/themes/**', async route => {
      const response = await route.fetch()
      const json = await response.json()
      
      // Add unknown section type
      json.sections.push({
        id: 'unknown-section',
        type: 'unknown-section-type',
        settings: {}
      })
      
      await route.fulfill({ json })
    })
    
    await page.goto('/test-store-dawn')
    
    // Should show error message for unknown section
    const errorSection = page.locator('.section-error')
    await expect(errorSection).toBeVisible()
    await expect(errorSection).toContainText('Unknown section type: unknown-section-type')
    
    // Should have proper error styling
    const hasErrorStyling = await errorSection.evaluate(el => {
      const classes = el.className
      return classes.includes('bg-red-50') && classes.includes('text-red-600')
    })
    expect(hasErrorStyling).toBe(true)
  })

  test('should render disabled sections correctly', async ({ page }) => {
    // Mock response with disabled section
    await page.route('**/api/themes/**', async route => {
      const response = await route.fetch()
      const json = await response.json()
      
      // Mark first section as disabled
      if (json.sections[0]) {
        json.sections[0].disabled = true
      }
      
      await route.fulfill({ json })
    })
    
    await page.goto('/test-store-dawn')
    
    // Disabled section should not be rendered
    const firstSectionType = process.env.TEST_STORES ? JSON.parse(process.env.TEST_STORES)[0].sections?.[0]?.type : null
    if (firstSectionType) {
      const disabledSection = page.locator(`[data-section-type="${firstSectionType}"]`)
      await expect(disabledSection).not.toBeVisible()
    }
  })

  test('should handle block rendering', async ({ page }) => {
    await page.goto('/test-store-dawn')
    
    // Find sections with blocks
    const sectionsWithBlocks = await page.locator('[data-section-type]').filter({
      has: page.locator('.block')
    }).all()
    
    for (const section of sectionsWithBlocks) {
      const blocks = await section.locator('.block').all()
      
      for (const block of blocks) {
        // Each block should have proper class
        const className = await block.getAttribute('class')
        expect(className).toContain('block')
        
        // Block should have block-type class
        const blockTypeClass = className?.split(' ').find(cls => cls.startsWith('block-'))
        expect(blockTypeClass).toBeTruthy()
      }
    }
  })

  test('should preserve section order', async ({ page }) => {
    await page.goto('/test-store-dawn')
    await page.waitForSelector('[data-section-type]')
    
    // Get section order
    const sectionOrder = await page.locator('[data-section-type]').evaluateAll(sections => {
      return sections.map(section => section.getAttribute('data-section-type'))
    })
    
    // Should have expected order (header first, footer last typically)
    expect(sectionOrder[0]).toBe('header')
    expect(sectionOrder[sectionOrder.length - 1]).toBe('footer')
    
    // Should maintain consistent order across reloads
    await page.reload()
    await page.waitForSelector('[data-section-type]')
    
    const newSectionOrder = await page.locator('[data-section-type]').evaluateAll(sections => {
      return sections.map(section => section.getAttribute('data-section-type'))
    })
    
    expect(newSectionOrder).toEqual(sectionOrder)
  })
})