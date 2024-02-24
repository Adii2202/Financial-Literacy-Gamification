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
import {SidePanelType} from '../subComponents/SidePanelEnum';
import {createHook} from 'customization-implementation';

export interface SidePanelContextInterface {
  sidePanel: SidePanelType;
  setSidePanel: React.Dispatch<SetStateAction<SidePanelType>>;
}

const SidePanelContext = React.createContext<SidePanelContextInterface>({
  sidePanel: SidePanelType.None,
  setSidePanel: () => {},
});

interface SidePanelProviderProps {
  value: SidePanelContextInterface;
  children: React.ReactNode;
}
const SidePanelProvider = (props: SidePanelProviderProps) => {
  return (
    <SidePanelContext.Provider value={{...props.value}}>
      {props.children}
    </SidePanelContext.Provider>
  );
};

/**
 * The Side panel app state governs the side panel.
 */
const useSidePanel = createHook(SidePanelContext);

export {SidePanelProvider, useSidePanel};
