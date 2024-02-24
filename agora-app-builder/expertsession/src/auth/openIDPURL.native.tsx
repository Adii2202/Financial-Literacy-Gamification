import {Linking, Platform} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {getOriginURL, getPlatformId, AUTH_ENDPOINT_URL} from './config';
import RNExitApp from 'react-native-exit-app';

export const getDeepLinkURI = (path = '') => {
  const scheme = $config.PRODUCT_ID?.toLowerCase();
  const prefix =
    Platform.OS === 'android' ? `${scheme}://my-host/` : `${scheme}://`;
  return prefix + path;
};

export const getIDPAuthLoginURL = () => {
  return `${AUTH_ENDPOINT_URL}?project_id=${
    $config.PROJECT_ID
  }&redirect_url=${encodeURIComponent(
    getDeepLinkURI('authorize'),
  )}&origin_url=${encodeURIComponent(
    getDeepLinkURI(),
  )}&platform_id=${getPlatformId()}`;
};

export const enableIDPAuth = async (openDeepLink) => {
  try {
    const URL = getIDPAuthLoginURL();
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.close();
      const result = await InAppBrowser.openAuth(
        URL,
        encodeURIComponent(getDeepLinkURI()),
      );
      if (result && result?.type === 'success') {
        openDeepLink && openDeepLink(result?.url);
      } else if (result && result?.type === 'cancel') {
        return {showNativePopup: true};
      }
    } else {
      Linking.openURL(URL);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const exitApp = () => {
  try {
    RNExitApp.exitApp();
  } catch (error) {
    console.log('Error on closing the app', error);
  }
};
