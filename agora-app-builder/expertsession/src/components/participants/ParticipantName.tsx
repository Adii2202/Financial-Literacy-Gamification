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
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Platform,
  Text,
} from 'react-native';
import TextWithToolTip from '../../subComponents/TextWithTooltip';
import {RFValue} from 'react-native-responsive-fontsize';
import {isWebInternal} from '../../utils/common';

const ParticipantName = ({value}: {value: string}) => {
  const {height, width} = useWindowDimensions();
  const fontSize = isWebInternal() ? 14 : 16;
  return (
    <View style={{flex: 1}}>
      <TextWithToolTip
        value={value}
        style={[
          style.participantText,
          {
            fontSize: RFValue(fontSize, height > width ? height : width),
          },
        ]}
      />
    </View>
  );
};
export default ParticipantName;

const style = StyleSheet.create({
  participantText: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'Source Sans Pro',
    flexDirection: 'row',
    color: $config.FONT_COLOR,
    textAlign: 'left',
    textTransform: 'capitalize',
  },
});
