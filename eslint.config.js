import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';

export default [
  // Configuración para JavaScript
  {
    files: ['**/*.js'],
    ...eslint.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // Configuración para TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        Response: 'readonly',
        URL: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },

  // Prettier (debe ir último)
  prettier,

  // Configuración global
  {
    ignores: [
      'dist/',
      '.astro/',
      'node_modules/',
      'src/env.d.ts', // Archivo de declaraciones TypeScript
    ],
  },
];
