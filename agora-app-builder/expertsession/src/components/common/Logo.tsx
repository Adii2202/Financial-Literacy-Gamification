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
import {StyleSheet, Image} from 'react-native';
import {useHasBrandLogo} from '../../utils/common';
const Logo: React.FC = () => {
  const hasBrandLogo = useHasBrandLogo();
  const hasLogo = hasBrandLogo();
  if (!hasLogo) {
    return null;
  }

  return (
    <Image
      source={{uri: $config.LOGO}}
      style={style.logo}
      resizeMode="contain"
    />
  );
};
export default Logo;
const style = StyleSheet.create({
  logo: {
    width: 78,
    height: 26,
  },
});
