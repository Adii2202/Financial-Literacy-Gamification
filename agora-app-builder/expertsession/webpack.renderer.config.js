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
// No additional config is required for electron renderer process
// So just re-exporting the commons
// This file is bootstrapped from electron-webpack.json

const {merge} = require('webpack-merge');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const webpack = require('webpack');

const commons = require('./webpack.commons');
module.exports = merge(commons, {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: path.resolve(__dirname, 'electron/renderer/index.js'),
  },
  node: {
    __dirname: false,
  },
  // externals: {
  //   'agora-electron-sdk': 'commonjs2 agora-electron-sdk',
  // },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, `../Builds/.electron`),
  },
  plugins: [
    isDevelopment && new webpack.HotModuleReplacementPlugin(), // to enable HMR for webpack-dev-server
  ].filter(Boolean),
  devServer: {
    port: 9002,
    hot: true,
  },
});
