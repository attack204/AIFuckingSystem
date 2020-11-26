module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'semi': ['error', 'always'],
    '@typescript-eslint/ban-types': 'off',
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline']
  }
}
