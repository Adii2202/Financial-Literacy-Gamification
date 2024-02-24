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
import React, {useContext} from 'react';
import {
  ToggleState,
  PermissionState,
  ImageIcon as UIKitImageIcon,
  ClientRole,
  PropsContext,
} from '../../agora-rn-uikit';
import useMuteToggleLocal, {MUTE_LOCAL_TYPE} from '../utils/useMuteToggleLocal';
import Styles from '../components/styles';
import {useString} from '../utils/useString';
import {useLocalUserInfo, useRoomInfo} from 'customization-api';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import ThemeConfig from '../theme';
import {ImageIconProps} from '../atoms/ImageIcon';
import useIsHandRaised from '../utils/useIsHandRaised';
import {useScreenshare} from './screenshare/useScreenshare';
import {isAndroid} from '../utils/common';
import {isIOS} from '../utils/common';
import {useVideoCall} from '../components/useVideoCall';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {isMobileUA} from '../utils/common';
import {useToolbar} from '../utils/useToolbar';
import {
  I18nDeviceStatus,
  livestreamingCameraTooltipText,
  toolbarItemCameraText,
  toolbarItemCameraTooltipText,
} from '../language/default-labels/videoCallScreenLabels';
/**
 * A component to mute / unmute the local video
 */
export interface LocalVideoMuteProps {
  plainIconHoverEffect?: boolean;
  showToolTip?: boolean;
  render?: (onPress: () => void, isVideoEnabled: boolean) => JSX.Element;
  disabled?: boolean;
  iconProps?: (
    isVideoEnabled: boolean,
    isPermissionDenied: boolean,
  ) => Partial<ImageIconProps>;
  showWarningIcon?: boolean;
}

function LocalVideoMute(props: LocalVideoMuteProps) {
  const {rtcProps} = useContext(PropsContext);
  const {isScreenshareActive} = useScreenshare();
  const {setShowStopScreenSharePopup} = useVideoCall();
  const {isToolbarMenuItem} = useToolbarMenu();
  const {
    data: {isHost},
  } = useRoomInfo();
  const local = useLocalUserInfo();
  const isHandRaised = useIsHandRaised();
  const localMute = useMuteToggleLocal();
  const {showToolTip = false, disabled = false, showWarningIcon = true} = props;
  const {isOnActionSheet, isOnFirstRow, showLabel} = useActionSheet();
  const {position} = useToolbar();
  const {
    rtcProps: {callActive},
  } = useContext(PropsContext);

  const videoButtonLabel = useString<I18nDeviceStatus>(toolbarItemCameraText);
  const videoButtonTooltip = useString<I18nDeviceStatus>(
    toolbarItemCameraTooltipText,
  );

  const lstooltip = useString<boolean>(livestreamingCameraTooltipText);
  const onPress = () => {
    //if screensharing is going on native - to turn on video screenshare should be turn off
    //show confirm popup to stop the screenshare
    if ((isAndroid() || isIOS()) && isScreenshareActive) {
      setShowStopScreenSharePopup(true);
    } else {
      localMute(MUTE_LOCAL_TYPE.video);
    }
  };
  //native screen share uses same local uid to publish the screenshare steam
  //so if screenshare active on native then its means local video is turned off
  const isVideoEnabled =
    (isAndroid() || isIOS()) && isScreenshareActive
      ? false
      : local.video === ToggleState.enabled;

  const permissionDenied =
    local.permissionStatus === PermissionState.REJECTED ||
    local.permissionStatus === PermissionState.GRANTED_FOR_MIC_ONLY;

  const videoLabel = permissionDenied
    ? videoButtonLabel(I18nDeviceStatus.PERMISSION_DENIED)
    : isVideoEnabled
    ? videoButtonLabel(I18nDeviceStatus.ON)
    : videoButtonLabel(I18nDeviceStatus.OFF);

  let iconProps: IconButtonProps['iconProps'] = {
    showWarningIcon: permissionDenied && showWarningIcon ? true : false,
    name: isVideoEnabled ? 'video-on' : 'video-off',
    iconBackgroundColor: isVideoEnabled
      ? $config.PRIMARY_ACTION_BRAND_COLOR
      : '',
    tintColor: isVideoEnabled
      ? $config.PRIMARY_ACTION_TEXT_COLOR
      : disabled
      ? $config.SEMANTIC_NEUTRAL
      : permissionDenied
      ? $config.SEMANTIC_NEUTRAL
      : $config.SEMANTIC_ERROR,
    ...(props?.iconProps
      ? props.iconProps(isVideoEnabled, permissionDenied)
      : {}),
  };

  let iconButtonProps: IconButtonProps = {
    hoverEffect: !permissionDenied
      ? props?.plainIconHoverEffect
        ? true
        : false
      : false,
    hoverEffectStyle: props?.plainIconHoverEffect
      ? {backgroundColor: $config.ICON_BG_COLOR, borderRadius: 20}
      : {},
    onPress,
    iconProps,
    btnTextProps: {
      text: showLabel && callActive && !isMobileUA() ? videoLabel : '',
      textColor: $config.FONT_COLOR,
    },
    disabled: permissionDenied || disabled ? true : false,
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
    const isAudience = rtcProps?.role == ClientRole.Audience;
    const isBroadCasting = rtcProps?.role == ClientRole.Broadcaster;

    iconButtonProps.disabled =
      permissionDenied || ($config.EVENT_MODE && isAudience && !isBroadCasting)
        ? true
        : false;
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
  if (!isOnActionSheet) {
    iconButtonProps.toolTipMessage = showToolTip
      ? permissionDenied
        ? videoButtonTooltip(I18nDeviceStatus.PERMISSION_DENIED)
        : isVideoEnabled
        ? videoButtonTooltip(I18nDeviceStatus.ON)
        : videoButtonTooltip(I18nDeviceStatus.OFF)
      : '';
    if (
      //precall mobile/mobile web UI - mute button should not show the label
      (!callActive && isMobileUA()) ||
      //sidepanel mute button should not show the label
      (callActive && !position)
    ) {
      iconButtonProps.btnTextProps.text = '';
    }
  }

  if (
    rtcProps.role == ClientRole.Audience &&
    $config.EVENT_MODE &&
    !$config.RAISE_HAND
  ) {
    return null;
  }

  if (
    rtcProps.role == ClientRole.Audience &&
    $config.EVENT_MODE &&
    $config.RAISE_HAND &&
    !isHost
  ) {
    iconButtonProps.iconProps = {
      ...iconButtonProps.iconProps,
      name: 'video-off',
      tintColor: $config.SEMANTIC_NEUTRAL,
    };
    iconButtonProps.toolTipMessage = showToolTip
      ? lstooltip(isHandRaised(local.uid))
      : '';
    iconButtonProps.disabled = true;
  }
  return props?.render ? (
    props.render(onPress, isVideoEnabled)
  ) : isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
}

export default LocalVideoMute;
