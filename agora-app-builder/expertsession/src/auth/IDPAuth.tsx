import React, {useEffect} from 'react';
import {GET_USER, useAuth} from './AuthProvider';
import {useHistory, useParams} from '../components/Router';
import Loading from '../subComponents/Loading';
import {useApolloClient} from '@apollo/client';
import Toast from '../../react-native-toast-message';
import {getParamFromURL} from '../utils/common';
import useTokenAuth from './useTokenAuth';
import {useString} from '../utils/useString';
import {
  authAuthorizingApplicationText,
  authErrorOnLoginToastHeading,
} from '../language/default-labels/commonLabels';

export const IDPAuth = () => {
  const toastheading = useString(authErrorOnLoginToastHeading)();
  const text = useString(authAuthorizingApplicationText)();
  const {setIsAuthenticated, authLogin} = useAuth();
  const history = useHistory();
  const {token: returnTo}: {token: string} = useParams();
  //token used as returnTo and webToken is sent on the token query param
  const apolloClient = useApolloClient();
  const {enableTokenAuth} = useTokenAuth();

  async function getUserDetails() {
    try {
      await apolloClient.query({
        query: GET_USER,
        fetchPolicy: 'network-only',
      });
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const token = getParamFromURL(history.location.search, 'token');
    if (token) {
      enableTokenAuth(token)
        .then(() => {
          setIsAuthenticated(true);
          if (returnTo && returnTo.indexOf('authorize') === -1) {
            history.push('/' + returnTo);
          } else {
            history.push('/');
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
          console.log('debugging error on IDP token setting');
        });
    } else {
      setIsAuthenticated(false);
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: toastheading,
        visibilityTime: 3000,
      });
      setTimeout(() => {
        authLogin();
      }, 3000);
    }
  }, []);

  return <Loading text={text} />;
};
