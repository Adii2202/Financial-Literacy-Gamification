/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and
documentation (the “Materials”) are owned by Agora Lab, Inc. and its licensors.
The Materials may not be accessed, used, modified, or distributed for any
purpose without a license from Agora Lab, Inc. Use without a license or in
violation of any license terms and conditions (including use for any purpose
competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more
 information visit https://appbuilder.agora.io.
*********************************************
*/
/**
 * Common Webpack configuration to be used across web and electron's renderer
 * process
 */
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const configVars = require('./configTransform');
const {
  getCustomizationApiPath,
  customizationDummyPath,
} = require('./customization.config');

const isElectron = ['linux', 'windows', 'mac'].includes(process.env.TARGET);
const isReactSdk = process.env.TARGET === 'rsdk';
const isWebSdk = process.env.TARGET === 'wsdk';
const isSdk = isReactSdk || isWebSdk;

module.exports = {
  // Adds React Refresh webpack plugin for webpack dev server hmr
  plugins: [
    // Using html webpack plugin to utilize our index.html
    !isSdk &&
      new HtmlWebpackPlugin({
        title: configVars['$config.APP_NAME'],
        template: isElectron ? 'electron/index.html' : 'web/index.html',
      }),
    isDevelopment &&
      !isSdk &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
  ].filter(Boolean),
  resolve: {
    alias: {
      // Using react-native web to translate UI
      'react-native$': 'react-native-web',
      // Using rtm bridge to translate React Native RTM SDK calls to web SDK calls
      'agora-react-native-rtm$': path.join(
        __dirname,
        'bridge/rtm/web/index.ts',
      ),
      // Using rtc bridge to translate React Native RTC SDK calls to web SDK calls for web and linux
      // Using rtc bridge to translate React Native RTC SDK calls to electron SDK calls for windows and mac
      'react-native-agora$': path.join(__dirname, 'bridge/rtc/webNg/index.ts'),
      'customization-api': path.join(__dirname, 'customization-api/index.ts'),
      'customization-implementation': path.join(
        __dirname,
        'customization-implementation/index.ts',
      ),
      customization: path.join(
        __dirname,
        isSdk ? customizationDummyPath : getCustomizationApiPath(),
      ),
      'agora-react-native-rtm/lib/typescript/src': path.join(
        __dirname,
        'bridge/rtm/web/index.ts',
      ),
    },
    // Adds platform specific extensions and OS specific extensions
    // .web.tsx works for web specific code
    // .electron.tsx works for electron specific code
    // .linux.tsx works for OS(linux) specific electron code
    extensions: [
      `.${process.env.TARGET}.tsx`,
      `.${process.env.TARGET}.ts`,
      isElectron && '.electron.tsx',
      isElectron && '.electron.ts',
      isSdk && '.sdk.ts',
      isSdk && '.sdk.tsx',
      isSdk && '.web.ts',
      isSdk && '.web.tsx',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.node',
    ].filter(Boolean),
  },
  // Enable source maps during development
  devtool: isDevelopment ? 'eval-cheap-module-source-map' : undefined,
  module: {
    rules: [
      {
        // Use babel to transpile all js, ts, jsx and tsx files
        test: /\.[jt]sx?$/,
        exclude: /node_modules/, // don't transpile the files under node_modules
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // enables caching in babel
            configFile: false,
            presets: [
              '@babel/preset-react', // transforms tsx into normal ts
              [
                '@babel/preset-typescript', // transforms ts into js
                {
                  allExtensions: true,
                  isTSX: true,
                },
              ],
              [
                '@babel/preset-env', // smartly transforms js into es5-es6
                {
                  targets: {
                    node: 'current',
                  },
                },
              ],
            ],
            plugins: [
              // Adds support for class properties
              ['transform-define', configVars],
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-class-properties',
              isDevelopment && !isSdk && require.resolve('react-refresh/babel'),
            ].filter(Boolean),
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(wasm)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'wasm',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
};
