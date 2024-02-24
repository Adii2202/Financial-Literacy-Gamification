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
import React, {createContext, useContext, useEffect} from 'react';
import {createHook} from 'customization-implementation';
import {ApolloError} from '@apollo/client';
import {SdkApiContext} from '../SdkApiContext';
import {useRoomInfo} from '../room-info/useRoomInfo';
import SDKEvents from '../../utils/SdkEvents';
import DeviceContext from '../DeviceContext';
import useSetName from '../../utils/useSetName';

export interface PreCallContextInterface {
  callActive: boolean;
  setCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  error?: ApolloError;
  isCameraAvailable?: boolean;
  setCameraAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isMicAvailable?: boolean;
  setMicAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isSpeakerAvailable?: boolean;
  setSpeakerAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isPermissionRequested: boolean;
  setIsPermissionRequested: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreCallContext = createContext<PreCallContextInterface>({
  callActive: false,
  setCallActive: () => {},
  isCameraAvailable: false,
  isMicAvailable: false,
  isSpeakerAvailable: false,
  setCameraAvailable: () => {},
  setMicAvailable: () => {},
  setSpeakerAvailable: () => {},
  isPermissionRequested: false,
  setIsPermissionRequested: () => {},
});

interface PreCallProviderProps {
  value: PreCallContextInterface;
  children: React.ReactNode;
}

const PreCallProvider = (props: PreCallProviderProps) => {
  const {join, enterRoom} = useContext(SdkApiContext);
  const roomInfo = useRoomInfo();
  const {deviceList} = useContext(DeviceContext);
  const setUsername = useSetName();

  useEffect(() => {
    if (join.initialized && join.phrase) {
      if (join.userName) {
        setUsername(join.userName);
      }

      //@ts-ignore
      join?.promise?.res([
        roomInfo.data,
        (userName: string) => {
          return new Promise((res, rej) => {
            setUsername(userName);
            enterRoom.set({res, rej});
            props.value.setCallActive(true);
          });
        },
      ]);
    }

    SDKEvents.emit('ready-to-join', roomInfo.data.meetingTitle, deviceList);
  }, []);

  return (
    <PreCallContext.Provider value={{...props.value}}>
      {props.children}
    </PreCallContext.Provider>
  );
};
const usePreCall = createHook(PreCallContext);

export {PreCallProvider, usePreCall};
