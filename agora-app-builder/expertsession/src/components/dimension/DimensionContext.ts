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
import {createContext} from 'react';

interface DimensionContextInterface {
  getDimensionData: (
    width?: number,
    height?: number,
  ) => {dim: [number, number, boolean]; isDesktop: boolean};
}

const DimensionContext = createContext<DimensionContextInterface>({
  getDimensionData: () => {
    return {dim: [0, 0, false], isDesktop: false};
  },
});

export default DimensionContext;
