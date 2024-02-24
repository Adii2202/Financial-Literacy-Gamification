import React, {useState, useRef, useContext, useEffect} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {
  PropsContext,
  DispatchContext,
  ContentInterface,
} from '../../../agora-rn-uikit';
import ScreenShareNotice from '../../subComponents/ScreenShareNotice';
import {MaxVideoView} from '../../../agora-rn-uikit';
import FallbackLogo from '../../subComponents/FallbackLogo';
import NetworkQualityPill from '../../subComponents/NetworkQualityPill';
import NameWithMicIcon from './NameWithMicIcon';
import {useLayout, useContent, useRtc, customEvents} from 'customization-api';
import {
  DefaultLayouts,
  getGridLayoutName,
  getPinnedLayoutName,
} from './DefaultLayouts';
import IconButton from '../../atoms/IconButton';
import UserActionMenuOptionsOptions from '../../components/participants/UserActionMenuOptions';
import {isMobileUA, isWebInternal} from '../../utils/common';
import ThemeConfig from '../../theme';
import {createHook} from 'customization-implementation';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import {useScreenContext} from '../../components/contexts/ScreenShareContext';
import ZoomableWrapper from './ZoomableWrapper';
import {isAndroid} from '../../utils/common';
import {isIOS} from '../../utils/common';
import {useScreenshare} from '../../subComponents/screenshare/useScreenshare';
import useActiveSpeaker from '../../utils/useActiveSpeaker';
import {useVideoCall} from '../../components/useVideoCall';
import VisibilitySensor from './VisibilitySensor';
import ImageIcon from '../../atoms/ImageIcon';
import {useWhiteboard} from '../../components/whiteboard/WhiteboardConfigure';
import {useString} from '../../utils/useString';
import {
  moreBtnViewInLarge,
  moreBtnViewWhiteboard,
} from '../../language/default-labels/videoCallScreenLabels';
interface VideoRendererProps {
  user: ContentInterface;
  isMax?: boolean;
  CustomChild?: React.ComponentType;
}
const VideoRenderer: React.FC<VideoRendererProps> = ({
  user,
  isMax = false,
  CustomChild,
}) => {
  const {height, width} = useWindowDimensions();
  const {dispatch} = useContext(DispatchContext);
  const {RtcEngineUnsafe} = useRtc();
  const {pinnedUid, secondaryPinnedUid} = useContent();
  const activeSpeaker = useActiveSpeaker();
  const isActiveSpeaker = activeSpeaker === user.uid;
  const [isHovered, setIsHovered] = useState(false);
  const {rtcProps} = useContext(PropsContext);
  const {currentLayout} = useLayout();
  const showReplacePin =
    pinnedUid && !isMax && isHovered && currentLayout === getPinnedLayoutName();
  const showPinForMe =
    !pinnedUid &&
    !isMax &&
    isHovered &&
    currentLayout === getPinnedLayoutName();
  const [videoTileWidth, setVideoTileWidth] = useState(0);
  const [avatarSize, setAvatarSize] = useState(100);
  const videoMoreMenuRef = useRef(null);
  const [actionMenuVisible, setActionMenuVisible] = React.useState(false);
  const {setVideoTileInViewPortState} = useVideoCall();
  const {getWhiteboardUid = () => 0} = useWhiteboard();
  const [landscapeMode, setLandscapeMode] = useState(
    isAndroid() || isIOS() ? true : false,
  );
  const landscapeModeRef = useRef({landscapeMode});
  const {
    screenShareData,
    setScreenShareData,
    isScreenShareOnFullView,
    setScreenShareOnFullView,
  } = useScreenContext();

  const {isScreenshareActive} = useScreenshare();

  useEffect(() => {
    landscapeModeRef.current.landscapeMode = landscapeMode;
  }, [landscapeMode]);

  useEffect(() => {
    //if screenshare is on fullscreen then get the width/height to set landscape mode
    if (isScreenShareOnFullView) {
      if (isAndroid() || isIOS()) {
        const cb = args => {
          if (
            args?.uid == user.uid &&
            args?.width &&
            args?.height &&
            args.height > args.width
          ) {
            landscapeModeRef.current.landscapeMode && setLandscapeMode(false);
          }
        };
        const subscription = RtcEngineUnsafe.addListener(
          'RemoteVideoStats',
          cb,
        );
        setTimeout(() => {
          subscription.remove();
        }, 5000);
      } else {
        if (screenShareData && screenShareData?.[user.uid] && isMobileUA()) {
          //@ts-ignore
          const data = RtcEngineUnsafe.getRemoteVideoStats(user.uid);
          if (
            data &&
            data?.receiveResolutionHeight &&
            data?.receiveResolutionWidth &&
            data?.receiveResolutionHeight > data.receiveResolutionWidth
          ) {
            setLandscapeMode(false);
          }
        }
      }
    }
  }, [screenShareData, isScreenShareOnFullView]);

  const isNativeScreenShareActive =
    (isAndroid() || isIOS()) && isScreenshareActive;
  const enableExpandButton = isNativeScreenShareActive ? false : true;

  const {enablePinForMe} = useVideoCall();

  const viewinlargeLabel = useString(moreBtnViewInLarge)();
  const viewwhiteboardlabel = useString(moreBtnViewWhiteboard)();

  return (
    <>
      <UserActionMenuOptionsOptions
        actionMenuVisible={actionMenuVisible}
        setActionMenuVisible={flag => {
          //once user clicks action menu item -> hide the action menu and set parent isHovered false
          if (!flag) {
            setIsHovered(false);
          }
          setActionMenuVisible(flag);
        }}
        user={user}
        btnRef={videoMoreMenuRef}
        from={'video-tile'}
      />
      <PlatformWrapper isHovered={isHovered} setIsHovered={setIsHovered}>
        <View
          onLayout={({
            nativeEvent: {
              layout: {x, y, width, height},
            },
          }) => {
            setVideoTileWidth(width);
            setAvatarSize(Math.floor(width * 0.35));
          }}
          style={[
            maxStyle.container,
            !CustomChild && isActiveSpeaker
              ? maxStyle.activeContainerStyle
              : user.video
              ? maxStyle.noVideoStyle
              : maxStyle.nonActiveContainerStyle,
          ]}>
          {!showReplacePin && !showPinForMe && (
            <ScreenShareNotice uid={user.uid} isMax={isMax} />
          )}
          {currentLayout === DefaultLayouts[1].name &&
          user.uid === secondaryPinnedUid ? (
            <View
              style={{
                position: 'absolute',
                zIndex: 2,
                borderRadius: 50,
                padding: 8,
                top: 8,
                left: 8,
                backgroundColor: $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR,
              }}>
              <ImageIcon
                iconType="plain"
                name={'pin-filled'}
                iconSize={16}
                tintColor={$config.FONT_COLOR}
              />
            </View>
          ) : (
            <></>
          )}
          {enableExpandButton &&
          screenShareData &&
          screenShareData?.[user.uid] &&
          isMobileUA() ? (
            <IconButton
              containerStyle={
                isScreenShareOnFullView && landscapeMode
                  ? {
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      transform: [{rotate: '90deg'}],
                      zIndex: 999,
                      elevation: 999,
                    }
                  : {
                      position: 'absolute',
                      top: 8,
                      left:
                        pinnedUid &&
                        pinnedUid == user.uid &&
                        !isScreenShareOnFullView
                          ? 160 + (isAndroid() ? 15 : 0)
                          : 8,
                      zIndex: 999,
                      elevation: 999,
                    }
              }
              onPress={() => {
                setScreenShareOnFullView(
                  !screenShareData[user.uid]?.isExpanded,
                );
                setScreenShareData(prevState => {
                  return {
                    ...prevState,
                    [user.uid]: {
                      ...prevState[user.uid],
                      isExpanded: !prevState[user.uid]?.isExpanded,
                    },
                  };
                });
              }}
              iconProps={{
                iconContainerStyle: {
                  padding: 8,
                  backgroundColor:
                    $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['10%'],
                  transform: [{rotate: '-45deg'}],
                },
                name:
                  screenShareData?.[user?.uid]?.isExpanded === true
                    ? 'collapse'
                    : 'expand',
                tintColor: $config.SECONDARY_ACTION_COLOR,
                iconSize: 20,
              }}
            />
          ) : (
            <></>
          )}
          {!isScreenShareOnFullView && !CustomChild && (
            <NetworkQualityPill uid={user?.uid} />
          )}
          <ZoomableWrapper
            enableZoom={
              isScreenShareOnFullView &&
              screenShareData &&
              screenShareData?.[user.uid]
                ? true
                : false
            }>
            <VisibilitySensor
              trigger={activeSpeaker}
              onChange={isVisible => {
                setVideoTileInViewPortState(user.uid, isVisible);
              }}>
              {CustomChild ? (
                <CustomChild />
              ) : (
                <MaxVideoView
                  fallback={() => {
                    return FallbackLogo(
                      user?.name,
                      isActiveSpeaker,
                      enablePinForMe &&
                        (showReplacePin || showPinForMe) &&
                        !isMobileUA()
                        ? true
                        : false,
                      isMax,
                      avatarSize,
                    );
                  }}
                  user={isNativeScreenShareActive ? {...user, video: 0} : user}
                  containerStyle={{
                    width:
                      landscapeMode && isScreenShareOnFullView
                        ? height
                        : '100%',
                    height:
                      landscapeMode && isScreenShareOnFullView ? width : '100%',
                    // width: '100%',
                    // height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                  key={user.uid}
                  landscapeMode={
                    landscapeMode && isScreenShareOnFullView ? true : false
                  }
                />
              )}
            </VisibilitySensor>
          </ZoomableWrapper>
          {(!isScreenShareOnFullView && !CustomChild) ||
          (CustomChild &&
            (pinnedUid !== getWhiteboardUid() || currentLayout === 'grid')) ? (
            <VideoContainerProvider value={{videoTileWidth}}>
              <NameWithMicIcon
                name={user.name}
                muted={CustomChild ? undefined : !user.audio}
                customBgColor={
                  CustomChild ? $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR : null
                }
                customTextColor={
                  CustomChild
                    ? $config.FONT_COLOR + hexadecimalTransparency['80%']
                    : null
                }
              />
            </VideoContainerProvider>
          ) : (
            <></>
          )}
          {!isScreenShareOnFullView &&
          // user.uid !== rtcProps?.screenShareUid &&
          (isHovered || actionMenuVisible || isMobileUA()) ? (
            <MoreMenu
              videoMoreMenuRef={videoMoreMenuRef}
              setActionMenuVisible={setActionMenuVisible}
            />
          ) : (
            <></>
          )}
          {enablePinForMe &&
          (showReplacePin || showPinForMe) &&
          !isMobileUA() ? (
            <IconButton
              onPress={() => {
                dispatch({type: 'UserPin', value: [user.uid]});
              }}
              containerStyle={
                user.uid === getWhiteboardUid()
                  ? maxStyle.replacePinContainer2
                  : maxStyle.replacePinContainer
              }
              btnTextProps={{
                //text: showReplacePin ? 'Replace Pin' : 'View in large',
                text:
                  user.uid === getWhiteboardUid()
                    ? viewwhiteboardlabel
                    : viewinlargeLabel,
                textColor: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
                textStyle: {
                  marginTop: 0,
                  fontWeight: '700',
                  marginLeft: user.uid === getWhiteboardUid() ? 0 : 6,
                },
              }}
              iconProps={
                user.uid === getWhiteboardUid()
                  ? null
                  : {
                      name: 'pin-filled',
                      iconSize: 20,
                      iconType: 'plain',
                      tintColor: $config.VIDEO_AUDIO_TILE_TEXT_COLOR,
                    }
              }
            />
          ) : (
            <></>
          )}
        </View>
      </PlatformWrapper>
    </>
  );
};

interface MoreMenuProps {
  setActionMenuVisible: (f: boolean) => void;
  videoMoreMenuRef: any;
}
const MoreMenu = ({setActionMenuVisible, videoMoreMenuRef}: MoreMenuProps) => {
  const {activeUids, customContent} = useContent();
  const activeUidsLen = activeUids?.filter(i => !customContent[i])?.length;
  const {currentLayout} = useLayout();
  const reduceSpace =
    isMobileUA() && activeUidsLen > 4 && currentLayout === getGridLayoutName();
  return (
    <>
      <View
        ref={videoMoreMenuRef}
        collapsable={false}
        style={{
          position: 'absolute',
          right: reduceSpace ? 2 : 8,
          bottom: reduceSpace ? 2 : 8,
          zIndex: 999,
        }}>
        <IconButton
          onPress={() => {
            setActionMenuVisible(true);
          }}
          iconProps={{
            iconContainerStyle: {
              padding: reduceSpace && activeUidsLen > 12 ? 2 : 8,
              backgroundColor:
                $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR +
                hexadecimalTransparency['25%'],
            },
            name: 'more-menu',
            iconSize: 20,
            tintColor: $config.SECONDARY_ACTION_COLOR,
          }}
        />
      </View>
    </>
  );
};

const PlatformWrapper = ({children, setIsHovered, isHovered}) => {
  return isWebInternal() && !isMobileUA() ? (
    <div
      style={{width: '100%', height: '100%', borderRadius: 4}}
      /**
       * why onMouseOver is used instead of onMouseEnter
       * when user clicks close icon the participant then video tile will expand and
       * cursor will directly land on child elements. so onhover kabab menu icon is not displayed
       *
       * As per doc
       * The mouseover event triggers when the mouse pointer enters the div element, and its child elements.
       * The mouseenter event is only triggered when the mouse pointer enters the div element.
       *  */
      onMouseOver={() => {
        !isHovered && setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    <>{children}</>
  );
};

const maxStyle = StyleSheet.create({
  replacePinContainer: {
    zIndex: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR,
    borderRadius: 8,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    maxWidth: 120,
    maxHeight: 32,
  },
  replacePinContainer2: {
    justifyContent: 'center',
    zIndex: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: $config.VIDEO_AUDIO_TILE_OVERLAY_COLOR,
    borderRadius: 8,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    maxWidth: 120,
    maxHeight: 32,
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: ThemeConfig.BorderRadius.small,
    borderWidth: 2,
    borderColor: 'red',
  },
  activeContainerStyle: {
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  nonActiveContainerStyle: {
    borderColor: 'transparent',
  },
  noVideoStyle: {
    borderColor: 'transparent',
  },
});

const VideoContainerContext = React.createContext({videoTileWidth: 0});
const VideoContainerProvider = VideoContainerContext.Provider;
export const useVideoContainer = createHook(VideoContainerContext);

export default VideoRenderer;
