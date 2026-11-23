# OrangeHRM — Playwright + TypeScript

[![Playwright Tests](https://github.com/solcala/orangehrm-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/solcala/orangehrm-playwright/actions/workflows/playwright.yml)

End-to-end tests for the [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login).

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

CI runs typecheck, markdown lint and the full suite in the official Playwright Docker image on every PR,
push to `main`, nightly and on demand.

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
