import { expect, type Locator, type Page } from '@playwright/test';

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
    // Verified on the live app: the OXD user menu renders inside <header>, not teleported to <body>.
    this.logoutMenuItem = this.root.getByRole('menuitem', { name: 'Logout', exact: true });
  }

  async logout(): Promise<void> {
    // On a slow load (seen once on WebKit) the first click can land before the Vue app has wired up the dropdown,
    // so the menu never opens. Retry the click until the Logout item shows. Clicking an already-open menu would
    // close it, so the retry only re-clicks while the item is still hidden.
    await expect(async () => {
      if (!(await this.logoutMenuItem.isVisible())) await this.userDropdown.click();
      await expect(this.logoutMenuItem).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 10_000 });
    await this.logoutMenuItem.click();
  }
}
