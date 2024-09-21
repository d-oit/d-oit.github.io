import { test, expect } from '@playwright/test';

test('testColorMode', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'theme mode dropdown-toogle' }).click();
  var mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
  await page.getByRole('link', { name: 'Dark' }).click();
  mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
  expect(mode).toBe('dark');
  await page.getByRole('link', { name: 'Light' }).click();
  mode = await page.evaluate(() => document.documentElement.getAttribute('data-bs-theme'));
  expect(mode).toBe('light');
});