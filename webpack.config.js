const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = () => {
  const isEnvProduction = process.env.NODE_ENV === 'production';
  const isEnvDevelopment = process.env.NODE_ENV === 'development';

  if (isEnvDevelopment) console.log('Server runs in development mode.');

  return {
    target: 'web',
    mode: isEnvProduction ? 'production' : 'development',
    devtool: isEnvDevelopment ? 'source-map' : false,
    entry: [path.resolve(__dirname, 'src', 'index.ts')],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          sideEffects: true,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        // comment below loader to get ES6 instead of ES5
        {
          test: /\.ts$/,
          loader: 'babel-loader',
        },
        // finds ts files and converts to vanilla js
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
        { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      ],
    },
    devServer: {
      // contentBase: 'public',
      // watchContentBase: true,
      port: 5555,
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        title: 'Singularity',
        template: path.resolve(__dirname, 'public', 'index.html'),
        minify: isEnvProduction,
        inject: isEnvProduction ? 'body' : true,
      }),
      // In devServer mode this plugin could prevent browser/package reload
      new ForkTsCheckerWebpackPlugin(),
    ],
  };
};
