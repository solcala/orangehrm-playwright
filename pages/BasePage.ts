import type { Page } from '@playwright/test';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';

export abstract class BasePage {
  /** App shell: left side panel and top bar (present on logged-in pages only). */
  readonly sidebar: Sidebar;
  readonly topBar: TopBar;

  constructor(protected readonly page: Page) {
    this.sidebar = new Sidebar(page);
    this.topBar = new TopBar(page);
  }

  /** Path relative to baseURL, e.g. `/web/index.php/auth/login`. */
  abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
