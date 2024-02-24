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

import {PropsContext, UidType} from '../../agora-rn-uikit';
import React, {useContext} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {useString} from '../utils/useString';
import {useScreenshare} from './screenshare/useScreenshare';
import ImageIcon from '../atoms/ImageIcon';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {useLayout} from 'customization-api';
import {getPinnedLayoutName} from '../pages/video-call/DefaultLayouts';
import {
  videoRoomScreenshareOverlayText,
  videoRoomScreenshareStopSharingBtnText,
} from '../language/default-labels/videoCallScreenLabels';
/**
 *
 * @param uid - uid of the user
 * @returns This component display overlay message "Screen sharing is active now" if user started sharing the screen.
 * why its needed : To prevent screensharing tunneling effect
 *
 */
function ScreenShareNotice({uid, isMax}: {uid: UidType; isMax: boolean}) {
  const screensharingActiveOverlayLabel = useString(
    videoRoomScreenshareOverlayText,
  )();
  const stopsharingbtnText = useString(
    videoRoomScreenshareStopSharingBtnText,
  )();
  const {currentLayout} = useLayout();
  const {stopUserScreenShare} = useScreenshare();
  const {rtcProps} = useContext(PropsContext);
  return uid === rtcProps?.screenShareUid ? (
    <View style={styles.screenSharingMessageContainer}>
      <Text
        style={
          !isMax && currentLayout === getPinnedLayoutName()
            ? styles.screensharingMessageMin
            : styles.screensharingMessage
        }>
        {screensharingActiveOverlayLabel}
      </Text>
      {!isMax && currentLayout === getPinnedLayoutName() ? (
        <></>
      ) : (
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={() => stopUserScreenShare()}>
          <View style={styles.iconContainer}>
            <ImageIcon
              iconType="plain"
              iconSize={20}
              name={'close'}
              tintColor={$config.SEMANTIC_ERROR}
            />
          </View>
          <View style={styles.btnTextContainer}>
            <Text style={styles.btnText}>{stopsharingbtnText}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  iconContainer: {
    marginVertical: 12,
    marginLeft: 16,
    marginRight: 12,
    backgroundColor: $config.PRIMARY_ACTION_TEXT_COLOR,
    alignSelf: 'center',
    width: 20,
    height: 20,
  },
  btnContainer: {
    alignSelf: 'center',
    backgroundColor: $config.SEMANTIC_ERROR,
    borderRadius: 8,
    height: 40,
    maxWidth: 129,
    flexDirection: 'row',
  },
  btnTextContainer: {
    marginVertical: 12,
    marginRight: 16,
  },
  btnText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
  },
  screenSharingMessageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor:
      $config.HARD_CODED_BLACK_COLOR + hexadecimalTransparency['80%'],
    borderRadius: 4,
  },
  screensharingMessageMin: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 20,
    color: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
  },
  screensharingMessage: {
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 32,
    lineHeight: 40,
    color: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
    paddingBottom: 24,
  },
});

export default ScreenShareNotice;
