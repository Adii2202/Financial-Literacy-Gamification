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
import React, {SetStateAction, useState} from 'react';
import {UidType} from '../../../agora-rn-uikit';

export enum ChatType {
  Group,
  //todo confirm memberlist with vineeth
  MemberList,
  Private,
}

export interface ChatUIControlsInterface {
  chatType: ChatType;
  privateChatUser: UidType;
  inputActive?: boolean;
  setChatType: (chatType: ChatType) => void;
  setPrivateChatUser: React.Dispatch<SetStateAction<UidType>>;
  setInputActive: React.Dispatch<SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<SetStateAction<string>>;
}

const ChatUIControlsContext = React.createContext<ChatUIControlsInterface>({
  chatType: ChatType.Group,
  privateChatUser: 0,
  message: '',
  setChatType: () => {},
  setPrivateChatUser: () => {},
  setMessage: () => {},
  inputActive: false,
  setInputActive: () => {},
});

interface ChatUIControlsProviderProps {
  children: React.ReactNode;
}

const ChatUIControlsProvider = (props: ChatUIControlsProviderProps) => {
  const [chatType, setChatType] = useState<ChatType>(ChatType.Group);
  const [inputActive, setInputActive] = useState(false);
  const [privateChatUser, setPrivateChatUser] = useState<UidType>(0);
  const [message, setMessage] = useState('');
  return (
    <ChatUIControlsContext.Provider
      value={{
        chatType,
        setChatType,
        privateChatUser,
        setPrivateChatUser,
        message,
        setMessage,
        inputActive,
        setInputActive,
      }}>
      {props.children}
    </ChatUIControlsContext.Provider>
  );
};

/**
 * The ChatUIControl app state governs the chat ui.
 */
const useChatUIControls = createHook(ChatUIControlsContext);

export {ChatUIControlsProvider, useChatUIControls};
