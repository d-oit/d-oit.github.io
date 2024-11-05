import { test, expect } from '@playwright/test';

test('showCustom404', async ({ page }) => {
  // Go to a non-existent page
  await page.goto('/en/fdaffa');
  
  // Check for a custom 404 element
  const element = await page.$('#fa-face-frown');
  expect(element).not.toBeNull();
  
  // Go to the homepage and check the absence of the 404 element
  await page.goto('/');
  const homeElement = await page.$('#fa-face-frown');
  expect(homeElement).toBeNull();
});
