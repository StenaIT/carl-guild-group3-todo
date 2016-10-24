'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var clientPort = '8080';
var socketioPort = '3009'

module.exports = {
    devtool: 'eval-source-map',
    devServer: {
      inline:true,
      port: clientPort,
      proxy: {
            '/sioapi/*': {
                target: 'ws://localhost:' + socketioPort,
                ws: true,
            },
      }
    },
    entry: [
        'webpack-dev-server/client?http://localhost:'+ clientPort,
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.join(__dirname, './app/index.js')
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].js',
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: './app/index.tpl.html',
          inject: 'body',
          filename: 'index.html',
          title: 'Todo (Development)',
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.json?$/,
                loader: 'json'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader:  [
                  'file?hash=sha512&digest=hex&name=[hash].[ext]',
                  'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]

    }
};
