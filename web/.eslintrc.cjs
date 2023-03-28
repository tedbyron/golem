const importOrderOptions = {
  groups: [
    'builtin',
    'external',
    ['internal', 'unknown', 'parent', 'sibling', 'index'],
    'type',
    'object',
  ],
  'newlines-between': 'always',
  alphabetize: { order: 'asc' },
}

/** @type {import('@typescript-eslint/utils').TSESLint.Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['svelte3', '@typescript-eslint'],
  ignorePatterns: ['*.cjs', 'svelte.config.js', '.yarn/**/*'],
  settings: { 'svelte3/typescript': () => require('typescript') },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off',
        'import/order': [
          'error',
          { ...importOrderOptions, 'newlines-between': 'always-and-inside-groups' },
        ],
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: { impliedStrict: true },
    ecmaVersion: 'latest',
    extraFileExtensions: ['.svelte'],
    project: './tsconfig.json',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/order': ['error', importOrderOptions],
  },
}
