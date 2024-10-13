import { test, expect } from '@playwright/test';

test('showCustom404', async ({ page }) => {
  await page.goto('/en/fdaffa');
  var element = await page.$('#fa-face-frown');
  expect(element).not.toBeNull();
  await page.goto('/');
  element = await page.$('#fa-face-frown');
  expect(element).toBeNull();
});
