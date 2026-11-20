import { test, expect } from '@fixtures/pages';
import { adminUser } from '@fixtures/test-data';

// Login tests must start logged out, so drop the shared session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', { tag: '@auth' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.expectLoaded();
  });

  test('admin can log in with valid credentials @smoke', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(adminUser.username, adminUser.password);
    await dashboardPage.expectLoaded();
  });

  test('user sees an error for invalid credentials', async ({ loginPage, page }) => {
    await loginPage.login(adminUser.username, 'wrong-password');
    await expect(loginPage.errorAlert).toContainText('Invalid credentials');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('user sees "Required" when submitting empty fields', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.requiredMessageFor(loginPage.usernameInput)).toBeVisible();
    await expect(loginPage.requiredMessageFor(loginPage.passwordInput)).toBeVisible();
  });

  // Logs in with its own session — logging out of the shared storageState
  // session would invalidate it for every other test.
  test('user can log out', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(adminUser.username, adminUser.password);
    await dashboardPage.expectLoaded();
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/auth\/login/);
    await loginPage.expectLoaded();
  });
});
