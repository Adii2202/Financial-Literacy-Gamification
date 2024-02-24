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
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
} from 'react-native';
import Settings, {
  SettingsWithViewWrapper,
  SettingsIconButtonProps,
} from './Settings';
import CopyJoinInfo, {CopyJoinInfoProps} from '../subComponents/CopyJoinInfo';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import ChatContext from '../components/ChatContext';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import LiveStreamContext from './livestream';
import {numFormatter} from '../utils/index';
import {useLayout} from '../utils/useLayout';
import {useChatNotification} from '../components/chat-notification/useChatNotification';
import useLayoutsData from '../pages/video-call/useLayoutsData';
import {
  BREAKPOINTS,
  CustomToolbarSort,
  isAndroid,
  isIOS,
  isMobileUA,
  isValidReactComponent,
  isWebInternal,
  trimText,
  useIsDesktop,
} from '../utils/common';
import {useChangeDefaultLayout} from '../pages/video-call/DefaultLayouts';
import {useRecording} from '../subComponents/recording/useRecording';
import LayoutIconDropdown from '../subComponents/LayoutIconDropdown';
import {useString} from '../utils/useString';
import {useRoomInfo} from './room-info/useRoomInfo';
import {useSidePanel} from '../utils/useSidePanel';
import {ChatType, useChatUIControls} from './chat-ui/useChatUIControls';
import LayoutIconButton from '../subComponents/LayoutIconButton';
import {ToolbarPosition, useToolbar} from '../utils/useToolbar';
import Styles from './styles';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import Spacer from '../atoms/Spacer';
import {useLiveStreamDataContext} from './contexts/LiveStreamDataContext';
import ParticipantsCount from '../atoms/ParticipantsCount';
import styles from 'react-native-toast-message/src/styles';
import RecordingInfo from '../atoms/RecordingInfo';
import Toolbar from '../atoms/Toolbar';
import ToolbarItem from '../atoms/ToolbarItem';
import {ToolbarCustomItem} from '../atoms/ToolbarPreset';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {useWaitingRoomContext} from './contexts/WaitingRoomContext';
import {
  toolbarItemChatText,
  toolbarItemPeopleText,
  videoRoomRecordingText,
} from '../language/default-labels/videoCallScreenLabels';

export const ParticipantsCountView = ({
  isMobileView = false,
}: {
  isMobileView?: boolean;
}) => {
  const {onlineUsersCount} = useContext(ChatContext);
  const peopleLabel = useString(toolbarItemPeopleText)();
  return isMobileView ? (
    <Text>
      {peopleLabel} {'\n'} ({numFormatter(onlineUsersCount)})
    </Text>
  ) : (
    <>
      {onlineUsersCount !== 0 && (
        <View style={[{justifyContent: 'center'}]}>
          <View style={style.chip}>
            {onlineUsersCount > 0 && (
              <Text style={style.chipText}>
                {numFormatter(onlineUsersCount)}
              </Text>
            )}
          </View>
        </View>
      )}
    </>
  );
};

