import {useContext} from 'react';
import {Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {
  enableIDPAuth,
  getDeepLinkURI,
  getIDPAuthLoginURL,
} from './openIDPURL.native';
import StorageContext from '../components/StorageContext';
import useTokenAuth from './useTokenAuth';

export const useIDPAuth = () => {
  const {store, setStore} = useContext(StorageContext);
  const {tokenLogout} = useTokenAuth();
  const idpLogout = (setShowNativePopup: (val: boolean) => void) => {
    return new Promise((resolve, reject) => {
      try {
        //v1/idp/logout -> will generate and return URL for IDP logout(frontend need to call this)
        fetch(`${$config.BACKEND_ENDPOINT}/v1/idp/logout`, {
          headers: {
            authorization: store?.token ? `Bearer ${store?.token}` : '',
          },
        })
          .then((response) => response.json())
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
                  if (InAppBrowser.isAvailable()) {
                    InAppBrowser.openAuth(
                      IDPAuthLogoutURL,
                      encodeURIComponent(getIDPAuthLoginURL()),
                    ).then((res) => {
                      if (res && res?.type === 'cancel') {
                        setShowNativePopup && setShowNativePopup(true);
                      }
                    });
                  } else {
                    Linking.openURL(IDPAuthLogoutURL);
                  }
                  resolve(true);
                })
                .catch(() => {
                  reject(false);
                });
            } else {
              reject(false);
            }
          })
          .catch((_) => {
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
