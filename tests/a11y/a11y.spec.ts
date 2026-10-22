import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

// WCAG 2.2 AA checks for #29. They run against the production build, like the
// performance checks, and every one must pass in CI.

declare global {
  interface Window {
    axe: { run: (context: Document, options: object) => Promise<AxeResults> };
    colour: {
      contrast: (a: string, b: string) => number;
      background: (element: Element | null) => string;
    };
  }
}

interface AxeResults {
  violations: { id: string; impact: string; help: string; nodes: { target: string[] }[] }[];
}

const axeSource = readFileSync(
  createRequire(import.meta.url).resolve('axe-core/axe.min.js'),
  'utf8',
);

const PAGES = [
  '/',
  '/about/',
  '/services/',
  '/projects/',
  '/projects/cs-butcher/',
  '/projects/drapp-fuq-drapp/',
  '/projects/malta-business-network/',
  '/contact/',
  '/contact/thanks/',
  '/404.html',
];

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

async function axe(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(
    (tags) => window.axe.run(document, { runOnly: tags }),
    AXE_TAGS,
  );
  return results.violations.map(
    (violation) =>
      `[${violation.impact}] ${violation.id}: ${violation.help} — ${violation.nodes
        .map((node) => node.target.join(' '))
        .join(', ')}`,
  );
}

// WCAG contrast between two computed rgb() colours, and the first opaque
// background behind an element. Installed in every page before it loads.
const COLOUR_HELPERS = `
  const channels = (colour) => colour.match(/[\\d.]+/g).slice(0, 3).map(Number);
  const luminance = (colour) => {
    const [r, g, b] = channels(colour).map((value) => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a, b) => {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
  };
  const background = (element) => {
    for (let node = element; node; node = node.parentElement) {
      const colour = getComputedStyle(node).backgroundColor;
      if (colour !== 'transparent' && !/rgba\\(.*, 0\\)$/.test(colour)) return colour;
    }
    return 'rgb(243, 238, 226)';
  };
  window.colour = { contrast, background };
`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(COLOUR_HELPERS);
});

for (const width of [390, 1280]) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const path of PAGES) {
      test(`${path} has no axe violations, one h1 and the main landmarks`, async ({ page }) => {
        await page.goto(path);
        expect(await axe(page)).toEqual([]);
        expect(await page.locator('h1').count()).toBe(1);
        expect(await page.locator('main#main').count()).toBe(1);
        expect(await page.locator('footer').count()).toBeGreaterThan(0);
      });

      // Brand rule: pepper is never text on Cream or Sand (or the other light grounds).
      test(`${path} never sets pepper text on a light ground`, async ({ page }) => {
        await page.goto(path);
        const offenders = await page.evaluate(() => {
          const { background } = window.colour;
          const PEPPER = 'rgb(184, 188, 50)';
          const LIGHT = [
            'rgb(243, 238, 226)', // cream
            'rgb(233, 226, 208)', // sand
            'rgb(251, 249, 244)', // paper
            'rgb(230, 229, 180)', // pepper pale
          ];
          return [...document.querySelectorAll<HTMLElement>('body *')]
            .filter((element) =>
              [...element.childNodes].some(
                (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
              ),
            )
            .filter((element) => getComputedStyle(element).color === PEPPER)
            .filter((element) => LIGHT.includes(background(element)))
            .map((element) => `${element.tagName} "${element.textContent?.trim().slice(0, 30)}"`);
        });
        expect(offenders).toEqual([]);
      });

      test(`${path} shows a focus ring with 3:1 contrast on every tab stop`, async ({ page }) => {
        await page.goto(path);
        const stops: string[] = [];
        const failures: string[] = [];
        for (let step = 0; step < 150; step += 1) {
          await page.keyboard.press('Tab');
          const stop = await page.evaluate(() => {
            const { background, contrast } = window.colour;
            const element = document.activeElement as HTMLElement | null;
            if (!element || element === document.body) return null;
            const name = `${element.tagName.toLowerCase()} "${(
              element.getAttribute('aria-label') ||
              element.textContent ||
              (element as HTMLInputElement).name ||
              ''
            )
              .trim()
              .slice(0, 30)}"`;
            // The hero mark's controls draw their ring as an SVG outline of the piece.
            if (element.matches('[data-control]')) {
              const outline = element
                .closest('gilda-hero-mark')
                ?.querySelector(`[data-outline="${element.dataset.control}"]`);
              const visible = !!outline && getComputedStyle(outline).visibility === 'visible';
              return { name, ok: visible, ratio: visible ? 99 : 0 };
            }
            // Checkboxes and radios ring their pill label.
            const ringed = element.matches('.choice input')
              ? (element.closest('.choice') as HTMLElement)
              : element;
            const style = getComputedStyle(ringed);
            const drawn = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2;
            const ratio = drawn
              ? contrast(style.outlineColor, background(ringed.parentElement))
              : 0;
            return { name, ok: drawn && ratio >= 3, ratio: Math.round(ratio * 100) / 100 };
          });
          if (!stop) break;
          if (stops[0] === stop.name && stops.length > 1) break;
          stops.push(stop.name);
          if (!stop.ok) failures.push(`${stop.name} (${stop.ratio}:1)`);
        }
        expect(stops.length).toBeGreaterThan(3);
        expect(failures).toEqual([]);
      });
    }
  });
}

