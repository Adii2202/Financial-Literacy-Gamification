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
import {StyleSheet, View, ViewProps} from 'react-native';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

export default function HorizontalRule(props: ViewProps) {
  return <View style={[styles.ruler, props?.style]} />;
}

const styles = StyleSheet.create({
  ruler: {
    borderBottomColor:
      $config.PRIMARY_ACTION_BRAND_COLOR + hexadecimalTransparency['80%'],
    borderBottomWidth: 1,
    margin: '2%',
    width: '100%',
    maxWidth: 200,
  },
});
