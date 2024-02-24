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
import React, {useState, useRef} from 'react';
import {useWindowDimensions} from 'react-native';
import {UidType} from '../../agora-rn-uikit';
import useRemoteMute, {MUTE_REMOTE_TYPE} from '../utils/useRemoteMute';
import IconButton from '../atoms/IconButton';
import RemoteMutePopup from './RemoteMutePopup';
import {I18nMuteType, useContent} from 'customization-api';
import {calculatePosition} from '../utils/common';
import useRemoteRequest, {REQUEST_REMOTE_TYPE} from '../utils/useRemoteRequest';
/**
 * Component to mute / unmute remote video.
 * Sends a control message to another user over RTM if the local user is a host.
 * If the local user is not a host, it simply renders an image
 */
export interface RemoteVideoMuteProps {
  uid: UidType;
  video: boolean;
  isHost: boolean;
  userContainerRef: any;
}
const RemoteVideoMute = (props: RemoteVideoMuteProps) => {
  const btnRef = useRef(null);
  const {isHost = false, userContainerRef} = props;
  const muteRemoteVideo = useRemoteMute();
  const requestRemoteVideo = useRemoteRequest();
  const [showModal, setShowModal] = useState(false);
  const [pos, setPos] = useState({});
  const {defaultContent} = useContent();
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const onPress = () => {
    props?.video
      ? muteRemoteVideo(MUTE_REMOTE_TYPE.video, props.uid)
      : requestRemoteVideo(REQUEST_REMOTE_TYPE.video, props.uid);
    setShowModal(false);
  };
  return String(props.uid)[0] !== '1' ? (
    <>
      <RemoteMutePopup
        action={props?.video ? 'mute' : 'request'}
        type={I18nMuteType.video}
        actionMenuVisible={showModal}
        setActionMenuVisible={setShowModal}
        name={defaultContent[props.uid]?.name}
        modalPosition={pos}
        onMutePress={onPress}
      />
      <IconButton
        hoverEffect={true}
        hoverEffectStyle={{
          backgroundColor: $config.ICON_BG_COLOR,
          borderRadius: 20,
        }}
        setRef={ref => (btnRef.current = ref)}
        disabled={!isHost}
        onPress={() => {
          btnRef?.current?.measure(
            (
              _fx: number,
              _fy: number,
              localWidth: number,
              localHeight: number,
              px: number,
              py: number,
            ) => {
              const data = calculatePosition({
                px,
                py,
                localHeight,
                localWidth,
                globalHeight,
                globalWidth,
              });
              setPos(data);
              setShowModal(true);
            },
          );
        }}
        iconProps={{
          iconContainerStyle: {padding: 8},
          name: props?.video ? 'video-on' : 'video-off',
          iconSize: 20,
          iconType: 'plain',
          tintColor: props.video
            ? $config.PRIMARY_ACTION_BRAND_COLOR
            : $config.SEMANTIC_NEUTRAL,
        }}
      />
    </>
  ) : (
    <></>
  );
};

export default RemoteVideoMute;
