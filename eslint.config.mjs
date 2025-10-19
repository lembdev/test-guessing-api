// @ts-check
import eslint from '@eslint/js';
import eslintPluginPluginImportX from 'eslint-plugin-import-x';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { createNextImportResolver } from 'eslint-import-resolver-next';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },

  eslint.configs.recommended,

  // Plugin documentation: https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
  ...tseslint.configs.recommendedTypeChecked,

  // Plugin documentation: https://www.npmjs.com/package/eslint-plugin-import-x
  eslintPluginPluginImportX.flatConfigs.recommended,
  eslintPluginPluginImportX.flatConfigs.typescript,

  // Disable all rules that may conflict with Prettier
  eslintPluginPrettier,

  // Settings for plugins
  {
    settings: {
      'import-x/resolver-next': [createNextImportResolver()],
    },
  },

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      "prettier/prettier": ["error", { endOfLine: "auto" }],

      // Import rules
      'import-x/no-unresolved': 'off',
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-nodejs-modules': 'off',
      'import-x/no-absolute-path': 'error',
      'import-x/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
      'import-x/export': 'warn',
      'import-x/first': 'warn',
      'import-x/newline-after-import': 'warn',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-extraneous-dependencies': 'warn',
      'import-x/no-named-default': 'warn',
      'import-x/no-unused-modules': 'warn',
      'import-x/no-useless-path-segments': 'warn',
      'import-x/order': [
        'warn',
        {
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          pathGroups: [
            {
              pattern: '@test-guessing/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // Alphabetize named members within import specifiers: { A, B, C }
      // Use core rule alongside import-x/order (ignoreDeclarationSort avoids conflicts)
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
    },
  },
);
