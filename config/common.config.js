const merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { srcPath } = require('./utils');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { appId, appVersion } = JSON.parse(
  fs.readFileSync(`${__dirname}/../.viewar-config`)
);

exports.config = merge([
  {
    entry: {
      index: [srcPath + '/polyfills.js', 'react-hot-loader/patch', srcPath],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.s?css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[folder]--[local]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: loader => [
                  require('postcss-import')({ root: loader.resourcePath }),
                  require('postcss-preset-env')(),
                ],
              },
            },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: true,
                includePaths: ['./css'],
              },
            },
          ],
        },
        {
          test: /\.(eot|ttf|otf|woff2|mov?)(\?v=\d+\.\d+\.\d+)?|png|jpe?g|svg|gif|ico$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].scss',
      }),
      new HtmlWebpackPlugin({
        template: path.join(srcPath, 'index.html'),
        inject: true,
        bundleIdentifier: appId,
        bundleVersion: appVersion,
      }),
    ],
  },
]);
