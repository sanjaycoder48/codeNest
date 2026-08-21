import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      // Without this, core no-unused-vars cannot see JSX member usage such as
      // <motion.div>, and reports every imported namespace as unused.
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]|motion', argsIgnorePattern: '^[A-Z_]' }],
      // This project does not use prop-types; it is not a TypeScript codebase either.
      'react/prop-types': 'off',
    },
  },
  {
    // shadcn/ui components export their cva variants alongside the component
    // by convention. Keeping that shape means `shadcn add` upgrades apply
    // cleanly, so the Fast Refresh rule is relaxed for this directory only.
    files: ['src/components/ui/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
