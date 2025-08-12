import { test, expect } from '@playwright/test'

/**
 * Theme Security Tests
 * Tests XSS prevention, DOMPurify sanitization, and code injection safety
 */

test.describe('Theme Security Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-store-dawn')
  })

  test('should prevent XSS in custom CSS', async ({ page }) => {
    // Navigate to customizer
    await page.goto('/admin/themes/customize')
    await page.waitForSelector('.theme-customizer')
    
    // Try to inject malicious CSS
    await page.click('[role="tab"][data-value="code"]')
    const cssEditor = page.locator('[data-testid="custom-css-editor"]')
    
    const maliciousCSS = `
      body::before {
        content: "<script>alert('XSS')</script>";
      }
      @import url("javascript:alert('XSS')");
      expression(alert('XSS'));
    `
    
    await cssEditor.fill(maliciousCSS)
    await page.click('[data-testid="save-button"]')
    
    // Navigate to frontend to check if XSS was executed
    await page.goto('/test-store-dawn')
    
    // Should not execute any JavaScript
    let alertFired = false
    page.on('dialog', dialog => {
      alertFired = true
      dialog.dismiss()
    })
    
    await page.waitForTimeout(2000)
    expect(alertFired).toBe(false)
    
    // Check that dangerous CSS functions are sanitized
    const customStyle = await page.locator('style').innerHTML()
    expect(customStyle).not.toContain('javascript:')
    expect(customStyle).not.toContain('expression(')
    expect(customStyle).not.toContain('<script>')
  })

  test('should sanitize custom HTML input', async ({ page }) => {
    await page.goto('/admin/themes/customize')
    await page.waitForSelector('.theme-customizer')
    
    // Try to inject malicious HTML
    await page.click('[role="tab"][data-value="code"]')
    const htmlEditor = page.locator('[data-testid="head-scripts-editor"]')
    
    const maliciousHTML = `
      <script>alert('XSS')</script>
      <img src="x" onerror="alert('XSS')">
      <iframe src="javascript:alert('XSS')"></iframe>
      <object data="javascript:alert('XSS')"></object>
      <embed src="javascript:alert('XSS')">
      <form action="javascript:alert('XSS')">
        <input type="submit">
      </form>
      <meta http-equiv="refresh" content="0;url=javascript:alert('XSS')">
    `
    
    await htmlEditor.fill(maliciousHTML)
    await page.click('[data-testid="save-button"]')
    
    // Check frontend
    await page.goto('/test-store-dawn')
    
    // Should not execute JavaScript
    let alertFired = false
    page.on('dialog', dialog => {
      alertFired = true
      dialog.dismiss()
    })
    
    await page.waitForTimeout(2000)
    expect(alertFired).toBe(false)
    
    // Check that dangerous elements are removed or sanitized
    const scriptTags = await page.locator('script[src*="javascript:"]').count()
    expect(scriptTags).toBe(0)
    
    const imgWithOnerror = await page.locator('img[onerror]').count()
    expect(imgWithOnerror).toBe(0)
    
    const iframes = await page.locator('iframe[src*="javascript:"]').count()
    expect(iframes).toBe(0)
  })

  test('should block JavaScript injection in custom JS field', async ({ page }) => {
    await page.goto('/admin/themes/customize')
    await page.waitForSelector('.theme-customizer')
    
    await page.click('[role="tab"][data-value="code"]')
    const jsEditor = page.locator('[data-testid="custom-js-editor"]')
    
    // Try various JavaScript injection techniques
    const maliciousJS = `
      alert('Direct XSS');
      window.location = 'http://malicious-site.com';
      document.cookie = 'stolen';
      eval('alert("eval XSS")');
      setTimeout('alert("timeout XSS")', 100);
      Function('alert("Function XSS")')();
    `
    
    await jsEditor.fill(maliciousJS)
    await page.click('[data-testid="save-button"]')
    
    // Check that JavaScript is not executed on frontend
    await page.goto('/test-store-dawn')
    
    let alertFired = false
    page.on('dialog', dialog => {
      alertFired = true
      dialog.dismiss()
    })
    
    // Wait to see if any malicious code executes
    await page.waitForTimeout(3000)
    expect(alertFired).toBe(false)
    
    // Check that URL hasn't changed to malicious site
    const currentUrl = page.url()
    expect(currentUrl).not.toContain('malicious-site.com')
  })

  test('should sanitize section settings input', async ({ page }) => {
    // Mock section with malicious settings
    await page.route('**/api/themes/**', async route => {
      const response = await route.fetch()
      const json = await response.json()
      
      // Add section with malicious content
      json.sections.push({
        id: 'malicious-section',
        type: 'hero',
        settings: {
          heading: '<script>alert("XSS in heading")</script>',
          subheading: '<img src="x" onerror="alert(\'XSS in subheading\')">',
          button_text: 'javascript:alert("XSS in button")',
          custom_css: 'body { background: url("javascript:alert(\'CSS XSS\')"); }'
        }
      })
      
      await route.fulfill({ json })
    })
    
    await page.goto('/test-store-dawn')
    
    // Check that malicious content is sanitized
    let alertFired = false
    page.on('dialog', dialog => {
      alertFired = true
      dialog.dismiss()
    })
    
    await page.waitForTimeout(2000)
    expect(alertFired).toBe(false)
    
    // Check that HTML entities are properly escaped
    const headingContent = await page.locator('h1').first().textContent()
    expect(headingContent).not.toContain('<script>')
    
    // Check that dangerous URLs are not used
    const buttons = await page.locator('a[href*="javascript:"]').count()
    expect(buttons).toBe(0)
  })

  test('should validate file uploads for security', async ({ page }) => {
    await page.goto('/admin/themes/customize')
    await page.waitForSelector('.theme-customizer')
    
    // Try to upload malicious files
    const fileInput = page.locator('[data-testid="theme-file-upload"]')
    
    if (await fileInput.isVisible()) {
      // Create malicious file content
      const maliciousFile = Buffer.from(`
        <?php system($_GET['cmd']); ?>
        <script>alert('XSS')</script>
      `)
      
      // Try to upload
      await fileInput.setInputFiles([{
        name: 'malicious.php',
        mimeType: 'application/x-php',
        buffer: maliciousFile
      }])
      
      // Should show error or reject file
      const errorMessage = page.locator('[data-testid="upload-error"]')
      await expect(errorMessage).toBeVisible({ timeout: 5000 })
      
      // Error should mention invalid file type
      const errorText = await errorMessage.textContent()
      expect(errorText).toMatch(/invalid|not allowed|file type/i)
    }
  })

  test('should prevent CSRF attacks', async ({ page }) => {
    // Check for CSRF tokens in forms
    await page.goto('/admin/themes/customize')
    await page.waitForSelector('.theme-customizer')
    
    const forms = await page.locator('form').all()
    
    for (const form of forms) {
      const csrfToken = await form.locator('input[name="_token"], input[name="csrf_token"]').count()
      expect(csrfToken).toBeGreaterThan(0)
    }
  })

  test('should validate content security policy', async ({ page }) => {
    await page.goto('/test-store-dawn')
    
    // Check CSP headers
    const response = await page.request.get('/test-store-dawn')
    const cspHeader = response.headers()['content-security-policy']
    
    if (cspHeader) {
      expect(cspHeader).toContain("script-src 'self'")
      expect(cspHeader).toContain("style-src 'self' 'unsafe-inline'")
      expect(cspHeader).not.toContain("'unsafe-eval'")
    }
  })

  test('should sanitize theme configuration data', async ({ page }) => {
    // Mock malicious theme configuration
    await page.route('**/api/themes/config', async route => {
      await route.fulfill({
        json: {
          theme: 'dawn',
          settings: {
            colors_accent_1: '<script>alert("XSS")</script>',
            font_heading: 'javascript:alert("XSS")',
            custom_css: 'body::before { content: "\\<script>alert(\\"XSS\\")\\</script>"; }',
            page_width: 'calc(100% + alert("XSS"))'
          }
        }
      })
    })
    
    await page.goto('/test-store-dawn')
    
    // Check that malicious values are sanitized
    let alertFired = false
    page.on('dialog', dialog => {
      alertFired = true
      dialog.dismiss()
    })
    
    await page.waitForTimeout(2000)
    expect(alertFired).toBe(false)
    
    // Check CSS variables don't contain malicious content
    const themeContainer = page.locator('.theme-container')
    const styles = await themeContainer.evaluate(el => {
      const computedStyle = window.getComputedStyle(el)
      return {
        colorAccent1: computedStyle.getPropertyValue('--color-accent-1'),
        fontHeading: computedStyle.getPropertyValue('--font-heading'),
        pageWidth: computedStyle.getPropertyValue('--page-width')
      }
    })
    
    expect(styles.colorAccent1).not.toContain('<script>')
    expect(styles.fontHeading).not.toContain('javascript:')
    expect(styles.pageWidth).not.toContain('alert')
  })

  test('should protect against prototype pollution', async ({ page }) => {
    // Test theme settings that could cause prototype pollution
    await page.route('**/api/themes/**', async route => {
      const response = await route.fetch()
      const json = await response.json()
      
      // Try to pollute prototype
      json.settings['__proto__'] = { malicious: 'value' }
      json.settings['constructor'] = { prototype: { polluted: true } }
      json.settings['prototype'] = { polluted: true }
      
      await route.fulfill({ json })
    })
    
    await page.goto('/test-store-dawn')
    
    // Check that prototype pollution didn't occur
    const isPrototypePolluted = await page.evaluate(() => {
      return ({}).polluted === true || ({}).malicious === 'value'
    })
    
    expect(isPrototypePolluted).toBe(false)
  })

  test('should validate theme template structure', async ({ page }) => {
    // Mock malformed theme structure
    await page.route('**/api/themes/**', async route => {
      await route.fulfill({
        json: {
          sections: [
            {
              id: '../../../etc/passwd',
              type: '../../templates/malicious',
              settings: {
                template: '<%= system("rm -rf /") %>'
              }
            }
          ]
        }
      })
    })
    
    await page.goto('/test-store-dawn')
    
    // Should handle malformed structure gracefully
    const errorSections = await page.locator('.section-error').count()
    expect(errorSections).toBeGreaterThan(0)
    
    // Should not execute template injection
    const pageContent = await page.content()
    expect(pageContent).not.toContain('system(')
    expect(pageContent).not.toContain('rm -rf')
  })
})