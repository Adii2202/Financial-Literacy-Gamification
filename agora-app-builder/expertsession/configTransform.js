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
let jsonFile = require('./config.json');
let PREFIX = '$config';
let config = {};
Object.keys(jsonFile).map((key) => {
  config[`${PREFIX}.${key}`] = jsonFile[key];
});

//find any missing config
const defaultConfig = require('./defaultConfig');
const filteredArray = Object.keys(defaultConfig).filter(
  (value) => !Object.keys(jsonFile).includes(value),
);

//add missing config with default value
if (filteredArray && filteredArray?.length) {
  console.error('config.json missing ', filteredArray);
  filteredArray.forEach((i) => {
    config[`${PREFIX}.${i}`] = defaultConfig[i];
  });
}

module.exports = config;
