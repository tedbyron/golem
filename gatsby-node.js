const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: 'webassembly/sync'
        }
      ]
    },
    experiments: {
      syncWebAssembly: true
    },
    plugins: [
      new WasmPackPlugin({
        crateDirectory: __dirname,
        forceMode: 'production',
        outName: 'lib',
        args: '--log-level warn'
        // extraArgs: '--no-typescript'
      })
    ]
  })
}
