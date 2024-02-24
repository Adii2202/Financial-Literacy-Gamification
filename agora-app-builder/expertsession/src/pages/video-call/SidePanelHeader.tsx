import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import SidePanelHeader, {
  SidePanelStyles,
} from '../../subComponents/SidePanelHeader';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import ThemeConfig from '../../theme';
import {useChatNotification} from '../../components/chat-notification/useChatNotification';
import {useSidePanel} from '../../utils/useSidePanel';
import {SidePanelType} from '../../subComponents/SidePanelEnum';
import {
  ChatType,
  useChatUIControls,
} from '../../components/chat-ui/useChatUIControls';
import {numFormatter} from '../../utils';
import ChatContext from '../../components/ChatContext';
import {useCaption} from '../../subComponents/caption/useCaption';
import ActionMenu, {ActionMenuItem} from '../../atoms/ActionMenu';
import {calculatePosition} from '../../utils/common';
import LanguageSelectorPopup from '../../subComponents/caption/LanguageSelectorPopup';
import useSTTAPI from '../../subComponents/caption/useSTTAPI';
import useGetName from '../../utils/useGetName';
import {LanguageType} from '../../subComponents/caption/utils';
import {useRoomInfo, usePreCall} from 'customization-api';
import useTranscriptDownload from '../../subComponents/caption/useTranscriptDownload';
import {useVB} from '../../components/virtual-background/useVB';
import {PropsContext} from '../../../agora-rn-uikit';
import useLiveStreamingUids from '../../utils/useLiveStreamingUids';
import {useString} from '../../utils/useString';
import {
  settingsPanelHeading,
  vbPanelHeading,
} from '../../language/default-labels/precallScreenLabels';
import {
  chatPanelGroupTabText,
  chatPanelPrivateTabText,
  peoplePanelHeaderText,
  sttChangeSpokenLanguageText,
  sttDownloadTranscriptBtnText,
  sttTranscriptPanelHeaderText,
} from '../../language/default-labels/videoCallScreenLabels';

export const SettingsHeader = props => {
  const {setSidePanel} = useSidePanel();
  const settingsLabel = useString(settingsPanelHeading)();

  return (
    <SidePanelHeader
      centerComponent={
        <Text style={SidePanelStyles.heading}>{settingsLabel}</Text>
      }
      trailingIconName="close"
      trailingIconOnPress={() => {
        props.handleClose && props.handleClose();
        setSidePanel(SidePanelType.None);
      }}
    />
  );
};

export const PeopleHeader = () => {
  const {onlineUsersCount} = useContext(ChatContext);
  const {hostUids, audienceUids} = useLiveStreamingUids();
  const count = $config.EVENT_MODE
    ? hostUids.length + audienceUids.length
    : onlineUsersCount;
  const participantsLabel = useString(peoplePanelHeaderText)();

  const {setSidePanel} = useSidePanel();
  return (
    <SidePanelHeader
      centerComponent={
        <Text style={SidePanelStyles.heading}>{participantsLabel}</Text>
      }
      trailingIconName="close"
      trailingIconOnPress={() => {
        setSidePanel(SidePanelType.None);
      }}
    />
  );
};

