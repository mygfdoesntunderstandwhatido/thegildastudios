import { test, expect, type Page } from '@playwright/test';

declare global {
  interface Window {
    labShifts: { value: number; recent: boolean }[];
  }
}

async function observeShifts(page: Page) {
  await page.addInitScript(() => {
    window.labShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        window.labShifts.push({ value: shift.value, recent: shift.hadRecentInput });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
}

async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
    await Promise.all(
      [...document.images].filter((img) => img.complete).map((img) => img.decode().catch(() => {})),
    );
  });
}

for (const width of [390, 1280]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const path of [
      '/',
      '/about/',
      '/services/',
      '/projects/',
      '/projects/cs-butcher/',
      '/contact/',
    ]) {
      test(`${path} reserves media space and loads without layout shift`, async ({ page }) => {
        await observeShifts(page);
        await page.goto(path);
        await settle(page);
        const images = await page.locator('img').evaluateAll((elements) =>
          elements.map((img) => ({
            intrinsicWidth: img.getAttribute('width'),
            intrinsicHeight: img.getAttribute('height'),
          })),
        );
        expect(
          images.every((img) => Number(img.intrinsicWidth) > 0 && Number(img.intrinsicHeight) > 0),
        ).toBe(true);
        expect(
          await page.evaluate(() =>
            window.labShifts
              .filter((shift) => !shift.recent)
              .reduce((sum, shift) => sum + shift.value, 0),
          ),
        ).toBe(0);
      });
    }

    test('hero overlays load on first use and quotes fit their active text', async ({ page }) => {
      const overlayRequests: string[] = [];
      page.on('request', (request) => {
        if (/mark-piece-[012]/.test(request.url())) overlayRequests.push(request.url());
      });
      await page.goto('/');
      await settle(page);
      expect(overlayRequests).toEqual([]);
      const mark = page.locator('gilda-hero-mark');
      const markBox = () =>
        mark.evaluate((element) => {
          const rect = element.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
            top: rect.top + scrollY,
            left: rect.left + scrollX,
          };
        });
      const markBefore = await markBox();
      for (const piece of [0, 1, 2]) {
        // Measure image layout independently of the browser scrolling a clipped
        // focus target into view (keyboard navigation is covered by #29).
        await mark
          .locator(`[data-control="${piece}"]`)
          .evaluate((element: HTMLElement) => element.focus({ preventScroll: true }));
        const image = mark.locator(`[data-piece="${piece}"] img`);
        await expect(image).toHaveCount(1);
        await expect
          .poll(() =>
            image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
          )
          .toBe(true);
        expect(await markBox()).toEqual(markBefore);
      }
      expect(overlayRequests).toHaveLength(3);
      const rotator = page.locator('gilda-testimonial-rotator');
      const slides = rotator.locator('.slides');
      await slides.scrollIntoViewIfNeeded();
      await settle(page);
      const heights = [];
      for (const dot of await rotator.locator('[data-dot]').all()) {
        await dot.click();
        const height = (await slides.boundingBox())!.height;
        const active = rotator.locator('[data-slide][data-active]');
        expect((await active.boundingBox())!.height).toBeCloseTo(height, 0);
        expect((await active.locator('figure').boundingBox())!.height).toBeCloseTo(height, 0);
        heights.push(height);
      }
      expect(new Set(heights).size).toBeGreaterThan(1);
    });

    test('filter and disclosure controls keep stable anchors', async ({ page }) => {
      await page.goto('/projects/');
      await settle(page);
      const filters = page.locator('.filters');
      await filters.scrollIntoViewIfNeeded();
      const before = await filters.evaluate((element) => ({
        top: element.getBoundingClientRect().top + scrollY,
        height: element.getBoundingClientRect().height,
      }));
      for (const button of await filters.locator('button').all()) {
        await button.click();
        expect(
          await filters.evaluate((element) => ({
            top: element.getBoundingClientRect().top + scrollY,
            height: element.getBoundingClientRect().height,
          })),
        ).toEqual(before);
      }
      await page.goto('/services/');
      await settle(page);
      const trigger = page.locator('gilda-disclosure .trigger').first();
      await trigger.scrollIntoViewIfNeeded();
      const top = await trigger.evaluate(
        (element) => element.getBoundingClientRect().top + scrollY,
      );
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(
        await trigger.evaluate((element) => element.getBoundingClientRect().top + scrollY),
      ).toBe(top);
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });
}

test('mobile menu overlays the page and preserves the document height', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  await settle(page);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('dialog')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
});

test('production cache rules and compression apply to served output', async ({ request }) => {
  const home = await request.get('/');
  expect(home.headers()['cache-control']).toBe('public, max-age=0, must-revalidate');
  expect(home.headers()['content-encoding']).toBe('gzip');
  const font = await request.get('/fonts/gilda-display-400.woff2');
  expect(font.headers()['cache-control']).toBe('public, max-age=604800');
  const html = await home.text();
  const asset = html.match(/src="(\/_astro\/[^"]+\.js)"/)?.[1];
  expect(asset).toBeTruthy();
  const response = await request.get(asset!);
  expect(response.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  expect((await request.get('/a-missing-url/')).status()).toBe(404);
});
