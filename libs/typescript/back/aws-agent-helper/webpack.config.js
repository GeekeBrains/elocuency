const { composePlugins, withNx } = require('@nx/webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = composePlugins(
  withNx({
    target: 'node',
  }),
  (config) => {
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        async: false,
        typescript: {
          configFile: path.resolve(__dirname, 'tsconfig.lib.json'),
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      })
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: path.resolve(
      //         __dirname,
      //         'dist/libs/back/aws-agent-helper/**/*.d.ts'
      //       ),
      //       to: path.resolve(
      //         __dirname,
      //         'dist/libs/back/aws-agent-helper'
      //       ),
      //       // flatten: true,
      //     },
      //   ],
      // })
    );
    return config;
  }
);
