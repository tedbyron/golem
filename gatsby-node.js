const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [

      ]
    }
    experiments: {
      asyncWebAssembly: true
    },
    plugins: [
      new WasmPackPlugin({
        crateDirectory: __dirname,
        forceMode: 'production',
        outName: 'lib'
      })
    ]
  })
}