test.describe('hover states', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  // Hover is a state the text is read in too: it must keep AA contrast.
  for (const path of ['/', '/services/', '/projects/', '/contact/']) {
    test(`${path} keeps AA text contrast while each control is hovered`, async ({ page }) => {
      test.setTimeout(120_000);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      await page.addScriptTag({ content: axeSource });
      // The skip link only shows on focus, and pointers reach the hero mark
      // through its hit map rather than its keyboard controls.
      const controls = page.locator(
        ':is(a[href], button, label.choice):not(.skip-link, [data-control])',
      );
      const failures: string[] = [];
      for (let index = 0; index < (await controls.count()); index += 1) {
        const control = controls.nth(index);
        if (!(await control.isVisible())) continue;
        await control.hover();
        const messages = await control.evaluate(async (element) => {
          const result = await window.axe.run(element as unknown as Document, {
            runOnly: ['color-contrast'],
          });
          return result.violations.map((violation) => violation.id);
        });
        if (messages.length) failures.push((await control.textContent())?.trim() ?? '');
      }
      expect(failures).toEqual([]);
    });
  }
});

test.describe('reflow and motion', () => {
  for (const path of PAGES) {
    test(`${path} reflows at 320px without horizontal scrolling`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        320,
      );
    });

    test(`${path} has no transitions or animations with reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(path);
      const moving = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('*')]
          .filter((element) => {
            const style = getComputedStyle(element);
            const transitions = style.transitionDuration.split(',').some((d) => parseFloat(d) > 0);
            const animated =
              style.animationName !== 'none' && parseFloat(style.animationDuration) > 0;
            return transitions || animated;
          })
          .map((element) => `${element.tagName.toLowerCase()}.${element.className}`),
      );
      expect(moving).toEqual([]);
    });
  }
});

test.describe('keyboard paths', () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test('hero mark pieces light on focus, toggle with Enter and Space and sync the strip', async ({
    page,
  }) => {
    await page.goto('/');
    const controls = page.locator('[data-control]');
    await expect(controls).toHaveCount(3);
    await controls.first().focus();
    await expect(page.locator('gilda-hero-mark')).toHaveAttribute('data-active', '0');
    await expect(page.locator('.strip-item').first()).toHaveAttribute('data-on', '');
    // Focus lights the piece, as hover does, so it already reads as pressed.
    await expect(controls.first()).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Enter');
    await expect(controls.first()).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('gilda-hero-mark')).not.toHaveAttribute('data-active', /.*/);
    await page.keyboard.press('Space');
    await expect(controls.first()).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Tab');
    await expect(controls.nth(1)).toBeFocused();
    await expect(page.locator('gilda-hero-mark')).toHaveAttribute('data-active', '1');
  });

  test('branch strip links light the matching mark piece on focus', async ({ page }) => {
    await page.goto('/');
    const items = page.locator('.strip-item');
    await items.nth(2).focus();
    await expect(page.locator('gilda-hero-mark')).toHaveAttribute('data-active', '2');
    await page.keyboard.press('Tab');
    await expect(page.locator('gilda-hero-mark')).not.toHaveAttribute('data-active', /.*/);
  });

  test('rotator dots and pause respond to the keyboard and announce changes', async ({ page }) => {
    await page.goto('/');
    const dots = page.locator('[data-dot]');
    await dots.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
    await expect(page.locator('gilda-testimonial-rotator [data-status]')).toHaveText(
      (await dots.nth(1).getAttribute('aria-label')) ?? '',
    );
    const playback = page.locator('[data-playback]');
    await expect(playback).toBeVisible();
    const pauseLabel = await playback.getAttribute('aria-label');
    await playback.focus();
    await page.keyboard.press('Enter');
    await expect(playback).not.toHaveAttribute('aria-label', pauseLabel ?? '');
  });

  test('rotator never autoplays with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('[data-playback]')).toBeHidden();
  });

  test('disclosures expand and collapse with the keyboard', async ({ page }) => {
    await page.goto('/services/');
    const trigger = page.locator('gilda-disclosure .trigger').first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator(`#${await trigger.getAttribute('aria-controls')}`);
    await expect(panel).toBeVisible();
    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('case study pillars open with the keyboard', async ({ page }) => {
    await page.goto('/projects/cs-butcher/');
    const trigger = page.locator('.pillar-trigger').first();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator(`#${await trigger.getAttribute('aria-controls')}`)).toBeVisible();
  });

  test('project filters press with the keyboard and announce the count', async ({ page }) => {
    await page.goto('/projects/');
    const chips = page.locator('.filters button');
    await chips.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(chips.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(chips.first()).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('gilda-project-filter [data-status]')).not.toBeEmpty();
  });

  test('contact form reports errors and moves focus to the first one', async ({ page }) => {
    await page.goto('/contact/');
    const submit = page.locator('button[type="submit"]');
    await submit.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contact-name')).toBeFocused();
    await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-name-error')).not.toBeEmpty();
    await expect(page.locator('[data-summary]')).not.toBeEmpty();
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, traps focus, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/about/');
    const toggle = page.locator('[data-menu-toggle]');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const dialog = page.locator('dialog[open]');
    await expect(dialog).toBeVisible();
    expect(await axe(page)).toEqual([]);
    for (let step = 0; step < 20; step += 1) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      );
    }
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

test('skip link is the first tab stop and moves past the header', async ({ page }) => {
  for (const path of ['/', '/about/']) {
    await page.goto(path);
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link').first();
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('.site-header, header.strip')),
    ).toBe(false);
  }
});
