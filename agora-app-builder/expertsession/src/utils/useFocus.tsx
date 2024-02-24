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

import React, {SetStateAction} from 'react';
import {createHook} from 'customization-implementation';

export interface currentFocus {
  editName: boolean;
}
export interface FocusContextInterface {
  currentFocus: currentFocus;
  setFocus: React.Dispatch<SetStateAction<currentFocus>>;
}

const FocusContext = React.createContext<FocusContextInterface>({
  currentFocus: {editName: false},
  setFocus: () => {},
});

interface FocusProviderProps {
  value: FocusContextInterface;
  children: React.ReactNode;
}
const FocusProvider = (props: FocusProviderProps) => {
  return (
    <FocusContext.Provider value={{...props.value}}>
      {props.children}
    </FocusContext.Provider>
  );
};

/**
 * The Focus app state governs the chatinput and editname.
 */
const useFocus = createHook(FocusContext);

export {FocusProvider, useFocus};
