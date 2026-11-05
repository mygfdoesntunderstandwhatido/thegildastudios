// eslint-disable-next-line @typescript-eslint/no-require-imports -- LHCI reads CommonJS config.
const [budget] = require('./lighthouse-budgets.json');
const resourceAssertions = Object.fromEntries([
  ...budget.resourceSizes.map(({ resourceType, budget: limit }) => [
    `resource-summary:${resourceType}:size`,
    ['error', { maxNumericValue: limit * 1024, aggregationMethod: 'median' }],
  ]),
  ...budget.resourceCounts.map(({ resourceType, budget: limit }) => [
    `resource-summary:${resourceType}:count`,
    ['error', { maxNumericValue: limit, aggregationMethod: 'median' }],
  ]),
]);

// Artwork is lossless (#64) and photographs are lossy AVIF (#90). Keep the
// original limits for other pages; bound each image-heavy page using its
// measured output. About and the case studies carry photographs, so their
// limits came down with #90 (About was 1440 KiB of images, Projects 620).
const imageBudgets = {
  '/': { performance: 0.86, lcpMs: 4300, imageKiB: 800, totalKiB: 960 },
  '/about/': { performance: 0.84, lcpMs: 4400, imageKiB: 800, totalKiB: 960 },
  '/services/': { performance: 0.95, lcpMs: 3000, imageKiB: 320, totalKiB: 480 },
  '/projects/': { performance: 0.95, lcpMs: 2500, imageKiB: 240, totalKiB: 400 },
  '/projects/cs-butcher/': { performance: 0.95, lcpMs: 2800, imageKiB: 240, totalKiB: 400 },
};
const pages = [...Object.keys(imageBudgets), '/contact/'];

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run serve:performance',
      startServerReadyPattern: 'Performance server ready',
      url: pages.map((path) => `http://127.0.0.1:4173${path}`),
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        formFactor: 'mobile',
        // Lighthouse's mobile defaults: simulated Slow 4G and 4x CPU slowdown.
        throttlingMethod: 'simulate',
      },
    },
    assert: {
      assertMatrix: pages.map((path) => ({
        matchingUrlPattern: `^https?://[^/]+${path}$`,
        assertions: {
          'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
          'categories:accessibility': ['error', { minScore: 1, aggregationMethod: 'median' }],
          'categories:best-practices': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
          'categories:seo': ['error', { minScore: 0.95, aggregationMethod: 'median' }],
          'largest-contentful-paint': [
            'error',
            { maxNumericValue: 2500, aggregationMethod: 'median' },
          ],
          'cumulative-layout-shift': ['error', { maxNumericValue: 0, aggregationMethod: 'median' }],
          ...resourceAssertions,
          ...(imageBudgets[path]
            ? {
                'categories:performance': [
                  'error',
                  { minScore: imageBudgets[path].performance, aggregationMethod: 'median' },
                ],
                'largest-contentful-paint': [
                  'error',
                  { maxNumericValue: imageBudgets[path].lcpMs, aggregationMethod: 'median' },
                ],
                'resource-summary:image:size': [
                  'error',
                  {
                    maxNumericValue: imageBudgets[path].imageKiB * 1024,
                    aggregationMethod: 'median',
                  },
                ],
                'resource-summary:total:size': [
                  'error',
                  {
                    maxNumericValue: imageBudgets[path].totalKiB * 1024,
                    aggregationMethod: 'median',
                  },
                ],
              }
            : {}),
        },
      })),
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
};
