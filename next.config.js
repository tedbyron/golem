module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    const newConfig = config

    newConfig.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async'
    })

    if (!Object.prototype.hasOwnProperty.call(newConfig, 'experiments')) {
      newConfig.experiments = {}
    }
    newConfig.experiments.asyncWebAssembly = true

    return newConfig
  }
}
