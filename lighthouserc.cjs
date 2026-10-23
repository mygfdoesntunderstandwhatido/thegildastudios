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

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run serve:performance',
      startServerReadyPattern: 'Performance server ready',
      url: [
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/about/',
        'http://127.0.0.1:4173/services/',
        'http://127.0.0.1:4173/projects/',
        'http://127.0.0.1:4173/projects/cs-butcher/',
        'http://127.0.0.1:4173/contact/',
      ],
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
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci/reports',
    },
  },
};
