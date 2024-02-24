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
 * A translucent watermark image that can added in various parts of the the application.
 * Not in use at the moment
 */
const Watermark = () => {
  return (
    // <View>
    <Image
      source={{uri: $config.LOGO}}
      style={styles.image}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    bottom: '2%',
    left: '3%',
    width: 90,
    height: 30,
    zIndex: 100,
    opacity: 0.5,
  },
});

export default Watermark;
