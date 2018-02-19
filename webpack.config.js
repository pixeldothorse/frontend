const fs = require('fs');
const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const dirPath = fs.realpathSync(process.cwd());

module.exports = {

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  entry: {
    bundle: path.resolve(dirPath, 'src/ts/index.ts')
  },

  output: {
    path: path.resolve(dirPath, 'dist/js'),
    filename: 'index.js'
  },

  // Add the loader for .ts files.
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
      new CheckerPlugin(),
      new UglifyJsPlugin()
  ]
};
