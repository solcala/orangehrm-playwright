import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { STORAGE_STATE } from './fixtures/constants';

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Omit `workers` locally so Playwright uses its default (exactOptionalPropertyTypes forbids `undefined`).
  ...(process.env.CI ? { workers: 1 } : {}),
  // The public demo can be slow — give it some headroom.
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // Logs in once and saves the session to STORAGE_STATE.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },

    // Chromium + WebKit only; Firefox dropped to keep runs fast. These are Playwright's own browser builds with
    // Desktop Chrome/Safari device presets (viewport, user agent), not the branded Chrome or Safari browsers.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
  ],
});
