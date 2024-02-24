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
import {useRoomInfo} from '../components/room-info/useRoomInfo';
import {controlMessageEnum} from '../components/ChatContext';
import useIsPSTN from './useIsPSTN';
import useMutePSTN from './useMutePSTN';
import {UidType} from '../../agora-rn-uikit';
import events, {PersistanceLevel} from '../rtm-events-api';

export enum REQUEST_REMOTE_TYPE {
  audio,
  video,
}
/**
 * Returns an asynchronous function to request audio/video for a remote user with the given uid or if no uid provided, request everyone else in the meeting.
 */
function useRemoteRequest() {
  const {
    data: {isHost},
  } = useRoomInfo();
  const isPSTN = useIsPSTN();

  return async (type: REQUEST_REMOTE_TYPE, uid?: UidType) => {
    if (isHost) {
      switch (type) {
        case REQUEST_REMOTE_TYPE.audio:
          // To individual
          if (uid) {
            if (isPSTN(uid)) {
              //can't ask pstn user to unmute
            } else {
              events.send(
                controlMessageEnum.requestAudio,
                '',
                PersistanceLevel.None,
                uid,
              );
            }
          } else {
            // To everyone
            events.send(
              controlMessageEnum.requestAudio,
              '',
              PersistanceLevel.None,
            );
          }
          break;
        case REQUEST_REMOTE_TYPE.video:
          if (uid) {
            // To individual
            if (!isPSTN(uid)) {
              events.send(
                controlMessageEnum.requestVideo,
                '',
                PersistanceLevel.None,
                uid,
              );
            }
          } else {
            // To everyone
            events.send(
              controlMessageEnum.requestVideo,
              '',
              PersistanceLevel.None,
            );
          }
          break;
      }
    } else {
      console.error('A host can only request audience audio or video.');
    }
  };
}

export default useRemoteRequest;
