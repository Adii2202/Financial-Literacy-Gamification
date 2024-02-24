import {useContext} from 'react';
import {
  enableIDPAuth,
  getIDPAuthLoginURL,
  addEventListenerForToken,
} from './openIDPURL.electron';
import StorageContext from '../components/StorageContext';
import useTokenAuth from './useTokenAuth';
import {useHistory} from '../components/Router';
import {useString} from '../utils/useString';
import {authSessionTimeoutToastHeading} from '../language/default-labels/commonLabels';

export const useIDPAuth = () => {
  const {store, setStore} = useContext(StorageContext);
  const {tokenLogout} = useTokenAuth();
  const headingText = useString(authSessionTimeoutToastHeading)();
  const history = useHistory();
  const idpLogout = () => {
    return new Promise((resolve, reject) => {
      try {
        //v1/idp/logout -> will generate and return URL for IDP logout(frontend need to call this)
        fetch(`${$config.BACKEND_ENDPOINT}/v1/idp/logout`, {
          headers: {
            authorization: store?.token ? `Bearer ${store?.token}` : '',
          },
        })
          .then(response => response.json())
          .then((res: any) => {
            if (res && res?.url) {
              //Storing the URL in the local variable
              const IDPAuthLogoutURL =
                res?.url +
                `&returnTo=${encodeURIComponent(getIDPAuthLoginURL())}`;
              //manage backend logout
              //it will invalid the user session from the manage backend
              tokenLogout()
                .then(() => {
                  //call IDP logout url
                  addEventListenerForToken(history, headingText);
                  setTimeout(() => {
                    window.open(IDPAuthLogoutURL, 'modal');
                  });
                  resolve(true);
                })
                .catch(() => {
                  reject(false);
                });
            } else {
              reject(false);
            }
          })
          .catch(_ => {
            reject(false);
          });
      } catch (error) {
        reject(false);
      }
    });
  };

  return {
    enableIDPAuth,
    idpLogout,
  };
};
