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

// Lossless delivery is the chosen image policy (#64). Keep the original limits
// for other pages; bound each image-heavy page using the measured WebP output.
const imageBudgets = {
  '/': { performance: 0.86, lcpMs: 4300, imageKiB: 800, totalKiB: 960 },
  '/about/': { performance: 0.82, lcpMs: 4800, imageKiB: 1440, totalKiB: 1600 },
  '/services/': { performance: 0.95, lcpMs: 3000, imageKiB: 320, totalKiB: 480 },
  '/projects/': { performance: 0.88, lcpMs: 4000, imageKiB: 620, totalKiB: 760 },
  '/projects/cs-butcher/': { performance: 0.94, lcpMs: 3200, imageKiB: 320, totalKiB: 480 },
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
