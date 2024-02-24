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

import {ILocalVideoTrack, IRemoteVideoTrack} from 'agora-rtc-sdk-ng';
import React, {useEffect} from 'react';
import {StyleProp, StyleSheet, ViewProps, ViewStyle} from 'react-native';
import {VideoMirrorMode, VideoRenderMode} from 'react-native-agora';

export interface RtcSurfaceViewProps extends ViewProps {
  zOrderMediaOverlay?: boolean;
  zOrderOnTop?: boolean;
  renderMode?: any;
  channelId?: string;
  mirrorMode?: any;
}
export interface RtcUidProps {
  uid: number;
}
export interface StyleProps {
  style?: StyleProp<ViewStyle>;
}

interface SurfaceViewInterface
  extends RtcSurfaceViewProps,
    RtcUidProps,
    StyleProps {}

const SurfaceView = (props: SurfaceViewInterface) => {
  //   console.log('Surface View props', props);

  const stream: ILocalVideoTrack | IRemoteVideoTrack =
    props.uid === 0
      ? window.engine.localStream.video
      : props.uid === 1
      ? window.engine.screenStream.video
      : window.engine.remoteStreams.get(props.uid)?.video;
  // console.log(props, window.engine, stream);
  useEffect(
    function () {
      if (stream?.play) {
        if (props.renderMode === 2) {
          stream.play(String(props.uid), {fit: 'contain'});
        } else {
          stream.play(String(props.uid));
        }
      }
      return () => {
        console.log(`unmounting stream ${props.uid}`, stream);
        stream && stream.stop();
      };
    },
    [props.uid, props.renderMode, stream],
  );

  return stream ? (
    <div
      id={String(props.uid)}
      className={'video-container'}
      style={{...style.full, ...(props.style as Object), overflow: 'hidden'}}
    />
  ) : (
    <div style={{...style.full, backgroundColor: 'black'}} />
  );
};

const style = StyleSheet.create({
  full: {
    flex: 1,
  },
});

export default SurfaceView;
