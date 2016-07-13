'use strict';
var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './src/client/entry.jsx'
  ],

  resolve: {
    modulesDirectory: 'node_modules',
    extensions: ['', '.js', '.jsx'],
    root: path.resolve('./src')
  },

  output: {
    path: path.join(__dirname, 'public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
    pathinfo: false
  },

  plugins:[
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      warnings: false
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
