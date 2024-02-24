import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Spacer from '../../atoms/Spacer';
import Popup from '../../atoms/Popup';
import TertiaryButton from '../../atoms/TertiaryButton';
import PrimaryButton from '../../atoms/PrimaryButton';
import ThemeConfig from '../../theme';
import {useIsDesktop} from '../../utils/common';

import {useVideoCall} from '../useVideoCall';
import {useScreenshare} from '../../subComponents/screenshare/useScreenshare';
import Toggle from '../../atoms/Toggle';
import useMuteToggleLocal, {
  MUTE_LOCAL_TYPE,
} from '../../utils/useMuteToggleLocal';
import {useString} from '../../utils/useString';
import {
  nativeStopScreensharePopupHeading,
  nativeStopScreensharePopupPrimaryBtnText,
  nativeStopScreensharePopupSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../../language/default-labels/commonLabels';

const StopScreenSharePopup = () => {
  const {showStopScreenSharePopup, setShowStopScreenSharePopup} =
    useVideoCall();
  const {stopUserScreenShare, isScreenshareActive} = useScreenshare();
  const isDesktop = useIsDesktop()('popup');
  const localMute = useMuteToggleLocal();
  const screenshareLabelHeading = useString(
    nativeStopScreensharePopupHeading,
  )();
  const screenshareLabelSubHeading = useString(
    nativeStopScreensharePopupSubHeading,
  )();

  const cancelBtnLabel = useString(cancelText)();
  const startShareShareBtnLabel = useString(
    nativeStopScreensharePopupPrimaryBtnText,
  )();

  const doStopScreenShare = () => {
    if (isScreenshareActive) {
      //true means keep the video enabled and stop only the screenshare
      //@ts-ignore
      stopUserScreenShare(true);
      setShowStopScreenSharePopup(false);
    }
  };
  return (
    <Popup
      modalVisible={showStopScreenSharePopup}
      setModalVisible={setShowStopScreenSharePopup}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{screenshareLabelHeading}</Text>
      <Spacer size={8} />
      <Text style={styles.subHeading}>{screenshareLabelSubHeading}</Text>
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
            onPress={() => setShowStopScreenSharePopup(false)}
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
              backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
              paddingVertical: 12,
              paddingHorizontal: 12,
            }}
            textStyle={styles.btnText}
            text={startShareShareBtnLabel}
            onPress={doStopScreenShare}
          />
        </View>
      </View>
    </Popup>
  );
};

export default StopScreenSharePopup;

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
    color: $config.FONT_COLOR,
  },
  subHeading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    color: $config.FONT_COLOR,
  },
});
