import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  Platform,
} from 'react-native';
import {useCustomization} from 'customization-implementation';
import Navbar, {NavbarProps} from '../../components/Navbar';
import ParticipantsView from '../../components/ParticipantsView';
import SettingsView from '../../components/SettingsView';
import Controls, {ControlsProps} from '../../components/Controls';
import Chat, {ChatProps} from '../../components/Chat';
import {SidePanelType} from '../../subComponents/SidePanelEnum';
import {
  isMobileUA,
  isValidReactComponent,
  isWebInternal,
  useIsDesktop,
  useIsSmall,
} from '../../utils/common';
import {useSidePanel} from '../../utils/useSidePanel';
import VideoComponent from './VideoComponent';
import {videoView} from '../../../theme.json';
import {ToolbarProvider, ToolbarPosition} from '../../utils/useToolbar';
import SDKEvents from '../../utils/SdkEvents';
import {useRoomInfo} from '../../components/room-info/useRoomInfo';
import {
  ToolbarCustomItem,
  controlMessageEnum,
  useUserName,
} from 'customization-api';
import events, {PersistanceLevel} from '../../rtm-events-api';
import VideoCallMobileView from './VideoCallMobileView';
import CaptionContainer from '../../subComponents/caption/CaptionContainer';
import Transcript from '../../subComponents/caption/Transcript';

import Spacer from '../../atoms/Spacer';
import Leftbar, {LeftbarProps} from '../../components/Leftbar';
import Rightbar, {RightbarProps} from '../../components/Rightbar';
import useFindActiveSpeaker from '../../utils/useFindActiveSpeaker';
import VBPanel from '../../components/virtual-background/VBPanel';

