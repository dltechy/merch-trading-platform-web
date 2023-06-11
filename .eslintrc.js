const fs = require('fs');

const { compilerOptions } = JSON.parse(fs.readFileSync('./tsconfig.json'));

const paths = Object.keys(compilerOptions.paths)
  .map((key) => key.slice(0, -2))
  .sort();

module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'next/core-web-vitals',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['!.lintstagedrc.js', '.next/'],
  overrides: [
    {
      files: [
        '**/__tests__/**/*.{ts,tsx}',
        '.lintstagedrc.js',
        'jest*.config.js',
        'tailwind.config.js',
      ],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      rules: {
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              String: {
                message: 'Use string instead',
                fixWith: 'string',
              },
              Boolean: {
                message: 'Use boolean instead',
                fixWith: 'boolean',
              },
              Number: {
                message: 'Use number instead',
                fixWith: 'number',
              },
              Symbol: {
                message: 'Use symbol instead',
                fixWith: 'symbol',
              },
            },
            extendDefaults: false,
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              constructors: 'no-public',
            },
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            ignoreRestSiblings: true,
          },
        ],
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
        'no-shadow': 'off',
      },
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx'],
          },
          typescript: {
            project: './tsconfig.json',
          },
        },
      },
    },
  ],
  plugins: ['react', 'simple-import-sort', 'tailwindcss'],
  root: true,
  rules: {
    'class-methods-use-this': 'off',
    curly: ['error', 'all'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-console': 'error',
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',
    'prefer-const': ['error', { destructuring: 'all' }],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^@?\\w'],
          ['^'],
          ...paths.map((path) => [`^${path}(\\/)`]),
          ['^\\.'],
        ],
      },
    ],
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
  },
};
