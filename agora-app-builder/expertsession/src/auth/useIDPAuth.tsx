import {Linking} from 'react-native';
import {useLocation} from '../components/Router';
import {enableIDPAuth, getIDPAuthLoginURL} from './openIDPURL';
import useTokenAuth from './useTokenAuth';
import StorageContext from '../components/StorageContext';
import {useContext} from 'react';

export const useIDPAuth = () => {
  const location = useLocation();
  const {store, setStore} = useContext(StorageContext);
  const {tokenLogout} = useTokenAuth();
  const idpLogout = (dummy: any) => {
    return new Promise((resolve, reject) => {
      try {
        //v1/idp/logout -> will generate and return URL for IDP logout(frontend need to call this)
        fetch(`${$config.BACKEND_ENDPOINT}/v1/idp/logout`, {
          credentials: 'include',
          headers: {
            authorization: store?.token ? `Bearer ${store?.token}` : '',
          },
        })
          .then((response) => response.json())
          .then((res: any) => {
            if (res && res?.url) {
              //Storing the URL in the local variable
              // const IDPAuthLogoutURL =
              //   res?.url + `&returnTo=${window.location.origin}`;
              const IDPAuthLogoutURL =
                res?.url +
                `&returnTo=${encodeURIComponent(
                  getIDPAuthLoginURL(location.pathname),
                )}`;
              //manage backend logout
              //it will invalid the user session from the manage backend
              //cookie logout -> true
              //regular logout -> false
              tokenLogout(false)
                .then(() => {
                  //open idp logout url
                  Linking.openURL(IDPAuthLogoutURL);
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
