import { chromium, FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Cleanup test database
  console.log('Cleaning up test database...')
  
  await page.goto('http://localhost:3000/api/test/cleanup')
  
  // Wait for cleanup to complete
  await page.waitForTimeout(3000)

  await browser.close()
  
  console.log('Global teardown completed successfully')
}

export default globalTeardown