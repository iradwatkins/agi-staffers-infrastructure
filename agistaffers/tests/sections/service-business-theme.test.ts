import { test, expect } from '@playwright/test'

/**
 * Service Business Theme Section Tests
 * Tests all sections of the Service Business theme (hero, services, team, contact)
 */

test.describe('Service Business Theme Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-store-service')
    await page.waitForSelector('[data-section-type]')
  })

  test.describe('Service Hero Section', () => {
    test('should render service hero with business focus', async ({ page }) => {
      const hero = page.locator('[data-section-type="service-hero"]')
      await expect(hero).toBeVisible()
      
      // Should have professional headline
      const headline = hero.locator('h1, [data-testid="hero-headline"]')
      await expect(headline).toBeVisible()
      
      const headlineText = await headline.textContent()
      expect(headlineText?.length).toBeGreaterThan(10)
      
      // Should have service-focused subheading
      const subheading = hero.locator('h2, p, [data-testid="hero-subheading"]')
      await expect(subheading).toBeVisible()
      
      // Should have professional CTA
      const ctaButton = hero.locator('[data-testid="hero-cta"], .cta-button')
      await expect(ctaButton).toBeVisible()
      
      const ctaText = await ctaButton.textContent()
      expect(ctaText).toMatch(/contact|get started|learn more|book|schedule/i)
    })

    test('should have contact information display', async ({ page }) => {
      const hero = page.locator('[data-section-type="service-hero"]')
      
      // Should show business contact info
      const contactInfo = hero.locator('[data-testid="contact-info"], .contact-info')
      
      if (await contactInfo.isVisible()) {
        // Phone number
        const phone = contactInfo.locator('[data-testid="phone"], .phone, a[href^="tel:"]')
        if (await phone.isVisible()) {
          const phoneText = await phone.textContent()
          expect(phoneText).toMatch(/\d{3}.*\d{3}.*\d{4}/)
        }
        
        // Email
        const email = contactInfo.locator('[data-testid="email"], .email, a[href^="mailto:"]')
        if (await email.isVisible()) {
          const emailText = await email.textContent()
          expect(emailText).toMatch(/\S+@\S+\.\S+/)
        }
        
        // Business hours
        const hours = contactInfo.locator('[data-testid="hours"], .hours')
        if (await hours.isVisible()) {
          const hoursText = await hours.textContent()
          expect(hoursText).toMatch(/\d+.*\d+|24\/7|hours/i)
        }
      }
    })

    test('should display service highlights', async ({ page }) => {
      const hero = page.locator('[data-section-type="service-hero"]')
      
      // Should have service highlights or key benefits
      const highlights = hero.locator('[data-testid="service-highlights"], .service-highlights')
      
      if (await highlights.isVisible()) {
        const highlightItems = highlights.locator('[data-testid="highlight-item"], .highlight-item')
        const highlightCount = await highlightItems.count()
        expect(highlightCount).toBeGreaterThan(0)
        
        // Each highlight should have icon and text
        for (let i = 0; i < Math.min(highlightCount, 3); i++) {
          const highlight = highlightItems.nth(i)
          
          const icon = highlight.locator('svg, img, .icon')
          if (await icon.isVisible()) {
            await expect(icon).toBeVisible()
          }
          
          const text = highlight.locator('span, p, div')
          await expect(text).toBeVisible()
        }
      }
    })
  })

  test.describe('Services Showcase Section', () => {
    test('should display service offerings', async ({ page }) => {
      const services = page.locator('[data-section-type="services-showcase"]')
      await expect(services).toBeVisible()
      
      // Should have services grid
      const serviceItems = services.locator('[data-testid="service-item"], .service-item')
      const serviceCount = await serviceItems.count()
      expect(serviceCount).toBeGreaterThan(0)
      
      // Each service should have proper structure
      for (let i = 0; i < Math.min(serviceCount, 3); i++) {
        const service = serviceItems.nth(i)
        
        // Service icon or image
        const serviceIcon = service.locator('svg, img, .service-icon')
        await expect(serviceIcon).toBeVisible()
        
        // Service title
        const serviceTitle = service.locator('h3, h4, [data-testid="service-title"]')
        await expect(serviceTitle).toBeVisible()
        
        // Service description
        const serviceDesc = service.locator('p, [data-testid="service-description"]')
        await expect(serviceDesc).toBeVisible()
        
        const descText = await serviceDesc.textContent()
        expect(descText?.length).toBeGreaterThan(20)
      }
    })

    test('should handle service interactions', async ({ page }) => {
      const services = page.locator('[data-section-type="services-showcase"]')
      const firstService = services.locator('[data-testid="service-item"], .service-item').first()
      
      // Service should be interactive
      await firstService.hover()
      
      // Should have visual feedback on hover
      await page.waitForTimeout(300)
      
      // Look for learn more or contact buttons
      const learnMore = firstService.locator('[data-testid="learn-more"], .learn-more, button:has-text("Learn More")')
      
      if (await learnMore.isVisible()) {
        await learnMore.click()
        
        // Should show service details modal or navigate to service page
        const serviceModal = page.locator('[data-testid="service-modal"], .service-modal')
        const isServicePage = page.url().includes('/services/')
        
        expect(await serviceModal.isVisible() || isServicePage).toBe(true)
      }
    })

    test('should show pricing information', async ({ page }) => {
      const services = page.locator('[data-section-type="services-showcase"]')
      const serviceItems = services.locator('[data-testid="service-item"], .service-item')
      
      // Check if services show pricing
      const pricing = services.locator('[data-testid="service-price"], .service-price')
      
      if (await pricing.count() > 0) {
        const firstPrice = pricing.first()
        const priceText = await firstPrice.textContent()
        
        // Should contain currency symbol and number
        expect(priceText).toMatch(/\$\d+|€\d+|£\d+|\d+.*hour|\d+.*month/i)
      }
    })

    test('should display service categories', async ({ page }) => {
      const services = page.locator('[data-section-type="services-showcase"]')
      
      // Look for service category filters
      const categories = services.locator('[data-testid="service-categories"], .service-categories')
      
      if (await categories.isVisible()) {
        const categoryButtons = categories.locator('button, .category-button')
        const categoryCount = await categoryButtons.count()
        expect(categoryCount).toBeGreaterThan(0)
        
        // Test category filtering
        if (categoryCount > 1) {
          const secondCategory = categoryButtons.nth(1)
          await secondCategory.click()
          
          await page.waitForTimeout(1000)
          
          // Should filter or highlight relevant services
          const activeCategory = categories.locator('.active, [aria-selected="true"]')
          await expect(activeCategory).toBeVisible()
        }
      }
    })
  })

  test.describe('Team Profiles Section', () => {
    test('should display team members', async ({ page }) => {
      const team = page.locator('[data-section-type="team-profiles"]')
      await expect(team).toBeVisible()
      
      // Should have team members
      const teamMembers = team.locator('[data-testid="team-member"], .team-member')
      const memberCount = await teamMembers.count()
      expect(memberCount).toBeGreaterThan(0)
      
      // Each team member should have proper structure
      for (let i = 0; i < Math.min(memberCount, 3); i++) {
        const member = teamMembers.nth(i)
        
        // Member photo
        const memberPhoto = member.locator('img, [data-testid="member-photo"]')
        await expect(memberPhoto).toBeVisible()
        
        // Member name
        const memberName = member.locator('h3, h4, [data-testid="member-name"]')
        await expect(memberName).toBeVisible()
        
        // Member title/role
        const memberTitle = member.locator('[data-testid="member-title"], .member-title')
        await expect(memberTitle).toBeVisible()
        
        // Member bio (optional)
        const memberBio = member.locator('p, [data-testid="member-bio"]')
        if (await memberBio.isVisible()) {
          const bioText = await memberBio.textContent()
          expect(bioText?.length).toBeGreaterThan(10)
        }
      }
    })

    test('should show team member credentials', async ({ page }) => {
      const team = page.locator('[data-section-type="team-profiles"]')
      const teamMembers = team.locator('[data-testid="team-member"], .team-member')
      
      if (await teamMembers.count() > 0) {
        const firstMember = teamMembers.first()
        
        // Look for credentials, certifications, or specializations
        const credentials = firstMember.locator('[data-testid="credentials"], .credentials')
        
        if (await credentials.isVisible()) {
          const credentialText = await credentials.textContent()
          expect(credentialText?.length).toBeGreaterThan(5)
        }
        
        // Look for years of experience
        const experience = firstMember.locator('[data-testid="experience"], .experience')
        
        if (await experience.isVisible()) {
          const expText = await experience.textContent()
          expect(expText).toMatch(/\d+.*year|experience/i)
        }
      }
    })

    test('should have social links for team members', async ({ page }) => {
      const team = page.locator('[data-section-type="team-profiles"]')
      const teamMembers = team.locator('[data-testid="team-member"], .team-member')
      
      if (await teamMembers.count() > 0) {
        const firstMember = teamMembers.first()
        
        // Look for social media links
        const socialLinks = firstMember.locator('[data-testid="social-links"], .social-links a')
        
        if (await socialLinks.count() > 0) {
          const firstLink = socialLinks.first()
          const href = await firstLink.getAttribute('href')
          
          expect(href).toMatch(/linkedin|twitter|facebook|instagram|github/i)
          
          // Should open in new tab
          const target = await firstLink.getAttribute('target')
          expect(target).toBe('_blank')
        }
      }
    })

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      
      const team = page.locator('[data-section-type="team-profiles"]')
      await expect(team).toBeVisible()
      
      const teamMembers = team.locator('[data-testid="team-member"], .team-member')
      
      if (await teamMembers.count() > 0) {
        // Members should stack vertically on mobile
        const firstMember = teamMembers.first()
        const memberBox = await firstMember.boundingBox()
        
        expect(memberBox?.width).toBeGreaterThan(300)
        expect(memberBox?.width).toBeLessThan(400)
      }
    })
  })

  test.describe('Contact Form Section', () => {
    test('should render contact form', async ({ page }) => {
      const contact = page.locator('[data-section-type="contact-form"]')
      await expect(contact).toBeVisible()
      
      // Should have contact form
      const form = contact.locator('form, [data-testid="contact-form"]')
      await expect(form).toBeVisible()
      
      // Required form fields
      const nameField = form.locator('input[name="name"], input[placeholder*="name" i]')
      await expect(nameField).toBeVisible()
      
      const emailField = form.locator('input[type="email"], input[name="email"]')
      await expect(emailField).toBeVisible()
      
      const messageField = form.locator('textarea, input[name="message"]')
      await expect(messageField).toBeVisible()
      
      const submitButton = form.locator('button[type="submit"], input[type="submit"]')
      await expect(submitButton).toBeVisible()
    })

    test('should validate form inputs', async ({ page }) => {
      const contact = page.locator('[data-section-type="contact-form"]')
      const form = contact.locator('form, [data-testid="contact-form"]')
      
      const submitButton = form.locator('button[type="submit"], input[type="submit"]')
      
      // Try to submit empty form
      await submitButton.click()
      
      // Should show validation errors
      const validationErrors = form.locator('.error, [data-testid="validation-error"]')
      
      if (await validationErrors.count() > 0) {
        await expect(validationErrors.first()).toBeVisible()
      } else {
        // Check for HTML5 validation
        const requiredFields = form.locator('input[required], textarea[required]')
        const requiredCount = await requiredFields.count()
        
        if (requiredCount > 0) {
          const isValid = await form.evaluate(form => (form as HTMLFormElement).checkValidity())
          expect(isValid).toBe(false)
        }
      }
    })

    test('should submit form successfully', async ({ page }) => {
      const contact = page.locator('[data-section-type="contact-form"]')
      const form = contact.locator('form, [data-testid="contact-form"]')
      
      // Fill out form
      const nameField = form.locator('input[name="name"], input[placeholder*="name" i]')
      await nameField.fill('John Doe')
      
      const emailField = form.locator('input[type="email"], input[name="email"]')
      await emailField.fill('john@example.com')
      
      const messageField = form.locator('textarea, input[name="message"]')
      await messageField.fill('This is a test message for the contact form.')
      
      // Optional phone field
      const phoneField = form.locator('input[type="tel"], input[name="phone"]')
      if (await phoneField.isVisible()) {
        await phoneField.fill('555-123-4567')
      }
      
      // Submit form
      const submitButton = form.locator('button[type="submit"], input[type="submit"]')
      await submitButton.click()
      
      // Should show success message
      const successMessage = page.locator('[data-testid="contact-success"], .contact-success, .success')
      await expect(successMessage).toBeVisible({ timeout: 10000 })
      
      const successText = await successMessage.textContent()
      expect(successText).toMatch(/thank you|success|received|contact|soon/i)
    })

    test('should show business contact information', async ({ page }) => {
      const contact = page.locator('[data-section-type="contact-form"]')
      
      // Should display business info alongside form
      const contactInfo = contact.locator('[data-testid="business-info"], .business-info')
      
      if (await contactInfo.isVisible()) {
        // Business address
        const address = contactInfo.locator('[data-testid="address"], .address')
        if (await address.isVisible()) {
          const addressText = await address.textContent()
          expect(addressText?.length).toBeGreaterThan(10)
        }
        
        // Business phone
        const phone = contactInfo.locator('[data-testid="phone"], .phone, a[href^="tel:"]')
        if (await phone.isVisible()) {
          const phoneText = await phone.textContent()
          expect(phoneText).toMatch(/\d{3}.*\d{3}.*\d{4}/)
        }
        
        // Business email
        const email = contactInfo.locator('[data-testid="email"], .email, a[href^="mailto:"]')
        if (await email.isVisible()) {
          const emailText = await email.textContent()
          expect(emailText).toMatch(/\S+@\S+\.\S+/)
        }
        
        // Business hours
        const hours = contactInfo.locator('[data-testid="hours"], .hours')
        if (await hours.isVisible()) {
          const hoursText = await hours.textContent()
          expect(hoursText).toMatch(/monday|tuesday|hours|am|pm|\d+/i)
        }
      }
    })

    test('should have map integration', async ({ page }) => {
      const contact = page.locator('[data-section-type="contact-form"]')
      
      // Look for embedded map
      const map = contact.locator('[data-testid="map"], .map, iframe[src*="maps"]')
      
      if (await map.isVisible()) {
        // Should be properly sized
        const mapBox = await map.boundingBox()
        expect(mapBox?.width).toBeGreaterThan(200)
        expect(mapBox?.height).toBeGreaterThan(200)
        
        // If it's an iframe, should have valid src
        if (await map.evaluate(el => el.tagName.toLowerCase() === 'iframe')) {
          const src = await map.getAttribute('src')
          expect(src).toMatch(/maps\.google|openstreetmap|mapbox/i)
        }
      }
    })

    test('should handle service inquiry types', async ({ page }) => {
      const contact = page.locator('[data-section-type="contact-form"]')
      const form = contact.locator('form, [data-testid="contact-form"]')
      
      // Look for service type selector
      const serviceType = form.locator('select[name="service"], select[name="inquiry_type"]')
      
      if (await serviceType.isVisible()) {
        const options = serviceType.locator('option')
        const optionCount = await options.count()
        expect(optionCount).toBeGreaterThan(1) // Should have multiple service options
        
        // Select a service type
        await serviceType.selectOption({ index: 1 })
        
        const selectedValue = await serviceType.inputValue()
        expect(selectedValue).toBeTruthy()
      }
    })
  })
})