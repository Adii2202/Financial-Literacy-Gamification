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

import React, {useContext, useEffect, useState} from 'react';
import Toast from '../../../react-native-toast-message';
import Error from '../../subComponents/Error';
type ErrorType = {
  name: string;
  message: string;
};
type ErrorContextType = {
  error: ErrorType | undefined;
  setGlobalErrorMessage: (error: any) => void;
  resetError: () => void;
};
const ErrorContext = React.createContext<ErrorContextType>({
  error: {name: '', message: ''},
  setGlobalErrorMessage: () => {},
  resetError: () => {},
});

const ErrorProvider = (props: {children: React.ReactNode}) => {
  const [error, setError] = useState<ErrorType>();
  const setGlobalErrorMessage = (error: ErrorType) => {
    setError(error);
  };
  const resetError = () => {
    setError(undefined);
  };
  return (
    <ErrorContext.Provider value={{error, setGlobalErrorMessage, resetError}}>
      {props.children}
    </ErrorContext.Provider>
  );
};

const CommonError: React.FC = () => {
  const {error} = useContext(ErrorContext);
  useEffect(() => {
    if (error?.name || error?.message) {
      Toast.show({
        leadingIconName: 'alert',
        type: 'error',
        text1: error.name,
        text2: error.message,
        visibilityTime: 1000 * 10,
        primaryBtn: null,
        secondaryBtn: null,
        leadingIcon: null,
      });
    }
  }, [error]);
  return <></>;
  // return error && (error.name || error.message) ? (
  //    <Error error={error} showBack={true} />
  // ) : (
  //   <></>
  // );
};
export {ErrorContext, ErrorProvider};
export default CommonError;
