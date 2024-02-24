import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {SetStateAction} from 'react';
import ThemeConfig from '../theme';
import Spacer from '../atoms/Spacer';
import PlatformWrapper from '../utils/PlatformWrapper';
import {isMobileOrTablet} from 'customization-api';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {useString} from '../utils/useString';
import {
  I18nMuteConfirmation,
  I18nMuteType,
  I18nRequestConfirmation,
  muteAllConfirmationPopoverContent,
  muteAllConfirmationPopoverPrimaryBtnText,
  muteConfirmationPopoverContent,
  muteConfirmationPopoverPrimaryBtnText,
  requestConfirmationPopoverContent,
  requestConfirmationPopoverPrimaryBtnText,
} from '../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../language/default-labels/commonLabels';

export interface RemoteMutePopupProps {
  actionMenuVisible: boolean;
  setActionMenuVisible: React.Dispatch<SetStateAction<boolean>>;
  modalPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  name: string;
  onMutePress: () => void;
  type: I18nMuteType;
  action?: 'mute' | 'request';
}

const RemoteMutePopup = (props: RemoteMutePopupProps) => {
  const cancelLabel = useString(cancelText)();
  const muteLabel = useString(muteConfirmationPopoverPrimaryBtnText)();
  const muteAllLabel = useString(muteAllConfirmationPopoverPrimaryBtnText)();
  const requestLabel = useString(requestConfirmationPopoverPrimaryBtnText)();

  const muteAllConfirmation = useString<I18nMuteType>(
    muteAllConfirmationPopoverContent,
  );
  const requestConfirmation = useString<I18nRequestConfirmation>(
    requestConfirmationPopoverContent,
  );
  const muteConfirmation = useString<I18nMuteConfirmation>(
    muteConfirmationPopoverContent,
  );

  const {height} = useWindowDimensions();
  const {
    actionMenuVisible,
    setActionMenuVisible,
    modalPosition,
    action = 'mute',
  } = props;
  let message = '';
  let btnLabel = '';

  if (props.name) {
    //mute action
    if (action === 'mute') {
      message = muteConfirmation({
        name: props?.name,
        type: props.type,
      });
      btnLabel = muteLabel;
      //message = `Mute ${props.name}'s ${props.type} for everyone on the call? Only ${props.name} can unmute themselves.`;
    }
    //request action
    else {
      message = requestConfirmation({
        name: props?.name,
        type: props?.type,
      });
      btnLabel = requestLabel;
      // if (props?.type === 'audio') {
      //   //message = `Request ${props.name} to turn on their microphone?`;
      // } else {
      //   //message = `Request ${props.name} to turn on their camera?`;
      // }
    }
  } else {
    message = muteAllConfirmation(props?.type);
    btnLabel = muteAllLabel;
    //message = `Mute everyone's ${props.type} on the call?`;
  }

  return (
    <View>
      <Modal
        testID="action-menu"
        animationType="none"
        transparent={true}
        visible={actionMenuVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            setActionMenuVisible(false);
          }}>
          <View
            style={[
              styles.backDrop,
              isMobileOrTablet()
                ? {
                    backgroundColor:
                      $config.HARD_CODED_BLACK_COLOR +
                      hexadecimalTransparency['50%'],
                  }
                : {},
            ]}
          />
        </TouchableWithoutFeedback>
        <View
          style={
            isMobileOrTablet()
              ? [styles.modalViewUA, {marginTop: height / 3}]
              : [styles.modalView, modalPosition]
          }>
          <View style={styles.container}>
            <Text style={styles.messageStyle}>{message}</Text>
            <View style={styles.btnContainer}>
              <PlatformWrapper>
                {(isHovered: boolean) => {
                  return (
                    <TouchableOpacity
                      style={isHovered ? styles.onHoverBtnStyle : {}}
                      onPress={() => props.setActionMenuVisible(false)}>
                      <Text style={styles.btnText}>
                        {cancelLabel?.toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              </PlatformWrapper>
              <Spacer size={8} horizontal={true} />
              <PlatformWrapper>
                {(isHovered: boolean) => {
                  return (
                    <TouchableOpacity
                      style={isHovered ? styles.onHoverBtnStyle : {}}
                      onPress={() => props.onMutePress()}>
                      <Text style={styles.btnText}>{btnLabel}</Text>
                    </TouchableOpacity>
                  );
                }}
              </PlatformWrapper>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RemoteMutePopup;

const styles = StyleSheet.create({
  onHoverBtnStyle: {
    backgroundColor: $config.CARD_LAYER_3_COLOR,
    borderRadius: 8,
  },
  container: {
    paddingHorizontal: 12,
    paddingTop: 24,
    paddingBottom: 14,
  },
  messageStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.FONT_COLOR,
    paddingBottom: 18,
  },
  btnText: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalView: {
    position: 'absolute',
    width: 290,
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1,
    elevation: 1,
  },
  modalViewUA: {
    alignSelf: 'center',
    maxWidth: '80%',
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1,
    elevation: 1,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
