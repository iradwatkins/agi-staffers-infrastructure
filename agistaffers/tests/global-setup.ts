import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Setup test database
  console.log('Setting up test database...')
  
  // Create test data
  await page.goto('http://localhost:3000/api/test/setup')
  
  // Wait for setup to complete
  await page.waitForTimeout(5000)
  
  // Verify setup
  const response = await page.request.get('http://localhost:3000/api/test/health')
  if (!response.ok()) {
    throw new Error('Test setup failed')
  }

  await browser.close()
  
  console.log('Global setup completed successfully')
}

export default globalSetup