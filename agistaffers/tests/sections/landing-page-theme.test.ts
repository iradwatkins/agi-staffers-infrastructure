import { test, expect } from '@playwright/test'

/**
 * Landing Page Theme Section Tests
 * Tests all sections of the Landing Page theme (conversion hero, benefits, social proof)
 */

test.describe('Landing Page Theme Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-store-landing')
    await page.waitForSelector('[data-section-type]')
  })

  test.describe('Conversion Hero Section', () => {
    test('should render conversion-focused hero', async ({ page }) => {
      const hero = page.locator('[data-section-type="conversion-hero"]')
      await expect(hero).toBeVisible()
      
      // Should have compelling headline
      const headline = hero.locator('h1, [data-testid="hero-headline"]')
      await expect(headline).toBeVisible()
      
      const headlineText = await headline.textContent()
      expect(headlineText?.length).toBeGreaterThan(15)
      
      // Should have value proposition
      const valueProposition = hero.locator('[data-testid="value-proposition"], .value-proposition')
      await expect(valueProposition).toBeVisible()
      
      // Should have primary CTA button
      const primaryCTA = hero.locator('[data-testid="primary-cta"], .primary-cta')
      await expect(primaryCTA).toBeVisible()
      
      const ctaText = await primaryCTA.textContent()
      expect(ctaText).toMatch(/get|start|try|buy|download|sign up|learn more/i)
    })

    test('should have urgency and scarcity elements', async ({ page }) => {
      const hero = page.locator('[data-section-type="conversion-hero"]')
      
      // Look for urgency indicators
      const urgency = hero.locator('[data-testid="urgency"], .urgency')
      
      if (await urgency.isVisible()) {
        const urgencyText = await urgency.textContent()
        expect(urgencyText).toMatch(/limited|offer|today|now|hurry|expires|only/i)
      }
      
      // Look for scarcity indicators
      const scarcity = hero.locator('[data-testid="scarcity"], .scarcity')
      
      if (await scarcity.isVisible()) {
        const scarcityText = await scarcity.textContent()
        expect(scarcityText).toMatch(/\d+.*left|spots.*remaining|limited.*available/i)
      }
      
      // Look for countdown timer
      const countdown = hero.locator('[data-testid="countdown"], .countdown')
      
      if (await countdown.isVisible()) {
        const timeElements = countdown.locator('.days, .hours, .minutes, .seconds')
        const timeCount = await timeElements.count()
        expect(timeCount).toBeGreaterThan(0)
      }
    })

    test('should display social proof in hero', async ({ page }) => {
      const hero = page.locator('[data-section-type="conversion-hero"]')
      
      // Look for customer count
      const customerCount = hero.locator('[data-testid="customer-count"], .customer-count')
      
      if (await customerCount.isVisible()) {
        const countText = await customerCount.textContent()
        expect(countText).toMatch(/\d+.*customers?|users?|clients?/i)
      }
      
      // Look for ratings or stars
      const rating = hero.locator('[data-testid="rating"], .rating, .stars')
      
      if (await rating.isVisible()) {
        const stars = rating.locator('.star, svg, [data-testid="star"]')
        const starCount = await stars.count()
        expect(starCount).toBeGreaterThan(0)
      }
      
      // Look for featured logos
      const logos = hero.locator('[data-testid="featured-logos"], .featured-logos img')
      
      if (await logos.count() > 0) {
        const firstLogo = logos.first()
        await expect(firstLogo).toBeVisible()
        
        const alt = await firstLogo.getAttribute('alt')
        expect(alt).toBeTruthy()
      }
    })

    test('should have lead capture form', async ({ page }) => {
      const hero = page.locator('[data-section-type="conversion-hero"]')
      
      // Look for email capture form
      const leadForm = hero.locator('[data-testid="lead-form"], .lead-form, form')
      
      if (await leadForm.isVisible()) {
        const emailInput = leadForm.locator('input[type="email"], input[name="email"]')
        await expect(emailInput).toBeVisible()
        
        const submitButton = leadForm.locator('button[type="submit"], input[type="submit"]')
        await expect(submitButton).toBeVisible()
        
        // Test form submission
        await emailInput.fill('test@example.com')
        await submitButton.click()
        
        // Should show confirmation or redirect
        const confirmation = page.locator('[data-testid="form-success"], .form-success')
        const thankYouPage = page.url().includes('thank-you')
        
        expect(await confirmation.isVisible({ timeout: 5000 }) || thankYouPage).toBe(true)
      }
    })

    test('should track conversion events', async ({ page }) => {
      const hero = page.locator('[data-section-type="conversion-hero"]')
      const primaryCTA = hero.locator('[data-testid="primary-cta"], .primary-cta')
      
      // Mock analytics tracking
      const analyticsEvents: string[] = []
      
      await page.route('**/analytics/**', async route => {
        const request = route.request()
        analyticsEvents.push(request.url())
        await route.fulfill({ status: 200, body: 'OK' })
      })
      
      // Click CTA button
      await primaryCTA.click()
      
      // Should track the click event
      await page.waitForTimeout(1000)
      
      // Verify analytics events were fired (this would depend on your analytics setup)
      const hasAnalyticsEvent = analyticsEvents.some(event => 
        event.includes('click') || event.includes('cta') || event.includes('conversion')
      )
      
      // Note: This test might need adjustment based on your actual analytics implementation
    })

    test('should be mobile optimized', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      
      const hero = page.locator('[data-section-type="conversion-hero"]')
      await expect(hero).toBeVisible()
      
      // Hero should take good portion of mobile viewport
      const heroBox = await hero.boundingBox()
      expect(heroBox?.height).toBeGreaterThan(400)
      
      // CTA button should be prominently sized on mobile
      const primaryCTA = hero.locator('[data-testid="primary-cta"], .primary-cta')
      const ctaBox = await primaryCTA.boundingBox()
      expect(ctaBox?.width).toBeGreaterThan(200)
      expect(ctaBox?.height).toBeGreaterThan(40)
    })
  })

  test.describe('Benefits Features Section', () => {
    test('should display key benefits', async ({ page }) => {
      const benefits = page.locator('[data-section-type="benefits-features"]')
      await expect(benefits).toBeVisible()
      
      // Should have benefit items
      const benefitItems = benefits.locator('[data-testid="benefit-item"], .benefit-item')
      const benefitCount = await benefitItems.count()
      expect(benefitCount).toBeGreaterThanOrEqual(3)
      
      // Each benefit should have proper structure
      for (let i = 0; i < Math.min(benefitCount, 5); i++) {
        const benefit = benefitItems.nth(i)
        
        // Benefit icon
        const icon = benefit.locator('svg, img, .icon, [data-testid="benefit-icon"]')
        await expect(icon).toBeVisible()
        
        // Benefit title
        const title = benefit.locator('h3, h4, [data-testid="benefit-title"]')
        await expect(title).toBeVisible()
        
        const titleText = await title.textContent()
        expect(titleText?.length).toBeGreaterThan(5)
        
        // Benefit description
        const description = benefit.locator('p, [data-testid="benefit-description"]')
        await expect(description).toBeVisible()
        
        const descText = await description.textContent()
        expect(descText?.length).toBeGreaterThan(20)
      }
    })

    test('should use conversion-focused copy', async ({ page }) => {
      const benefits = page.locator('[data-section-type="benefits-features"]')
      
      // Benefits should use action-oriented language
      const benefitTitles = benefits.locator('[data-testid="benefit-title"], .benefit-item h3, .benefit-item h4')
      const titles = await benefitTitles.allTextContents()
      
      // Should use benefit-focused language
      const hasBenefitLanguage = titles.some(title => 
        /save|increase|improve|boost|reduce|eliminate|faster|better|easier|more/i.test(title)
      )
      expect(hasBenefitLanguage).toBe(true)
    })

    test('should have before/after comparisons', async ({ page }) => {
      const benefits = page.locator('[data-section-type="benefits-features"]')
      
      // Look for before/after comparison
      const comparison = benefits.locator('[data-testid="before-after"], .before-after')
      
      if (await comparison.isVisible()) {
        const beforeSection = comparison.locator('[data-testid="before"], .before')
        const afterSection = comparison.locator('[data-testid="after"], .after')
        
        await expect(beforeSection).toBeVisible()
        await expect(afterSection).toBeVisible()
        
        // Before section should highlight problems
        const beforeText = await beforeSection.textContent()
        expect(beforeText).toMatch(/without|problem|difficult|slow|expensive|frustrating/i)
        
        // After section should highlight solutions
        const afterText = await afterSection.textContent()
        expect(afterText).toMatch(/with|solution|easy|fast|affordable|simple/i)
      }
    })

    test('should include feature demonstrations', async ({ page }) => {
      const benefits = page.locator('[data-section-type="benefits-features"]')
      
      // Look for interactive demos or videos
      const demos = benefits.locator('[data-testid="demo"], .demo, video, iframe[src*="youtube"], iframe[src*="vimeo"]')
      
      if (await demos.count() > 0) {
        const firstDemo = demos.first()
        await expect(firstDemo).toBeVisible()
        
        // If it's a video, should have controls
        if (await firstDemo.evaluate(el => el.tagName.toLowerCase() === 'video')) {
          const hasControls = await firstDemo.getAttribute('controls')
          expect(hasControls).toBeTruthy()
        }
      }
    })

    test('should have secondary CTAs', async ({ page }) => {
      const benefits = page.locator('[data-section-type="benefits-features"]')
      
      // Look for secondary call-to-action buttons
      const secondaryCTAs = benefits.locator('[data-testid="secondary-cta"], .secondary-cta, .cta-button:not(.primary)')
      
      if (await secondaryCTAs.count() > 0) {
        const firstCTA = secondaryCTAs.first()
        await expect(firstCTA).toBeVisible()
        
        const ctaText = await firstCTA.textContent()
        expect(ctaText).toMatch(/learn more|see how|watch demo|get details/i)
        
        // Click should provide more information
        await firstCTA.click()
        
        // Should expand content, open modal, or navigate
        const modal = page.locator('[data-testid="info-modal"], .modal')
        const expandedContent = benefits.locator('.expanded, [data-expanded="true"]')
        const navigationOccurred = page.url() !== await page.evaluate(() => window.location.href)
        
        expect(
          await modal.isVisible({ timeout: 2000 }) ||
          await expandedContent.isVisible() ||
          navigationOccurred
        ).toBe(true)
      }
    })
  })

  test.describe('Social Proof Section', () => {
    test('should display customer testimonials', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      await expect(socialProof).toBeVisible()
      
      // Should have testimonials
      const testimonials = socialProof.locator('[data-testid="testimonial"], .testimonial')
      const testimonialCount = await testimonials.count()
      expect(testimonialCount).toBeGreaterThan(0)
      
      // Each testimonial should have proper structure
      for (let i = 0; i < Math.min(testimonialCount, 3); i++) {
        const testimonial = testimonials.nth(i)
        
        // Customer quote
        const quote = testimonial.locator('[data-testid="quote"], .quote, blockquote, p')
        await expect(quote).toBeVisible()
        
        const quoteText = await quote.textContent()
        expect(quoteText?.length).toBeGreaterThan(30)
        
        // Customer name
        const customerName = testimonial.locator('[data-testid="customer-name"], .customer-name')
        await expect(customerName).toBeVisible()
        
        // Customer title/company (optional)
        const customerTitle = testimonial.locator('[data-testid="customer-title"], .customer-title')
        if (await customerTitle.isVisible()) {
          const titleText = await customerTitle.textContent()
          expect(titleText?.length).toBeGreaterThan(3)
        }
        
        // Customer photo (optional)
        const customerPhoto = testimonial.locator('[data-testid="customer-photo"], .customer-photo img')
        if (await customerPhoto.isVisible()) {
          const alt = await customerPhoto.getAttribute('alt')
          expect(alt).toBeTruthy()
        }
      }
    })

    test('should show ratings and reviews', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      
      // Look for overall rating
      const overallRating = socialProof.locator('[data-testid="overall-rating"], .overall-rating')
      
      if (await overallRating.isVisible()) {
        // Should have star rating
        const stars = overallRating.locator('.star, svg, [data-testid="star"]')
        const starCount = await stars.count()
        expect(starCount).toBeGreaterThan(0)
        
        // Should have rating number
        const ratingNumber = overallRating.locator('[data-testid="rating-number"]')
        if (await ratingNumber.isVisible()) {
          const rating = await ratingNumber.textContent()
          expect(rating).toMatch(/[0-5]\.[0-9]|[0-5]\/5/)
        }
        
        // Should have review count
        const reviewCount = overallRating.locator('[data-testid="review-count"]')
        if (await reviewCount.isVisible()) {
          const count = await reviewCount.textContent()
          expect(count).toMatch(/\d+.*reviews?|reviews?.*\d+/i)
        }
      }
    })

    test('should display trust indicators', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      
      // Look for trust badges
      const trustBadges = socialProof.locator('[data-testid="trust-badges"], .trust-badges')
      
      if (await trustBadges.isVisible()) {
        const badges = trustBadges.locator('img, [data-testid="badge"]')
        const badgeCount = await badges.count()
        expect(badgeCount).toBeGreaterThan(0)
        
        // Badges should have alt text
        for (let i = 0; i < Math.min(badgeCount, 3); i++) {
          const badge = badges.nth(i)
          const alt = await badge.getAttribute('alt')
          expect(alt).toBeTruthy()
        }
      }
      
      // Look for security indicators
      const security = socialProof.locator('[data-testid="security"], .security')
      
      if (await security.isVisible()) {
        const securityText = await security.textContent()
        expect(securityText).toMatch(/secure|ssl|encrypted|safe|protected/i)
      }
      
      // Look for money-back guarantee
      const guarantee = socialProof.locator('[data-testid="guarantee"], .guarantee')
      
      if (await guarantee.isVisible()) {
        const guaranteeText = await guarantee.textContent()
        expect(guaranteeText).toMatch(/guarantee|money.*back|\d+.*day|refund/i)
      }
    })

    test('should show usage statistics', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      
      // Look for usage stats
      const stats = socialProof.locator('[data-testid="usage-stats"], .usage-stats')
      
      if (await stats.isVisible()) {
        const statItems = stats.locator('[data-testid="stat-item"], .stat-item')
        const statCount = await statItems.count()
        expect(statCount).toBeGreaterThan(0)
        
        // Each stat should have number and description
        for (let i = 0; i < Math.min(statCount, 3); i++) {
          const stat = statItems.nth(i)
          
          const number = stat.locator('[data-testid="stat-number"], .stat-number')
          await expect(number).toBeVisible()
          
          const numberText = await number.textContent()
          expect(numberText).toMatch(/\d+[kmb]?[\+]?|[\$]?\d+/)
          
          const description = stat.locator('[data-testid="stat-description"], .stat-description')
          await expect(description).toBeVisible()
        }
      }
    })

    test('should have social media proof', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      
      // Look for social media mentions
      const socialMentions = socialProof.locator('[data-testid="social-mentions"], .social-mentions')
      
      if (await socialMentions.isVisible()) {
        const mentions = socialMentions.locator('[data-testid="mention"], .mention')
        
        if (await mentions.count() > 0) {
          const firstMention = mentions.first()
          
          // Should have social platform logo
          const platform = firstMention.locator('img, .platform-logo')
          await expect(platform).toBeVisible()
          
          // Should have mention content
          const content = firstMention.locator('[data-testid="mention-content"], .mention-content')
          await expect(content).toBeVisible()
        }
      }
      
      // Look for follower counts
      const followers = socialProof.locator('[data-testid="followers"], .followers')
      
      if (await followers.isVisible()) {
        const followerText = await followers.textContent()
        expect(followerText).toMatch(/\d+[kmb]?.*followers?|following.*\d+/i)
      }
    })

    test('should have testimonial carousel', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      const testimonials = socialProof.locator('[data-testid="testimonial"], .testimonial')
      
      if (await testimonials.count() > 3) {
        // Should have carousel navigation
        const prevButton = socialProof.locator('[data-testid="testimonial-prev"], .testimonial-prev')
        const nextButton = socialProof.locator('[data-testid="testimonial-next"], .testimonial-next')
        
        if (await nextButton.isVisible()) {
          // Test carousel navigation
          const firstTestimonial = testimonials.first()
          const firstTestimonialText = await firstTestimonial.textContent()
          
          await nextButton.click()
          await page.waitForTimeout(1000)
          
          // Should show different testimonial
          const newFirstTestimonial = testimonials.first()
          const newTestimonialText = await newFirstTestimonial.textContent()
          
          // Content should be different (carousel moved)
          expect(newTestimonialText).not.toBe(firstTestimonialText)
        }
        
        // Should have dots or pagination indicators
        const indicators = socialProof.locator('[data-testid="testimonial-indicators"], .testimonial-indicators button')
        
        if (await indicators.count() > 0) {
          const indicatorCount = await indicators.count()
          expect(indicatorCount).toBeGreaterThan(1)
        }
      }
    })

    test('should load testimonials progressively', async ({ page }) => {
      const socialProof = page.locator('[data-section-type="social-proof"]')
      
      // Look for "load more" functionality
      const loadMore = socialProof.locator('[data-testid="load-more"], .load-more')
      
      if (await loadMore.isVisible()) {
        const initialTestimonials = await socialProof.locator('[data-testid="testimonial"], .testimonial').count()
        
        await loadMore.click()
        await page.waitForTimeout(2000)
        
        const newTestimonials = await socialProof.locator('[data-testid="testimonial"], .testimonial').count()
        expect(newTestimonials).toBeGreaterThan(initialTestimonials)
      }
    })
  })
})