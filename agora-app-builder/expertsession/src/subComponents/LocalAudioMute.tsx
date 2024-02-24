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
  useLocalUid,
} from '../../agora-rn-uikit';
import useMuteToggleLocal, {MUTE_LOCAL_TYPE} from '../utils/useMuteToggleLocal';
import Styles from '../components/styles';
import {useString} from '../utils/useString';
import {useLocalUserInfo, useRoomInfo} from 'customization-api';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import ThemeConfig from '../theme';
import {ImageIconProps} from '../atoms/ImageIcon';
import useIsHandRaised from '../utils/useIsHandRaised';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {ToolbarPosition, useToolbar} from '../utils/useToolbar';
import {useActionSheet} from '../utils/useActionSheet';
import {isMobileUA} from '../utils/common';
import {
  I18nDeviceStatus,
  livestreamingMicrophoneTooltipText,
  toolbarItemMicrophoneText,
  toolbarItemMicrophoneTooltipText,
} from '../language/default-labels/videoCallScreenLabels';

/**
 * A component to mute / unmute the local audio
 */
export interface LocalAudioMuteProps {
  plainIconHoverEffect?: boolean;
  showToolTip?: boolean;
  iconProps?: (
    isAudioEnabled: boolean,
    isPermissionDenied: boolean,
  ) => Partial<ImageIconProps>;
  render?: (onPress: () => void, isAudioEnabled: boolean) => JSX.Element;
  disabled?: boolean;
  showWarningIcon?: boolean;
}

function LocalAudioMute(props: LocalAudioMuteProps) {
  const {isToolbarMenuItem} = useToolbarMenu();
  const {rtcProps} = useContext(PropsContext);
  const {
    data: {isHost},
  } = useRoomInfo();
  const {position} = useToolbar();
  const local = useLocalUserInfo();
  const isHandRaised = useIsHandRaised();
  const localMute = useMuteToggleLocal();
  const {isOnActionSheet, isOnFirstRow, showLabel} = useActionSheet();
  const {showToolTip = false, disabled = false, showWarningIcon = true} = props;

  const micButtonLabel = useString<I18nDeviceStatus>(toolbarItemMicrophoneText);
  const micButtonTooltip = useString<I18nDeviceStatus>(
    toolbarItemMicrophoneTooltipText,
  );

  const lstooltip = useString<boolean>(livestreamingMicrophoneTooltipText);

  const {
    rtcProps: {callActive},
  } = useContext(PropsContext);

  const onPress = () => {
    localMute(MUTE_LOCAL_TYPE.audio);
  };
  const isAudioEnabled = local.audio === ToggleState.enabled;

  const permissionDenied =
    local.permissionStatus === PermissionState.REJECTED ||
    local.permissionStatus === PermissionState.GRANTED_FOR_CAM_ONLY;

  const audioLabel = permissionDenied
    ? micButtonLabel(I18nDeviceStatus.PERMISSION_DENIED)
    : isAudioEnabled
    ? micButtonLabel(I18nDeviceStatus.ON)
    : micButtonLabel(I18nDeviceStatus.OFF);

  let iconProps: IconButtonProps['iconProps'] = {
    showWarningIcon: permissionDenied && showWarningIcon ? true : false,
    name: isAudioEnabled ? 'mic-on' : 'mic-off',

    iconBackgroundColor: isAudioEnabled
      ? $config.PRIMARY_ACTION_BRAND_COLOR
      : '',
    tintColor: isAudioEnabled
      ? $config.PRIMARY_ACTION_TEXT_COLOR
      : disabled
      ? $config.SEMANTIC_NEUTRAL
      : permissionDenied
      ? $config.SEMANTIC_NEUTRAL
      : $config.SEMANTIC_ERROR,
    ...(props?.iconProps
      ? props.iconProps(isAudioEnabled, permissionDenied)
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
      text: showLabel && callActive && !isMobileUA() ? audioLabel : '',
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
        ? micButtonTooltip(I18nDeviceStatus.PERMISSION_DENIED)
        : isAudioEnabled
        ? micButtonTooltip(I18nDeviceStatus.ON)
        : micButtonTooltip(I18nDeviceStatus.OFF)
      : '';
    if (
      //precall mobile/mobile web UI - mute button should not show the label
      (!callActive && isMobileUA()) ||
      //desktop web -sidepanel mute button should not show the label
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
      name: 'mic-off',
      tintColor: $config.SEMANTIC_NEUTRAL,
    };
    iconButtonProps.toolTipMessage = showToolTip
      ? lstooltip(isHandRaised(local.uid))
      : '';
    iconButtonProps.disabled = true;
  }

  return props?.render ? (
    props.render(onPress, isAudioEnabled)
  ) : isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
}

export default LocalAudioMute;