export const ChatHeader = () => {
  const {
    unreadGroupMessageCount,
    setUnreadGroupMessageCount,
    unreadPrivateMessageCount,
    setUnreadPrivateMessageCount,
    setUnreadIndividualMessageCount,
    unreadIndividualMessageCount,
  } = useChatNotification();

  const {setSidePanel} = useSidePanel();
  const groupChatLabel = useString(chatPanelGroupTabText)();
  const privateChatLabel = useString(chatPanelPrivateTabText)();

  const {chatType, setChatType, setPrivateChatUser} = useChatUIControls();

  const selectGroup = () => {
    setChatType(ChatType.Group);
    //move this logic into ChatContainer
    //setUnreadGroupMessageCount(0);
    setPrivateChatUser(0);
  };
  const selectPrivate = () => {
    setPrivateChatUser(0);
    setChatType(ChatType.MemberList);
  };
  const isPrivateActive = chatType === ChatType.Private;
  const isGroupActive = chatType === ChatType.Group;
  return (
    <SidePanelHeader
      isChat={true}
      leadingIconName={isPrivateActive ? 'back-btn' : null}
      leadingIconOnPress={
        isPrivateActive
          ? () => {
              setPrivateChatUser(0);
              setChatType(ChatType.MemberList);
            }
          : () => {}
      }
      centerComponent={
        <View style={styles.buttonHolder}>
          <TouchableOpacity
            onPress={selectGroup}
            style={
              isGroupActive ? styles.activeContainer : styles.nonActiveContainer
            }>
            {unreadGroupMessageCount !== 0 ? (
              <View style={styles.chatNotification} />
            ) : null}
            <Text
              style={isGroupActive ? styles.activeText : styles.nonActiveText}>
              {groupChatLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={selectPrivate}
            style={
              !isGroupActive
                ? [styles.activeContainer]
                : [styles.nonActiveContainer]
            }>
            {unreadPrivateMessageCount !== 0 ? (
              <View style={styles.chatNotification} />
            ) : null}
            <Text
              style={!isGroupActive ? styles.activeText : styles.nonActiveText}>
              {privateChatLabel}
            </Text>
          </TouchableOpacity>
        </View>
      }
      trailingIconName="close"
      trailingIconOnPress={() => {
        setSidePanel(SidePanelType.None);
      }}
    />
  );
};

export const VBHeader = () => {
  const label = useString(vbPanelHeading)();
  const {setSidePanel} = useSidePanel();
  const {setIsVBActive} = useVB();

  const {
    rtcProps: {callActive},
  } = useContext(PropsContext);
  const trailingIconName = 'close';
  return (
    <SidePanelHeader
      centerComponent={<Text style={SidePanelStyles.heading}>{label}</Text>}
      trailingIconName={trailingIconName}
      trailingIconOnPress={() => {
        setSidePanel(SidePanelType.None);
        setIsVBActive(false);
      }}
    />
  );
};

export const TranscriptHeader = props => {
  const {setSidePanel} = useSidePanel();
  const moreIconRef = React.useRef<View>(null);
  const [actionMenuVisible, setActionMenuVisible] =
    React.useState<boolean>(false);

  const label = useString(sttTranscriptPanelHeaderText)();

  return (
    <SidePanelHeader
      centerComponent={<Text style={SidePanelStyles.heading}>{label}</Text>}
      trailingIconName={'more-menu'}
      ref={moreIconRef}
      trailingIconOnPress={() => {
        setActionMenuVisible(true);
      }}
      trailingIconName2={'close'}
      trailingIconOnPress2={() => {
        setSidePanel(SidePanelType.None);
      }}>
      <TranscriptHeaderActionMenu
        actionMenuVisible={actionMenuVisible}
        setActionMenuVisible={setActionMenuVisible}
        btnRef={moreIconRef}
      />
    </SidePanelHeader>
  );
};

interface TranscriptHeaderActionMenuProps {
  actionMenuVisible: boolean;
  setActionMenuVisible: (actionMenuVisible: boolean) => void;
  btnRef: React.RefObject<View>;
}

const TranscriptHeaderActionMenu = (props: TranscriptHeaderActionMenuProps) => {
  const {actionMenuVisible, setActionMenuVisible, btnRef} = props;
  const {
    language: prevLang,
    meetingTranscript,
    isLangChangeInProgress,
    setLanguage,
  } = useCaption();
  const {downloadTranscript} = useTranscriptDownload();
  const [modalPosition, setModalPosition] = React.useState({});
  const [isPosCalculated, setIsPosCalculated] = React.useState(false);
  const {width: globalWidth, height: globalHeight} = useWindowDimensions();
  const [isLanguagePopupOpen, setLanguagePopup] =
    React.useState<boolean>(false);
  const {restart} = useSTTAPI();
  const username = useGetName();
  const actionMenuitems: ActionMenuItem[] = [];
  const {
    data: {isHost},
  } = useRoomInfo();

  const downloadTranscriptLabel = useString(sttDownloadTranscriptBtnText)();
  const changeSpokenLanguage = useString<boolean>(
    sttChangeSpokenLanguageText,
  )();
  isHost &&
    actionMenuitems.push({
      icon: 'lang-select',
      iconColor: $config.SECONDARY_ACTION_COLOR,
      textColor: $config.FONT_COLOR,
      title: changeSpokenLanguage + ' ',
      disabled: isLangChangeInProgress,
      callback: () => {
        setActionMenuVisible(false);
        setLanguagePopup(true);
      },
    });

  actionMenuitems.push({
    icon: 'download',
    iconColor: $config.SECONDARY_ACTION_COLOR,
    textColor: $config.FONT_COLOR,
    title: downloadTranscriptLabel,
    disabled: meetingTranscript.length === 0,
    callback: () => {
      downloadTranscript();
      setActionMenuVisible(false);
    },
  });

  const onLanguageChange = (langChanged = false, language: LanguageType[]) => {
    setLanguagePopup(false);
    if (langChanged) {
      restart(language)
        .then(() => {
          console.log('stt restarted successfully');
        })
        .catch(error => {
          console.log('Error in restarting', error);
          // Handle the error case
        });
    }
  };

  React.useEffect(() => {
    if (actionMenuVisible) {
      //getting btnRef x,y
      btnRef?.current?.measure(
        (
          _fx: number,
          _fy: number,
          localWidth: number,
          localHeight: number,
          px: number,
          py: number,
        ) => {
          const data = calculatePosition({
            px,
            py,
            localWidth,
            localHeight,
            globalHeight,
            globalWidth,
          });
          setModalPosition(data);
          setIsPosCalculated(true);
        },
      );
    }
  }, [actionMenuVisible]);
  return (
    <>
      <ActionMenu
        from={'transcript-header'}
        actionMenuVisible={actionMenuVisible && isPosCalculated}
        setActionMenuVisible={setActionMenuVisible}
        modalPosition={modalPosition}
        items={actionMenuitems}
      />

      <LanguageSelectorPopup
        modalVisible={isLanguagePopupOpen}
        setModalVisible={setLanguagePopup}
        onConfirm={onLanguageChange}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonHolder: {
    backgroundColor:
      $config.HARD_CODED_BLACK_COLOR + hexadecimalTransparency['30%'],
    borderRadius: 12,
    flexDirection: 'row',
  },
  chatViewNative: {
    zIndex: 5,
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  chatInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContainer: {
    margin: 2,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 11,
    alignSelf: 'center',
  },
  nonActiveContainer: {
    alignSelf: 'center',
  },
  activeText: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 12,
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
  },
  nonActiveText: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 12,
    color: $config.FONT_COLOR,
  },
  chatNotification: {
    width: 8,
    height: 8,
    backgroundColor: $config.SEMANTIC_ERROR,
    borderRadius: 30,
    position: 'absolute',
    right: 8,
    top: 4,
  },
});
