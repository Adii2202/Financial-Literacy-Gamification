import {useContext} from 'react';
import {UidType} from '../../agora-rn-uikit';
import LiveStreamContext from '../components/livestream/LiveStreamContext';
import {RaiseHandValue} from '../components/livestream/Types';

const useIsHandRaised = () => {
  const {raiseHandList} = useContext(LiveStreamContext);
  const isHandRaised = (uid: UidType) => {
    return raiseHandList[uid]?.raised === RaiseHandValue.TRUE;
  };
  return isHandRaised;
};
export default useIsHandRaised;
