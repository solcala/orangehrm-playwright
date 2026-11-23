import type { Locator, Page } from '@playwright/test';

/** Left side panel with the main module menu, shown on every logged-in page. */
export class Sidebar {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole('navigation', { name: 'Sidepanel' });
  }

  /** Menu link for a module, e.g. `Admin`, `PIM`, `My Info`. */
  menuItem(name: string): Locator {
    return this.root.getByRole('link', { name, exact: true });
  }

  async open(name: string): Promise<void> {
    await this.menuItem(name).click();
  }
}
