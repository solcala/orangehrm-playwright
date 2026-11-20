import { test, expect } from '@fixtures/pages';

// Uses the logged-in session saved by auth.setup.ts.
test.describe('Dashboard', { tag: '@dashboard' }, () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('loads for an authenticated user @smoke', async ({ dashboardPage }) => {
    await dashboardPage.expectLoaded();
  });

  test('sidebar shows the main modules', async ({ dashboardPage }) => {
    for (const item of ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info']) {
      await expect(dashboardPage.menuItem(item)).toBeVisible();
    }
  });
});
