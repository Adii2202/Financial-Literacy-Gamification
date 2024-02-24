import {StyleSheet, Text, View} from 'react-native';
import React, {useRef, useContext, useEffect} from 'react';
import VideoComponent from './VideoComponent';
import ActionSheet from './ActionSheet';
import ThemeConfig from '../../theme';
import Spacer from '../../atoms/Spacer';
import {useRoomInfo} from '../../components/room-info/useRoomInfo';

import {useRecording} from '../../subComponents/recording/useRecording';
import ParticipantsCount from '../../atoms/ParticipantsCount';
import RecordingInfo from '../../atoms/RecordingInfo';
import {
  isAndroid,
  isIOS,
  isMobileUA,
  isValidReactComponent,
  isWebInternal,
  trimText,
} from '../../utils/common';
import {DispatchContext, RtcContext} from '../../../agora-rn-uikit';
import {
  useLocalUserInfo,
  useContent,
  ToolbarCustomItem,
} from 'customization-api';
import CaptionContainer from '../../subComponents/caption/CaptionContainer';
import {useScreenContext} from '../../components/contexts/ScreenShareContext';
import VideoRenderer from './VideoRenderer';
import {filterObject} from '../../utils';
import {useScreenshare} from '../../subComponents/screenshare/useScreenshare';
import useAppState from '../../utils/useAppState';
import {ToolbarPosition, ToolbarProvider} from '../../utils/useToolbar';
import {ActionSheetProvider} from '../../utils/useActionSheet';
import {useCustomization} from 'customization-implementation';
import NavbarMobile from '../../components/NavbarMobile';
import {useVB} from '../../components/virtual-background/useVB';
import VBPanel from '../../components/virtual-background/VBPanel';
import {WhiteboardListener} from '../../components/Controls';

const VideoCallMobileView = props => {
  const {native = true} = props;
  const {isScreenShareOnFullView, screenShareData} = useScreenContext();

  const {RtcEngineUnsafe} = useContext(RtcContext);
  const {dispatch} = useContext(DispatchContext);
  const local = useLocalUserInfo();
  const {defaultContent} = useContent();

  const maxScreenShareData = filterObject(
    screenShareData,
    ([k, v]) => v?.isExpanded === true,
  );
  const maxScreenShareUid = Object.keys(maxScreenShareData)?.length
    ? Object.keys(maxScreenShareData)[0]
    : null;

  const {isScreenshareActive} = useScreenshare();
  const appStateVisible = useAppState();
  const isCamON = useRef(local.video);
  const isScreenShareOn = useRef(isScreenshareActive);
  const {isVBActive, setIsVBActive} = useVB();
  const isVBAvaialble =
    $config.ENABLE_VIRTUAL_BACKGROUND && !$config.AUDIO_ROOM && isVBActive;

  useEffect(() => {
    // console.log(`Video State  ${local.video} in Mode  ${appStateVisible}`);
    //native screenshare use local uid to publish the screenshare stream
    //so when user minimize the app we shouldnot pause the local video
    if ($config.AUDIO_ROOM || !isMobileUA()) {
      return;
    } else {
      if (
        appStateVisible === 'background' &&
        isScreenshareActive &&
        (isAndroid() || isIOS())
      ) {
        isScreenShareOn.current = true;
      }
      if (
        appStateVisible === 'active' &&
        !isScreenshareActive &&
        (isAndroid() || isIOS())
      ) {
        isScreenShareOn.current = false;
      }
      if (!((isAndroid() || isIOS()) && isScreenshareActive)) {
        if (appStateVisible === 'background') {
          isCamON.current =
            isAndroid() || isIOS()
              ? local.video && !isScreenShareOn.current
              : local.video;
          if (isCamON.current) {
            isWebInternal()
              ? RtcEngineUnsafe.muteLocalVideoStream(true)
              : //@ts-ignore
                RtcEngineUnsafe.enableLocalVideo(false);
            dispatch({
              type: 'LocalMuteVideo',
              value: [0],
            });
          }
        }
        if (appStateVisible === 'active' && isCamON.current) {
          isWebInternal()
            ? RtcEngineUnsafe.muteLocalVideoStream(false)
            : //@ts-ignore
              RtcEngineUnsafe.enableLocalVideo(true);
          dispatch({
            type: 'LocalMuteVideo',
            value: [1],
          });
        }
      }
    }
  }, [appStateVisible, isScreenshareActive]);

  if (isVBAvaialble) {
    return <VBPanel />;
  }

  return isScreenShareOnFullView &&
    maxScreenShareUid &&
    defaultContent[maxScreenShareUid] &&
    defaultContent[maxScreenShareUid]?.video ? (
    <>
      {!native ? <WhiteboardListener /> : <></>}
      <VideoRenderer user={defaultContent[maxScreenShareUid]} />
    </>
  ) : (
    <>
      {!native ? <WhiteboardListener /> : <></>}
      <VideoCallView />
    </>
  );
};

