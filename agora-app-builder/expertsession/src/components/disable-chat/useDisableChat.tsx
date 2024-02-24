import {createHook} from 'customization-implementation';
import React from 'react';

type DisableChatObj = {
  [key: string]: {
    disableChat: boolean;
  };
};

export const DisableChatContext = React.createContext<{
  disableChatUids: DisableChatObj;
  setDisableChatUids: React.Dispatch<React.SetStateAction<DisableChatObj>>;
}>({
  disableChatUids: {},
  setDisableChatUids: () => {},
});

const DisableChatProvider = ({children}) => {
  const [disableChatUids, setDisableChatUids] = React.useState<DisableChatObj>(
    {},
  );

  return (
    <DisableChatContext.Provider value={{disableChatUids, setDisableChatUids}}>
      {children}
    </DisableChatContext.Provider>
  );
};

const useDisableChat = createHook(DisableChatContext);

export {DisableChatProvider, useDisableChat};
