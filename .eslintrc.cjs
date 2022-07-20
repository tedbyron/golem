module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['svelte3', '@typescript-eslint'],
  ignorePatterns: ['*.cjs', '.yarn/**/*'],
  settings: {
    'svelte3/typescript': () => require('typescript')
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      impliedStrict: true
    },
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2022: true
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'import/first': 'off'
      }
    }
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          ['internal', 'parent', 'sibling', 'index'],
          ['object', 'type']
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' }
      }
    ]
  }
}
