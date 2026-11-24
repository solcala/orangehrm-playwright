import { createHash } from 'crypto';
import { test as base } from '@playwright/test';
import { base as fakerBase, en, Faker } from '@faker-js/faker';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  /** A Faker instance seeded for this test only; pass it to the builders in `@fixtures/factories`. */
  faker: Faker;
};

/** Reads `FAKER_SEED` (a non-negative integer) to replay a failed test's data, or picks a random seed. */
function baseSeed(): number {
  const raw = process.env.FAKER_SEED?.trim();
  if (!raw) return Math.floor(Math.random() * 2 ** 31);
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw))) {
    throw new Error(`FAKER_SEED must be a non-negative integer, got "${raw}"`);
  }
  return Number(raw);
}

/**
 * Mixes the seed with the test's ID, so a whole run under one `FAKER_SEED` still gives each test
 * (and each browser project) different data, while the same seed + test always gives the same data.
 */
function seedForTest(seed: number, testId: string): number {
  return createHash('sha256')
    .update(`${String(seed)}:${testId}`)
    .digest()
    .readUInt32BE(0);
}

/** Extends Playwright's `test` with ready-made page objects and a seeded `faker`. */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  // eslint-disable-next-line no-empty-pattern -- Playwright fixtures must destructure their dependencies.
  faker: async ({}, use, testInfo) => {
    const seed = baseSeed();
    // Shown in the HTML report; replay with FAKER_SEED=<seed>.
    testInfo.annotations.push({ type: 'faker-seed', description: String(seed) });
    const faker = new Faker({ locale: [en, fakerBase] });
    faker.seed(seedForTest(seed, testInfo.testId));
    await use(faker);
  },
});

export { expect } from '@playwright/test';
