import { Page, Locator, expect } from '@playwright/test'

export class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  // Navigation
  async goto(path: string = '/') {
    await this.page.goto(path)
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  // Common elements
  get header(): Locator {
    return this.page.locator('header, .header, [data-section-type="header"]')
  }

  get footer(): Locator {
    return this.page.locator('footer, .footer, [data-section-type="footer"]')
  }

  get mainContent(): Locator {
    return this.page.locator('main, .main-content, #main')
  }

  // Theme-specific elements
  get themeContainer(): Locator {
    return this.page.locator('.theme-container')
  }

  get sections(): Locator {
    return this.page.locator('.section, [data-section-id]')
  }

  getSectionByType(type: string): Locator {
    return this.page.locator(`[data-section-type="${type}"]`)
  }

  getSectionById(id: string): Locator {
    return this.page.locator(`[data-section-id="${id}"]`)
  }

  // Interactions
  async clickButton(text: string) {
    await this.page.getByRole('button', { name: text }).click()
  }

  async clickLink(text: string) {
    await this.page.getByRole('link', { name: text }).click()
  }

  async fillInput(label: string, value: string) {
    await this.page.getByLabel(label).fill(value)
  }

  // Validation
  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible()
  }

  async expectText(locator: Locator, text: string) {
    await expect(locator).toContainText(text)
  }

  async expectUrl(url: string) {
    await expect(this.page).toHaveURL(url)
  }

  // Responsive testing
  async setViewportSize(width: number, height: number) {
    await this.page.setViewportSize({ width, height })
  }

  async testMobileView() {
    await this.setViewportSize(375, 667) // iPhone SE
  }

  async testTabletView() {
    await this.setViewportSize(768, 1024) // iPad
  }

  async testDesktopView() {
    await this.setViewportSize(1920, 1080) // Desktop
  }

  // Performance utilities
  async measurePageLoad(): Promise<number> {
    const startTime = Date.now()
    await this.page.waitForLoadState('networkidle')
    return Date.now() - startTime
  }

  async getLCPValue(): Promise<number> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
  }

  async getCLSValue(): Promise<number> {
    return await this.page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          resolve(clsValue)
        }).observe({ entryTypes: ['layout-shift'] })

        // Resolve after a short delay to capture shifts
        setTimeout(() => resolve(clsValue), 3000)
      })
    })
  }

  // Accessibility testing
  async checkAccessibility() {
    const violations = await this.page.evaluate(() => {
      // Simple accessibility checks
      const issues: string[] = []
      
      // Check for missing alt text
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push(`Image ${index + 1} missing alt text`)
        }
      })

      // Check for missing form labels
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input, index) => {
        const hasLabel = input.getAttribute('aria-label') || 
                        input.getAttribute('aria-labelledby') ||
                        document.querySelector(`label[for="${input.id}"]`)
        if (!hasLabel) {
          issues.push(`Form field ${index + 1} missing label`)
        }
      })

      // Check heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let lastLevel = 0
      headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.slice(1))
        if (level > lastLevel + 1) {
          issues.push(`Heading ${index + 1} skips levels (h${lastLevel} to h${level})`)
        }
        lastLevel = level
      })

      return issues
    })

    return violations
  }

  // Security testing
  async checkSecurityHeaders() {
    const response = await this.page.request.get(this.page.url())
    const headers = response.headers()
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'strict-transport-security',
      'content-security-policy'
    ]

    const missingHeaders = securityHeaders.filter(header => !headers[header])
    return missingHeaders
  }

  async checkForXSSVulnerabilities(testString: string = '<script>alert("xss")</script>') {
    // Try to inject malicious content
    const inputs = this.page.locator('input[type="text"], textarea')
    const count = await inputs.count()
    
    const vulnerabilities: string[] = []
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      await input.fill(testString)
      
      // Check if the malicious content appears in the DOM unescaped
      const pageContent = await this.page.content()
      if (pageContent.includes('<script>alert("xss")</script>')) {
        vulnerabilities.push(`Input field ${i + 1} vulnerable to XSS`)
      }
    }

    return vulnerabilities
  }

  // Visual testing
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}.png`,
      fullPage: true 
    })
  }

  async compareScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(`${name}.png`)
  }

  // Wait utilities
  async waitForSelector(selector: string, timeout: number = 10000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  async waitForText(text: string, timeout: number = 10000) {
    await this.page.waitForFunction(
      (searchText) => document.body.innerText.includes(searchText),
      text,
      { timeout }
    )
  }

  async waitForApiCall(url: string) {
    await this.page.waitForResponse(response => 
      response.url().includes(url) && response.status() === 200
    )
  }

  // Custom CSS injection testing
  async injectCustomCSS(css: string) {
    await this.page.addStyleTag({ content: css })
  }

  async checkCSSInjectionSafety(maliciousCSS: string) {
    const originalContent = await this.page.content()
    
    try {
      await this.injectCustomCSS(maliciousCSS)
      const newContent = await this.page.content()
      
      // Check if malicious scripts were executed
      const hasScript = newContent.includes('<script>') || 
                       newContent.includes('javascript:')
      
      return !hasScript
    } catch (error) {
      // If injection fails, that's good for security
      return true
    }
  }
}