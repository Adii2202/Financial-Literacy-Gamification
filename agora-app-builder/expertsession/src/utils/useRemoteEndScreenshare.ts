import {controlMessageEnum} from '../components/ChatContext';
import {useRoomInfo} from '../components/room-info/useRoomInfo';
import {UidType} from '../../agora-rn-uikit';
import events, {PersistanceLevel} from '../rtm-events-api';

/**
 * Returns a function to end the screenshare for a remote user with the given uid.
 */
const useRemoteEndScreenshare = () => {
  const {
    data: {isHost},
  } = useRoomInfo();
  return (uid: UidType) => {
    if (isHost && uid) {
      events.send(
        controlMessageEnum.kickScreenshare,
        '',
        PersistanceLevel.None,
        uid,
      );
    } else {
      console.error('A host can only remove the screenshare from the call.');
    }
  };
};
export default useRemoteEndScreenshare;
