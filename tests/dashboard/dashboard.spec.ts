import { test, expect } from '@fixtures/pages';

// Uses the logged-in session saved by auth.setup.ts.
test.describe('Dashboard', { tag: '@dashboard' }, () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('loads for an authenticated user @smoke', async ({ dashboardPage }) => {
    await test.step('Dashboard is shown', async () => {
      await dashboardPage.expectLoaded();
    });
  });

  test('sidebar shows the main modules', async ({ dashboardPage }) => {
    const modules = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'My Info'];

    await test.step(`Sidebar lists: ${modules.join(', ')}`, async () => {
      // Soft: report every missing module in one run, not only the first.
      for (const module of modules) {
        await expect.soft(dashboardPage.menuItem(module), `"${module}" is in the sidebar`).toBeVisible();
      }
    });
  });
});
