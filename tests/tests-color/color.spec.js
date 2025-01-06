import { test, expect } from '@playwright/test'

test('testColorMode', async ({ page }) => {
  await page.goto('/')
  await page.locator('button#themeDropdown').click()
  let mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'))
  await page.locator('button[title="Dark mode"]').click()
  mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'))
  expect(mode).toBe('dark')
  await page.locator('button[title="Light mode"]').click()
  mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'))
  expect(mode).toBe('light')
})
