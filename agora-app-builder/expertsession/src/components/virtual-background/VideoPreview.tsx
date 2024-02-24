import {StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import {useContent, useLocalUserInfo, usePreCall} from 'customization-api';
import {MaxVideoView, RtcContext, useLocalUid} from '../../../agora-rn-uikit';
import {ToggleState} from '../../../agora-rn-uikit/src/Contexts/PropsContext';
import AgoraRTC from 'agora-rtc-sdk-ng';
import {useVB} from './useVB';
import ThemeConfig from '../../../src/theme';
import {isMobileUA} from '../../utils/common';
import InlineNotification from '../../atoms/InlineNotification';
import {useString} from '../../utils/useString';
import {vbPanelInfo} from '../../language/default-labels/precallScreenLabels';
interface VideoPreviewProps {
  isLocalVideoON?: boolean;
}

const VideoPreview = ({isLocalVideoON}: VideoPreviewProps) => {
  const {setPreviewVideoTrack, setSaveVB, previewVideoTrack} = useVB();
  const rtc = useContext(RtcContext);
  const vContainerRef = React.useRef(null);
  const {video: localVideoStatus} = useLocalUserInfo();
  const {isCameraAvailable} = usePreCall();
  const localUid = useLocalUid();

  const isMobileWeb = isMobileUA();
  const {defaultContent, activeUids} = useContent();
  const [maxUid] = activeUids;

  const fallbackText = useString<boolean>(vbPanelInfo);

  const createCameraTrack = async () => {
    if (isLocalVideoON && vContainerRef.current && !previewVideoTrack) {
      const localVideo = await AgoraRTC.createCameraVideoTrack();
      localVideo.play(vContainerRef.current);
      setPreviewVideoTrack(localVideo);
      return localVideo;
    }
    return null;
  };

  React.useEffect(() => {
    if (isMobileWeb) return;
    let localVideo = null;
    const initialize = async () => {
      localVideo = await createCameraTrack();
    };

    initialize();
    return () => {
      console.log('cleanup local preview');
      if (localVideo) {
        localVideo.stop();
        localVideo.close();
        setPreviewVideoTrack(null);
        setSaveVB(false);
      }
    };
  }, [isLocalVideoON]);

  return (
    <View
      style={
        isMobileWeb
          ? styles.mobilePreviewContainer
          : styles.desktopPreviewContainer
      }>
      {isMobileWeb ? (
        <MaxVideoView
          user={defaultContent[localUid]}
          key={localUid}
          fallback={() => <InlineNotification text={fallbackText(true)} />}
          isFullView={true}
          containerStyle={{
            width: '100%',
            height: '100%',
            borderRadius: 12,
          }}
        />
      ) : isLocalVideoON ? (
        <View ref={vContainerRef} style={styles.desktopPreview}></View>
      ) : (
        <InlineNotification text={fallbackText(isCameraAvailable)} />
      )}
    </View>
  );
};

export default VideoPreview;

const styles = StyleSheet.create({
  desktopPreviewContainer: {
    padding: 20,
    paddingBottom: 8,
    backgroundColor: $config.CARD_LAYER_1_COLOR,
    flex: 1,
  },
  mobilePreviewContainer: {
    flex: 1,
  },
  desktopPreview: {
    width: 300,
    height: 166,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
