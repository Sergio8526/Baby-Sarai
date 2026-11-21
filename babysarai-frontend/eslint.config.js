/**
 * Reglas de ESLint del proyecto.
 * Revisa errores comunes de JavaScript, las reglas de los hooks de React
 * y que cada archivo .jsx exporte solo componentes (requisito de Vite).
 */
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
  {
    // Los archivos de configuración se ejecutan en Node.js, no en el navegador
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
  },
]);
