import { test, expect, type Page } from '@playwright/test';

for (const width of [375, 390]) {
  test.describe(`${width}px project images`, () => {
    test.use({ viewport: { width, height: 844 } });

    for (const path of [
      '/projects/',
      '/projects/cs-butcher/',
      '/projects/drapp-fuq-drapp/',
      '/projects/malta-business-network/',
    ]) {
      test(`${path} displays the complete uploaded images`, async ({ page }) => {
        await page.goto(path);
        const images = page.locator('.hero-image, .gallery-image, .cover');
        expect(await images.count()).toBeGreaterThan(0);
        for (const image of await images.all()) {
          const ratios = await image.evaluate((element: HTMLImageElement) => ({
            displayed: element.clientWidth / element.clientHeight,
            source: Number(element.getAttribute('width')) / Number(element.getAttribute('height')),
          }));
          expect(ratios.displayed).toBeCloseTo(ratios.source, 1);
        }
      });
    }
  });
}

for (const width of [1280, 1440]) {
  test(`About portraits and their caption rows align at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about/');
    await page.evaluate(() => document.fonts.ready);
    const founders = page.locator('.founder');
    for (const selector of ['.portrait', '.affiliations', 'h3', '.role', '.bio']) {
      const first = (await founders.nth(0).locator(selector).boundingBox())!;
      const second = (await founders.nth(1).locator(selector).boundingBox())!;
      expect(first.y).toBeCloseTo(second.y, 0);
      if (selector === '.portrait') {
        expect(first.width).toBeCloseTo(second.width, 0);
        expect(first.height).toBeCloseTo(second.height, 0);
        expect(first.width).toBeCloseTo((await founders.first().boundingBox())!.width, 0);
      }
    }
  });
}

test('homepage leaves project cards on the Projects page and never rotates automatically', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/');
  await expect(page.locator('#selected-work-title')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'See our work' })).toHaveAttribute(
    'href',
    '/projects/',
  );
  await expect(page.locator('[data-playback]')).toHaveCount(0);
  await page.clock.fastForward(60_000);
  await expect(page.locator('[data-dot]').first()).toHaveAttribute('aria-current', 'true');
  await page.locator('[data-dot]').nth(1).click();
  await page.clock.fastForward(60_000);
  await expect(page.locator('[data-dot]').nth(1)).toHaveAttribute('aria-current', 'true');
});

test.describe('phone gestures', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  async function swipe(page: Page, dx: number, dy = 0) {
    const slides = page.locator('gilda-testimonial-rotator .slides');
    await slides.scrollIntoViewIfNeeded();
    const box = (await slides.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = Math.max(box.y, 0) + 100;
    const client = await page.context().newCDPSession(page);
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x, y }],
    });
    for (let step = 1; step <= 5; step++) {
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x + (dx * step) / 5, y: y + (dy * step) / 5 }],
      });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await client.detach();
  }

  test('swipes in both directions, wraps and announces the active quote', async ({ page }) => {
    await page.goto('/');
    const dots = page.locator('[data-dot]');
    await swipe(page, -100);
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('[data-status]').last()).toHaveText(
      (await dots.nth(1).getAttribute('aria-label'))!,
    );
    await swipe(page, 100);
    await expect(dots.first()).toHaveAttribute('aria-current', 'true');
    await swipe(page, 100);
    await expect(dots.last()).toHaveAttribute('aria-current', 'true');
    await swipe(page, -100);
    await expect(dots.first()).toHaveAttribute('aria-current', 'true');
  });

  test('vertical scrolling and short gestures keep the current quote', async ({ page }) => {
    await page.goto('/');
    await swipe(page, 10, -100);
    await expect(page.locator('[data-dot]').first()).toHaveAttribute('aria-current', 'true');
    await swipe(page, -20);
    await expect(page.locator('[data-dot]').first()).toHaveAttribute('aria-current', 'true');
  });
});

test('all testimonials remain readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  for (const slide of await page.locator('[data-slide]').all()) await expect(slide).toBeVisible();
  await expect(page.locator('.rotator .controls')).toBeHidden();
  await context.close();
});
