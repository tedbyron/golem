const LoadablePlugin = require('@loadable/webpack-plugin');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/async',
        },
      ],
    },
    experiments: {
      asyncWebAssembly: true,
    },
    plugins: [
      new LoadablePlugin(),
    ],
  });
};
