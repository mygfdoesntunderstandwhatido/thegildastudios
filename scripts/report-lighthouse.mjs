import { readdir, readFile, writeFile } from 'node:fs/promises';

const groups = new Map();
for (const file of await readdir('.lighthouseci')) {
  if (!/^lhr-.*\.json$/.test(file)) continue;
  const report = JSON.parse(await readFile(`.lighthouseci/${file}`, 'utf8'));
  const path = new URL(report.finalUrl).pathname;
  const reports = groups.get(path) || [];
  reports.push(report);
  groups.set(path, reports);
}
const median = (values) => values.toSorted((a, b) => a - b)[Math.floor(values.length / 2)];
const pages = [...groups].map(([path, reports]) => ({
  path,
  runs: reports.length,
  scores: Object.fromEntries(
    ['performance', 'accessibility', 'best-practices', 'seo'].map((category) => [
      category,
      Math.round(median(reports.map((report) => report.categories[category].score)) * 100),
    ]),
  ),
  lcpMs: Math.round(
    median(reports.map((report) => report.audits['largest-contentful-paint'].numericValue)),
  ),
  cls: median(reports.map((report) => report.audits['cumulative-layout-shift'].numericValue)),
  lcpRangeMs: reports.map((report) =>
    Math.round(report.audits['largest-contentful-paint'].numericValue),
  ),
  clsValues: reports.map((report) => report.audits['cumulative-layout-shift'].numericValue),
}));
const first = groups.values().next().value?.[0];
const summary = {
  measuredAt: first?.fetchTime,
  lighthouseVersion: first?.lighthouseVersion,
  userAgent: first?.environment?.hostUserAgent,
  formFactor: first?.configSettings?.formFactor,
  throttlingMethod: first?.configSettings?.throttlingMethod,
  throttling: first?.configSettings?.throttling,
  pages,
};
await writeFile('.lighthouseci/summary.json', `${JSON.stringify(summary, null, 2)}\n`);
console.table(
  pages.map(({ path, runs, scores, lcpMs, cls }) => ({ path, runs, ...scores, lcpMs, cls })),
);
