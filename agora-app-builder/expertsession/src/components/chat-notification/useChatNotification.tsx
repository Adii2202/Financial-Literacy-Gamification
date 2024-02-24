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
import {createHook} from 'customization-implementation';
import React, {SetStateAction, useState, useEffect} from 'react';

export interface individualUnreadMessageCount {
  [key: number]: number;
}

export interface ChatNotificationInterface {
  totalUnreadCount: number;
  unreadGroupMessageCount: number;
  setUnreadGroupMessageCount: React.Dispatch<SetStateAction<number>>;
  unreadPrivateMessageCount: number;
  setUnreadPrivateMessageCount: React.Dispatch<SetStateAction<number>>;
  unreadIndividualMessageCount: individualUnreadMessageCount;
  setUnreadIndividualMessageCount: React.Dispatch<
    SetStateAction<individualUnreadMessageCount>
  >;
}

const ChatNotificationContext = React.createContext<ChatNotificationInterface>({
  totalUnreadCount: 0,
  unreadGroupMessageCount: 0,
  unreadPrivateMessageCount: 0,
  unreadIndividualMessageCount: {},
  setUnreadGroupMessageCount: () => {},
  setUnreadIndividualMessageCount: () => {},
  setUnreadPrivateMessageCount: () => {},
});

interface ChatNotificationProviderProps {
  children: React.ReactNode;
}

const ChatNotificationProvider = (props: ChatNotificationProviderProps) => {
  const [unreadGroupMessageCount, setUnreadGroupMessageCount] = useState(0);
  const [unreadPrivateMessageCount, setUnreadPrivateMessageCount] = useState(0);
  const [unreadIndividualMessageCount, setUnreadIndividualMessageCount] =
    useState<individualUnreadMessageCount>({});

  useEffect(() => {
    let privateUnreadCount = 0;
    for (const key in unreadIndividualMessageCount) {
      privateUnreadCount =
        privateUnreadCount + unreadIndividualMessageCount[key];
    }
    setUnreadPrivateMessageCount(privateUnreadCount);
  }, [unreadIndividualMessageCount]);

  return (
    <ChatNotificationContext.Provider
      value={{
        totalUnreadCount: unreadGroupMessageCount + unreadPrivateMessageCount,
        unreadGroupMessageCount,
        setUnreadGroupMessageCount,
        unreadPrivateMessageCount,
        setUnreadPrivateMessageCount,
        unreadIndividualMessageCount,
        setUnreadIndividualMessageCount,
      }}>
      {props.children}
    </ChatNotificationContext.Provider>
  );
};

const useChatNotification = createHook(ChatNotificationContext);

export {ChatNotificationProvider, useChatNotification};
