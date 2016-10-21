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
                test: /\.scss$/,
                loader: 'style!css!sass?modules&localIdentName=[name]---[local]---[hash:base64:5]'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    }
};
