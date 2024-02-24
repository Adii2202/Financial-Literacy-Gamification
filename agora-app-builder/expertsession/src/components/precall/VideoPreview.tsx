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

import {MaxVideoView} from '../../../agora-rn-uikit';

import {useContent} from 'customization-api';

import VideoFallback from './VideoFallback';
import {isMobileUA} from '../../utils/common';

const VideoPreview = () => {
  const {defaultContent, activeUids} = useContent();
  const [maxUid] = activeUids;
  const isMobileView = isMobileUA();

  const mobileContainerStyle = {
    borderRadius: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  };

  if (!maxUid) {
    return null;
  }

  return (
    <MaxVideoView
      user={defaultContent[maxUid]}
      key={maxUid}
      fallback={VideoFallback}
      containerStyle={{
        minHeight: 200,
        width: '100%',
        height: '100%',
        borderRadius: 8,
        ...(isMobileView ? mobileContainerStyle : {}),
      }}
      isFullView={true}
    />
  );
};

export default VideoPreview;
