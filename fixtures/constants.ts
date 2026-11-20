import path from 'path';

/** Project root (this file lives in `fixtures/`). */
const ROOT = path.resolve(__dirname, '..');

/** Saved admin session, written by `tests/auth.setup.ts` and reused by the browser projects. */
export const STORAGE_STATE = path.join(ROOT, 'playwright/.auth/admin.json');
