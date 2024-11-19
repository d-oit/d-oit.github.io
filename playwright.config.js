const { defineConfig, devices } = require('@playwright/test');
import dotenv from 'dotenv';
import path from 'path';

// Read from ".env" file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Use the environment variable for the base URL
const baseURL = process.env.BASE_URL_TESTING || 'http://localhost:1313';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
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
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
  webServer: {
    ignoreHTTPSErrors: true,
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: process.env.REUSE_SERVER === 'true',
  },
  // Add Playwright test configuration for the new zoom in/out functionality
  testMatch: '**/tests/**/zoom*.spec.js',
});
