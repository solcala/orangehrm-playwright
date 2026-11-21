# OrangeHRM — Playwright automation & AI-driven testing

Playwright + TypeScript end-to-end tests for the public OrangeHRM demo
(<https://opensource-demo.orangehrmlive.com>). Browsers: Playwright's **Chromium** and **WebKit** builds.

## Commands

| Command                                         | What it does                            |
| ----------------------------------------------- | --------------------------------------- |
| `npm test`                                      | Full suite (Chromium + WebKit)          |
| `npm run test:smoke`                            | `@smoke` tests only                     |
| `npm run test:chromium` / `npm run test:webkit` | One browser                             |
| `npm run typecheck`                             | `tsc --noEmit`; run before every commit |
| `npm run lint:md`                               | Markdown lint; run before every commit  |
| `npm run report`                                | Open the last HTML report               |

## Layout

- `pages/`: page objects (locators + actions). `fixtures/`: custom `test`, test data, constants.
- `tests/<section>/*.spec.ts`: specs. `tests/*.setup.ts`: logs in once and saves the admin session.
- `fixtures/constants.ts`: shared constants such as `STORAGE_STATE`. Tests never import `playwright.config.ts`.

## Writing tests

- Import `test` / `expect` from `@fixtures/pages`, never from `@playwright/test`.
- **Locators: user-facing first.** `getByRole` with a name → `getByLabel` → `getByPlaceholder` → alt text →
  `getByTitle` → `getByText` (stable static text only, never demo data) → test id. Scope locators to the nearest
  landmark (banner, navigation, main, dialog, table row). CSS/XPath only as a last resort, with a `//` comment
  saying why. Check new locators against the live app (Playwright MCP) instead of guessing.
- **`test.step`:** write each test as named _do_ → _verify_ steps that read like a manual test case.
- **`expect.soft`:** for several independent checks of one end state. Use a hard `expect` for preconditions that
  later steps depend on.
- Web-first assertions only; no `waitForTimeout`, no `.only`.
- Tag every `describe` with its section (`@auth`, `@pim`, …). Use `@smoke` for critical paths only.
- Tests are independent: self-created, unique test data with cleanup. Never log out of the shared session;
  logged-out tests use `test.use({ storageState: { cookies: [], origins: [] } })`.

## Workflow

- **Before every commit: no errors in VS Code's Problems tab.** Run `npm run typecheck` and `npm run lint:md`
  (ESLint joins later); both must pass. `.markdownlint.jsonc` is shared by the CLI and the VS Code extension.
- Never commit to `main`. Use one small branch per change (`chore/ ci/ docs/ feature/<section> fix/`) and
  conventional commits.
- Before pushing or opening a PR, rebase on the latest `main` (`git fetch && git rebase origin/main`).
- Before every PR, run the **`code-reviewer`** agent (`.claude/agents/code-reviewer.md`) and fix blocking findings.
- CodeRabbit is paused: don't trigger it. To get an AI review on a PR, comment `@coderabbitai review` (it doesn't
  run automatically on this repo). Its rules are in `.coderabbit.yaml`.
- `@playwright/test` is pinned to an exact version. Once CI is added, it must match the CI Docker image tag; bump both
  together.

## MCP servers (`.mcp.json`)

| Server            | Use it for                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `context7`        | Up-to-date docs for Playwright, TypeScript and other libraries. Prefer it over memory when writing Playwright APIs ("use context7"). |
| `playwright`      | Driving a real browser: exploring OrangeHRM, finding robust locators, turning an exploration into a spec.                            |
| `chrome-devtools` | Debugging: console errors, network requests, performance traces.                                                                     |
| `github`          | PRs, issues, and GitHub Actions runs. Needs `GITHUB_PERSONAL_ACCESS_TOKEN` (see `.env.example`).                                     |

Never write secrets into `.mcp.json`: use `${VAR}` expansion and document the variable in `.env.example`.

If the `github` server fails with "Authorization header is badly formatted", `GITHUB_PERSONAL_ACCESS_TOKEN` isn't set
in the shell Claude was started from. Export it (see `.env.example`) and restart Claude. The other servers don't need it.
