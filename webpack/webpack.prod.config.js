const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

var config = {
  mode: 'production',
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
};

const serverConfig = merge(common, config);
module.exports = serverConfig;
