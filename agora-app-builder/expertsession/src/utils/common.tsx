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
import React from 'react';
import {
  Platform as ReactNativePlatform,
  useWindowDimensions,
} from 'react-native';
import Platform from '../subComponents/Platform';

import * as ReactIs from 'react-is';

const trimText = (text: string, length: number = 25) => {
  if (!text) {
    return '';
  }
  return text?.substring(0, length) + (text?.length > length ? '...' : '');
};
const maxInputLimit = 60;
const isValidReactComponent = <T,>(Component?: React.ComponentType<T>) =>
  Component && ReactIs.isValidElementType(Component) ? true : false;

const useHasBrandLogo = () => () => !!$config.LOGO;

const shouldAuthenticate: boolean = false;
// $config.ENABLE_TOKEN_AUTH || $config.ENABLE_IDP_AUTH;

//for our internal usage don't check Platform - electron and web will same kind ui checks. thats why we have isWeb for external usage
const isWebInternal = () => ReactNativePlatform.OS === 'web';

/**
 * Checks whether the application is running as a web app and returns true/false.
 * @returns function
 */
const isWeb = () => Platform === 'web' && ReactNativePlatform.OS === 'web';

/**
 * Checks whether the application is running as an android app and returns true/false.
 * @returns function
 */
const isAndroid = () =>
  //@ts-ignore
  Platform === 'native' && ReactNativePlatform.OS === 'android';

/**
 * Checks whether the application is running as an iOS app and returns true/false.
 * @returns function
 */
//@ts-ignore
const isIOS = () => Platform === 'native' && ReactNativePlatform.OS === 'ios';

/**
 * Checks whether the application is running as an electron desktop app and returns true/false.
 * @returns function
 */
//@ts-ignore
const isDesktop = () => Platform === 'electron';

/**
 * Checks whether the application is running on mobile device (user agent) and returns true/false.
 * @returns function
 */
//@ts-ignore
const isMobileUA = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a,
      ) ||
      isAndroid() ||
      isIOS()
    )
      check = true;
  })(navigator?.userAgent || navigator?.vendor || window?.opera);
  return check;
};

const isArray = (data: any[]) =>
  data && Array.isArray(data) && data.length ? true : false ? true : false;

interface calculatedPositionProps {
  px: number;
  py: number;
  localWidth: number;
  localHeight: number;
  globalWidth: number;
  globalHeight: number;
  extra?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  popupWidth?: number;
}
const calculatePosition = (params: calculatedPositionProps) => {
  const {
    px,
    py,
    localWidth,
    localHeight,
    globalWidth,
    globalHeight,
    extra: {top = 0, bottom = 0, left = 0, right = 0} = {},
    popupWidth = 220,
  } = params;
  //right hand side
  if (px > globalWidth / 2) {
    // if actionmenu overflow - horizontal
    const w = globalWidth - px + popupWidth;
    let minus = 0;
    if (w > globalWidth) {
      minus = w - globalWidth + 10;
    }
    //right bottom
    if (py > globalHeight / 2) {
      return {
        bottom: globalHeight - py + bottom,
        right: globalWidth - px - minus + right,
      };
    }
    //right top
    else {
      return {
        top: py + localHeight + top,
        right: globalWidth - px - minus + right,
      };
    }
  }
  //left hand side
  else {
    // if actionmenu overflow - horizontal
    const w = px + localWidth + popupWidth;
    let minus = 0;
    if (w > globalWidth) {
      minus = w - globalWidth + 10;
    }
    //left bottom
    if (py > globalHeight / 2) {
      return {
        bottom: globalHeight - py + bottom,
        left: px + localWidth - minus + left,
      };
    }
    //left top
    else {
      return {
        top: py + localHeight + top + top,
        left: px + localWidth - minus + left,
      };
    }
  }
};

const BREAKPOINTS = {
  xs: 360,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1330,
  xxl: 1400,
};

const useIsDesktop = () => {
  const {width, height} = useWindowDimensions();
  return (from: 'default' | 'toolbar' | 'popup' | 'large' = 'default') => {
    if (from === 'default') {
      return width > height ? true : false;
    } else if (from === 'toolbar') {
      return width > BREAKPOINTS.xl;
    } else if (from === 'popup') {
      return width > BREAKPOINTS.md;
    } else if (from === 'large') {
      return width > BREAKPOINTS.lg;
    }
    return width >= BREAKPOINTS.xl;
  };
};
const useIsSmall = () => {
  const {width} = useWindowDimensions();
  return (number = BREAKPOINTS.sm) => {
    return width < number;
  };
};

const useResponsive = () => {
  const {width} = useWindowDimensions();
  return (input: number) => {
    if (width < BREAKPOINTS.xs) {
      return input / 3;
    } else if (width < BREAKPOINTS.md) {
      return input / 2;
    } else {
      return input;
    }
  };
};

const processDeepLinkURI = (url: string): string => {
  return url
    .replace(`${$config.PRODUCT_ID.toLowerCase()}://my-host`, '')
    .replace($config.FRONTEND_ENDPOINT, '');
};

const getParamFromURL = (url, param) => {
  const include = url.includes(param);

  if (!include) return null;

  const params = url.split(/([&,?,=])/);
  const index = params.indexOf(param);
  const value = params[index + 2];
  return value;
};
const throttleFn = (fn: Function, wait: number = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number;
  return function (this: any) {
    const context = this,
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};

const debounceFn = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const capitalizeFirstLetter = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const CustomToolbarSort = (a, b) =>
  (a.hasOwnProperty('order') ? a.order : 999999) -
  (b.hasOwnProperty('order') ? b.order : 999999);

const randomString = (
  length = 5,
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
) => {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getOS() {
  let userAgent = window.navigator.userAgent.toLowerCase(),
    macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
    windowsPlatforms = /(win32|win64|windows|wince)/i,
    iosPlatforms = /(iphone|ipad|ipod)/i,
    os = null;

  if (macosPlatforms.test(userAgent)) {
    os = 'macos';
  } else if (iosPlatforms.test(userAgent)) {
    os = 'ios';
  } else if (windowsPlatforms.test(userAgent)) {
    os = 'windows';
  } else if (/android/.test(userAgent)) {
    os = 'android';
  } else if (!os && /linux/.test(userAgent)) {
    os = 'linux';
  }

  return os;
}

function hexToRgb(hex: string): [number, number, number] {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

export {
  useIsDesktop,
  useIsSmall,
  BREAKPOINTS,
  useHasBrandLogo,
  isMobileUA,
  isAndroid,
  isIOS,
  isWebInternal,
  isWeb,
  isDesktop,
  shouldAuthenticate,
  isArray,
  isValidReactComponent,
  maxInputLimit,
  trimText,
  calculatePosition,
  useResponsive,
  processDeepLinkURI,
  getParamFromURL,
  throttleFn,
  debounceFn,
  capitalizeFirstLetter,
  CustomToolbarSort,
  randomString,
  randomIntFromInterval,
  getOS,
  hexToRgb,
};
