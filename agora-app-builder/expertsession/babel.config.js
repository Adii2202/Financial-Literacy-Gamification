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
const configVars = require('./configTransform');
const { getCustomizationApiPath } =  require('./customization.config');

// This file is read only by react native for IOS & Android. Doesn't apply to electron, Web targets
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['transform-define', configVars],
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['./'],
        alias: {
          'customization-api': './customization-api/index.ts',
          'customization-implementation':
            './customization-implementation/index.ts',
          customization: getCustomizationApiPath(),
        },
      },
    ],
    'react-native-reanimated/plugin'
  ],
};
