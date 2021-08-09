module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  globals: {
    document: true,
    window: true,
    graphql: true,
    __PATH_PREFIX__: true,
    __BASE_PATH__: true,
  },
  parser: '@babel/eslint-parser',
  plugins: [
    'import',
    'jsx-a11y',
    'react',
    'react-hooks',
  ],
};
