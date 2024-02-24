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
import {usePreCall} from './usePreCall';
import {useString, useStringRef} from '../../utils/useString';
import {
  ChannelProfile,
  DispatchContext,
  PropsContext,
  useLocalUid,
} from '../../../agora-rn-uikit';
import {
  PrecallJoinBtnTextInterface,
  precallJoinBtnText,
} from '../../language/default-labels/precallScreenLabels';
import {WaitingRoomStatus, useRoomInfo} from '../room-info/useRoomInfo';
import useGetName from '../../utils/useGetName';
import {useUserPreference} from '../useUserPreference';
import {useSetRoomInfo} from '../room-info/useSetRoomInfo';
import Toast from '../../../react-native-toast-message';
import events from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import useWaitingRoomAPI from '../../subComponents/waiting-rooms/useWaitingRoomAPI';
import {useContent} from 'customization-api';
import EventsConfigure from '../EventsConfigure';
import {
  waitingRoomApprovalRejectionToastHeading,
  waitingRoomApprovalRejectionToastSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';

export interface PreCallJoinWaitingRoomBtnProps {
  render?: (
    onPress: () => void,
    title: string,
    disabled: boolean,
  ) => JSX.Element;
}

let shouldWaitingRoomPoll = null;
const JoinWaitingRoomBtn = (props: PreCallJoinWaitingRoomBtnProps) => {
  const headinglabel = useStringRef(waitingRoomApprovalRejectionToastHeading);
  const subheadinglabel = useStringRef(
    waitingRoomApprovalRejectionToastSubHeading,
  );
  let pollingTimeout = React.useRef(null);
  const {rtcProps} = useContext(PropsContext);
  const {setCallActive, callActive} = usePreCall();
  const username = useGetName();
  const {isJoinDataFetched, isInWaitingRoom} = useRoomInfo();
  const {setRoomInfo} = useSetRoomInfo();

  const waitingRoomButton =
    useString<PrecallJoinBtnTextInterface>(precallJoinBtnText);
  const {saveName} = useUserPreference();
  const [buttonText, setButtonText] = React.useState(
    waitingRoomButton({
      waitingRoom: true,
      ready: isInWaitingRoom,
    }),
  );
  const {request: requestToJoin} = useWaitingRoomAPI();
  const {dispatch} = useContext(DispatchContext);
  const localUid = useLocalUid();
  const {activeUids} = useContent();
  const activeUidsRef = React.useRef(activeUids);

  React.useEffect(() => {
    activeUidsRef.current = activeUids;
  }, [activeUids]);

  const {
    data: {token, isHost},
  } = useRoomInfo();

  useEffect(() => {
    if ($config.ENABLE_WAITING_ROOM && !isHost && token) {
      setCallActive(true);
    }
  }, [token]);

  useEffect(() => {
    setButtonText(
      waitingRoomButton({
        waitingRoom: true,
        ready: !isInWaitingRoom,
      }),
    );
  }, [isInWaitingRoom]);

  useEffect(() => {
    events.on(EventNames.WAITING_ROOM_RESPONSE, data => {
      const {approved, mainUser, screenShare, whiteboard} = JSON.parse(
        data?.payload,
      );
      // stop polling if user has responsed with yes / no
      pollingTimeout.current && clearTimeout(pollingTimeout.current);
      shouldWaitingRoomPoll = false;

      if (callActive) return;
      // on approve/reject response from host, waiting room permission is reset
      // update waitinng room status on uid
      dispatch({
        type: 'UpdateRenderList',
        value: [localUid, {isInWaitingRoom: false}],
      });

      if (approved) {
        setRoomInfo(prev => {
          return {
            ...prev,
            isInWaitingRoom: false,
            waitingRoomStatus: WaitingRoomStatus.APPROVED,
            data: {
              ...prev.data,
              token: mainUser.rtc,
              screenShareToken: screenShare.rtc,
              screenShareUid: screenShare.uid,
              whiteboard,
            },
          };
        });
      } else {
        setRoomInfo(prev => {
          return {
            ...prev,
            isInWaitingRoom: false,
            waitingRoomStatus: WaitingRoomStatus.REJECTED,
          };
        });
        // inform user that entry was denied by the host
        Toast.show({
          leadingIconName: 'info',
          text1: headinglabel?.current(),
          text2: subheadinglabel?.current(),
          visibilityTime: 3000,
          type: 'error',
          primaryBtn: null,
          secondaryBtn: null,
        });
      }
    });

    return () => {
      clearTimeout(pollingTimeout.current);
      shouldWaitingRoomPoll = false;
    };
  }, []);

  const requestServerToJoinRoom = async () => {
    // polling for every 30 seconds
    const pollFunction = async () => {
      if (shouldWaitingRoomPoll) {
        const res = await requestToJoin({send_event: true});
        pollingTimeout.current = setTimeout(() => {
          pollFunction();
        }, 15000);
      }

      if (!shouldWaitingRoomPoll) {
        // If the request is approved/rejected stop polling
        clearTimeout(pollingTimeout.current);
      }
    };

    // Call the polling function immediately
    pollFunction();
  };

  const onSubmit = () => {
    shouldWaitingRoomPoll = true;
    saveName(username?.trim());

    // Enter waiting rooom;
    setRoomInfo(prev => {
      return {...prev, isInWaitingRoom: true};
    });

    // add the waitingRoomStatus to the uid
    dispatch({
      type: 'UpdateRenderList',
      value: [localUid, {isInWaitingRoom: true}],
    });

    // join request API to server, server will send RTM message to all hosts regarding request from this user,
    requestServerToJoinRoom();
    // send a message to host for asking permission to enter the call , then set setCallActive(true) isInWaitingRoom:false
  };

  const title = buttonText;
  const onPress = () => onSubmit();
  const disabled = isInWaitingRoom || username === '';
  return props?.render ? (
    props.render(onPress, title, disabled)
  ) : (
    <PrimaryButton onPress={onPress} disabled={disabled} text={title} />
  );
};

export default JoinWaitingRoomBtn;
