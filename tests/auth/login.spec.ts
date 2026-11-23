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
    await test.step('Submit valid admin credentials', async () => {
      await loginPage.login(adminUser.username, adminUser.password);
    });

    await test.step('Dashboard is shown', async () => {
      await dashboardPage.expectLoaded();
    });
  });

  test('user sees an error for invalid credentials', async ({ loginPage, page }) => {
    await test.step('Submit a wrong password', async () => {
      await loginPage.login(adminUser.username, 'wrong-password');
    });

    await test.step('Error is shown and user stays on the login page', async () => {
      // Independent checks of the same end state: soft, so one failure doesn't hide the other.
      await expect
        .soft(loginPage.errorAlert, 'Error alert says "Invalid credentials"')
        .toContainText('Invalid credentials');
      await expect.soft(page, 'User stays on the login page').toHaveURL(/\/auth\/login/);
    });
  });

  test('user sees "Required" when submitting empty fields', async ({ loginPage }) => {
    await test.step('Submit the form with both fields empty', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Both fields show a "Required" message', async () => {
      await expect
        .soft(loginPage.requiredMessageFor(loginPage.usernameInput), 'Username shows "Required"')
        .toBeVisible();
      await expect
        .soft(loginPage.requiredMessageFor(loginPage.passwordInput), 'Password shows "Required"')
        .toBeVisible();
    });
  });

  // Logs in with its own session — logging out of the shared storageState
  // session would invalidate it for every other test.
  test('user can log out', async ({ loginPage, dashboardPage, page }) => {
    // Each step depends on the previous one, so these assertions are hard (not soft).
    await test.step('Log in as admin and reach the dashboard', async () => {
      await loginPage.login(adminUser.username, adminUser.password);
      await dashboardPage.expectLoaded();
    });

    await test.step('Log out from the user menu', async () => {
      await dashboardPage.topBar.logout();
    });

    await test.step('Login page is shown again', async () => {
      await expect(page).toHaveURL(/\/auth\/login/);
      await loginPage.expectLoaded();
    });
  });
});
