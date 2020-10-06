const serverConfiguration = {
  internal: {
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  },
  external: {
    proxy: 'http://localhost:9000/path/to/project/',
  },
};

const path = require('path');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let targetServerConfiguration = serverConfiguration.internal;

const config = function(env, args) {
  if (args.externalServer !== undefined && args.externalServer) {
    targetServerConfiguration = serverConfiguration.external;
  }

  return {
    entry: {
      app: './src/js/app.js',
    },
    output: {
      filename: 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
              options: { name: 'fonts/[name].[hash:6].[ext]', publicPath: '../', limit: 8192 },
            },
          ],
        },
      ],
    },
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/,
    },
    plugins: [
      new BrowserSyncPlugin({
        ...targetServerConfiguration,
        files: ['src/*'],
        ghostMode: {
          clicks: false,
          location: false,
          forms: false,
          scroll: false,
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'webpack',
        notify: true,
        reloadDelay: 0,
      }),
      new HtmlWebpackPlugin({
        inject: true,
        hash: false,
        filename: 'index.html',
        template: path.resolve(__dirname, 'src', 'index.html'),
        favicon: path.resolve(__dirname, 'src', 'assets/images', 'favicon.png'),
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'assets'),
            to: path.resolve(__dirname, 'dist', 'assets'),
            toType: 'dir',
          },
          {
            from: path.resolve(__dirname, 'src', 'js/vendor'),
            to: path.resolve(__dirname, 'dist', 'js/vendor'),
            toType: 'dir',
          },
          {
            from: path.resolve(__dirname, 'src', 'fonts'),
            to: path.resolve(__dirname, 'dist', 'fonts'),
            toType: 'dir',
          },
        ],
      }),
    ],
  };
};

module.exports = config;
