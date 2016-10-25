'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var clientPort = process.env['TODO_CLIENT_PORT'] == undefined ? '8081' : process.env['TODO_CLIENT_PORT'];
var clientIP = process.env['TODO_CLIENT_IP'] == undefined ? 'localhost' : process.env['TODO_CLIENT_IP'];
var serverPort =  process.env['TODO_SERVER_PORT'] == undefined ? '3009' : process.env['TODO_SERVER_PORT'];
var serverIP =  process.env['TODO_SERVER_IP'] == undefined ? 'localhost' : process.env['TODO_SERVER_IP'];

module.exports = {
    devtool: 'eval-source-map',
    devServer: {
      inline:true,
      port: clientPort,
      host: '0.0.0.0',
      proxy: {
            '/sioapi/*': {
                target: 'ws://' + serverIP + ':' + serverPort,
                ws: true
            }
      }
    },
    entry: [
        'webpack-dev-server/client?' + 'http://' + clientIP + ':'+ clientPort,
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
