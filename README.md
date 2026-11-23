# OrangeHRM — Playwright + TypeScript

[![Playwright Tests](https://github.com/solcala/orangehrm-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/solcala/orangehrm-playwright/actions/workflows/playwright.yml)

End-to-end tests for the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login).

**Latest test report (main):** <https://solcala.github.io/orangehrm-playwright/>, published by CI after each run on
`main` that produces a report.

## Setup

```bash
npm install
npx playwright install chromium webkit   # browsers
cp .env.example .env                     # credentials / base URL
```

## Running

| Command | What it does |
| --- | --- |
| `npm test` | All tests on Playwright's Chromium and WebKit builds |
| `npm run test:chromium` | Chromium only |
| `npm run test:webkit` | WebKit only |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm run test:headed` | Watch the browser |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open the last HTML report |
| `npm run codegen` | Record actions against the login page |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint (typescript-eslint strict, type-checked + Playwright rules) |
| `npm run lint:md` | Markdown lint |
| `npm run format` / `npm run format:check` | Prettier: format files / check only |

`npm install` also sets up Husky git hooks: **pre-commit** runs ESLint `--fix` and Prettier on staged files;
**pre-push** runs typecheck, ESLint and the `@smoke` tests on Chromium.

CI runs typecheck, ESLint, the Prettier check, markdown lint and the full suite in the official Playwright Docker
image on every PR, push to `main`, nightly and on demand.

## Layout

```text
pages/            Page Objects (BasePage, LoginPage, DashboardPage)
fixtures/         Custom `test` with page-object fixtures; test data
tests/
  auth.setup.ts   Logs in once, saves session to playwright/.auth/admin.json
  auth/           Login/logout tests (run logged out)
  dashboard/      Tests that reuse the saved admin session
playwright.config.ts
```

## Conventions

- Import `test`/`expect` from `@fixtures/pages`, not `@playwright/test`.
- Prefer `getByRole` / `getByPlaceholder` / `getByText` locators; keep them in page objects.
- Tests reuse the admin session by default. For a logged-out test, add
  `test.use({ storageState: { cookies: [], origins: [] } })`.
- Never log out of the shared session in a test — it invalidates it for parallel tests.
