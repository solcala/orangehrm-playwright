// @ts-check
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import playwright from 'eslint-plugin-playwright';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'blob-report/',
      'playwright/.cache/',
      '.claude/',
      '.playwright-mcp/',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Config files are plain JS: no type information.
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['tests/**'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      // Page objects assert in `expect*` methods (e.g. `dashboardPage.expectLoaded()`); count those as assertions.
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect[A-Z]'] }],
    },
  },
  // Last: turns off style rules that Prettier owns.
  prettier,
);
