import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../../atoms/Spacer';
import Popup from '../../atoms/Popup';
import TertiaryButton from '../../atoms/TertiaryButton';
import PrimaryButton from '../../atoms/PrimaryButton';
import ThemeConfig from '../../theme';
import {useIsDesktop} from '../../utils/common';
import {useVideoCall} from '../useVideoCall';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../../rtm-events-api/LocalEvents';
import {useString} from '../../utils/useString';
import {
  clearAllWhiteboardPopupHeading,
  clearAllWhiteboardPopupPrimaryBtnText,
  clearAllWhiteboardPopupSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../../language/default-labels/commonLabels';

const WhiteboardClearAllPopup = () => {
  const {showWhiteboardClearAllPopup, setShowWhiteboardClearAllPopup} =
    useVideoCall();
  const isDesktop = useIsDesktop()('popup');
  const recordingLabelHeading = useString(clearAllWhiteboardPopupHeading)();
  const recordingLabelSubHeading = useString(
    clearAllWhiteboardPopupSubHeading,
  )();

  const cancelBtnLabel = useString(cancelText)();
  const whiteboardClearAllLabel = useString(
    clearAllWhiteboardPopupPrimaryBtnText,
  )();

  const clearWhiteboard = () => {
    LocalEventEmitter.emit(LocalEventsEnum.CLEAR_WHITEBOARD);
  };
  return (
    <Popup
      modalVisible={showWhiteboardClearAllPopup}
      setModalVisible={setShowWhiteboardClearAllPopup}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{recordingLabelHeading}</Text>
      <Spacer size={8} />
      <Text style={styles.subHeading}>{recordingLabelSubHeading}</Text>
      <Spacer size={32} />
      <View style={isDesktop ? styles.btnContainer : styles.btnContainerMobile}>
        <View style={isDesktop && {flex: 1}}>
          <TertiaryButton
            containerStyle={{
              minWidth: 'auto',
              width: isDesktop ? 90 : '100%',
              height: 48,
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: ThemeConfig.BorderRadius.medium,
            }}
            textStyle={styles.btnText}
            text={cancelBtnLabel}
            onPress={() => setShowWhiteboardClearAllPopup(false)}
          />
        </View>
        <Spacer
          size={isDesktop ? 10 : 20}
          horizontal={isDesktop ? true : false}
        />
        <View style={isDesktop && {flex: 2}}>
          <PrimaryButton
            containerStyle={{
              minWidth: 'auto',
              width: '100%',
              borderRadius: ThemeConfig.BorderRadius.medium,
              height: 48,
              backgroundColor: $config.SEMANTIC_ERROR,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
            textStyle={styles.btnText}
            text={whiteboardClearAllLabel}
            onPress={clearWhiteboard}
          />
        </View>
      </View>
    </Popup>
  );
};

export default WhiteboardClearAllPopup;

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
    maxWidth: 342,
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
  },
});
