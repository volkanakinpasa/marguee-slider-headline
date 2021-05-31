const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const output = {
  filename: '[name].bundle.js',
  path: path.join(__dirname, '..', 'dist'),
};

const config = {
  entry: {
    background: path.join(
      __dirname,
      '..',
      'src',
      'js',
      'background',
      'index.ts',
    ),
    content: path.join(__dirname, '..', 'src', 'js', 'content', 'index.ts'),
    popup: path.join(__dirname, '..', 'src', 'js', 'popup', 'index.tsx'),
    options: path.join(__dirname, '..', 'src', 'js', 'options', 'index.tsx'),
    marquee: path.join(__dirname, '..', 'src', 'js', 'marquee', 'index.tsx'),
  },
  target: 'web',
  output,
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader', options: { injectType: 'styleTag' } },
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            }, // compiles Less to CSS
          },
        ],
      },
      // use: [
      //   {
      //     loader: 'file-loader',
      //     options: {
      //       name: 'theme.css',
      //     },
      //   },
      //   {
      //     loader: 'less-loader',
      //     options: { javascriptEnabled: true }, // compiles Less to CSS
      //   },
      // ],
      {
        test: /\.shadowcss$/,
        exclude: /node_modules/,
        use: ['to-string-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3)$/,
        use: 'file-loader?name=media/[name].[ext]',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['*', '.tsx', '.ts', '.js', '.css'],
  },
  plugins: [
    new ProgressBarPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'html', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'html', 'options.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'html', 'background.html'),
      filename: 'background.html',
      chunks: ['background'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'html', 'marquee.html'),
      filename: 'marquee.html',
      chunks: ['marquee'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/resources',
          to: '',
        },
        {
          from: 'src/manifest.json',
          to: 'manifest.json',
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],
};
module.exports = config;
