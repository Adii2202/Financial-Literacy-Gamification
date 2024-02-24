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
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import {DispatchContext, UidType} from '../../../agora-rn-uikit';
import {
  getGridLayoutName,
  getPinnedLayoutName,
  useChangeDefaultLayout,
  useSetPinnedLayout,
} from '../../pages/video-call/DefaultLayouts';
import {useScreenContext} from '../../components/contexts/ScreenShareContext';
import events from '../../rtm-events-api';
import {EventNames, EventActions} from '../../rtm-events';
import {useLayout, useContent, useRtc} from 'customization-api';
import {filterObject} from '../../utils';
import {ScreenshareContext} from './useScreenshare';
import useMuteToggleLocal, {
  MUTE_LOCAL_TYPE,
} from '../../utils/useMuteToggleLocal';
import {useLocalUserInfo} from '../../app-state/useLocalUserInfo';
import {LocalVideoStreamError} from 'react-native-agora';
import useAppState from '../../utils/useAppState';

export const ScreenshareContextConsumer = ScreenshareContext.Consumer;

export const ScreenshareConfigure = (props: {children: React.ReactNode}) => {
  const [isScreenshareActive, setScreenshareActive] = useState(false);
  const isAndroidScreenShareStarted = useRef(false);
  const appState = useAppState();
  const processRef = useRef(false);
  const enableVideoRef = useRef(false);
  const {RtcEngineUnsafe} = useRtc();
  const {dispatch} = useContext(DispatchContext);
  const {defaultContent, activeUids, pinnedUid, secondaryPinnedUid} =
    useContent();
  const isPinned = useRef(0);
  const {setScreenShareData, screenShareData, setScreenShareOnFullView} =
    useScreenContext();
  const setPinnedLayout = useSetPinnedLayout();
  const changeLayout = useChangeDefaultLayout();
  const {currentLayout} = useLayout();
  const defaultContentRef = useRef({defaultContent: defaultContent});
  const currentLayoutRef = useRef({currentLayout: currentLayout});
  const pinnedUidRef = useRef({pinnedUid: pinnedUid});
  const secondaryPinnedUidRef = useRef({
    secondaryPinnedUid: secondaryPinnedUid,
  });
  const screenShareDataRef = useRef({screenShareData: screenShareData});
  const localMute = useMuteToggleLocal();
  const {video} = useLocalUserInfo();
  useEffect(() => {
    pinnedUidRef.current.pinnedUid = pinnedUid;
  }, [pinnedUid]);

  useEffect(() => {
    secondaryPinnedUidRef.current.secondaryPinnedUid = secondaryPinnedUid;
  }, [secondaryPinnedUid]);

  useEffect(() => {
    screenShareDataRef.current.screenShareData = screenShareData;
  }, [screenShareData]);

  useEffect(() => {
    defaultContentRef.current.defaultContent = defaultContent;
  }, [defaultContent]);

  useEffect(() => {
    currentLayoutRef.current.currentLayout = currentLayout;
  }, [currentLayout]);

  useEffect(() => {
    const data = filterObject(screenShareData, ([k, v]) => v?.isActive);
    if (data) {
      const recentScreenshare = Object.keys(data)
        .map(i => parseInt(i))
        .sort((a, b) => {
          return data[a].ts - data[b].ts;
        });
      if (recentScreenshare?.length) {
        recentScreenshare.reverse();
        if (
          isPinned.current !== recentScreenshare[0] &&
          activeUids.indexOf(recentScreenshare[0]) !== -1
        ) {
          triggerChangeLayout(
            true,
            recentScreenshare[0],
            defaultContentRef.current.defaultContent[recentScreenshare[0]]
              ?.parentUid,
          );
        }
      }
    }
  }, [activeUids, screenShareData]);

  const triggerChangeLayout = (
    pinned: boolean,
    screenShareUid?: UidType,
    parentUid?: UidType,
  ) => {
    let layout = currentLayoutRef.current.currentLayout;
    //screenshare is started set the layout to Pinned View
    if (pinned && screenShareUid) {
      isPinned.current = screenShareUid;
      dispatch({
        type: 'UserPin',
        value: [screenShareUid],
      });
      if (parentUid && !secondaryPinnedUidRef.current.secondaryPinnedUid) {
        dispatch({
          type: 'UserSecondaryPin',
          value: [parentUid],
        });
      } else if (
        parentUid &&
        secondaryPinnedUidRef.current.secondaryPinnedUid
      ) {
        dispatch({
          type: 'ActiveSpeaker',
          value: [parentUid],
        });
      }
      layout !== getPinnedLayoutName() && setPinnedLayout();
    } else {
      isPinned.current = 0;
      //screenshare is stopped set the layout Grid View
      layout !== getGridLayoutName() && changeLayout();
    }
  };

  useEffect(() => {
    RtcEngineUnsafe?.addListener(
      'LocalVideoStateChanged',
      (localVideoState, error) => {
        if (Platform.OS === 'android') {
          switch (error) {
            case LocalVideoStreamError.ScreenCapturePermissionDenied:
              isAndroidScreenShareStarted.current = false;
              break;
          }
        } else {
          switch (error) {
            case LocalVideoStreamError.ExtensionCaptureStarted:
              processRef.current = true;
              setScreenshareActive(true);
              break;
            case LocalVideoStreamError.ExtensionCaptureStoped:
            case LocalVideoStreamError.ExtensionCaptureDisconnected:
            case LocalVideoStreamError.ScreenCapturePermissionDenied:
              processRef.current = true;
              setScreenshareActive(false);
              break;
            default:
              break;
          }
        }
      },
    );
    const unsubScreenShareAttribute = events.on(
      EventNames.SCREENSHARE_ATTRIBUTE,
      data => {
        const payload = JSON.parse(data.payload);
        const action = payload.action;
        const value = payload.value;

        const screenUidOfUser =
          defaultContentRef.current.defaultContent[data.sender].screenUid;
        switch (action) {
          case EventActions.SCREENSHARE_STARTED:
            setScreenShareData(prevState => {
              return {
                ...prevState,
                [screenUidOfUser]: {
                  ...prevState[screenUidOfUser],
                  name: defaultContentRef.current.defaultContent[
                    screenUidOfUser
                  ]?.name,
                  isActive: true,
                  ts: value || 0,
                },
              };
            });
            break;
          case EventActions.SCREENSHARE_STOPPED:
            //if user pinned some remote screenshare view as fullscreen view on native and remote stop the screenshare
            //then we need to exit the fullscreen view
            if (
              screenShareDataRef.current.screenShareData[screenUidOfUser] &&
              screenShareDataRef.current.screenShareData[screenUidOfUser]
                ?.isExpanded
            ) {
              setScreenShareOnFullView(false);
            }
            setScreenShareData(prevState => {
              return {
                ...prevState,
                [screenUidOfUser]: {
                  ...prevState[screenUidOfUser],
                  isExpanded: false,
                  name: defaultContentRef.current.defaultContent[
                    screenUidOfUser
                  ]?.name,
                  isActive: false,
                  ts: value || 0,
                },
              };
            });
            //if remote user started/stopped the screenshare then change the layout to pinned/grid
            //if user pinned somebody then don't triggerlayout change
            if (!pinnedUidRef.current.pinnedUid) {
              triggerChangeLayout(false);
            }
            if (screenUidOfUser === pinnedUidRef.current.pinnedUid) {
              triggerChangeLayout(false);
              dispatch({
                type: 'UserPin',
                value: [0],
              });
            }
            break;
          default:
            break;
        }
      },
    );

    return () => {
      unsubScreenShareAttribute();
    };
  }, []);

  const startUserScreenshare = async (captureAudio: boolean = false) => {
    if (!isScreenshareActive) {
      // either user can publish local video or screenshare stream
      // so if user video is turned on then we are turning off video before screenshare
      await RtcEngineUnsafe?.startScreenCapture({
        captureVideo: true,
        captureAudio,
      });
      /**
       * android -> user will see the confirmation popup from the system,
       * if user denied permission we will update isAndroidScreenShareStarted.current as false in the video state change callback
       * if user allowed permission we will update screenshare as active in appState useeffect
       */
      if (Platform.OS === 'android') {
        isAndroidScreenShareStarted.current = true;
      }
      //For ios will update state in the video state changed callback
    } else {
      console.log('screenshare is already active');
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (
        appState === 'active' &&
        isAndroidScreenShareStarted.current === true
      ) {
        isAndroidScreenShareStarted.current = false;
        processRef.current = true;
        setScreenshareActive(true);
      }
    }, 1000);
  }, [appState]);

  const stopUserScreenShare = async (
    enableVideo: boolean = false,
    forceStop: boolean = false,
  ) => {
    if (isScreenshareActive || forceStop) {
      enableVideoRef.current = enableVideo;
      await RtcEngineUnsafe?.stopScreenCapture();
      if (Platform.OS === 'android') {
        processRef.current = true;
        setScreenshareActive(false);
      }
      //For ios will update state in the video state changed callback
    } else {
      console.log('no screenshare is active');
    }
  };

  useEffect(() => {
    if (processRef.current) {
      //native screenshare is started
      if (isScreenshareActive) {
        //to increase the performance - stop incoming video stream
        RtcEngineUnsafe.muteAllRemoteVideoStreams(true);

        //since native screenshare uses local user video
        //we need to turn on video if its off.
        //otherwise remote user can't see the screen shared from the mobile
        if (!video) {
          localMute(MUTE_LOCAL_TYPE.video);
        }
      }
      //native screenshare is stopped
      else {
        //resume the incoming video stream
        RtcEngineUnsafe.muteAllRemoteVideoStreams(false);

        //edge case - if screenshare is going on and user want to enable the video
        //then we will inform the user to stop screenshare and start camera
        //in that case if video is off then turned it on.
        //if video is on - that's fine
        if (enableVideoRef.current) {
          enableVideoRef.current = false;
          if (!video) {
            localMute(MUTE_LOCAL_TYPE.video);
          }
        }
        //regular usecase - once screenshare stopped will stop user video - since screenshare uses local user video
        else {
          //
          if (video) {
            localMute(MUTE_LOCAL_TYPE.video);
          }
        }
      }
      processRef.current = false;
    }
  }, [isScreenshareActive]);

  const ScreenshareStoppedCallback = () => {};

  return (
    <ScreenshareContext.Provider
      value={{
        isScreenshareActive,
        startUserScreenshare,
        stopUserScreenShare,
        //@ts-ignore
        ScreenshareStoppedCallback,
      }}>
      {props.children}
      <KeepAwake />
    </ScreenshareContext.Provider>
  );
};

export default ScreenshareConfigure;
