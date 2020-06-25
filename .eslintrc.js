module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-irregular-whitespace': 'off',
    indent:'off',
    'space-before-function-paren': 0,
    'space-before-blocks':0,
    'key-spacing':0,
    'no-trailing-spaces':0,
    'arrow-spacing':0,
    'padded-blocks':0
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
