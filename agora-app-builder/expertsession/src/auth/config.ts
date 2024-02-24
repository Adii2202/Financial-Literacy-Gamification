import {
  isWebInternal,
  isAndroid,
  isIOS,
  isWeb,
  isDesktop,
} from '../utils/common';
import isSDK from '../utils/isSDK';

export const AUTH_ENDPOINT_URL = `${$config.BACKEND_ENDPOINT}/v1/idp/login`;

export const ENABLE_AUTH = $config.ENABLE_IDP_AUTH || $config.ENABLE_TOKEN_AUTH;

export const getPlatformId = (): string => {
  let platformID = 'turnkey_web';
  // Turnkey
  isWeb() && (platformID = 'turnkey_web');
  isDesktop() && (platformID = 'turnkey_desktop');
  (isAndroid() || isIOS()) && (platformID = 'turnkey_native');
  // SDKs
  isSDK() && isWebInternal() && (platformID = 'sdk_web');
  isSDK() && isAndroid() && (platformID = 'sdk_android');
  isSDK() && isIOS() && (platformID = 'sdk_ios');
  return platformID;
};

export const getRequestHeaders = () => {
  return {
    'X-Project-ID': $config.PROJECT_ID,
    'X-Platform-ID': getPlatformId(),
  };
};
export const getIDPAuthRedirectURL = () => {
  return isWeb()
    ? `${window.location.origin}/authorize`
    : `${$config.FRONTEND_ENDPOINT}/authorize`;
};

export const getUnauthLoginRedirectURL = () => {
  return isWebInternal()
    ? `${window.location.origin}/create`
    : `${$config.FRONTEND_ENDPOINT}/create`;
};

export const getOriginURL = () => {
  return isWeb() ? `${window.location.origin}` : `${$config.FRONTEND_ENDPOINT}`;
};

export const GET_UNAUTH_FLOW_API_ENDPOINT = () =>
  `${$config.BACKEND_ENDPOINT}/v1/login?project_id=${
    $config.PROJECT_ID
  }&platform_id=${getPlatformId()}`;
