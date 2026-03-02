/* eslint-disable import/no-extraneous-dependencies */
import js from '@eslint/js'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  js.configs.recommended,
  {
    plugins: { import: importPlugin, 'unused-imports': unusedImports },
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/eslint.config.js', '**/*.test.js'] }
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
]
