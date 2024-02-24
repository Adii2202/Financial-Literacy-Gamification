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

import React, {useContext, useEffect} from 'react';
import PrimaryButton from '../../atoms/PrimaryButton';
import {usePreCall} from '../../components/precall/usePreCall';
import {useString} from '../../utils/useString';
import {ChannelProfile, PropsContext} from '../../../agora-rn-uikit';
import {
  PrecallJoinBtnTextInterface,
  precallJoinBtnText,
} from '../../language/default-labels/precallScreenLabels';
import {useRoomInfo} from '../room-info/useRoomInfo';
import useGetName from '../../utils/useGetName';
import {useUserPreference} from '../useUserPreference';

export interface PreCallJoinCallBtnProps {
  render?: (
    onPress: () => void,
    title: string,
    disabled: boolean,
  ) => JSX.Element;
}

const JoinCallBtn = (props: PreCallJoinCallBtnProps) => {
  const {rtcProps} = useContext(PropsContext);
  const {setCallActive} = usePreCall();
  const username = useGetName();
  const {isJoinDataFetched} = useRoomInfo();
  const joinRoomButton =
    useString<PrecallJoinBtnTextInterface>(precallJoinBtnText);
  const {saveName} = useUserPreference();
  const [buttonText, setButtonText] = React.useState(
    joinRoomButton({
      waitingRoom: false,
      ready: isJoinDataFetched,
      role: $config.EVENT_MODE ? rtcProps.role : undefined,
    }),
  );
  useEffect(() => {
    if (rtcProps?.role) {
      setButtonText(
        joinRoomButton({
          waitingRoom: false,
          ready: isJoinDataFetched,
          role: $config.EVENT_MODE ? rtcProps.role : undefined,
        }),
      );
    }
  }, [rtcProps?.role]);

  const onSubmit = () => {
    saveName(username?.trim());
    setCallActive(true);
  };

  const title = buttonText;
  const onPress = () => onSubmit();
  const disabled = !isJoinDataFetched || username === '';
  return props?.render ? (
    props.render(onPress, title, disabled)
  ) : (
    <PrimaryButton onPress={onPress} disabled={disabled} text={title} />
  );
};

export default JoinCallBtn;
