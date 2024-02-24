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
import React from 'react';
import {Dimensions} from 'react-native';
import DimensionContext from './DimensionContext';

const DimensionProvider = (props: {children: React.ReactNode}) => {
  const getDimensionData = (width?: number, height?: number) => {
    (width = width ? width : Dimensions.get('window').width),
      (height = height ? height : Dimensions.get('window').height);
    const dim: [number, number, boolean] = [width, height, width > height];
    return {
      dim: dim,
      isDesktop: width < height + 150 ? false : true,
    };
  };

  return (
    <DimensionContext.Provider value={{getDimensionData}}>
      {props.children}
    </DimensionContext.Provider>
  );
};

export default DimensionProvider;
