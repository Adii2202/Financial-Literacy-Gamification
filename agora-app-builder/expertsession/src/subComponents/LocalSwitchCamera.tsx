import React, {useContext} from 'react';
import {Text, ViewStyle} from 'react-native';
import {useString} from '../utils/useString';
import {ClientRole, PropsContext, ToggleState} from '../../agora-rn-uikit';
import Styles from '../components/styles';
import {isAndroid, isIOS, useLocalUserInfo, useRtc} from 'customization-api';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import {useScreenshare} from './screenshare/useScreenshare';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {toolbarItemSwitchCameraText} from '../language/default-labels/videoCallScreenLabels';

export interface LocalSwitchCameraProps {
  render?: (onPress: () => void, isVideoEnabled: boolean) => JSX.Element;
  showText?: boolean;
  iconBackgroundColor?: string;
  iconSize?: number;
  iconContainerStyle?: ViewStyle;
}

function LocalSwitchCamera(props: LocalSwitchCameraProps) {
  const {isToolbarMenuItem} = useToolbarMenu();
  const {callbacks} = useContext(PropsContext);
  const {isScreenshareActive} = useScreenshare();
  const {RtcEngineUnsafe} = useRtc();
  const local = useLocalUserInfo();
  const {isOnActionSheet, showLabel} = useActionSheet();
  const {
    showText = true,
    iconBackgroundColor,
    iconSize,
    iconContainerStyle = {},
  } = props;

  const switchCameraText = useString(toolbarItemSwitchCameraText)();

  const {rtcProps} = useContext(PropsContext);
  const isLiveStream = $config.EVENT_MODE;
  const isAudience = rtcProps?.role == ClientRole.Audience;
  const isBroadCasting = rtcProps?.role == ClientRole.Broadcaster;
  const showTitle = showText ? showLabel : false;
  const onPress = () => {
    RtcEngineUnsafe.switchCamera();
    callbacks?.SwitchCamera && callbacks.SwitchCamera();
  };
  const isNativeScreenShareActive =
    (isAndroid() || isIOS()) && isScreenshareActive;
  const isVideoEnabled = isNativeScreenShareActive
    ? false
    : local.video === ToggleState.enabled;
  const disabled =
    (isLiveStream && isAudience && !isBroadCasting) || !isVideoEnabled;

  let iconButtonProps: IconButtonProps = {
    iconProps: {
      name: 'switch-camera',
      tintColor:
        isVideoEnabled || !disabled
          ? $config.SECONDARY_ACTION_COLOR
          : $config.SEMANTIC_NEUTRAL,
      ...(iconBackgroundColor && {iconBackgroundColor}),
      ...(iconSize && {iconSize}),
      iconContainerStyle: iconContainerStyle,
    },
    disabled: disabled,
    onPress: onPress,
    btnTextProps: {
      text: showTitle ? switchCameraText?.replace(' ', '\n') : '',
      numberOfLines: 2,
      textStyle: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '400',
        fontFamily: 'Source Sans Pro',
        textAlign: 'center',
        color: disabled ? $config.SEMANTIC_NEUTRAL : $config.FONT_COLOR,
      },
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
  return props?.render ? (
    props.render(onPress, isVideoEnabled)
  ) : isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
}

export default LocalSwitchCamera;
