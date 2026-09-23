const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/**']
  },

  js.configs.recommended,

  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        console: 'readonly'
      }
    }
  },

  {
    files: ['app.js', 'server.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        process: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-console': 'off'
    }
  },

  {
    files: ['test/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        fetch: 'readonly',
        URLSearchParams: 'readonly'
      }
    }
  }
];