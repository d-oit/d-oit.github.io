import { test, expect } from '@playwright/test';

test('testTOC', async ({ page }) => {
  // Recording...
  await page.goto('/en/blog/free-basketball-live-streams/');
  // check without toc 
  await expect(page.locator(".toc")).toHaveCount(0);
  await page.goto('/en/blog/xiaomi-gallery-app-unnecessary-space-android-phone//');
  await expect(page.locator(".toc")).toHaveCount(1);
  
});