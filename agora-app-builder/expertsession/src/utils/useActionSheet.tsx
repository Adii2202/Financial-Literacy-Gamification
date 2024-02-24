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
import {useToolbar} from './useToolbar';

export interface ActionSheetInferface {
  isOnActionSheet: boolean;
  isOnFirstRow: boolean;
  showLabel: boolean;
}

const ActionSheetContext = React.createContext<ActionSheetInferface>({
  isOnActionSheet: false,
  isOnFirstRow: false,
  showLabel: $config.ICON_TEXT,
});

interface ActionSheetProviderProps {
  children: React.ReactNode;
  isOnFirstRow?: boolean;
}
const ActionSheetProvider = (props: ActionSheetProviderProps) => {
  const {position} = useToolbar();
  return (
    <ActionSheetContext.Provider
      value={{
        isOnActionSheet: true,
        isOnFirstRow: props?.isOnFirstRow,
        showLabel:
          !props?.isOnFirstRow && $config.ICON_TEXT && position !== undefined,
      }}>
      {props.children}
    </ActionSheetContext.Provider>
  );
};

const useActionSheet = createHook(ActionSheetContext);

export {ActionSheetProvider, useActionSheet};
