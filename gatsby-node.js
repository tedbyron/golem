exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/sync',
        },
      ],
    },
    experiments: {
      syncWebAssembly: true,
    },
  });
};
