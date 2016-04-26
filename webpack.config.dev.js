'use strict';

var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',

  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/client/entry.js'
  ],

  resolve: {
    modulesDirectory: 'node_modules',
    extensions: ['', '.js', '.jsx'],
    root: path.resolve('./src')
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.MIN_EXT': JSON.stringify(''),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        exclude: 'node_modules',
        query: {
          presets: ['es2015', 'react'],
        }, 
        loader: 'babel'
      }
    ]
  }

};