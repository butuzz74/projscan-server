import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  ...tseslint.configs.recommended,

  {
    name: 'prettier-overrides',
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'warn'
    }
  },

  {
    ignores: ['dist/**/*', 'node_modules/**/*']
  },

  {
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'warn'
    }
  }
];
