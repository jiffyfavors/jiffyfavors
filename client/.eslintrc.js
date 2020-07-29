module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
   'vue'
  ],
  // add your custom rules here
  rules: {
    'semi': [2, 'never'],
    'no-console': 'off',
    'camelcase': 'off',
    'no-prototype-builtins':'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': ['error', { 'semi': false }]
  }
}
