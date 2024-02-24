import {StyleSheet, Text, View} from 'react-native';
import React, {createContext, useState} from 'react';
import {UidType} from '../../../agora-rn-uikit';
import {useContent} from 'customization-api';
import {createHook} from 'customization-implementation';
import {filterObject} from '../../utils';

export interface WaitingRoomContextInterface {
  waitingRoomUids: UidType[];
  waitingRoomRef: React.MutableRefObject<{}>;
}
const WaitingRoomContext = createContext<WaitingRoomContextInterface>({
  waitingRoomUids: [],
  waitingRoomRef: {current: {}},
});

const WaitingRoomProvider = ({children}) => {
  const [waitingRoomUids, setwaitingRoomUids] = useState<UidType[]>([]);
  const waitingRoomRef = React.useRef<{}>({});

  const {defaultContent} = useContent();

  React.useEffect(() => {
    const uids = Object.keys(
      filterObject(
        defaultContent,
        ([k, v]) =>
          //@ts-ignore
          v?.type === 'rtc' && !v.offline && v?.isInWaitingRoom === true,
      ),
    ).map(Number);
    console.log('in waiting - de', uids, defaultContent);

    setwaitingRoomUids(uids);
  }, [defaultContent]);

  return (
    <WaitingRoomContext.Provider
      value={{
        waitingRoomUids: waitingRoomUids,
        waitingRoomRef,
      }}>
      {children}
    </WaitingRoomContext.Provider>
  );
};

const useWaitingRoomContext = createHook(WaitingRoomContext);

export {WaitingRoomProvider, useWaitingRoomContext};
