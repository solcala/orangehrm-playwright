import type { Locator, Page } from '@playwright/test';

/** Top bar (header) with the user menu, shown on every logged-in page. */
export class TopBar {
  readonly root: Locator;
  readonly userDropdown: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('banner');
    // The dropdown trigger is a plain <span> with no role or name, and the displayed user name is random
    // demo data, so we anchor on the profile picture's accessible name, scoped to the top bar.
    this.userDropdown = this.root.getByRole('img', { name: 'profile picture', exact: true });
    this.logoutMenuItem = this.root.getByRole('menuitem', { name: 'Logout' });
  }

  async logout(): Promise<void> {
    await this.userDropdown.click();
    await this.logoutMenuItem.click();
  }
}
