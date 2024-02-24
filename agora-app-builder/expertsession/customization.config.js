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

/*
getCustomizationApiPath - will return customization if exists otherwise it will return the dummy customization path
*/
const fs = require('fs');
const customizationPathTs = './customization/index.ts';
const customizationPathTsx = './customization/index.tsx';
const customizationDummyPath = './customization-implementation/dummyConfig.ts';
const getCustomizationApiPath = () => {
  if (fs.existsSync(customizationPathTs)) {
    return customizationPathTs;
  }
  if (fs.existsSync(customizationPathTsx)) {
    return customizationPathTsx;
  }
  return customizationDummyPath;
};
module.exports = {getCustomizationApiPath, customizationDummyPath};