const VideoCallView = React.memo(() => {
  //toolbar changes
  const {BottombarComponent, BottombarProps, TopbarComponent, TopbarProps} =
    useCustomization(data => {
      let components: {
        BottombarComponent: React.ComponentType;
        BottombarProps?: ToolbarCustomItem[];
        TopbarComponent: React.ComponentType;
        TopbarProps?: ToolbarCustomItem[];
      } = {
        BottombarComponent: ActionSheet,
        BottombarProps: [],
        //@ts-ignore
        TopbarComponent: NavbarMobile,
        TopbarProps: [],
      };
      if (
        data?.components?.videoCall &&
        typeof data?.components?.videoCall === 'object'
      ) {
        if (
          data?.components?.videoCall.bottomToolBar &&
          typeof data?.components?.videoCall.bottomToolBar !== 'object' &&
          isValidReactComponent(data?.components?.videoCall.bottomToolBar)
        ) {
          components.BottombarComponent =
            data?.components?.videoCall.bottomToolBar;
        }
        if (
          data?.components?.videoCall.bottomToolBar &&
          typeof data?.components?.videoCall.bottomToolBar === 'object' &&
          data?.components?.videoCall.bottomToolBar.length
        ) {
          components.BottombarProps = data?.components?.videoCall.bottomToolBar;
        }

        if (
          data?.components?.videoCall.topToolBar &&
          typeof data?.components?.videoCall.topToolBar !== 'object' &&
          isValidReactComponent(data?.components?.videoCall.topToolBar)
        ) {
          components.TopbarComponent = data?.components?.videoCall.topToolBar;
        }

        if (
          data?.components?.videoCall.topToolBar &&
          typeof data?.components?.videoCall.topToolBar === 'object' &&
          data?.components?.videoCall.topToolBar.length
        ) {
          components.TopbarProps = data?.components?.videoCall.topToolBar;
        }
      }

      return components;
    });

  return (
    <View style={styles.container}>
      <>
        <ToolbarProvider value={{position: ToolbarPosition.top}}>
          {TopbarProps?.length ? (
            <TopbarComponent
              //@ts-ignore
              customItems={TopbarProps}
              includeDefaultItems={false}
            />
          ) : (
            <TopbarComponent />
          )}
        </ToolbarProvider>
        <View style={styles.videoView}>
          <VideoComponent />
          <CaptionContainer />
        </View>
        <ToolbarProvider value={{position: ToolbarPosition.bottom}}>
          <ActionSheetProvider>
            {BottombarProps?.length ? (
              <BottombarComponent
                //@ts-ignore
                customItems={BottombarProps}
                includeDefaultItems={false}
              />
            ) : (
              <BottombarComponent />
            )}
          </ActionSheetProvider>
        </ToolbarProvider>
      </>
    </View>
  );
});

export default VideoCallMobileView;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flex: 1,
  },
  title: {
    fontSize: ThemeConfig.FontSize.normal,
    lineHeight: ThemeConfig.FontSize.normal,
    color: $config.FONT_COLOR,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    paddingVertical: 2,
  },
  videoView: {
    flex: 0.85,
    zIndex: 0,
    elevation: 0,
  },
  titleBar: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  countView: {
    flexDirection: 'row',
  },
});
