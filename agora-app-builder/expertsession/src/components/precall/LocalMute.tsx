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
import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {useCustomization} from 'customization-implementation';
import {
  isAndroid,
  isIOS,
  isMobileUA,
  isValidReactComponent,
} from '../../utils/common';
import LocalVideoMute, {
  LocalVideoMuteProps,
} from '../../subComponents/LocalVideoMute';
import LocalAudioMute, {
  LocalAudioMuteProps,
} from '../../subComponents/LocalAudioMute';

import {usePreCall} from './usePreCall';
import DeviceContext from '../DeviceContext';
import VBButton from '../virtual-background/VBButton';
import {ToolbarItem} from 'customization-api';
import IconButton from '../../atoms/IconButton';

interface PreCallProps {
  isMobileView?: boolean;
  isSettingsOpen?: boolean;
  setIsSettingsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isVBOpen?: boolean;
  setIsVBOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreCallLocalMute = (props: PreCallProps) => {
  const {VideoMute, AudioMute} = useCustomization(data => {
    let components: {
      VideoMute: React.ComponentType<LocalAudioMuteProps>;
      AudioMute: React.ComponentType<LocalVideoMuteProps>;
    } = {
      AudioMute: LocalAudioMute,
      VideoMute: LocalVideoMute,
    };
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall === 'object'
    // ) {
    //   if (
    //     data.components?.precall?.audioMute &&
    //     typeof data.components?.precall?.audioMute !== 'object'
    //   ) {
    //     if (
    //       data.components?.precall?.audioMute &&
    //       isValidReactComponent(data.components?.precall?.audioMute)
    //     ) {
    //       components.AudioMute = data.components?.precall?.audioMute;
    //     }
    //   }

    //   if (
    //     data.components?.precall?.videoMute &&
    //     typeof data.components?.precall?.videoMute !== 'object'
    //   ) {
    //     if (
    //       data.components?.precall?.videoMute &&
    //       isValidReactComponent(data.components?.precall?.videoMute)
    //     ) {
    //       components.VideoMute = data.components?.precall?.videoMute;
    //     }
    //   }
    // }
    return components;
  });
  const {
    isMobileView = false,
    isSettingsOpen,
    setIsSettingsOpen,
    isVBOpen,
    setIsVBOpen,
  } = props;
  const isNative = isAndroid() || isIOS();
  // for mweb check for camera * mic availablity for desktop it happens in settings panel
  // refactor later to set mic/camera availablity oustside settings panel <selectDevice>
  const {deviceList} = useContext(DeviceContext);
  const {setCameraAvailable, setMicAvailable} = usePreCall();

  const audioDevices = deviceList.filter(device => {
    if (device.kind === 'audioinput') {
      return true;
    }
  });
  const videoDevices = deviceList.filter(device => {
    if (device.kind === 'videoinput') {
      return true;
    }
  });
  useEffect(() => {
    if (audioDevices && audioDevices.length) {
      isMobileView && !isNative && setMicAvailable(true);
    }
  }, [audioDevices]);

  useEffect(() => {
    if (videoDevices && videoDevices.length) {
      isMobileView && !isNative && setCameraAvailable(true);
    }
  }, [videoDevices]);
  return (
    <View
      style={[
        style.precallControls,
        isMobileView && {
          paddingVertical: 10,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          flex: 1,
        },
      ]}
      testID="precall-controls">
      <AudioMute showToolTip={true} />

      {!$config.AUDIO_ROOM && (
        <View style={{marginLeft: isMobileView ? 24 : 16}}>
          <VideoMute showToolTip={true} />
        </View>
      )}

      {$config.ENABLE_VIRTUAL_BACKGROUND &&
        !$config.AUDIO_ROOM &&
        isMobileView && (
          <View style={{marginLeft: isMobileView ? 24 : 16}}>
            <VBButton isVBOpen={isVBOpen} setIsVBOpen={setIsVBOpen} />
          </View>
        )}
    </View>
  );
};

const SettingsButton = ({isSettingsOpen, setIsSettingsOpen}) => {
  return (
    <ToolbarItem>
      <IconButton
        hoverEffect={true}
        iconProps={{
          iconBackgroundColor: isSettingsOpen
            ? $config.PRIMARY_ACTION_BRAND_COLOR
            : '',
          tintColor: $config.SECONDARY_ACTION_COLOR,
          name: 'settings',
          iconSize: 26,
        }}
        btnTextProps={{
          textColor: $config.FONT_COLOR,
          text: isSettingsOpen ? 'Hide Settings' : 'Show Settings',
        }}
        onPress={() => {
          setIsSettingsOpen(prev => !prev);
        }}
      />
    </ToolbarItem>
  );
};
export const PreCallLocalMuteComponentsArray: [
  (props: LocalAudioMuteProps) => JSX.Element,
  (props: LocalVideoMuteProps) => JSX.Element,
] = [LocalAudioMute, LocalVideoMute];

export default PreCallLocalMute;

const style = StyleSheet.create({
  precallControls: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: $config.CARD_LAYER_1_COLOR,
  },
});
