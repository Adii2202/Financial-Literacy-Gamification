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
import LiveStreamContext, {
  RaiseHandValue,
} from '../../../components/livestream';
import {useString} from '../../../utils/useString';
import Styles from '../../../components/styles';
import ChatContext from '../../../components/ChatContext';
import IconButton from '../../../atoms/IconButton';
import ThemeConfig from '../../../theme';
import {ClientRole, PropsContext} from '../../../../agora-rn-uikit';
import {useContent} from 'customization-api';
import {isMobileUA} from '../../../utils/common';
import {IconButtonProps} from '../../../atoms/IconButton';
import {useToolbarMenu} from '../../../utils/useMenu';
import ToolbarMenuItem from '../../../atoms/ToolbarMenuItem';
import {useActionSheet} from '../../../utils/useActionSheet';
import {toolbarItemRaiseHandText} from '../../../language/default-labels/videoCallScreenLabels';

interface LocalRaiseHandProps {}
const LocalRaiseHand = (props: LocalRaiseHandProps) => {
  const {isToolbarMenuItem} = useToolbarMenu();
  const {audienceSendsRequest, audienceRecallsRequest, raiseHandList} =
    useContext(LiveStreamContext);
  const {rtcProps} = useContext(PropsContext);
  const {localUid} = useContext(ChatContext);
  const {activeUids} = useContent();
  const {isOnActionSheet, showLabel} = useActionSheet();

  const handStatusText = useString<boolean>(toolbarItemRaiseHandText);
  const isHandRasied = raiseHandList[localUid]?.raised === RaiseHandValue.TRUE;
  const iconButtonProps: IconButtonProps = {
    iconProps: {
      name: isHandRasied ? 'lower-hand' : 'raise-hand',
      tintColor: isHandRasied
        ? $config.PRIMARY_ACTION_TEXT_COLOR
        : $config.SECONDARY_ACTION_COLOR,
      iconBackgroundColor: isHandRasied
        ? $config.PRIMARY_ACTION_BRAND_COLOR
        : '',
      base64: isMobileUA() ? true : false,
    },
    btnTextProps: {
      text: showLabel
        ? handStatusText(isHandRasied)?.replace(
            ' ',
            isOnActionSheet ? '\n' : ' ',
          )
        : '',
      textColor: $config.FONT_COLOR,
      numberOfLines: 2,
    },
    onPress: () => {
      if (isHandRasied) {
        audienceRecallsRequest();
      } else {
        audienceSendsRequest();
      }
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
  if (isOnActionSheet) {
    // iconButtonProps.containerStyle = {
    //   backgroundColor: $config.CARD_LAYER_2_COLOR,
    //   width: 52,
    //   height: 52,
    //   borderRadius: 26,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // };

    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }
  return isToolbarMenuItem ? (
    <ToolbarMenuItem {...iconButtonProps} />
  ) : (
    <IconButton {...iconButtonProps} />
  );
};

export default LocalRaiseHand;
