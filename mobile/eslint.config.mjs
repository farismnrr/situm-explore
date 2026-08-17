import tsParser from '@typescript-eslint/parser'

export default [
  { ignores: ['android/**', 'ios/**', 'node_modules/**', '.expo/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } },
    rules: {
      'no-console': 'warn',
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
]
