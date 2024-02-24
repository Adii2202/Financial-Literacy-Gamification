import {controlMessageEnum} from '../components/ChatContext';
import {useRoomInfo} from '../components/room-info/useRoomInfo';
import useIsPSTN from './useIsPSTN';
import {UidType} from '../../agora-rn-uikit';
import events, {PersistanceLevel} from '../rtm-events-api';

/**
 * Returns a function to end the call for a remote user with the given uid.
 */
const useRemoteEndCall = () => {
  const {
    data: {isHost},
  } = useRoomInfo();
  const isPSTN = useIsPSTN();

  return (uid: UidType) => {
    if (isHost && uid) {
      if (!isPSTN(uid)) {
        events.send(
          controlMessageEnum.kickUser,
          '',
          PersistanceLevel.None,
          uid,
        );
      }
    } else {
      console.error('A host can only remove the audience from the call.');
    }
  };
};
export default useRemoteEndCall;
