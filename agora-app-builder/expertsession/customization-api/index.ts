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

// TODO: Investigate further
// Exported like so to prevent error while bundling as react-sdk. Cause: some webpack Edgecase
import {customize} from './customize';
import configJSON from '../config.json';

let $config = configJSON as unknown as ConfigInterface;

export {customize, $config};
export * from './action-library';
export * from './app-state';
export * from './customEvents';
export * from './sub-components';
export * from './typeDefinition';
export * from './utils';
export * from './types';

//TODO: hari remove later - used for simple-practice demo
export * from './temp';
