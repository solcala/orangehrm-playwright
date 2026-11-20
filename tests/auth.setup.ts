import { test as setup } from '@fixtures/pages';
import { adminUser } from '@fixtures/test-data';
import { STORAGE_STATE } from '../playwright.config';

setup('authenticate as admin', async ({ loginPage, dashboardPage, page }) => {
  await loginPage.goto();
  await loginPage.login(adminUser.username, adminUser.password);
  await dashboardPage.expectLoaded();
  await page.context().storageState({ path: STORAGE_STATE });
});
