import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const executablePath =
  process.env.CHROME_PATH ??
  ['/usr/bin/google-chrome', '/usr/bin/chromium'].find((path) => existsSync(path));
if (!executablePath) throw new Error('Set CHROME_PATH to a local Chrome or Chromium executable.');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: { executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run serve:performance',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
