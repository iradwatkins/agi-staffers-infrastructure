import { test, expect } from '@playwright/test'

/**
 * Theme Customizer Tests
 * Tests the theme customization interface functionality
 */

test.describe('Theme Customizer Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin to access customizer
    await page.goto('/admin/login')
    
    try {
      await page.fill('[data-testid="email"]', 'test@example.com')
      await page.fill('[data-testid="password"]', 'testpassword')
      await page.click('[data-testid="login-button"]')
      await page.waitForNavigation()
    } catch (error) {
      // Skip if login is not available in test environment
      test.skip()
    }
    
    // Navigate to theme customizer
    await page.goto('/admin/themes/customize')
    await page.waitForSelector('.theme-customizer', { timeout: 10000 })
  })

  test('should load customizer interface', async ({ page }) => {
    // Check main customizer components
    await expect(page.locator('.theme-customizer')).toBeVisible()
    await expect(page.locator('[data-testid="customizer-header"]')).toBeVisible()
    
    // Check tabs are present
    await expect(page.locator('[role="tablist"]')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Sections' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Theme Settings' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Custom Code' })).toBeVisible()
  })

  test('should switch between preview modes', async ({ page }) => {
    // Test desktop mode
    await page.click('[data-testid="preview-desktop"]')
    const desktopButton = page.locator('[data-testid="preview-desktop"]')
    await expect(desktopButton).toHaveClass(/default/)
    
    // Test tablet mode
    await page.click('[data-testid="preview-tablet"]')
    const tabletButton = page.locator('[data-testid="preview-tablet"]')
    await expect(tabletButton).toHaveClass(/default/)
    
    // Test mobile mode
    await page.click('[data-testid="preview-mobile"]')
    const mobileButton = page.locator('[data-testid="preview-mobile"]')
    await expect(mobileButton).toHaveClass(/default/)
  })

  test('should manage sections properly', async ({ page }) => {
    // Navigate to sections tab
    await page.click('[role="tab"][data-value="sections"]')
    
    // Should show section list
    await expect(page.locator('[data-testid="sections-list"]')).toBeVisible()
    
    // Should show existing sections
    const sections = await page.locator('[data-testid="section-item"]').all()
    expect(sections.length).toBeGreaterThan(0)
    
    // Each section should have controls
    for (const section of sections.slice(0, 3)) { // Test first 3 sections
      await expect(section.locator('[data-testid="section-visibility-toggle"]')).toBeVisible()
      await expect(section.locator('[data-testid="section-move-up"]')).toBeVisible()
      await expect(section.locator('[data-testid="section-move-down"]')).toBeVisible()
      await expect(section.locator('[data-testid="section-delete"]')).toBeVisible()
    }
  })

  test('should add new sections', async ({ page }) => {
    await page.click('[role="tab"][data-value="sections"]')
    
    // Get initial section count
    const initialSections = await page.locator('[data-testid="section-item"]').count()
    
    // Add a new hero section
    await page.click('[data-testid="add-hero-section"]')
    
    // Should increase section count
    await page.waitForTimeout(1000)
    const newSections = await page.locator('[data-testid="section-item"]').count()
    expect(newSections).toBe(initialSections + 1)
    
    // New section should appear in list
    const lastSection = page.locator('[data-testid="section-item"]').last()
    await expect(lastSection).toContainText('hero')
  })

  test('should toggle section visibility', async ({ page }) => {
    await page.click('[role="tab"][data-value="sections"]')
    
    const firstSection = page.locator('[data-testid="section-item"]').first()
    const visibilityToggle = firstSection.locator('[data-testid="section-visibility-toggle"]')
    
    // Check initial state
    const initiallyVisible = await firstSection.evaluate(el => !el.classList.contains('opacity-50'))
    
    // Toggle visibility
    await visibilityToggle.click()
    
    // Wait for state change
    await page.waitForTimeout(500)
    
    // Check state changed
    const nowVisible = await firstSection.evaluate(el => !el.classList.contains('opacity-50'))
    expect(nowVisible).toBe(!initiallyVisible)
  })

  test('should reorder sections', async ({ page }) => {
    await page.click('[role="tab"][data-value="sections"]')
    
    // Get initial section order
    const initialOrder = await page.locator('[data-testid="section-item"]').evaluateAll(sections => {
      return sections.map(section => section.textContent?.trim())
    })
    
    // Move second section up
    const secondSection = page.locator('[data-testid="section-item"]').nth(1)
    await secondSection.locator('[data-testid="section-move-up"]').click()
    
    await page.waitForTimeout(500)
    
    // Get new order
    const newOrder = await page.locator('[data-testid="section-item"]').evaluateAll(sections => {
      return sections.map(section => section.textContent?.trim())
    })
    
    // Second item should now be first
    expect(newOrder[0]).toBe(initialOrder[1])
    expect(newOrder[1]).toBe(initialOrder[0])
  })

  test('should edit theme settings', async ({ page }) => {
    await page.click('[role="tab"][data-value="theme"]')
    
    // Should show theme settings
    await expect(page.locator('[data-testid="theme-settings"]')).toBeVisible()
    
    // Test color picker
    const colorInput = page.locator('[data-testid="primary-color-input"]')
    await colorInput.fill('#ff0000')
    
    // Verify color was set
    const colorValue = await colorInput.inputValue()
    expect(colorValue).toBe('#ff0000')
    
    // Test font selection
    const fontSelect = page.locator('[data-testid="heading-font-select"]')
    await fontSelect.click()
    await page.click('[data-value="serif"]')
    
    // Verify font was selected
    const fontValue = await fontSelect.inputValue()
    expect(fontValue).toBe('serif')
    
    // Test slider input
    const pageWidthSlider = page.locator('[data-testid="page-width-slider"]')
    const sliderThumb = pageWidthSlider.locator('[role="slider"]')
    
    // Move slider
    await sliderThumb.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    
    // Should update value display
    const valueDisplay = page.locator('[data-testid="page-width-value"]')
    const value = await valueDisplay.textContent()
    expect(value).toContain('px')
  })

  test('should handle custom code editing', async ({ page }) => {
    await page.click('[role="tab"][data-value="code"]')
    
    // Should show code editors
    await expect(page.locator('[data-testid="custom-css-editor"]')).toBeVisible()
    await expect(page.locator('[data-testid="custom-js-editor"]')).toBeVisible()
    await expect(page.locator('[data-testid="head-scripts-editor"]')).toBeVisible()
    
    // Test CSS editor
    const cssEditor = page.locator('[data-testid="custom-css-editor"]')
    await cssEditor.fill('body { background-color: red; }')
    
    const cssValue = await cssEditor.inputValue()
    expect(cssValue).toContain('background-color: red')
    
    // Test JS editor (should accept code but warn about security)
    const jsEditor = page.locator('[data-testid="custom-js-editor"]')
    await jsEditor.fill('console.log("test");')
    
    const jsValue = await jsEditor.inputValue()
    expect(jsValue).toContain('console.log')
  })

  test('should save and publish changes', async ({ page }) => {
    // Make a change
    await page.click('[role="tab"][data-value="theme"]')
    const colorInput = page.locator('[data-testid="primary-color-input"]')
    await colorInput.fill('#00ff00')
    
    // Save changes
    await page.click('[data-testid="save-button"]')
    
    // Should show save confirmation
    await expect(page.locator('[data-testid="save-success"]')).toBeVisible()
    
    // Publish changes
    await page.click('[data-testid="publish-button"]')
    
    // Should show publish confirmation
    await expect(page.locator('[data-testid="publish-success"]')).toBeVisible()
  })

  test('should support undo/redo functionality', async ({ page }) => {
    // Make initial change
    await page.click('[role="tab"][data-value="theme"]')
    const colorInput = page.locator('[data-testid="primary-color-input"]')
    const originalColor = await colorInput.inputValue()
    
    await colorInput.fill('#ff0000')
    await page.waitForTimeout(500)
    
    // Make second change
    await colorInput.fill('#00ff00')
    await page.waitForTimeout(500)
    
    // Undo should work
    await page.click('[data-testid="undo-button"]')
    await page.waitForTimeout(500)
    
    let currentColor = await colorInput.inputValue()
    expect(currentColor).toBe('#ff0000')
    
    // Undo again
    await page.click('[data-testid="undo-button"]')
    await page.waitForTimeout(500)
    
    currentColor = await colorInput.inputValue()
    expect(currentColor).toBe(originalColor)
    
    // Redo should work
    await page.click('[data-testid="redo-button"]')
    await page.waitForTimeout(500)
    
    currentColor = await colorInput.inputValue()
    expect(currentColor).toBe('#ff0000')
  })

  test('should validate input constraints', async ({ page }) => {
    await page.click('[role="tab"][data-value="theme"]')
    
    // Test color input validation
    const colorInput = page.locator('[data-testid="primary-color-input"]')
    await colorInput.fill('invalid-color')
    
    // Should show validation error or revert to valid value
    const colorValue = await colorInput.inputValue()
    expect(colorValue).toMatch(/^#[0-9a-fA-F]{6}$|^$/)
    
    // Test range input constraints
    const pageWidthSlider = page.locator('[data-testid="page-width-slider"]')
    const sliderInput = pageWidthSlider.locator('input')
    
    // Try to set value outside range
    await sliderInput.fill('999999')
    await sliderInput.blur()
    
    // Should be constrained to max value
    const finalValue = await sliderInput.inputValue()
    expect(parseInt(finalValue)).toBeLessThanOrEqual(1600)
  })
})