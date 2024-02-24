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
import ThemeConfig from '../../theme';
import IconButton, {IconButtonProps} from '../../atoms/IconButton';
import Styles from '../../components/styles';
import {useString} from '../../utils/useString';
import {useScreenshare} from './useScreenshare';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import {PropsContext, ClientRole} from '../../../agora-rn-uikit';
import {useLocalUserInfo, useRoomInfo} from 'customization-api';
import useIsHandRaised from '../../utils/useIsHandRaised';
import {isAndroid, isIOS} from '../../utils/common';
import {useVideoCall} from '../../components/useVideoCall';
import {useToolbarMenu} from '../../utils/useMenu';
import ToolbarMenuItem from '../../atoms/ToolbarMenuItem';
import {
  livestreamingShareTooltipText,
  toolbarItemShareText,
} from '../../language/default-labels/videoCallScreenLabels';
/**
 * A component to start and stop screen sharing on web clients.
 * Screen sharing is not yet implemented on mobile platforms.
 * Electron has it's own screen sharing component
 */

export interface ScreenshareButtonProps {
  render?: (onPress: () => void, isScreenshareActive: boolean) => JSX.Element;
  showLabel?: boolean;
  isOnActionSheet?: boolean;
}

const ScreenshareButton = (props: ScreenshareButtonProps) => {
  const {isToolbarMenuItem} = useToolbarMenu();
  const {rtcProps} = useContext(PropsContext);
  const {showLabel = $config.ICON_TEXT || false, isOnActionSheet = false} =
    props;
  const {
    data: {isHost},
  } = useRoomInfo();
  const local = useLocalUserInfo();
  const isHandRaised = useIsHandRaised();
  const {isScreenshareActive, startUserScreenshare, stopUserScreenShare} =
    useScreenshare();
  const {setShowStartScreenSharePopup} = useVideoCall();
  const screenShareButtonLabel = useString<boolean>(toolbarItemShareText);
  const lstooltip = useString<boolean>(livestreamingShareTooltipText);
  const onPress = () => {
    if (isScreenshareActive) {
      stopUserScreenShare();
    } else {
      if (isAndroid() || isIOS()) {
        //native screen we need to stop user video before proceeding the screenshare
        //so showing confirm popup to stop camera(if cam on ) and option to share audio
        setShowStartScreenSharePopup(true);
      } else {
        startUserScreenshare();
      }
    }
  };

  let iconButtonProps: IconButtonProps = {
    iconProps: {
      name: isScreenshareActive ? 'stop-screen-share' : 'screen-share',
      tintColor: isScreenshareActive
        ? $config.SEMANTIC_ERROR
        : $config.SECONDARY_ACTION_COLOR,
    },
    onPress,
    btnTextProps: {
      text: showLabel ? screenShareButtonLabel(isScreenshareActive) : '',
      textColor: $config.FONT_COLOR,
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
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
      tintColor: $config.SEMANTIC_NEUTRAL,
    };
    iconButtonProps.toolTipMessage = lstooltip(isHandRaised(local.uid));
    iconButtonProps.disabled = true;
  }

  return props?.render ? (
    props.render(onPress, isScreenshareActive)
  ) : isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
};

export default ScreenshareButton;
