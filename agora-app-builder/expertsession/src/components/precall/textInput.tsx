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

import React from 'react';
import {TextStyle} from 'react-native';
import TextInput from '../../atoms/TextInput';
import {useString} from '../../utils/useString';
import {useRoomInfo} from '../room-info/useRoomInfo';
import useSetName from '../../utils/useSetName';
import useGetName from '../../utils/useGetName';
import Input from '../../atoms/Input';
import ThemeConfig from '../../theme';
import {maxInputLimit} from '../../utils/common';
import {
  precallInputGettingName,
  precallNameInputPlaceholderText,
  precallYouAreJoiningAsHeading,
} from '../../language/default-labels/precallScreenLabels';

export interface PreCallTextInputProps {
  labelStyle?: TextStyle;
  textInputStyle?: TextStyle;
  isDesktop?: boolean;
  isOnPrecall?: boolean;
}
const PreCallTextInput = (props?: PreCallTextInputProps) => {
  const placeHolder = useString(precallNameInputPlaceholderText)();
  const joiningAs = useString(precallYouAreJoiningAsHeading)();
  const fetchingNamePlaceholder = useString(precallInputGettingName)();
  const username = useGetName();
  const setUsername = useSetName();
  const {isJoinDataFetched, isInWaitingRoom} = useRoomInfo();
  const {isDesktop = false, isOnPrecall = false} = props;

  return (
    <Input
      maxLength={maxInputLimit}
      label={isOnPrecall ? '' : isDesktop ? joiningAs : ''}
      labelStyle={
        props?.labelStyle
          ? props.labelStyle
          : {
              fontFamily: ThemeConfig.FontFamily.sansPro,
              fontWeight: '400',
              fontSize: ThemeConfig.FontSize.small,
              lineHeight: ThemeConfig.FontSize.small,
              color: $config.FONT_COLOR,
            }
      }
      value={username}
      autoFocus
      onChangeText={text => setUsername(text ? text : '')}
      onSubmitEditing={() => {}}
      placeholder={isJoinDataFetched ? placeHolder : fetchingNamePlaceholder}
      editable={!isInWaitingRoom && isJoinDataFetched}
    />
  );
};

export default PreCallTextInput;
