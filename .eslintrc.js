module.exports = {
  parser: 'babel-eslint',
  globals: {
    graphql: true,
    __PATH_PREFIX__: true,
    __BASE_PATH__: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  plugins: [
    'import',
    'jsx-a11y',
    'react',
    'react-hooks',
  ],
};
