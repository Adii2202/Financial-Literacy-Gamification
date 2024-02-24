import React, {useContext} from 'react';
import {whiteboardContext} from './WhiteboardConfigure';
import VideoRenderer from '../../pages/video-call/VideoRenderer';
import {useContent} from 'customization-api';
import WhiteboardView from './WhiteboardView';

const WhiteboardWrapper = () => {
  const {getWhiteboardUid} = useContext(whiteboardContext);
  const {customContent, pinnedUid, activeUids} = useContent();

  if (
    customContent &&
    getWhiteboardUid() &&
    customContent[getWhiteboardUid()]?.uid
  ) {
    return (
      <VideoRenderer
        isMax={
          getWhiteboardUid() === pinnedUid ||
          getWhiteboardUid() === activeUids[0]
        }
        user={{
          uid: customContent[getWhiteboardUid()]?.uid,
          type: 'whiteboard',
          video: 0,
          audio: 0,
          parentUid: undefined,
          name: 'Whiteboard',
          muted: undefined,
        }}
        CustomChild={WhiteboardView}
      />
    );
  }
  return null;
};

export default WhiteboardWrapper;
