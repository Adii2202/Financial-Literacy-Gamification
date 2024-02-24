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

export enum MUTE_REMOTE_TYPE {
  audio,
  video,
}
/**
 * Returns an asynchronous function to toggle muted state of the given track type for a remote user with the given uid or if no uid provided, mutes everyone else in the meeting.
 */
function useRemoteMute() {
  const {
    data: {isHost},
  } = useRoomInfo();
  const isPSTN = useIsPSTN();
  const mutePSTN = useMutePSTN();

  return async (type: MUTE_REMOTE_TYPE, uid?: UidType) => {
    if (isHost) {
      switch (type) {
        case MUTE_REMOTE_TYPE.audio:
          // To individual
          if (uid) {
            if (isPSTN(uid)) {
              try {
                mutePSTN(uid);
              } catch (error) {
                console.error('An error occurred while muting the PSTN user.');
              }
            } else {
              events.send(
                controlMessageEnum.muteAudio,
                '',
                PersistanceLevel.None,
                uid,
              );
            }
          } else {
            // To everyone
            events.send(
              controlMessageEnum.muteAudio,
              '',
              PersistanceLevel.None,
            );
          }
          break;
        case MUTE_REMOTE_TYPE.video:
          if (uid) {
            // To individual
            if (!isPSTN(uid)) {
              events.send(
                controlMessageEnum.muteVideo,
                '',
                PersistanceLevel.None,
                uid,
              );
            }
          } else {
            // To everyone
            events.send(
              controlMessageEnum.muteVideo,
              '',
              PersistanceLevel.None,
            );
          }
          break;
      }
    } else {
      console.error('A host can only mute audience audio or video.');
    }
  };
}

export default useRemoteMute;
