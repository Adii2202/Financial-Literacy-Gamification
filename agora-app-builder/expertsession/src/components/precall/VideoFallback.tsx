import {StyleSheet, Text, View, Linking, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useContext} from 'react';
import {
  isAndroid,
  isIOS,
  isWebInternal,
  useResponsive,
} from '../../utils/common';
import {
  LocalContext,
  PermissionState,
  ImageIcon as UiKitImageIcon,
} from '../../../agora-rn-uikit';
import ThemeConfig from '../../theme';
import {useContent} from 'customization-api';
import {usePreCall} from './usePreCall';
import ImageIcon from '../../atoms/ImageIcon';
import Spacer from '../../atoms/Spacer';
import Toast from '../../../react-native-toast-message';
import {useString} from '../../utils/useString';
import {
  permissionPopupErrorToastHeading,
  permissionPopupErrorToastSubHeading,
} from '../../language/default-labels/precallScreenLabels';

const VideoFallback = () => {
  const toastHeading = useString<boolean>(permissionPopupErrorToastHeading);
  const toastSubHeading = useString<boolean>(
    permissionPopupErrorToastSubHeading,
  );

  const {isCameraAvailable, isMicAvailable} = usePreCall();
  const toastRef = useRef({isShown: false});
  const local = useContext(LocalContext);
  const requestCameraAndAudioPermission = () => {
    try {
      const URL =
        'https://support.google.com/chrome/answer/2693767?hl=en&co=GENIE.Platform%3DDesktop';
      if (isWebInternal()) {
        window.open(URL, '_blank');
      } else {
        Linking.openURL(URL);
      }
    } catch (error) {
      console.error(`Couldn't open the support url`);
    }
  };

  const styles = useStyles();
  useEffect(() => {
    // camera not avaialble popup is not shown for native devices
    if (isAndroid() || isIOS()) return;
    if (
      !(
        isCameraAvailable ||
        ($config.AUDIO_ROOM && isMicAvailable) ||
        local.permissionStatus === PermissionState.NOT_REQUESTED ||
        local.permissionStatus === PermissionState.REQUESTED
      ) &&
      toastRef.current.isShown === false
    ) {
      toastRef.current.isShown = true;
      Toast.show({
        type: 'warn',
        text1: toastHeading($config.AUDIO_ROOM),
        text2: toastSubHeading($config.AUDIO_ROOM),
        visibilityTime: 10000,
      });
    }
  }, [local, isCameraAvailable, isMicAvailable]);

  return (
    <View style={styles.fallbackRootContainer}>
      {
        // isCameraAvailable ||
        // ($config.AUDIO_ROOM && isMicAvailable) ||
        // local.permissionStatus === PermissionState.NOT_REQUESTED ||
        // local.permissionStatus === PermissionState.REQUESTED
        true ? (
          <View style={styles.avatar}>
            <UiKitImageIcon name={'profile'} />
          </View>
        ) : (
          <View style={styles.fallbackContainer}>
            <Text style={styles.infoText1}>
              Can’t Find Your{$config.AUDIO_ROOM ? ' Microphone' : ' Camera'}
            </Text>
            <Text style={styles.infoText2}>
              Check your system settings to make sure that a
              {$config.AUDIO_ROOM ? ' microphone' : ' camera'} is available. If
              not, plug one in and restart your browser.
            </Text>
            <Spacer size={33} />
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
              }}
              onPress={() => {
                requestCameraAndAudioPermission();
              }}>
              <Text style={styles.retryBtn}>Learn More</Text>
              <Spacer horizontal={true} size={4} />
              <View style={{alignSelf: 'center'}}>
                <ImageIcon
                  iconType="plain"
                  name={'link-share'}
                  tintColor={$config.PRIMARY_ACTION_BRAND_COLOR}
                />
              </View>
            </TouchableOpacity>
            <Spacer size={23} />
          </View>
        )
      }
    </View>
  );
};

export default VideoFallback;

const useStyles = () => {
  const getResponsiveValue = useResponsive();
  return StyleSheet.create({
    infoText1: {
      fontFamily: ThemeConfig.FontFamily.sansPro,
      fontWeight: '700',
      fontSize: 20,
      textAlign: 'center',
      color: $config.FONT_COLOR,
      paddingTop: 24,
      paddingBottom: 12,
      paddingHorizontal: 10,
    },
    infoText2: {
      fontFamily: ThemeConfig.FontFamily.sansPro,
      fontWeight: '400',
      fontSize: ThemeConfig.FontSize.small,
      textAlign: 'center',
      color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled,
      paddingHorizontal: getResponsiveValue(48),
    },
    fallbackRootContainer: {
      flex: 1,
      backgroundColor: $config.VIDEO_AUDIO_TILE_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
    },
    fallbackContainer: {
      minHeight: 200,
      maxWidth: 440,
      backgroundColor: $config.CARD_LAYER_4_COLOR,
      borderRadius: ThemeConfig.BorderRadius.large,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 40,
    },
    retryBtn: {
      fontFamily: ThemeConfig.FontFamily.sansPro,
      fontWeight: '600',
      fontSize: ThemeConfig.FontSize.normal,
      color: $config.PRIMARY_ACTION_BRAND_COLOR,
      alignSelf: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      margin: 40,
    },
  });
};
