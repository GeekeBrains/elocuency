const { composePlugins, withNx } = require('@nx/webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.output = {
      ...config.output,
      clean: false,
    };
    config.plugins.push(
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['main.js'],
      })
    );
    return config;
  }
);
