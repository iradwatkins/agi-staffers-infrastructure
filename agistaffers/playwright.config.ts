import { defineConfig, devices } from '@playwright/test'

/**
 * Shopify Theme System - Playwright Configuration
 * Comprehensive testing setup for theme engine, sections, and user journeys
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Custom timeout for theme loading
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    // Tablet testing
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },
  ],

  // Test environment setup
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Global test configurations
  globalSetup: require.resolve('./tests/global-setup.ts'),
  globalTeardown: require.resolve('./tests/global-teardown.ts'),

  // Test output directories
  outputDir: 'test-results',
  
  // Timeout settings for theme tests
  timeout: 60 * 1000, // 60 seconds for complex theme operations
  
  // Expect settings for visual comparisons
  expect: {
    // Visual regression testing
    threshold: 0.2,
    toMatchSnapshot: {
      threshold: 0.3,
      mode: 'pixel'
    }
  }
})