import {UidType} from '../../../agora-rn-uikit';
import React, {
  createContext,
  useState,
  useContext,
  useReducer,
  useEffect,
} from 'react';
import {createHook} from 'customization-implementation';
import LiveStreamContext, {
  raiseHandListInterface,
} from '../../components/livestream';
import {ClientRole, useLocalUid} from '../../../agora-rn-uikit';
import {filterObject} from '../../utils';
import {useContent} from 'customization-api';

export interface LiveStreamDataObjectInterface {
  [key: number]: {
    role: number;
    raised: boolean;
    ts: number;
  };
}
export interface LiveStreamDataContextInterface {
  hostUids: UidType[];
  audienceUids: UidType[];
  liveStreamData: raiseHandListInterface;
}
const LiveStreamDataContext = createContext<LiveStreamDataContextInterface>({
  hostUids: [],
  audienceUids: [],
  liveStreamData: {},
});

interface ScreenShareProviderProps {
  children: React.ReactNode;
}
const LiveStreamDataProvider = (props: ScreenShareProviderProps) => {
  const {defaultContent, activeUids} = useContent();
  const {raiseHandList} = useContext(LiveStreamContext);
  const [hostUids, setHostUids] = useState<UidType[]>([]);
  const [audienceUids, setAudienceUids] = useState<UidType[]>([]);

  React.useEffect(() => {
    if (Object.keys(defaultContent).length !== 0) {
      const hostList = filterObject(
        defaultContent,
        ([k, v]) =>
          (v?.type === 'rtc' || v?.type === 'live') && //||
          //(v?.type === 'screenshare' && v?.video == 1)
          (raiseHandList[k]
            ? raiseHandList[k]?.role == ClientRole.Broadcaster
            : true) &&
          !v?.offline &&
          activeUids.indexOf(v?.uid) !== -1,
      );
      const audienceList = filterObject(
        defaultContent,
        ([k, v]) =>
          (v?.type === 'rtc' || v?.type === 'live') &&
          raiseHandList[k]?.role == ClientRole.Audience &&
          !v.offline,
      );
      const hUids = Object.keys(hostList).map(uid => parseInt(uid));
      const aUids = Object.keys(audienceList).map(uid => parseInt(uid));

      setHostUids(hUids);
      setAudienceUids(aUids);
    }
  }, [defaultContent, raiseHandList]);

  return (
    <LiveStreamDataContext.Provider
      value={{
        liveStreamData: raiseHandList,
        hostUids: hostUids,
        audienceUids,
      }}>
      {props.children}
    </LiveStreamDataContext.Provider>
  );
};
const useLiveStreamDataContext = createHook(LiveStreamDataContext);

export {useLiveStreamDataContext, LiveStreamDataProvider};
