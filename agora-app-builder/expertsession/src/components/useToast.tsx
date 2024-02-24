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
import React, {useState} from 'react';
import {createHook} from 'customization-implementation';

interface ToastContextInterface {
  isActionSheetVisible: boolean;
  setActionSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToastContext = React.createContext<ToastContextInterface>({
  isActionSheetVisible: false,
  setActionSheetVisible: () => {},
});

const ToastProvider = (props: {children: React.ReactNode}) => {
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  return (
    <ToastContext.Provider
      value={{
        isActionSheetVisible,
        setActionSheetVisible,
      }}>
      {props.children}
    </ToastContext.Provider>
  );
};

const useToast = createHook(ToastContext);

export {useToast, ToastContext, ToastProvider};
