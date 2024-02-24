const commons = require('./webpack.commons');
const {merge} = require('webpack-merge');
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

const libraryTargets = ['commonjs2', 'var','umd2'];

const baseConfig = {
  // Enable optimizations in production
  mode: isDevelopment ? 'development' : 'production',
  // Angular doesn't support cheap-eval-module-source-maps 
  devtool:'source-map',
  // Main entry point for the web application
  entry: {
    main: './index.wsdk.tsx',
  },
  output: {
    path: path.resolve(__dirname, `../Builds/web-sdk`),
    filename: 'app-builder-web-sdk.js',
    library: {
      name: 'AgoraAppBuilder',
    },
  },
};

const mappedConfigs = libraryTargets.map((target, _) => {
  let newConfig = baseConfig;
  newConfig.output.library.type = target;
  newConfig.output.filename = `app-builder-web-sdk.${target}.js`;
  newConfig = merge(commons, newConfig);
  return newConfig;
});

module.exports = mappedConfigs;
