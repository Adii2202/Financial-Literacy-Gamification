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

import React, {
  SetStateAction,
  useState,
  useContext,
  useEffect,
  useRef,
} from 'react';
import {createHook} from 'customization-implementation';
import InvitePopup from './popups/InvitePopup';
import StopRecordingPopup from './popups/StopRecordingPopup';
import StartScreenSharePopup from './popups/StartScreenSharePopup';
import StopScreenSharePopup from './popups/StopScreenSharePopup';
import {SdkApiContext} from './SdkApiContext';
import {UidType, useRoomInfo} from 'customization-api';
import SDKEvents from '../utils/SdkEvents';
import DeviceContext from './DeviceContext';
import useSetName from '../utils/useSetName';
import WhiteboardClearAllPopup from './popups/WhiteboardClearAllPopup';

interface InViewPortState {
  [key: number]: boolean;
}
export interface VideoCallContextInterface {
  showInvitePopup: boolean;
  setShowInvitePopup: React.Dispatch<SetStateAction<boolean>>;
  showStopRecordingPopup: boolean;
  setShowStopRecordingPopup: React.Dispatch<SetStateAction<boolean>>;
  showLayoutOption: boolean;
  setShowLayoutOption: React.Dispatch<SetStateAction<boolean>>;
  showStartScreenSharePopup: boolean;
  setShowStartScreenSharePopup: React.Dispatch<SetStateAction<boolean>>;
  showStopScreenSharePopup: boolean;
  setShowStopScreenSharePopup: React.Dispatch<SetStateAction<boolean>>;
  enablePinForMe: boolean;
  setEnablePinForMe: React.Dispatch<SetStateAction<boolean>>;
  videoTileInViewPortState: InViewPortState;
  setVideoTileInViewPortState: (uid: UidType, visible: boolean) => void;
  showWhiteboardClearAllPopup: boolean;
  setShowWhiteboardClearAllPopup: React.Dispatch<SetStateAction<boolean>>;
}

const VideoCallContext = React.createContext<VideoCallContextInterface>({
  showInvitePopup: false,
  setShowInvitePopup: () => {},
  showStopRecordingPopup: false,
  setShowStopRecordingPopup: () => {},
  showLayoutOption: false,
  setShowLayoutOption: () => {},
  showStartScreenSharePopup: false,
  setShowStartScreenSharePopup: () => {},
  showStopScreenSharePopup: false,
  setShowStopScreenSharePopup: () => {},
  enablePinForMe: true,
  setEnablePinForMe: () => {},
  videoTileInViewPortState: {},
  setVideoTileInViewPortState: () => {},
  showWhiteboardClearAllPopup: false,
  setShowWhiteboardClearAllPopup: () => {},
});

interface VideoCallProviderProps {
  children: React.ReactNode;
}
const VideoCallProvider = (props: VideoCallProviderProps) => {
  const [showWhiteboardClearAllPopup, setShowWhiteboardClearAllPopup] =
    useState(false);
  const [enablePinForMe, setEnablePinForMe] = useState(true);
  const [showLayoutOption, setShowLayoutOption] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [showStopRecordingPopup, setShowStopRecordingPopup] = useState(false);
  const [showStartScreenSharePopup, setShowStartScreenSharePopup] =
    useState(false);
  const [showStopScreenSharePopup, setShowStopScreenSharePopup] =
    useState(false);
  const {join, enterRoom} = useContext(SdkApiContext);
  const roomInfo = useRoomInfo();
  const {deviceList} = useContext(DeviceContext);
  const setUsername = useSetName();
  //const videoTileInViewPortStateRef = useRef({});
  const [videoTileInViewPortState, setVideoTileInViewPortStateL] = useState({});

  const setVideoTileInViewPortState = (uid: UidType, visible: boolean) => {
    //videoTileInViewPortStateRef.current[uid] = visible;
    setVideoTileInViewPortStateL(prevState => {
      return {
        ...prevState,
        [uid]: visible,
      };
    });
  };

  useEffect(() => {
    if (join.initialized && join.phrase) {
      if (join.userName && join.skipPrecall) {
        setUsername(join.userName);
      }
      join.promise.res(roomInfo.data);
    }
    if (enterRoom.promise) {
      enterRoom.promise.res(roomInfo.data);
    }
    SDKEvents.emit(
      'join',
      roomInfo.data.meetingTitle,
      deviceList,
      roomInfo.data.isHost,
    );
  }, []);
  return (
    <VideoCallContext.Provider
      value={{
        showInvitePopup,
        setShowInvitePopup,
        showStopRecordingPopup,
        setShowStopRecordingPopup,
        showLayoutOption,
        setShowLayoutOption,
        showStartScreenSharePopup,
        setShowStartScreenSharePopup,
        showStopScreenSharePopup,
        setShowStopScreenSharePopup,
        enablePinForMe,
        setEnablePinForMe,
        setVideoTileInViewPortState,
        //videoTileInViewPortState: videoTileInViewPortStateRef.current,
        videoTileInViewPortState,
        showWhiteboardClearAllPopup,
        setShowWhiteboardClearAllPopup,
      }}>
      <StartScreenSharePopup />
      <StopScreenSharePopup />
      <StopRecordingPopup />
      <InvitePopup />
      <WhiteboardClearAllPopup />
      {props.children}
    </VideoCallContext.Provider>
  );
};

/**
 *
 */
const useVideoCall = createHook(VideoCallContext);

export {VideoCallProvider, useVideoCall};
