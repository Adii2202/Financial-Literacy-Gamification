import React, {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
} from 'react';
import {useHistory, useLocation} from '../components/Router';
import {gql, useApolloClient} from '@apollo/client';
import {useIDPAuth} from './useIDPAuth';
import Loading from '../subComponents/Loading';
import useTokenAuth from './useTokenAuth';
import Toast from '../../react-native-toast-message';
import {
  ENABLE_AUTH,
  getPlatformId,
  GET_UNAUTH_FLOW_API_ENDPOINT,
} from './config';
import isSDK from '../utils/isSDK';
import {Linking} from 'react-native';
import {
  isAndroid,
  isIOS,
  isWeb,
  isDesktop,
  processDeepLinkURI,
  getParamFromURL,
} from '../utils/common';
import SDKMethodEventsManager from '../utils/SdkMethodEvents';
import StorageContext from '../components/StorageContext';
import UserCancelPopup from './UserCancelPopup';
import {exitApp} from './openIDPURL';
import {useString} from '../utils/useString';
import {
  authSessionTimeoutToastHeading,
  loadingText,
} from '../language/default-labels/commonLabels';

export const GET_USER = gql`
  query getUser {
    getUser {
      name
      email
    }
  }
`;

type AuthProviderProps = {
  enableAuth?: boolean;
  children: React.ReactNode;
};

