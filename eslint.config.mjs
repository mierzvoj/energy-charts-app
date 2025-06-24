// eslint.config.mjs - Complete React + TypeScript setup
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: {
        react,
        'react-hooks': reactHooks,
      },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        // Disable base rules covered by TypeScript
        'no-unused-vars': 'off',
        'no-undef': 'off',

        // TypeScript rules
        '@typescript-eslint/no-unused-vars': ['warn', {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }],
        '@typescript-eslint/no-explicit-any': 'warn',

        // React rules
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
        ...reactHooks.configs.recommended.rules,

        // General rules
        'no-console': 'warn',
        'no-var': 'error',
        'prefer-const': 'error',
      },
    },

    {
      ignores: [
        'node_modules/**',
        'dist/**',
        'build/**',
        'coverage/**',
        '*.min.js',
        '*.d.ts',
      ],
    }
);
