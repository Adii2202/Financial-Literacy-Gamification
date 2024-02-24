import React, {SetStateAction, useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../atoms/Spacer';
import Popup from '../atoms/Popup';
import TertiaryButton from '../atoms/TertiaryButton';
import PrimaryButton from '../atoms/PrimaryButton';
import ThemeConfig from '../theme';
import {useIsDesktop} from '../utils/common';
import DownloadTranscriptBtn from './caption/DownloadTranscriptBtn';
import ImageIcon from '../atoms/ImageIcon';
import {useCaption} from './caption/useCaption';
import {useString} from '../utils/useString';
import {
  leavePopupHeading,
  leavePopupPrimaryBtnText,
  leavePopupSubHeading,
  sttDownloadBtnText,
  sttTranscriptPanelHeaderText,
} from '../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../language/default-labels/commonLabels';

interface EndcallPopupProps {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<SetStateAction<boolean>>;
  endCall: () => void;
}

const DownloadTranscript = () => {
  const label = useString(sttTranscriptPanelHeaderText)();
  const downloadLabel = useString(sttDownloadBtnText)();
  return (
    <View style={[styles.btnDownloadContainer, styles.row]}>
      <View style={styles.row}>
        <ImageIcon
          iconType="plain"
          name={'transcript-mode'}
          tintColor={$config.FONT_COLOR}
          iconSize={20}
        />
        <Spacer size={4} horizontal />
        <Text style={styles.label}>{label}</Text>
      </View>
      <DownloadTranscriptBtn
        textStyle={[styles.label, styles.downloadBtnText] as Object}
        containerStyle={styles.downloadBtn}
        iconName=""
        text={downloadLabel}
      />
    </View>
  );
};

const EndcallPopup = (props: EndcallPopupProps) => {
  const isDesktop = useIsDesktop()('popup');
  const leaveMeetingLabelHeading = useString(leavePopupHeading)();
  const leaveMeetingLabelSubHeading = useString<boolean>(leavePopupSubHeading);
  const leaveMeetingPopupActionButton = useString(leavePopupPrimaryBtnText)();
  const cancelLabel = useString(cancelText)();
  const {isSTTActive} = useCaption();
  const isTranscriptAvailable = $config.ENABLE_STT && isSTTActive;

  const stayBtnLabel = cancelLabel;
  const leaveBtnLabel = leaveMeetingPopupActionButton;
  return (
    <Popup
      modalVisible={props.modalVisible}
      setModalVisible={props.setModalVisible}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{leaveMeetingLabelHeading}</Text>
      <Spacer size={8} />
      <Text style={styles.subHeading}>
        {leaveMeetingLabelSubHeading(isTranscriptAvailable)}
      </Text>
      {isTranscriptAvailable ? <DownloadTranscript /> : <></>}
      <Spacer size={40} />
      <View style={isDesktop ? styles.btnContainer : styles.btnContainerMobile}>
        <View style={isDesktop && {flex: 1}}>
          <TertiaryButton
            containerStyle={{
              width: '100%',
              height: 48,
              paddingVertical: 8,
              paddingHorizontal: 40,
              borderRadius: ThemeConfig.BorderRadius.medium,
            }}
            text={stayBtnLabel}
            textStyle={styles.btnText}
            onPress={() => props.setModalVisible(false)}
          />
        </View>
        <Spacer
          size={isDesktop ? 10 : 20}
          horizontal={isDesktop ? true : false}
        />
        <View style={isDesktop && {flex: 1}}>
          <PrimaryButton
            containerStyle={{
              minWidth: 'auto',
              width: '100%',
              borderRadius: ThemeConfig.BorderRadius.medium,
              height: 48,
              backgroundColor: $config.SEMANTIC_ERROR,
              paddingVertical: 8,
              paddingHorizontal: 36,
            }}
            text={leaveBtnLabel}
            textStyle={styles.btnText}
            onPress={props.endCall}
          />
        </View>
      </View>
    </Popup>
  );
};

export default EndcallPopup;

const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
  },

  btnContainerMobile: {
    flexDirection: 'column-reverse',
  },
  contentContainer: {
    padding: 24,
    minWidth: 342,
  },
  heading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 22,
    color: $config.SEMANTIC_ERROR,
  },
  subHeading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
    maxWidth: 336,
  },
  downloadBtn: {
    minWidth: 'auto',
  },
  btnDownloadContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: $config.CARD_LAYER_2_COLOR,

    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 20,
  },
  downloadBtnText: {
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  label: {
    color: $config.FONT_COLOR,
    fontSize: ThemeConfig.FontSize.tiny,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
  row: {
    flexDirection: 'row',
  },
});