interface AuthContextInterface {
  authenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  authLogin: () => void;
  authLogout: () => void;
  returnTo: string;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const AuthProvider = (props: AuthProviderProps) => {
  const loadingLabel = useString(loadingText)();
  const timeoutHeading = useString(authSessionTimeoutToastHeading)();
  const regEvent = useRef(true);
  const refreshTimeoutWeb = useRef(null);
  const [showNativePopup, setShowNativePopup] = useState(false);
  const {setStore, store} = useContext(StorageContext);
  const [authenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnTo, setReturnTo] = useState('');
  // auth hooks
  const {enableIDPAuth, idpLogout} = useIDPAuth();
  const {enableTokenAuth, tokenLogout} = useTokenAuth();
  // routing
  const history = useHistory();
  const location = useLocation();
  // client
  const apolloClient = useApolloClient();

  const indexesOf = (arr, item) =>
    arr.reduce((acc, v, i) => (v === item && acc.push(i), acc), []);
  const nonprodenv = ['dev', 'staging', 'preprod', 'test'];
  const timeout = indexesOf(nonprodenv, $config.BACKEND_ENDPOINT)
    ? 240600
    : 3540600;

  //not needed since cookies authentication removed
  const tokenRefreshWeb = () => {
    //cookie token expiry in staging - 5min and production - 1hr
    //since we can't read the cookies and its expiry details in the frontend
    //manully calling refresh before 59 sec
    //NOTE - IMP - if we call the refresh before or after 59 sec it won't work
    //staging - 4min 1 sec
    //production - 59min 1 sec
    // if (authenticated && $config.ENABLE_IDP_AUTH && isWeb()) {
    //   refreshTimeoutWeb.current = setTimeout(() => {
    //     fetch(`${$config.BACKEND_ENDPOINT}/v1/token/refresh`, {
    //       method: 'POST',
    //       credentials: 'include',
    //       headers: {
    //         'X-Platform-ID': getPlatformId(),
    //       },
    //     })
    //       .then((data) => {
    //         clearTimeout(refreshTimeoutWeb.current);
    //         tokenRefreshWeb();
    //       })
    //       .catch((error) => {
    //       });
    //   }, timeout);
    // } else if (!authenticated && $config.ENABLE_IDP_AUTH && isWeb()) {
    //   //not authenticated
    //   if (refreshTimeoutWeb.current) {
    //     clearTimeout(refreshTimeoutWeb.current);
    //   } else {
    //   }
    // }
  };

  // useEffect(() => {
  //   tokenRefreshWeb();
  // }, [authenticated]);

  useEffect(() => {
    if (!ENABLE_AUTH && !authenticated && store.token) {
      setIsAuthenticated(true);
      if (isAndroid() || isIOS()) {
        if (returnTo) {
          history.push(returnTo);
        }
      }
    }
  }, [store?.token]);

  const deepLinkUrl = (link: string | null) => {
    if (link !== null) {
      //deeplinking handling with authentication enabled
      if ($config.ENABLE_IDP_AUTH) {
        const url = processDeepLinkURI(link);
        try {
          //login link expiry fix
          if (url?.indexOf('msg') !== -1) {
            //adding time delay to open in app browser
            Toast.show({
              leadingIconName: 'alert',
              type: 'error',
              text1: timeoutHeading,
              visibilityTime: 3000,
            });
            setTimeout(() => {
              authLogin();
            }, 3000);
          } else if (url?.indexOf('authorize') !== -1) {
            const token = getParamFromURL(url, 'token');
            if (token) {
              enableTokenAuth(token)
                .then(() => {
                  setIsAuthenticated(true);
                  if (returnTo) {
                    history.push(returnTo);
                  } else {
                    history.push('/');
                  }
                })
                .catch(() => {
                  setIsAuthenticated(false);
                  console.log('debugging error on IDP token setting');
                });
            } else {
              console.log('debugging deep-linking token is empty');
              history.push('/');
            }
          } else if (url?.indexOf('authorize') === -1) {
            console.log('debugging deep-linking setting return to');
            setReturnTo(url);
          } else {
            history.push(url);
          }
        } catch (error) {
          console.log('debugging deep-linking error catch');
          history.push('/');
        }
      } else {
        //deeplinking handling with authentication enabled
        const url = processDeepLinkURI(link);
        setReturnTo(url);
      }
    }
  };

  useEffect(() => {
    //handling the deeplink for native
    if (isIOS() || isAndroid()) {
      const deepLink = async () => {
        const initialUrl = await Linking.getInitialURL();
        Linking.addEventListener('url', e => {
          deepLinkUrl(e.url);
        });
        deepLinkUrl(initialUrl);
      };
      deepLink();
    }
  }, [history]);

  useEffect(() => {
    if (isSDK() && regEvent.current) {
      regEvent.current = false;
      SDKMethodEventsManager.on('login', async (res, rej, token) => {
        try {
          setStore(prevState => {
            return {...prevState, token};
          });
          setTimeout(async () => {
            enableTokenAuth(token)
              .then(() => {
                res();
              })
              .catch(error => {
                rej('SDK Login failed' + JSON.stringify(error));
              });
          });
        } catch (error) {
          rej('SDK Login failed' + JSON.stringify(error));
        }
      });
      SDKMethodEventsManager.on('logout', async (res, rej) => {
        try {
          await tokenLogout();
          res();
        } catch (error) {
          rej('SDK Logout failed' + JSON.stringify(error));
        }
      });
    }

    if (!isSDK() && $config.ENABLE_TOKEN_AUTH) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: 'Token Server Authentication only supports SDK integration',
        text2: 'Please use Auth0 Authentication.',
        visibilityTime: 1000 * 60,
      });
    }
    if (isSDK() && $config.ENABLE_IDP_AUTH) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: 'Auth0 Authentication does not support SDK integration',
        text2: 'Please use Token Server Authentication.',
        visibilityTime: 1000 * 60,
      });
    }
  }, []);

  useEffect(() => {
    if (!authenticated && authError) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: authError,
        visibilityTime: 3000,
      });
    }
  }, [authenticated, authError]);

  async function getUserDetails() {
    try {
      await apolloClient.query({
        query: GET_USER,
        fetchPolicy: 'network-only',
      });
    } catch (error) {
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Ignore if on sdk since IDP flow is not supported
    // For unauthenticated flow authLogin should be called to get the token
    if (isSDK() && ENABLE_AUTH) {
      setIsAuthenticated(true);
      setLoading(false);
      return () => {};
    }
    //if application in authorization state then don't call authlogin
    if (
      //to check authoriztion
      location?.pathname?.indexOf('authorize') === -1 &&
      //to check login link expiry
      //login link expiry fix
      location?.search?.indexOf('msg') === -1
    ) {
      //fetch user details
      getUserDetails()
        .then(_ => {
          //Each time user refresh the page we have to redirect the user to IDP login.then only we can able to refresh the token
          //because we can't read the cookie so we don't know expirytime.
          //so each time page refresh will get new token
          //then only
          if (isWeb() && $config.ENABLE_IDP_AUTH) {
            //authLogin();this is for cookie based authentication
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          authLogin();
        });
    } else {
      if (location?.search?.indexOf('msg') !== -1) {
        Toast.show({
          leadingIconName: 'alert',
          type: 'error',
          text1: timeoutHeading,
          visibilityTime: 3000,
        });
        setTimeout(() => {
          authLogin();
        }, 3000);
        //new code
        //authLogin();
      } else {
        //it will render the children
        setLoading(false);
      }
    }
  }, []);

  const authLogin = () => {
    // Authenticated login flow
    if (ENABLE_AUTH) {
      //AUTH -> IDP -> NATIVE and WEB and DESKTOP
      if ($config.ENABLE_IDP_AUTH && !isSDK()) {
        //it will open external web link and post authentication it will redirect to application
        //@ts-ignore
        enableIDPAuth(
          isWeb()
            ? location.pathname
            : isDesktop()
            ? history
            : isIOS() || isAndroid()
            ? deepLinkUrl
            : '',
          timeoutHeading,
        )?.then((response: any) => {
          if (isAndroid() || isIOS()) {
            if (response && response?.showNativePopup) {
              setShowNativePopup(true);
            } else {
              setShowNativePopup(false);
            }
          }
        });
      }
      //AUTH -> IDP -> SDK ONLY
      else if ($config.ENABLE_TOKEN_AUTH && isSDK()) {
        enableTokenAuth()
          .then(res => {
            setIsAuthenticated(true);
            history.push('/create');
          })
          .catch(error => {
            //don't show token expire/not found toast in the sdk
            //we have event emitter to inform the customer application
            //they have to listen for those events
            if (!isSDK()) {
              if (error instanceof Error) {
                setAuthError(error.message);
              } else {
                setAuthError(error);
              }
            }
            setIsAuthenticated(false);
            //sdk there is no fallback page
            history.push('/create');
          });
      }
    }
    // Unauthenticated login flow
    else {
      fetch(GET_UNAUTH_FLOW_API_ENDPOINT(), {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(response => {
          // unauthenticated flow all platform we will have to handle the token manually
          // we need to store token manually
          if (!response.token) {
            throw new Error('Token not received');
          } else {
            enableTokenAuth(response.token)
              .then(() => {
                //set auth enabled on useEffect
              })
              .catch(error => {
                //we don't need to show token expire/not found toast in the sdk
                //we have event emitter to inform the customer application
                //they have to listen for those events
                if (!isSDK()) {
                  if (error instanceof Error) {
                    setAuthError(error.message);
                  } else {
                    setAuthError(error);
                  }
                }
                setIsAuthenticated(false);
              });
          }
        })
        .catch(error => {
          if (error instanceof Error) {
            setAuthError(error.message);
          } else {
            setAuthError(error);
          }
          setIsAuthenticated(false);
        });
    }
  };

  const authLogout = () => {
    if (ENABLE_AUTH && $config.ENABLE_IDP_AUTH && !isSDK()) {
      idpLogout(isAndroid() || isIOS() ? setShowNativePopup : {})
        .then(res => {
          setIsAuthenticated(false);
        })
        .catch(() => {
          setIsAuthenticated(false);
          console.error('user logout failed');
          setAuthError('Error occured on Logout, please try again.');
          setTimeout(() => {
            authLogin();
          }, 3000);
        });
    } else {
      if (!ENABLE_AUTH || isSDK()) {
        //no need to logout because we need token to see the create screen
        //unauth flow no logout
        //sdk with auth flow will use sdk api for logout
        history.push('/create');
      } else {
        tokenLogout()
          .then(res => {})
          .catch(() => {
            console.error('user logout failed');
            setAuthError('Error occured on Logout, please try again.');
          })
          .finally(() => {
            setIsAuthenticated(false);
          });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        setIsAuthenticated,
        authenticated,
        authLogin,
        authLogout,
        returnTo,
      }}>
      {showNativePopup ? (
        <UserCancelPopup
          login={() => {
            setShowNativePopup(false);
            authLogin();
          }}
          exitApp={() => {
            setShowNativePopup(false);
            exitApp();
          }}
          modalVisible={showNativePopup}
          setModalVisible={setShowNativePopup}
        />
      ) : (
        <></>
      )}
      {(!authenticated && !ENABLE_AUTH) || (ENABLE_AUTH && loading) ? (
        <Loading text={loadingLabel} />
      ) : (
        props.children
      )}
    </AuthContext.Provider>
  );
};
const useAuth = () => React.useContext(AuthContext);

export {AuthProvider, useAuth};
