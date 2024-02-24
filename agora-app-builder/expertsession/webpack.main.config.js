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
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // Main entry point for the web application
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: path.resolve(__dirname, 'electron/main/index.js'),
  },
  node: {
    __dirname: false,
  },
  target: 'electron-main',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../Builds/.electron'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.TARGET': JSON.stringify(process.env.TARGET),
    }),
  ],
};
