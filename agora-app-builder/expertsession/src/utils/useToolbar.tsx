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

import React, {useEffect, useState} from 'react';
import {createHook} from 'customization-implementation';

export enum ToolbarPosition {
  top = 'TOP',
  bottom = 'BOTTOM',
  left = 'LEFT',
  right = 'RIGHT',
}

export interface ToolbarInferface {
  position?: ToolbarPosition;
  isHorizontal?: boolean;
}

const ToolbarContext = React.createContext<ToolbarInferface>({
  position: undefined,
  isHorizontal: true,
});

interface ToolbarProviderProps {
  value: ToolbarInferface;
  children: React.ReactNode;
}
const ToolbarProvider = (props: ToolbarProviderProps) => {
  const [isHorizontal, setIsHorizontal] = useState(true);
  useEffect(() => {
    if (
      props?.value?.position === ToolbarPosition.left ||
      props?.value?.position === ToolbarPosition.right
    ) {
      setIsHorizontal(false);
    } else {
      !isHorizontal && setIsHorizontal(true);
    }
  }, [props?.value?.position]);
  return (
    <ToolbarContext.Provider
      value={{position: props?.value?.position, isHorizontal}}>
      {props.children}
    </ToolbarContext.Provider>
  );
};

const useToolbar = createHook(ToolbarContext);

export {ToolbarProvider, useToolbar};
