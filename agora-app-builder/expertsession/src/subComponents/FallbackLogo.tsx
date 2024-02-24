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
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import UserAvatar from '../atoms/UserAvatar';
//import AnimatedRings from '../atoms/AnimatedRings';
import {useLayout, useContent} from 'customization-api';
import {BREAKPOINTS, isMobileUA} from '../utils/common';
import {
  getGridLayoutName,
  getPinnedLayoutName,
} from '../pages/video-call/DefaultLayouts';

export default function FallbackLogo(
  name: string,
  isActiveSpeaker?: boolean,
  hideAvatar?: boolean,
  isMax?: boolean,
  avatarSize?: number,
) {
  const {activeUids} = useContent();
  const {currentLayout} = useLayout();
  const {width} = useWindowDimensions();
  const isSmall = width < BREAKPOINTS.xl;
  const iconSize = Math.min(avatarSize, 100);
  const textSize = Math.min(avatarSize * 0.35, 32);
  return (
    <View style={[styles.container]}>
      {!hideAvatar ? (
        // <View
        //   style={[
        //     styles.activeSpeakerBg,
        //     (currentLayout === getGridLayoutName() && activeUids.length > 9) ||
        //     (currentLayout === getPinnedLayoutName() && !isMax)
        //       ? styles.activeSpeakerBgSmall
        //       : {},
        //     {
        //       backgroundColor: isActiveSpeaker
        //         ? $config.PRIMARY_ACTION_BRAND_COLOR +
        //           hexadecimalTransparency['15%']
        //         : 'transparent',
        //     },
        //   ]}>
        <UserAvatar
          name={name}
          //name={avatarSize}
          containerStyle={[
            //  styles.avatarBg,
            {
              width: iconSize,
              height: iconSize,
              borderRadius: iconSize / 2,
            },

            // currentLayout === getPinnedLayoutName() && !isMax
            //   ? styles.avatarBgSmall
            //   : {},
            // (!isMobileUA() &&
            //   currentLayout === getGridLayoutName() &&
            //   isSmall &&
            //   activeUids.length > 9) ||
            // (!isMobileUA() &&
            //   currentLayout === getPinnedLayoutName() &&
            //   isSmall &&
            //   !isMax)
            //   ? styles.avatarBgMobileUA
            //   : {},
            // isMobileUA() &&
            // (activeUids.length > 4 ||
            //   (currentLayout === getPinnedLayoutName() && !isMax))
            //   ? styles.avatarBgMobileUA
            //   : {},

            {
              backgroundColor: isActiveSpeaker
                ? $config.PRIMARY_ACTION_BRAND_COLOR
                : $config.VIDEO_AUDIO_TILE_AVATAR_COLOR,
            },
          ]}
          textStyle={[
            styles.textStyle,
            {fontSize: textSize, lineHeight: textSize},
          ]}
        />
      ) : (
        //</View>
        <></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: $config.VIDEO_AUDIO_TILE_COLOR,
    justifyContent: 'center',
  },
  // activeSpeakerBg: {
  //   width: 140,
  //   height: 140,
  //   borderRadius: 80,
  //   alignSelf: 'center',
  //   justifyContent: 'center',
  //   color: $config.VIDEO_AUDIO_TILE_COLOR,
  // },
  // activeSpeakerBgSmall: {
  //   width: 80,
  //   height: 80,
  // },
  avatarBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBgSmall: {
    width: 60,
    height: 60,
  },
  avatarBgMobileUA: {
    width: 45,
    height: 45,
  },
  textStyle: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: '600',
    color: $config.CARD_LAYER_1_COLOR,
  },
});
