/*
********************************************
 Copyright © 2023 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React from 'react';
import {View, ScrollView, StyleSheet, ViewStyle} from 'react-native';
import {useCustomization} from 'customization-implementation';
import {isMobileUA} from '../../utils/common';
import Card from '../../atoms/Card';
import Spacer from '../../atoms/Spacer';
import IDPLogoutComponent from '../../auth/IDPLogoutComponent';

interface MeetingInfoProps {
  margin?: 'dense' | 'normal';
  padding?: 'dense' | 'normal';
  children: React.ReactNode;
  cardContainerStyle?: ViewStyle;
}

const MeetingInfo = (props: MeetingInfoProps) => {
  const {margin, padding, children, cardContainerStyle} = props;
  const {FpeShareComponent} = useCustomization(data => {
    let components: {
      FpeShareComponent?: React.ElementType;
    } = {};
    // commented for v1 release
    // if (
    //   data?.components?.share &&
    //   typeof data?.components?.share !== 'object'
    // ) {
    //   if (
    //     data?.components?.share &&
    //     isValidReactComponent(data?.components?.share)
    //   ) {
    //     components.FpeShareComponent = data?.components?.share;
    //   }
    // }
    return components;
  });

  return FpeShareComponent ? (
    <FpeShareComponent />
  ) : (
    <View style={style.root}>
      {!isMobileUA() ? (
        <IDPLogoutComponent containerStyle={{marginBottom: -100}} />
      ) : (
        <></>
      )}
      <ScrollView contentContainerStyle={style.scrollMain}>
        <Card
          margin={margin}
          padding={padding}
          cardContainerStyle={cardContainerStyle}>
          <View
            style={{display: 'flex', flex: 1, justifyContent: 'space-between'}}>
            {children}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default MeetingInfo;
export const style = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollMain: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
