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
import React, {useContext} from 'react';
import {CustomizationApiInterface} from 'customization-api';
import customizationConfig from 'customization';
import createHook from './createHook';
import {SdkApiContext} from '../src/components/SdkApiContext';

const CustomizationContext: React.Context<CustomizationApiInterface> =
  React.createContext(customizationConfig);

const CustomizationProvider: React.FC = (props) => {
  const {customize: userCustomization} = useContext(SdkApiContext);

  return (
    <CustomizationContext.Provider value={userCustomization.customization}>
      {props.children}
    </CustomizationContext.Provider>
  );
};

const useCustomization = createHook(CustomizationContext);

export {useCustomization, CustomizationProvider};
