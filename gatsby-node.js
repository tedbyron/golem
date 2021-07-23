const LoadablePlugin = require('@loadable/webpack-plugin');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    experiments: {
      syncWebAssembly: true,
    },
    plugins: [
      new LoadablePlugin(),
    ],
  });
};