const VideoCallScreen = () => {
  useFindActiveSpeaker();
  const {sidePanel} = useSidePanel();
  const [name] = useUserName();
  const {
    data: {meetingTitle, isHost},
  } = useRoomInfo();
  const {
    ChatComponent,
    VideocallComponent,
    BottombarComponent,
    ParticipantsComponent,
    SettingsComponent,
    TopbarComponent,
    VideocallBeforeView,
    VideocallAfterView,
    LeftbarComponent,
    RightbarComponent,
    BottombarProps,
    TopbarProps,
    LeftbarProps,
    RightbarProps,
    VideocallWrapper,
  } = useCustomization(data => {
    let components: {
      VideocallWrapper: React.ComponentType;
      VideocallComponent?: React.ComponentType;
      ChatComponent: React.ComponentType<ChatProps>;
      BottombarComponent: React.ComponentType<ControlsProps>;
      ParticipantsComponent: React.ComponentType;
      SettingsComponent: React.ComponentType;
      TopbarComponent: React.ComponentType<NavbarProps>;
      VideocallBeforeView: React.ComponentType;
      VideocallAfterView: React.ComponentType;
      LeftbarComponent: React.ComponentType<LeftbarProps>;
      RightbarComponent: React.ComponentType<RightbarProps>;
      BottombarProps?: ToolbarCustomItem[];
      TopbarProps?: ToolbarCustomItem[];
      LeftbarProps?: ToolbarCustomItem[];
      RightbarProps?: ToolbarCustomItem[];
    } = {
      BottombarComponent: Controls,
      TopbarComponent: Navbar,
      ChatComponent: Chat,
      ParticipantsComponent: ParticipantsView,
      SettingsComponent: SettingsView,
      VideocallAfterView: React.Fragment,
      VideocallBeforeView: React.Fragment,
      VideocallWrapper: React.Fragment,
      LeftbarComponent: Leftbar,
      RightbarComponent: Rightbar,
      BottombarProps: [],
      TopbarProps: [],
      LeftbarProps: [],
      RightbarProps: [],
    };
    if (
      data?.components?.videoCall &&
      typeof data?.components?.videoCall !== 'object' &&
      isValidReactComponent(data?.components?.videoCall)
    ) {
      components.VideocallComponent = data?.components?.videoCall;
    }
    if (
      data?.components?.videoCall &&
      typeof data?.components?.videoCall === 'object'
    ) {
      // commented for v1 release
      // if (
      //   data?.components?.videoCall?.after &&
      //   isValidReactComponent(data?.components?.videoCall?.after)
      // ) {
      //   components.VideocallAfterView = data?.components?.videoCall?.after;
      // }

      // commented for v1 release
      // if (
      //   data?.components?.videoCall?.before &&
      //   isValidReactComponent(data?.components?.videoCall?.before)
      // ) {
      //   components.VideocallBeforeView = data?.components?.videoCall?.before;
      // }

      // commented for v1 release
      // if (
      //   data?.components?.videoCall.chat &&
      //   typeof data?.components?.videoCall.chat !== 'object' &&
      //   isValidReactComponent(data?.components?.videoCall.chat)
      // ) {
      //   components.ChatComponent = data?.components?.videoCall.chat;
      // }

      if (
        data?.components?.videoCall.bottomToolBar &&
        typeof data?.components?.videoCall.bottomToolBar !== 'object' &&
        isValidReactComponent(data?.components?.videoCall.bottomToolBar)
      ) {
        components.BottombarComponent =
          data?.components?.videoCall.bottomToolBar;
      }

      if (
        data?.components?.videoCall.topToolBar &&
        typeof data?.components?.videoCall.topToolBar !== 'object' &&
        isValidReactComponent(data?.components?.videoCall.topToolBar)
      ) {
        components.TopbarComponent = data?.components?.videoCall.topToolBar;
      }

      if (
        data?.components?.videoCall.leftToolBar &&
        typeof data?.components?.videoCall.leftToolBar !== 'object' &&
        isValidReactComponent(data?.components?.videoCall.leftToolBar)
      ) {
        components.LeftbarComponent = data?.components?.videoCall.leftToolBar;
      }

      if (
        data?.components?.videoCall.rightToolBar &&
        typeof data?.components?.videoCall.rightToolBar !== 'object' &&
        isValidReactComponent(data?.components?.videoCall.rightToolBar)
      ) {
        components.RightbarComponent = data?.components?.videoCall.rightToolBar;
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
        typeof data?.components?.videoCall.topToolBar === 'object' &&
        data?.components?.videoCall.topToolBar.length
      ) {
        components.TopbarProps = data?.components?.videoCall.topToolBar;
      }
      if (
        data?.components?.videoCall.rightToolBar &&
        typeof data?.components?.videoCall.rightToolBar === 'object' &&
        data?.components?.videoCall.rightToolBar.length
      ) {
        components.RightbarProps = data?.components?.videoCall.rightToolBar;
      }
      if (
        data?.components?.videoCall.leftToolBar &&
        typeof data?.components?.videoCall.leftToolBar === 'object' &&
        data?.components?.videoCall.leftToolBar.length
      ) {
        components.LeftbarProps = data?.components?.videoCall.leftToolBar;
      }

      if (
        data?.components?.videoCall.participantsPanel &&
        typeof data?.components?.videoCall.participantsPanel !== 'object' &&
        isValidReactComponent(data?.components?.videoCall.participantsPanel)
      ) {
        components.ParticipantsComponent =
          data?.components?.videoCall.participantsPanel;
      }

      //todo hari - need to remove wrapper
      if (
        data?.components?.videoCall.wrapper &&
        typeof data?.components?.videoCall.wrapper !== 'object' &&
        isValidReactComponent(data?.components?.videoCall.wrapper)
      ) {
        components.VideocallWrapper = data?.components?.videoCall.wrapper;
      }

      // commented for v1 release
      // if (
      //   data?.components?.videoCall.settingsPanel &&
      //   typeof data?.components?.videoCall.settingsPanel !== 'object' &&
      //   isValidReactComponent(data?.components?.videoCall.settingsPanel)
      // ) {
      //   components.SettingsComponent =
      //     data?.components?.videoCall.settingsPanel;
      // }
    }

    return components;
  });

  const isDesktop = useIsDesktop();
  const isSmall = useIsSmall();

  return VideocallComponent ? (
    <VideocallComponent />
  ) : // ) : !isDesktop ? (
  isMobileUA() ? (
    // Mobile View
    <VideoCallMobileView native={false} />
  ) : (
    // Desktop View
    <>
      <VideocallWrapper>
        <VideocallBeforeView />
        <View
          style={$config.ICON_TEXT ? style.fullRow : style.fullRowWithoutIcon}>
          <ToolbarProvider value={{position: ToolbarPosition.left}}>
            {LeftbarProps?.length ? (
              <LeftbarComponent
                customItems={LeftbarProps}
                includeDefaultItems={false}
              />
            ) : (
              <LeftbarComponent />
            )}
          </ToolbarProvider>
          <View style={style.full}>
            <ToolbarProvider value={{position: ToolbarPosition.top}}>
              {TopbarProps?.length ? (
                <TopbarComponent
                  customItems={TopbarProps}
                  includeDefaultItems={false}
                />
              ) : (
                <TopbarComponent />
              )}
            </ToolbarProvider>
            <View
              style={[
                style.videoView,
                $config.ICON_TEXT
                  ? {
                      paddingHorizontal: isDesktop() ? 32 : 10,
                      paddingVertical: 10,
                      paddingBottom: 0,
                    }
                  : {marginVertical: 20},
              ]}>
              <VideoComponent />
              {sidePanel === SidePanelType.Participants ? (
                <ParticipantsComponent />
              ) : (
                <></>
              )}
              {sidePanel === SidePanelType.Chat ? (
                $config.CHAT ? (
                  <ChatComponent />
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
              {sidePanel === SidePanelType.Settings ? (
                <SettingsComponent />
              ) : (
                <></>
              )}
              {sidePanel === SidePanelType.Transcript ? <Transcript /> : <></>}
              {sidePanel === SidePanelType.VirtualBackground ? (
                <VBPanel />
              ) : (
                <></>
              )}
            </View>
            {!isWebInternal() && sidePanel === SidePanelType.Chat ? (
              <></>
            ) : (
              <ToolbarProvider value={{position: ToolbarPosition.bottom}}>
                {BottombarProps?.length ? (
                  <BottombarComponent
                    customItems={BottombarProps}
                    includeDefaultItems={false}
                  />
                ) : (
                  <>
                    <CaptionContainer />
                    <Spacer size={10} />
                    <BottombarComponent />
                  </>
                )}
              </ToolbarProvider>
            )}
          </View>
          <ToolbarProvider value={{position: ToolbarPosition.right}}>
            {RightbarProps?.length ? (
              <RightbarComponent
                customItems={RightbarProps}
                includeDefaultItems={false}
              />
            ) : (
              <RightbarComponent />
            )}
          </ToolbarProvider>
        </View>
        <VideocallAfterView />
      </VideocallWrapper>
    </>
  );
};
export default VideoCallScreen;
//change these to inline styles or sth
const style = StyleSheet.create({
  full: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  fullRow: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fullRowWithoutIcon: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  videoView: {
    flex: 12,
    flexDirection: 'row',
  },
});
