module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['prettier'],
  extends: [
    'airbnb-base',
    'airbnb/rules/react',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: 'babel-eslint',
  ignorePatterns: ['serviceWorker.js', 'node_modules/', 'src/locales/'],
  rules: {
    'react/jsx-props-no-spreading': 0,
    'react/no-unescaped-entities': ['error', { forbid: ['>', '}'] }],
    'react/sort-comp': 0,
    'react/prop-types': 0,
    'linebreak-style': 0,
    'react/destructuring-assignment': 0,
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'react/jsx-one-expression-per-line': 0,
    'no-return-assign': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-useless-escape': 'off',
  },
};
