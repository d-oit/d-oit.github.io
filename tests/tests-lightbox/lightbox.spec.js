import { test, expect } from '@playwright/test';

test.describe('Lightbox Zoom Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('img.lightbox');
  });

  test('should zoom in the image', async ({ page }) => {
    const initialTransform = await page.$eval('.lightbox-image', el => el.style.transform);
    await page.click('.zoom-in-button');
    const newTransform = await page.$eval('.lightbox-image', el => el.style.transform);
    expect(newTransform).not.toBe(initialTransform);
  });

  test('should zoom out the image', async ({ page }) => {
    await page.click('.zoom-in-button'); // Zoom in first to ensure we can zoom out
    const initialTransform = await page.$eval('.lightbox-image', el => el.style.transform);
    await page.click('.zoom-out-button');
    const newTransform = await page.$eval('.lightbox-image', el => el.style.transform);
    expect(newTransform).not.toBe(initialTransform);
  });

  test('should not exceed maximum zoom level', async ({ page }) => {
    for (let i = 0; i < 30; i++) {
      await page.click('.zoom-in-button');
    }
    const transform = await page.$eval('.lightbox-image', el => el.style.transform);
    expect(transform).toBe('scale(3)');
  });

  test('should not go below minimum zoom level', async ({ page }) => {
    for (let i = 0; i < 30; i++) {
      await page.click('.zoom-out-button');
    }
    const transform = await page.$eval('.lightbox-image', el => el.style.transform);
    expect(transform).toBe('scale(0.5)');
  });

  test('should have initial zoom level of 1x', async ({ page }) => {
    const transform = await page.$eval('.lightbox-image', el => el.style.transform);
    expect(transform).toBe('scale(1)');
  });

  test('should navigate using image thumbnails', async ({ page }) => {
    await page.click('.thumbnail-strip img:nth-child(2)');
    const newImageSrc = await page.$eval('.lightbox-image', el => el.src);
    expect(newImageSrc).not.toBe('');
  });

  test('should navigate using left and right arrow keys', async ({ page }) => {
    await page.keyboard.press('ArrowRight');
    const newImageSrcRight = await page.$eval('.lightbox-image', el => el.src);
    expect(newImageSrcRight).not.toBe('');

    await page.keyboard.press('ArrowLeft');
    const newImageSrcLeft = await page.$eval('.lightbox-image', el => el.src);
    expect(newImageSrcLeft).not.toBe('');
  });
});
