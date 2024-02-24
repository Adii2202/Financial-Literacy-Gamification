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
import {useLocalUserInfo} from '../../app-state/useLocalUserInfo';
import {useString} from '../../utils/useString';
import {
  nativeScreensharePopupHeading,
  nativeScreensharePopupIncludeDeviceAudioText,
  nativeScreensharePopupPrimaryBtnText,
  nativeScreensharePopupSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';
import {cancelText} from '../../language/default-labels/commonLabels';

const StartScreenSharePopup = () => {
  const {showStartScreenSharePopup, setShowStartScreenSharePopup} =
    useVideoCall();
  const {video} = useLocalUserInfo();
  const {startUserScreenshare, isScreenshareActive} = useScreenshare();
  const isDesktop = useIsDesktop()('popup');
  const cancelLabel = useString(cancelText)();
  const proceedLabel = useString(nativeScreensharePopupPrimaryBtnText)();
  const includeDeviceAudio = useString(
    nativeScreensharePopupIncludeDeviceAudioText,
  )();
  const screenshareLabelHeading = useString(nativeScreensharePopupHeading)();
  const screenshareLabelSubHeading = useString(
    nativeScreensharePopupSubHeading,
  );

  const cancelBtnLabel = cancelLabel;
  const startShareShareBtnLabel = proceedLabel;

  const doStartScreenShare = () => {
    if (!isScreenshareActive) {
      //@ts-ignore native only we will have argument
      startUserScreenshare && startUserScreenshare(shareAudio);
      setShowStartScreenSharePopup(false);
    }
  };
  const [shareAudio, setShareAudio] = useState(false);
  return (
    <Popup
      modalVisible={showStartScreenSharePopup}
      setModalVisible={setShowStartScreenSharePopup}
      showCloseIcon={false}
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.heading}>{screenshareLabelHeading}</Text>
      <Spacer size={12} />
      <View style={[styles.toggleContainer, styles.lower, styles.upper]}>
        <View style={styles.infoContainer}>
          <Text numberOfLines={1} style={styles.toggleLabel}>
            {includeDeviceAudio}
          </Text>
        </View>
        <View style={styles.infoToggleContainer}>
          <Toggle isEnabled={shareAudio} toggleSwitch={setShareAudio} />
        </View>
      </View>
      <>
        <Spacer size={28} />
        <Text style={styles.subHeading}>
          {screenshareLabelSubHeading(video)}
        </Text>
      </>
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
            onPress={() => setShowStartScreenSharePopup(false)}
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
            onPress={doStartScreenShare}
          />
        </View>
      </View>
    </Popup>
  );
};

export default StartScreenSharePopup;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  upper: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  lower: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  toggleLabel: {
    color: $config.FONT_COLOR,
    fontSize: ThemeConfig.FontSize.normal,
    marginRight: 4,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    alignSelf: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    flex: 0.8,
  },
  infoToggleContainer: {
    flex: 0.2,
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
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
    minWidth: 342,
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
