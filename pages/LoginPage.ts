import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';

  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Login' });
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.getByRole('alert');
    this.forgotPasswordLink = page.getByText('Forgot your password?');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /** Inline "Required" message shown under an empty field. */
  requiredMessageFor(field: Locator): Locator {
    // Last resort, CSS (verified on the live app): the message <span> has no role, and neither it nor the <label> is
    // linked to the input (no aria-describedby / for), so no role or label locator can reach it. We scope to the
    // stable OXD form-group component that contains this field.
    return this.page.locator('.oxd-input-group').filter({ has: field }).getByText('Required', { exact: true });
  }
}
