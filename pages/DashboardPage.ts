import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly path = '/web/index.php/dashboard/index';

  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly userDropdown: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.sidebar = page.getByRole('navigation', { name: 'Sidepanel' });
    // The dropdown trigger is a plain <span> with no role or name, and the displayed user name is random
    // demo data, so we anchor on the profile picture's accessible name, scoped to the top bar.
    this.userDropdown = page.getByRole('banner').getByRole('img', { name: 'profile picture', exact: true });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/index/);
    await expect(this.heading).toBeVisible();
  }

  menuItem(name: string): Locator {
    return this.sidebar.getByRole('link', { name, exact: true });
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }
}
