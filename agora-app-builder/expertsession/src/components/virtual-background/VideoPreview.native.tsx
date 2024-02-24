import React from 'react';
import {MaxVideoView, useLocalUid} from '../../../agora-rn-uikit';
import {useContent, usePreCall, useRtc} from 'customization-api';
import InlineNotification from '../../atoms/InlineNotification';
import {useString} from '../../utils/useString';
import {vbPanelInfo} from '../../language/default-labels/precallScreenLabels';

interface VideoPreviewProps {
  isLocalVideoON?: boolean;
}

const VideoPreview = ({isLocalVideoON = false}: VideoPreviewProps) => {
  const {defaultContent} = useContent();
  const {isCameraAvailable} = usePreCall();
  const localUid = useLocalUid();

  const rtc = useRtc();
  const fallbackText = useString<boolean>(vbPanelInfo);
  rtc?.RtcEngineUnsafe?.startPreview();

  if (!isLocalVideoON) {
    return <InlineNotification text={fallbackText(isCameraAvailable)} />;
  }

  return (
    <MaxVideoView
      user={defaultContent[localUid]}
      key={localUid}
      fallback={() => (
        <InlineNotification text={fallbackText(isCameraAvailable)} />
      )}
      isFullView={true}
      containerStyle={{
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    />
  );
};

export default VideoPreview;
