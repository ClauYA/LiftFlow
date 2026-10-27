import js from '@eslint/js';

export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-eval': 'error',
    },
  },
];
