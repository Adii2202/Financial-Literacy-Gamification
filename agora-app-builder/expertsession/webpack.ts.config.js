/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
const commons = require('./webpack.commons');
const {merge} = require('webpack-merge');
const path = require('path');
const configVars = require('./configTransform');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = merge(commons, {
  // Enable optimizations in production
  mode: isDevelopment ? 'development' : 'production',
  // Main entry point for the web application
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // loader: 'ts-loader',
        exclude: /node_modules|\.d\.ts$/,
        options: {
          configFile: 'tsconfig.json',
          ignoreDiagnostics: [2339, 2554, 2539, 1005],
          // ignoreDiagnostics: [2554,2539,2339,2551,2769,2305,2614,2322,2362,2369,2698]
        },
      },
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
    ],
  },
  entry: {
    main: './customization-api/index.ts',
  },
  output: {
    path: path.resolve(__dirname, `../Builds/ts`),
  },
});
