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

import {useContent, useRtc} from 'customization-api';
import React from 'react';
import {MaxVideoView} from '../../../agora-rn-uikit';
import VideoFallback from './VideoFallback';

const VideoPreview = () => {
  const rtc = useRtc();
  rtc?.RtcEngineUnsafe?.startPreview();

  const {defaultContent, activeUids} = useContent();
  const [maxUid] = activeUids;

  if (!maxUid) {
    return null;
  }

  return (
    <MaxVideoView
      user={defaultContent[maxUid]}
      key={maxUid}
      fallback={VideoFallback}
      containerStyle={{
        width: '100%',
        height: '100%',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden',
      }}
      isFullView={true}
    />
  );
};

export default VideoPreview;
