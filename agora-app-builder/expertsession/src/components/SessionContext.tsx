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
import React, {createContext, useState} from 'react';
import {useHistory} from './Router';
// interface SessionStoreInterface {
//   channel: string | null;
//   isHost: boolean | null;
//   rtc: string | null;
//   rtm: string | null;
//   uid: number | null;
// }

interface SessionContextInterface {
  // sessionStore: SessionStoreInterface;
  // setSessionStore: React.Dispatch<React.SetStateAction<SessionStoreInterface>> | null;
  joinSession: (arg0: joinSessionInterface) => void;
  joinStore: joinSessionInterface;
  setJoinStore: React.Dispatch<
    React.SetStateAction<joinSessionInterface>
  > | null;
}

interface joinSessionInterface {
  // channel?: string | null;
  // password?: string | null;
  // joinFlag: number | null;
  phrase: string | null;
}

// const initStoreValue: SessionStoreInterface = {
//   channel: null,
//   isHost: null,
//   rtc: null,
//   rtm: null,
//   uid: null,
// };

const initJoinStoreValue = {
  channel: null,
  password: null,
  joinFlag: null,
  phrase: null,
};

const initSessionContextValue = {
  // sessionStore: initStoreValue,
  // setSessionStore: null,
  joinSession: () => {},
  joinStore: initJoinStoreValue,
  setJoinStore: null,
};

const SessionContext = createContext<SessionContextInterface>(
  initSessionContextValue,
);

export default SessionContext;

export const StorageConsumer = SessionContext.Consumer;

export const SessionProvider = (props: {children: React.ReactNode}) => {
  const history = useHistory();
  // const [sessionStore, setSessionStore] = useState<SessionStoreInterface>(initStoreValue);
  const [joinStore, setJoinStore] =
    useState<joinSessionInterface>(initJoinStoreValue);
  const joinSession = (data: joinSessionInterface) => {
    setJoinStore(data);
    history.push(`/${data.phrase}`);
  };
  return (
    <SessionContext.Provider
      value={{
        // sessionStore,
        // setSessionStore,
        joinSession,
        joinStore,
        setJoinStore,
      }}>
      {props.children}
    </SessionContext.Provider>
  );
};
