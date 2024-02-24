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
import {Image, StyleSheet} from 'react-native';

/**
 * Displays the illustration.
 */
const Illustration = () => {
  return (
    <Image
      style={styles.illustration}
      resizeMode={'contain'}
      source={{
        uri:
          $config.BG === ''
            ? 'https://gist.githubusercontent.com/EkaanshArora/59ae6969456f8e95f9752a4adf96bb44/raw/4c3831d115b4f9de0219e8658f049927b0ed9271/image.svg'
            : $config.BG,
      }}
    />
  );
};

const styles = StyleSheet.create({
  illustration: {flex: 1},
});
export default Illustration;
