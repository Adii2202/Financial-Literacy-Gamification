/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext} from 'react';
import ImageIcon from '../../atoms/ImageIcon';
import LocalAudioMute from '../../subComponents/LocalAudioMute';
import LocalVideoMute from '../../subComponents/LocalVideoMute';
import LocalEndcall from '../../subComponents/LocalEndCall';
import CopyJoinInfo from '../../subComponents/CopyJoinInfo';
import LocalSwitchCamera from '../../subComponents/LocalSwitchCamera';
import Recording from '../../subComponents/Recording';
import ChatContext from '../../components/ChatContext';
import {PropsContext, ToggleState} from '../../../agora-rn-uikit';
import {ClientRole} from '../../../agora-rn-uikit';
import {
  RoomInfoContextInterface,
  useRoomInfo,
} from '../../components/room-info/useRoomInfo';
import LiveStreamControls from '../../components/livestream/views/LiveStreamControls';
import LiveStreamContext, {RaiseHandValue} from '../../components/livestream';
import {
  ChatIconButton,
  ParticipantsIconButton,
} from '../../../src/components/Navbar';
import {useChatNotification} from '../../components/chat-notification/useChatNotification';
import {SidePanelType} from '../../subComponents/SidePanelEnum';
import {useSidePanel} from '../../utils/useSidePanel';
import {useContent, useLocalUserInfo, ToolbarItem} from 'customization-api';
import LayoutIconButton from '../../subComponents/LayoutIconButton';
import CaptionIcon from '../../../src/subComponents/caption/CaptionIcon';
import TranscriptIcon from '../../../src/subComponents/caption/TranscriptIcon';
import useSTTAPI from '../../../src/subComponents/caption/useSTTAPI';
import Carousel from '../../atoms/Carousel';
import {useCaption} from '../../subComponents/caption/useCaption';
import Settings from '../../components/Settings';
import ScreenshareButton from '../../subComponents/screenshare/ScreenshareButton';
import {useScreenshare} from '../../subComponents/screenshare/useScreenshare';
import {EventNames} from '../../rtm-events';
import events from '../../rtm-events-api';
import {getLanguageLabel} from '../../subComponents/caption/utils';
import Toast from '../../../react-native-toast-message';
import {CustomToolbarSort} from '../../utils/common';
import {ActionSheetProvider} from '../../utils/useActionSheet';
import {useWaitingRoomContext} from '../../components/contexts/WaitingRoomContext';
import {useSetRoomInfo} from '../../components/room-info/useSetRoomInfo';
import VBButton from '../../components/virtual-background/VBButton';
import {useVB} from '../../components/virtual-background/useVB';
import {useString} from '../../utils/useString';
import {
  sttSpokenLanguageToastHeading,
  sttSpokenLanguageToastSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';
//Icon for expanding Action Sheet
interface ShowMoreIconProps {
  isExpanded: boolean;
  showNotification: boolean;
  onPress: () => void;
}
const ShowMoreIcon = (props: ShowMoreIconProps) => {
  const {isExpanded, onPress, showNotification} = props;
  return (
    <ToolbarItem>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={onPress}>
          <ImageIcon
            name={isExpanded ? 'arrow-down' : 'more-menu'}
            tintColor={$config.PRIMARY_ACTION_BRAND_COLOR}
          />
        </TouchableOpacity>
        {showNotification && <View style={styles.notification} />}
      </View>
    </ToolbarItem>
  );
};

//Icon for Live Streaming Controls
const LiveStreamIcon = () => {
  //toolbaritem wrapped in the LiveStreamControls
  return <LiveStreamControls showControls={true} />;
};

//Icon for Chat
const ChatIcon = () => {
  return (
    <ToolbarItem>
      <ChatIconButton />
    </ToolbarItem>
  );
};

//Icon for Participants
const ParticipantsIcon = () => {
  return (
    <ToolbarItem>
      <ParticipantsIconButton />
    </ToolbarItem>
  );
};

//Icon for Recording

const RecordingIcon = () => {
  return (
    <ToolbarItem>
      <Recording />
    </ToolbarItem>
  );
};

const VBIcon = () => {
  const {isVBActive, setIsVBActive} = useVB();
  return (
    <ToolbarItem>
      <VBButton
        isVBOpen={isVBActive}
        setIsVBOpen={setIsVBActive}
        showLabel={true}
      />
    </ToolbarItem>
  );
};

const SwitchCameraIcon = () => {
  return (
    <ToolbarItem>
      <LocalSwitchCamera />
    </ToolbarItem>
  );
};

const SettingsIcon = () => {
  return (
    <ToolbarItem>
      <Settings />
    </ToolbarItem>
  );
};

const ShareIcon = () => {
  return (
    <ToolbarItem>
      <CopyJoinInfo />
    </ToolbarItem>
  );
};
const ScreenshareIcon = () => {
  return (
    <View style={styles.iconWithText}>
      <View style={styles.iconContainer}>
        <ScreenshareButton showLabel={false} isOnActionSheet={true} />
      </View>
      {$config.ICON_TEXT && <Text style={styles.iconText}>Screen Share</Text>}
    </View>
  );
};

const AudioIcon = () => {
  return (
    <ToolbarItem>
      <LocalAudioMute />
    </ToolbarItem>
  );
};

const CamIcon = () => {
  return (
    <ToolbarItem>
      <LocalVideoMute />
    </ToolbarItem>
  );
};

const EndCallIcon = () => {
  return (
    <ToolbarItem>
      <LocalEndcall />
    </ToolbarItem>
  );
};

const LayoutIcon = () => {
  return (
    <ToolbarItem>
      <LayoutIconButton />
    </ToolbarItem>
  );
};

interface CaptionIconBtnProps {
  showLabel?: boolean;
  onPress?: () => void;
}

const CaptionIconBtn = (props: CaptionIconBtnProps) => {
  const {showLabel = $config.ICON_TEXT, onPress} = props;
  const {isCaptionON, isSTTActive} = useCaption();
  const {
    data: {isHost},
  } = useRoomInfo();
  const isDisabled = !(
    $config.ENABLE_STT &&
    (isHost || (!isHost && isSTTActive))
  );
  return (
    <ToolbarItem>
      <CaptionIcon
        isOnActionSheet={true}
        showLabel={true}
        closeActionSheet={onPress}
      />
    </ToolbarItem>
  );
};

interface TranscriptIconProps {
  showLabel?: boolean;
}

const TranscriptIconBtn = (props: TranscriptIconProps) => {
  const {showLabel = $config.ICON_TEXT} = props;
  const {sidePanel} = useSidePanel();
  const isTranscriptON = sidePanel === SidePanelType.Transcript;
  const {isSTTActive} = useCaption();
  const {
    data: {isHost},
  } = useRoomInfo();
  const isDisabled = !(
    $config.ENABLE_STT &&
    (isHost || (!isHost && isSTTActive))
  );
  return (
    <ToolbarItem>
      <TranscriptIcon isOnActionSheet={true} showLabel={true} />
    </ToolbarItem>
  );
};

const ToastIcon = ({color}) => (
  <View style={{marginRight: 12, alignSelf: 'center', width: 24, height: 24}}>
    <ImageIcon iconType="plain" tintColor={color} name={'lang-select'} />
  </View>
);

const ActionSheetContent = props => {
  const heading = useString<'Set' | 'Changed'>(sttSpokenLanguageToastHeading);
  const subheading = useString<{
    action: 'Set' | 'Changed';
    newLanguage: string;
    oldLanguage: string;
    username: string;
  }>(sttSpokenLanguageToastSubHeading);

  const {
    handleSheetChanges,
    isExpanded,
    customItems = [],
    includeDefaultItems = true,
    displayCustomBottomSheetContent = false,
    customBottomSheetContent,
    native = false,
  } = props;

  const {localUid} = useContext(ChatContext);
  const {isScreenshareActive} = useScreenshare();
  const {rtcProps} = useContext(PropsContext);
  const {setSidePanel} = useSidePanel();
  const {setRoomInfo} = useSetRoomInfo();
  const {
    data: {isHost},
    sttLanguage,
    isSTTActive,
  } = useRoomInfo();
  const {isPendingRequestToReview, raiseHandList} =
    useContext(LiveStreamContext);
  const {totalUnreadCount} = useChatNotification();
  const {setIsSTTActive, setLanguage, setMeetingTranscript} = useCaption();
  const {defaultContent} = useContent();
  const {waitingRoomUids} = useWaitingRoomContext();
  const defaultContentRef = React.useRef(defaultContent);

  React.useEffect(() => {
    defaultContentRef.current = defaultContent;
  }, [defaultContent]);

  //STT events on mount

  React.useEffect(() => {
    setIsSTTActive(isSTTActive);
  }, [isSTTActive]);

  React.useEffect(() => {
    // for mobile events are set in ActionSheetContent
    if (!sttLanguage) return;
    const {
      username,
      prevLang,
      newLang,
      uid,
      langChanged,
    }: RoomInfoContextInterface['sttLanguage'] = sttLanguage;
    if (!langChanged) return;
    const actionText =
      prevLang.indexOf('') !== -1
        ? `has set the spoken language to  "${getLanguageLabel(newLang)}" `
        : `changed the spoken language from "${getLanguageLabel(
            prevLang,
          )}" to "${getLanguageLabel(newLang)}" `;
    const msg = `${
      defaultContentRef.current[uid]?.name || username
    } ${actionText} `;

    let subheadingObj: any = {};
    if (prevLang.indexOf('') !== -1) {
      subheadingObj = {
        username: defaultContentRef.current[uid]?.name || username,
        action: prevLang.indexOf('') !== -1 ? 'Set' : 'Changed',
        newLanguage: getLanguageLabel(newLang),
      };
    } else {
      subheadingObj = {
        username: defaultContentRef.current[uid]?.name || username,
        action: prevLang.indexOf('') !== -1 ? 'Set' : 'Changed',
        newLanguage: getLanguageLabel(newLang),
        oldLanguage: getLanguageLabel(prevLang),
      };
    }
    Toast.show({
      leadingIconName: 'lang-select',
      type: 'info',
      text1: heading(prevLang.indexOf('') !== -1 ? 'Set' : 'Changed'),
      visibilityTime: 3000,
      primaryBtn: null,
      secondaryBtn: null,
      text2: subheading(subheadingObj),
    });
    setRoomInfo(prev => {
      return {
        ...prev,
        sttLanguage: {...sttLanguage, langChanged: false},
      };
    });
    // syncing local set language
    newLang && setLanguage(newLang);
    // add spoken lang msg to transcript
    setMeetingTranscript(prev => {
      return [
        ...prev,
        {
          name: 'langUpdate',
          time: new Date().getTime(),
          uid: `langUpdate-${uid}`,
          text: actionText,
        },
      ];
    });
  }, [sttLanguage]);

  const isLiveStream = $config.EVENT_MODE && !$config.AUDIO_ROOM;
  const isAudience = rtcProps?.role === ClientRole.Audience;
  const isBroadCasting = rtcProps?.role === ClientRole.Broadcaster;
  const isHandRaised = raiseHandList[localUid]?.raised === RaiseHandValue.TRUE;

  const isAudioRoom = $config.AUDIO_ROOM;
  const isVoiceChatHost = !$config.EVENT_MODE && $config.AUDIO_ROOM && isHost;
  const isVoiceChatAudience =
    !$config.EVENT_MODE && $config.AUDIO_ROOM && isAudience;
  const isAudioCastHost = $config.EVENT_MODE && $config.AUDIO_ROOM && isHost;
  const isAudioCastAudience =
    $config.EVENT_MODE && $config.AUDIO_ROOM && isAudience;

  const isAudioVideoControlsDisabled =
    isAudience && $config.EVENT_MODE && !$config.RAISE_HAND;

  const isConferencing = !$config.EVENT_MODE && !$config.AUDIO_ROOM;

  const localUser = useLocalUserInfo();

  const isVideoDisabled = native
    ? localUser.video === ToggleState.disabled || isScreenshareActive
    : localUser.video === ToggleState.disabled;

  const isPendingWaitingRoomApproval = isHost && waitingRoomUids.length > 0;

  const defaultItems = [
    {
      default: true,
      order: 0,
      hide: 'no',
      align: 'start',
      component: isAudioVideoControlsDisabled ? null : <AudioIcon />,
    },
    {
      default: true,
      order: 0,
      hide: 'no',
      align: 'start',
      /*For AudioCast Host:Chat ,Attendee:Raise Hand 
            For VoiceChat Host:Chat, Attendee:Chat
           */
      component: (isAudioCastHost ||
        isVoiceChatHost ||
        isVoiceChatAudience) && <ChatIcon />,
    },

    {
      default: true,
      order: 0,
      hide: 'no',
      align: 'start',
      component:
        (isAudioCastAudience && isLiveStream && isAudience) ||
        (isBroadCasting && !isHost) ? (
          $config.RAISE_HAND && isAudioRoom ? (
            <LiveStreamIcon />
          ) : null
        ) : null,
    },
    {
      default: true,
      order: 1,
      hide: 'no',
      align: 'start',
      component:
        !isAudioRoom && (isAudioVideoControlsDisabled ? null : <CamIcon />),
    },
    {
      default: true,
      order: 2,
      hide: 'no',
      align: 'start',
      component: <EndCallIcon />,
    },
    //reset of the controls
    {
      default: true,
      order: 4,
      hide: 'no',
      align: 'start',
      component:
        (isLiveStream && isAudience) || (isBroadCasting && !isHost) ? (
          $config.RAISE_HAND && !isAudioRoom ? (
            <LiveStreamIcon />
          ) : null
        ) : null,
    },

    {
      default: true,
      order: 5,
      hide: 'no',
      align: 'start',
      component: !(
        isAudioCastHost ||
        isVoiceChatHost ||
        isVoiceChatAudience
      ) && <ChatIcon />,
    },
    {
      default: true,
      order: 6,
      hide: 'no',
      align: 'start',
      component: <ParticipantsIcon />,
    },
    {
      default: true,
      order: 7,
      hide: 'no',
      align: 'start',
      component: isHost && $config.CLOUD_RECORDING ? <RecordingIcon /> : null,
    },
    {
      default: true,
      order: 7,
      hide: 'no',
      align: 'start',
      component:
        $config.ENABLE_VIRTUAL_BACKGROUND && !$config.AUDIO_ROOM ? (
          <VBIcon />
        ) : null,
    },
    {
      default: true,
      order: 8,
      hide: 'no',
      align: 'start',
      component:
        !isAudioRoom &&
        (isAudioVideoControlsDisabled ? null : <SwitchCameraIcon />),
    },
    {
      default: true,
      order: 9,
      hide: 'no',
      align: 'start',
      component: <LayoutIcon />,
    },
    {
      default: true,
      order: 10,
      hide: 'no',
      align: 'start',
      component: <SettingsIcon />,
    },
    {
      default: true,
      order: 11,
      hide: 'no',
      align: 'start',
      component: <ShareIcon />,
    },
    {
      default: true,
      order: 12,
      hide: 'no',
      align: 'start',
      component: (
        <CaptionIconBtn
          onPress={() => handleSheetChanges(isExpanded ? 0 : 1)}
        />
      ),
    },
    {
      default: true,
      order: 13,
      hide: 'no',
      align: 'start',
      component: <TranscriptIconBtn />,
    },
  ];

  const isHidden = i => {
    return i?.hide === 'yes';
  };
  const combinedItems = customItems
    ?.filter(i => !isHidden(i))
    ?.concat(includeDefaultItems ? defaultItems : [])
    //to filter empty component because of some condition array will have empty component
    ?.filter(i => i?.component)
    ?.sort(CustomToolbarSort);

  if (displayCustomBottomSheetContent) {
    return <View>{customBottomSheetContent}</View>;
  }
  return (
    <View>
      {/* Row Always Visible */}
      <ActionSheetProvider isOnFirstRow={true}>
        <View
          style={[
            styles.row,
            {borderBottomWidth: 1, paddingTop: 4, justifyContent: 'center'},
          ]}>
          {/**If no items more than 4 then render firstrender first 3 items and render show more icon  */}
          {/**If no items more less or equal to 4 then render n items and don't show more icon  */}
          {combinedItems
            ?.slice(0, combinedItems?.length > 4 ? 3 : 4)
            ?.map(i => {
              const Component = i?.component;
              if (Component) {
                return i?.default ? Component : <Component />;
              } else {
                return null;
              }
            })}
          {combinedItems && combinedItems?.length > 4 ? (
            <ShowMoreIcon
              isExpanded={isExpanded}
              showNotification={
                (!isExpanded && totalUnreadCount !== 0) ||
                ($config.EVENT_MODE && isPendingRequestToReview) ||
                isPendingWaitingRoomApproval
              }
              onPress={() => handleSheetChanges(isExpanded ? 0 : 1)}
            />
          ) : (
            <></>
          )}
        </View>
      </ActionSheetProvider>

      <CarouselWrapper data={combinedItems?.slice(3, combinedItems?.length)} />
    </View>
  );
};
const CarouselWrapper = ({data}) => {
  const createSlides = () => {
    const slides = [];
    const items = data || [];
    // one slide can contain max of 8 icons
    for (let i = 0; i < items.length; i += 8) {
      const slideItems = items.slice(i, i + 8).map(item => {
        const Component = item?.component;
        return Component ? (
          item.default ? (
            Component
          ) : (
            <Component key={item.id} />
          )
        ) : null;
      });

      slides.push({
        id: `slide_${Math.floor(i / 8) + 1}`,
        component: <View style={styles.row}>{slideItems}</View>,
      });
    }

    return slides;
  };

  const slides = createSlides();

  const isPaginationRequired = slides.length > 1;

  if (isPaginationRequired)
    return (
      <View style={{flexDirection: 'row'}}>
        <Carousel data={slides} />
      </View>
    );
  return <View style={styles.row}>{slides[0].component}</View>;
};

export default ActionSheetContent;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 24,
    borderColor: $config.CARD_LAYER_3_COLOR,
    flexWrap: 'wrap',
  },

  iconContainer: {
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWithText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '25%',
    paddingBottom: 24,
  },
  iconText: {
    color: $config.FONT_COLOR,
    marginTop: 8,
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Source Sans Pro',
    textAlign: 'center',
  },
  notification: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: $config.SEMANTIC_ERROR,
    borderRadius: 6,
    top: -1,
    right: 5,
  },
});
