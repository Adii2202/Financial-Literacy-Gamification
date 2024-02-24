import {UidType, PropsContext} from '../../../agora-rn-uikit';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {createHook} from 'customization-implementation';

export interface ScreenShareObjectInterface {
  [key: string | number]: {
    name: string;
    isActive: boolean;
    isExpanded?: boolean; //only used in mobile/mobile web
    ts: number;
  };
}
export interface ScreenShareContextInterface {
  screenShareData: ScreenShareObjectInterface;
  setScreenShareData: Dispatch<SetStateAction<ScreenShareObjectInterface>>;
  isScreenShareOnFullView: boolean;
  setScreenShareOnFullView: Dispatch<SetStateAction<boolean>>;
}
const ScreenShareContext = createContext<ScreenShareContextInterface>({
  screenShareData: {},
  setScreenShareData: () => {},
  isScreenShareOnFullView: false,
  setScreenShareOnFullView: () => {},
});

interface ScreenShareProviderProps {
  children: React.ReactNode;
}
const ScreenShareProvider = (props: ScreenShareProviderProps) => {
  const {rtcProps} = useContext(PropsContext);
  const [isScreenShareOnFullView, setScreenShareOnFullView] = useState(false);
  const [screenShareData, setScreenShareData] =
    useState<ScreenShareObjectInterface>({
      //@ts-ignore
      [rtcProps?.screenShareUid]: {
        name: '',
        isActive: false,
        isExpanded: false,
        ts: 0,
      },
    });

  return (
    <ScreenShareContext.Provider
      value={{
        screenShareData,
        setScreenShareData,
        isScreenShareOnFullView,
        setScreenShareOnFullView,
      }}>
      {props.children}
    </ScreenShareContext.Provider>
  );
};
const useScreenContext = createHook(ScreenShareContext);

export {useScreenContext, ScreenShareProvider};
