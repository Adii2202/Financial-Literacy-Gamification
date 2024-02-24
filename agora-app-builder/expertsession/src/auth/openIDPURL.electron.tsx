import {getOriginURL, getPlatformId, AUTH_ENDPOINT_URL} from './config';
import Toast from '../../react-native-toast-message';

export const getIDPAuthLoginURL = () => {
  //redirect URL not require for electron
  return `${AUTH_ENDPOINT_URL}?project_id=${
    $config.PROJECT_ID
  }&origin_url=${getOriginURL()}&platform_id=${getPlatformId()}`;
};

export const addEventListenerForToken = (history, heading) => {
  window.addEventListener(
    'message',
    ({data, origin}: {data: {token: string; msg: string}; origin: string}) => {
      if (data?.token) {
        history.push(`/authorize/${data.token}`);
      } else if (data?.msg && data?.msg === 'login_link_expired') {
        Toast.show({
          leadingIconName: 'alert',
          type: 'error',
          text1: heading ? heading : 'Your session has timed out, Retrying...',
          visibilityTime: 3000,
        });
        setTimeout(() => {
          //open auth login again
          window.open(getIDPAuthLoginURL(), 'modal');
        }, 3000);
      }
    },
    false,
  );
};

export const enableIDPAuth = async (history, heading) => {
  addEventListenerForToken(history, heading);
  //open the auth login in the popup
  window.open(getIDPAuthLoginURL(), 'modal');
};
export const exitApp = () => {};
