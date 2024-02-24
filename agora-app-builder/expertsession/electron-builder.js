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
const {PRODUCT_ID} = require('./config.json');

module.exports = {
  appId: `com.${PRODUCT_ID.toLowerCase()}`,
  productName: PRODUCT_ID,
  directories: {
    output: `../Builds/${process.env.TARGET}`,
    app: '../Builds/.electron',
  },
  linux: {
    target: ['AppImage'],
  },
  mac: {
    target: ['dmg', 'zip'],
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: './electron/entitlements.mac.plist',
    entitlementsInherit: './electron/entitlements.mac.plist',
    extendInfo: {
      "NSMicrophoneUsageDescription": "Mic access",
      "NSCameraUsageDescription": "Camera access"
    },
    publish: [
      {
        provider: "github",
        owner: "AgoraIO-Community",
        repo: "app-builder-core"
      }
    ]  
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['ia32'],
      },
    ],
  },
  afterSign: './notarize.js',
  protocols: [
    {
      name: "appbuilder",
      schemes: [
        "appbuilder"
      ]
    }
  ]
};
