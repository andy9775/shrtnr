'use strict';

var webpack = require('webpack');
var path = require('path');
var HMR_PORT = process.env.HMR_PORT || 8080;
module.exports = {
  devtool: 'eval-source-map',

  entry: [
    'webpack-dev-server/client?http://localhost:' + HMR_PORT,
    'webpack/hot/only-dev-server',
    './src/client/entry.jsx'
  ],

  resolve: {
    modulesDirectory: 'node_modules',
    extensions: ['', '.js', '.jsx'],
    root: path.resolve('./src')
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        exclude: 'node_modules',
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            [
              'react-transform',
              {
                transforms: [
                  {
                    transform: 'react-transform-hmr',
                    imports: ['react'],
                    locals: ['module']
                  }
                ]
              }
            ]
          ]
        },
        loader: 'babel'
      }
    ]
  }
};
