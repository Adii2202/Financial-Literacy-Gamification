import {Linking} from 'react-native';
import {
  getIDPAuthRedirectURL,
  getOriginURL,
  getPlatformId,
  AUTH_ENDPOINT_URL,
} from './config';

export const getIDPAuthLoginURL = (returnTo?: any) => {
  const finalRedirectURL = getIDPAuthRedirectURL() + returnTo;
  return `${AUTH_ENDPOINT_URL}?project_id=${
    $config.PROJECT_ID
  }&redirect_url=${finalRedirectURL}&origin_url=${getOriginURL()}&platform_id=${getPlatformId()}`;
};

export const enableIDPAuth = async (returnTo?: any, heading?: string) => {
  Linking.openURL(getIDPAuthLoginURL(returnTo));
};

export const exitApp = () => {};
