import { test, expect, type Page } from '@playwright/test';

async function openForm(page: Page) {
  // A deterministic widget stub, not evidence of Cloudflare's live challenge UI.
  await page.route('https://challenges.cloudflare.com/**', async (route) => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `
      const widget = document.querySelector('.cf-turnstile');
      const token = document.createElement('input');
      token.type = 'hidden'; token.name = 'cf-turnstile-response'; token.value = 'test-token';
      widget.append(token);
      window.turnstile = { reset() { token.value = 'fresh-token'; window.resets = (window.resets || 0) + 1; } };
    `,
    });
  });
  await page.goto('/contact/?service=01.2');
  await page.waitForFunction(() => customElements.get('gilda-contact-form'));
  await expect(page.locator('[name="cf-turnstile-response"]')).toHaveValue('test-token');
  await page.locator('#contact-name').fill('Zoë Example');
  await page.locator('#contact-email').fill('zoe@example.com');
  await page.locator('#contact-message').fill('A & B + café');
  await page.evaluate(() => {
    (window as Window & { conversions?: number }).conversions = 0;
    document.addEventListener('gilda:form-submitted', () => {
      const state = window as Window & { conversions?: number };
      state.conversions = (state.conversions ?? 0) + 1;
    });
  });
}

test('HTTP and network errors preserve values, refresh token and permit retry; acceptance records once', async ({
  page,
}) => {
  await openForm(page);
  let attempt = 0;
  await page.route('**/api/contact', async (route) => {
    attempt++;
    const body = new URLSearchParams(route.request().postData() ?? '');
    expect(body.get('message')).toBe('A & B + café');
    expect(body.get('service')).toBe('01.2');
    expect(body.get('branch')).toBe('plan');
    if (attempt === 1) return route.fulfill({ status: 503 });
    if (attempt === 2) return route.abort();
    expect(body.get('cf-turnstile-response')).toBe('fresh-token');
    return route.fulfill({ json: { accepted: true } });
  });
  const submit = page.locator('[data-form] button[type=submit]');
  for (let index = 0; index < 2; index++) {
    await submit.click();
    await expect(page.locator('[data-submission-error]')).toBeVisible();
    await expect(page.locator('#contact-name')).toHaveValue('Zoë Example');
    await expect(submit).toBeEnabled();
    expect(
      await page.evaluate(() => (window as Window & { conversions?: number }).conversions),
    ).toBe(0);
  }
  await submit.click();
  await expect(page.locator('[data-success]')).toBeVisible();
  expect(await page.evaluate(() => (window as Window & { conversions?: number }).conversions)).toBe(
    1,
  );
  expect(attempt).toBe(3);
});

test('missing verification and invalid fields do not post; silent discard does not count as a conversion', async ({
  page,
}) => {
  await openForm(page);
  let posts = 0;
  await page.route('**/api/contact', async (route) => {
    posts++;
    await route.fulfill({ json: { accepted: false } });
  });
  const submit = page.locator('[data-form] button[type=submit]');
  await page.locator('#contact-name').fill('');
  await submit.click();
  await expect(page.locator('#contact-name')).toBeFocused();
  await page.locator('#contact-name').fill('Zoë');
  await page.locator('[name="cf-turnstile-response"]').evaluate((input: HTMLInputElement) => {
    input.value = '';
  });
  await submit.click();
  await expect(page.locator('[data-summary]')).toContainText('verification');
  expect(posts).toBe(0);
  await page.locator('[name="cf-turnstile-response"]').evaluate((input: HTMLInputElement) => {
    input.value = 'token';
  });
  await submit.click();
  await expect(page.locator('[data-success]')).toBeVisible();
  expect(posts).toBe(1);
  expect(await page.evaluate(() => (window as Window & { conversions?: number }).conversions)).toBe(
    0,
  );
});

for (const width of [390, 1280]) {
  test(`contact reflows with verification container at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openForm(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `test-results/contact-${width}.png`, fullPage: true });
  });
}

test('no-JavaScript visitors see the email fallback', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/contact/');
  await expect(page.locator('noscript p')).toContainText('email hello@thegildastudios.com');
  await expect(page.locator('[data-form]')).toHaveAttribute('action', '/api/contact');
  await context.close();
});
