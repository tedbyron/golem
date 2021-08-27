const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/bootstrap.ts',
  experiments: {
    syncWebAssembly: true,
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        test: /\.ts$/,
        options: {
          transpileOnly: true
        },
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/sync',
      },
    ],
  },
  output: {
    clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new ESLintPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
        files: './src/**/*',
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Golem',
      meta: {
        viewport: 'width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no'
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
