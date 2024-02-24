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
import {CustomizationApiInterface} from './typeDefinition';
import ReactIs from 'react-is';
/**
 *
 * @param config customization options to override the UI components and customize the application
 * @returns customization options
 */

function isString(data: any) {
  if (data && typeof data === 'string') {
    return true;
  }
  return false;
}

function isFunction(data: any) {
  if (data && typeof data === 'function') {
    return true;
  }
  return false;
}

function isObject(data: any) {
  if (data && typeof data === 'object') {
    return true;
  }
  return false;
}

function isComponent(data: any) {
  if (data && ReactIs.isValidElementType(data)) {
    return true;
  }
  return false;
}

//These keys value are not react component. so doing indexOf and checking whether its function or not
const ignoreTheseKeys = ['customLayout'];

function validateComponents(components: any) {
  for (const key in components) {
    if (ignoreTheseKeys.indexOf(key) === -1) {
      let comp = components[key];
      if (comp) {
        if (isComponent(comp) || isObject(comp)) {
          if (isObject(comp)) {
            validateComponents(comp);
          }
        } else {
          console.error(
            `Customize:Error ${key} should be a react component or object`,
          );
        }
      }
    } else {
      let comp = components[key];
      if (comp && !isFunction(comp)) {
        console.error(`Customize:Error ${key} should be an function`);
      }
    }
  }
}

function validateLifecycle(data: any) {
  for (const key in data) {
    const callback = data[key];
    if (callback && !isFunction(callback)) {
      console.error(
        `Customize:Error ${key} should be a function that return async function`,
      );
    }
  }
}

function validateCustomRoutes(routes: any) {
  if (routes && !Array.isArray(routes)) {
    console.error(`Customize:Error customRoutes should be an array`);
  }
}

function validatei18n(data: any) {
  if (data) {
    if (!Array.isArray(data)) {
      console.error(`Customize:Error i18n should be an array`);
    } else {
      data.map((item) => {
        const langData = item.data;
        for (const key in langData) {
          const value = langData[key];
          if (value) {
            if (!(isString(value) || isFunction(value))) {
              console.error(
                `Customize:Error ${item.locale} ${key} should be a string or function`,
              );
            }
          }
        }
      });
    }
  }
}
export const customize = (config: CustomizationApiInterface) => {
  //validating the components
  config?.components && validateComponents(config.components);

  //validating the custom routes
  //commented for v1 release
  //config?.customRoutes && validateCustomRoutes(config.customRoutes);

  //validating the i18n
  config?.i18n && validatei18n(config.i18n);

  //validating the lifecycle
  //commented for v1 release
  //config?.lifecycle && validateLifecycle(config?.lifecycle);

  return config;
};