export interface ParticipantsIconButtonProps {
  liveStreamingRequestAlertIconPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  render?: (onPress: () => void, isPanelActive: boolean) => JSX.Element;
}
export const ParticipantsIconButton = (props: ParticipantsIconButtonProps) => {
  const {isToolbarMenuItem} = useToolbarMenu();
  const {
    liveStreamingRequestAlertIconPosition = {
      top: 0,
      right: 0,
      left: undefined,
      bottom: undefined,
    },
  } = props;
  const {isOnActionSheet, showLabel} = useActionSheet();
  const {sidePanel, setSidePanel} = useSidePanel();
  const {isPendingRequestToReview, setLastCheckedRequestTimestamp} =
    useContext(LiveStreamContext);

  const {waitingRoomUids} = useWaitingRoomContext();
  const participantsLabel = useString(toolbarItemPeopleText)();
  const isPanelActive = sidePanel === SidePanelType.Participants;
  const {
    data: {isHost},
  } = useRoomInfo();

  const isPendingWaitingRoomApproval = isHost && waitingRoomUids.length > 0;

  const onPress = () => {
    isPanelActive
      ? setSidePanel(SidePanelType.None)
      : setSidePanel(SidePanelType.Participants);
    // $config.EVENT_MODE && $config.RAISE_HAND;
    //setLastCheckedRequestTimestamp(new Date().getTime());
  };
  let iconButtonProps: IconButtonProps = {
    onPress: onPress,
    iconProps: {
      name: 'participants',
      tintColor: isPanelActive
        ? $config.PRIMARY_ACTION_TEXT_COLOR
        : $config.SECONDARY_ACTION_COLOR,
      iconBackgroundColor: isPanelActive
        ? $config.PRIMARY_ACTION_BRAND_COLOR
        : '',
    },
    btnTextProps: {
      text: showLabel ? participantsLabel : '',
      textColor: $config.FONT_COLOR,
    },
  };
  if (isOnActionSheet) {
    // iconButtonProps.containerStyle = {
    //   backgroundColor: $config.CARD_LAYER_2_COLOR,
    //   width: 52,
    //   height: 52,
    //   borderRadius: 26,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // };
    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }
  iconButtonProps.isOnActionSheet = isOnActionSheet;

  return props?.render ? (
    props.render(onPress, isPanelActive)
  ) : (
    <>
      {isToolbarMenuItem ? (
        <ToolbarMenuItem {...iconButtonProps} />
      ) : (
        <>
          <View>
            <IconButton {...iconButtonProps} />
          </View>
          {isPendingWaitingRoomApproval ||
          ($config.EVENT_MODE &&
            $config.RAISE_HAND &&
            isPendingRequestToReview) ? (
            <View
              style={{
                position: 'absolute',
                top: liveStreamingRequestAlertIconPosition.top,
                bottom: liveStreamingRequestAlertIconPosition.bottom,
                right: liveStreamingRequestAlertIconPosition.right,
                left: liveStreamingRequestAlertIconPosition.left,
                backgroundColor: $config.SEMANTIC_ERROR,
                width: 12,
                height: 12,
                borderRadius: 10,
              }}></View>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export interface ChatIconButtonProps {
  badgeContainerPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  badgeTextStyle?: TextStyle;
  render?: (
    onPress: () => void,
    isPanelActive: boolean,
    totalUnreadCount: number,
  ) => JSX.Element;
  isMobileView?: boolean;
}

export const ChatIconButton = (props: ChatIconButtonProps) => {
  const {sidePanel, setSidePanel} = useSidePanel();
  const {isToolbarMenuItem} = useToolbarMenu();
  const {
    badgeContainerPosition = {
      top: 0,
      right: 0,
      left: undefined,
      bottom: undefined,
      zIndex: 999,
    },
    badgeTextStyle = {
      color: $config.PRIMARY_ACTION_TEXT_COLOR,
      fontSize: 12,
      textAlign: 'center',
    },
  } = props;
  const {setUnreadGroupMessageCount, totalUnreadCount} = useChatNotification();
  const {setChatType, setPrivateChatUser} = useChatUIControls();

  const chatLabel = useString(toolbarItemChatText)();

  const isPanelActive = sidePanel === SidePanelType.Chat;

  //when chat panel is close then we need to show the toast notification. for that
  //we are resetting flag which used when chat panel is active
  useEffect(() => {
    if (sidePanel !== SidePanelType.Chat) {
      setChatType(ChatType.Group);
      setPrivateChatUser(0);
    }
  }, [sidePanel]);

  const onPress = () => {
    {
      if (isPanelActive) {
        setSidePanel(SidePanelType.None);
        setChatType(ChatType.Group);
        setPrivateChatUser(0);
      } else {
        //move this logic into ChatContainer
        //setUnreadGroupMessageCount(0);
        setChatType(ChatType.Group);
        setSidePanel(SidePanelType.Chat);
      }
    }
  };
  const {isOnActionSheet, showLabel} = useActionSheet();
  let iconButtonProps: IconButtonProps = {
    onPress: onPress,
    iconProps: {
      name: 'chat-nav',
      tintColor: isPanelActive
        ? $config.PRIMARY_ACTION_TEXT_COLOR
        : $config.SECONDARY_ACTION_COLOR,
      iconBackgroundColor: isPanelActive
        ? $config.PRIMARY_ACTION_BRAND_COLOR
        : '',
    },
    btnTextProps: {
      text: showLabel ? chatLabel : '',
      textColor: $config.FONT_COLOR,
    },
  };

  if (isOnActionSheet) {
    // iconButtonProps.containerStyle = {
    //   backgroundColor: $config.CARD_LAYER_2_COLOR,
    //   width: 52,
    //   height: 52,
    //   borderRadius: 26,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // };
    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }
  iconButtonProps.isOnActionSheet = isOnActionSheet;

  // const renderBadgeOld = (badgeCount: any) => {
  //   return (
  //     <View
  //       style={{
  //         position: 'absolute',
  //         top: badgeContainerPosition?.top,
  //         bottom: badgeContainerPosition?.bottom,
  //         left: badgeContainerPosition?.left,
  //         right: badgeContainerPosition?.right,
  //         borderRadius: 10,
  //         width: 20,
  //         height: 20,
  //         backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  //         justifyContent: 'center',
  //       }}>
  //       <Text
  //         style={{
  //           ...badgeTextStyle,
  //         }}>
  //         {numFormatter(badgeCount)}
  //       </Text>
  //     </View>
  //   );
  // };
  const renderUnreadMessageIndicator = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: badgeContainerPosition?.top,
          bottom: badgeContainerPosition?.bottom,
          left: badgeContainerPosition?.left,
          right: badgeContainerPosition?.right,
          borderRadius: 10,
          width: 12,
          height: 12,
          backgroundColor: $config.SEMANTIC_ERROR,
        }}></View>
    );
  };
  return props?.render ? (
    props.render(onPress, isPanelActive, totalUnreadCount)
  ) : (
    <>
      <View>
        {isToolbarMenuItem ? (
          <ToolbarMenuItem {...iconButtonProps} />
        ) : (
          <>
            <IconButton {...iconButtonProps} />
            {totalUnreadCount !== 0 && renderUnreadMessageIndicator()}
          </>
        )}
      </View>
    </>
  );
};

interface LayoutIconButtonProps {
  modalPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };

  render?: (onPress: () => void) => JSX.Element;
}

export const SettingsIconButton = (props: SettingsIconButtonProps) => {
  return <Settings {...props} />;
};
const SettingsIconButtonWithWrapper = (props: SettingsIconButtonProps) => {
  return <SettingsWithViewWrapper {...props} />;
};

export const MeetingTitleToolbarItem = () => {
  const {
    data: {meetingTitle},
  } = useRoomInfo();
  return (
    <ToolbarItem>
      <Text
        style={style.roomNameText}
        testID="videocall-meetingName"
        numberOfLines={1}
        ellipsizeMode="tail">
        {trimText(meetingTitle)}
      </Text>
    </ToolbarItem>
  );
};
export const ParticipantCountToolbarItem = () => {
  return (
    <ToolbarItem>
      <View>
        <View
          style={{
            width: 45,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            zIndex: isWebInternal() ? 3 : 0,
          }}>
          <ParticipantsCount />
        </View>
      </View>
    </ToolbarItem>
  );
};
export const RecordingStatusToolbarItem = () => {
  const recordingLabel = useString(videoRoomRecordingText)();
  const {isRecordingActive} = useRecording();
  return isRecordingActive ? (
    <ToolbarItem>
      <RecordingInfo recordingLabel={recordingLabel} />
    </ToolbarItem>
  ) : (
    <></>
  );
};
const defaultStartItems: ToolbarCustomItem[] = [
  {
    align: 'start',
    component: MeetingTitleToolbarItem,
    order: 0,
    hide: 'no',
  },
  {
    align: 'start',
    component: ParticipantCountToolbarItem,
    order: 1,
    hide: 'no',
  },
  {
    align: 'start',
    component: RecordingStatusToolbarItem,
    order: 2,
    hide: 'no',
  },
];
const defaultCenterItems: ToolbarCustomItem[] = [];

export const ParticipantToolbarItem = () => {
  return (
    <ToolbarItem testID="videocall-participantsicon">
      <ParticipantsIconButton />
    </ToolbarItem>
  );
};

export const ChatToolbarItem = () => {
  return (
    $config.CHAT && (
      <>
        <ToolbarItem testID="videocall-chaticon">
          <ChatIconButton />
        </ToolbarItem>
      </>
    )
  );
};
export const SettingsToobarItem = () => {
  return (
    <ToolbarItem testID="videocall-settingsicon">
      <SettingsIconButtonWithWrapper />
    </ToolbarItem>
  );
};

const defaultEndItems: ToolbarCustomItem[] = [
  {
    align: 'start',
    component: ParticipantToolbarItem,
    order: 0,
    hide: 'no',
  },
  {
    align: 'start',
    component: ChatToolbarItem,
    order: 1,
    hide: 'no',
  },
  {
    align: 'start',
    component: SettingsToobarItem,
    order: 2,
    hide: 'no',
  },
];

export interface NavbarProps {
  customItems?: ToolbarCustomItem[];
  includeDefaultItems?: boolean;
}
const Navbar = (props: NavbarProps) => {
  const {customItems = [], includeDefaultItems = true} = props;
  const {width} = useWindowDimensions();

  const isHidden = i => {
    return i?.hide === 'yes';
  };

  const customStartItems = customItems
    ?.filter(i => i.align === 'start' && !isHidden(i))
    ?.concat(includeDefaultItems ? defaultStartItems : [])
    ?.sort(CustomToolbarSort);

  const customCenterItems = customItems
    ?.filter(i => i.align === 'center' && !isHidden(i))
    ?.concat(includeDefaultItems ? defaultCenterItems : [])
    ?.sort(CustomToolbarSort);

  const customEndItems = customItems
    ?.filter(i => i.align === 'end' && !isHidden(i))
    ?.concat(includeDefaultItems ? defaultEndItems : [])
    ?.sort(CustomToolbarSort);

  const renderContent = (
    items: ToolbarCustomItem[],
    type: 'start' | 'center' | 'end',
  ) => {
    return items?.map((item, index) => {
      const ToolbarItem = item?.component;
      if (ToolbarItem) {
        return <ToolbarItem key={`top-toolbar-${type}` + index} />;
      } else {
        return null;
      }
    });
  };
  return (
    <Toolbar>
      <View style={style.startContent}>
        {renderContent(customStartItems, 'start')}
      </View>
      <View style={style.centerContent}>
        {renderContent(customCenterItems, 'center')}
      </View>
      {width > BREAKPOINTS.sm || isMobileUA() ? (
        <View style={style.endContent}>
          {renderContent(customEndItems, 'end')}
        </View>
      ) : (
        <></>
      )}
    </Toolbar>
  );
};

const style = StyleSheet.create({
  startContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerContent: {
    zIndex: 2,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endContent: {
    flex: 1,
    zIndex: 9,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  participantCountView: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: $config.ICON_BG_COLOR,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: $config.CARD_LAYER_3_COLOR,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  btnHolder: {
    marginHorizontal: isMobileOrTablet() ? 2 : 0,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  btnHolderCustom: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  roomNameContainer: {
    zIndex: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  roomNameText: {
    alignSelf: 'center',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.FONT_COLOR,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
  chip: {
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 2.5,
    paddingHorizontal: 5,
    marginLeft: 5,
    marginRight: 0,
    paddingVertical: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: isIOS() ? 'Helvetica' : 'sans-serif',
    fontSize: 12,
    color: $config.SECONDARY_ACTION_COLOR,
  },
  navSmItem: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '15%',
  },
  dropdownIconContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  separaterContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
  },
  dropdownContainer: {
    position: 'absolute',
    marginTop: 5,
    width: 40,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
  },
});

export default Navbar;
