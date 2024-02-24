import React from 'react';
import {
  CustomizationApiInterface,
  customize,
  RoomInfoContextInterface,
  customEvents,
} from 'customization-api';
import {CustomizationProvider} from 'customization-implementation';
import SDKEvents, {userEventsMapInterface} from './utils/SdkEvents';
import SDKMethodEventsManager from './utils/SdkMethodEvents';
import App from './App';
import SdkApiContextProvider from './components/SdkApiContext';
import {Unsubscribe} from 'nanoevents';
import {deviceId} from './components/DeviceConfigure';

type meetingData = Partial<RoomInfoContextInterface['data']>;

export interface AppBuilderSdkApiInterface {
  customize: (customization: CustomizationApiInterface) => Promise<void>;
  joinRoom: (
    roomDetails: string | meetingData,
    userName?: string,
  ) => Promise<meetingData>;
  joinPrecall: (
    roomDetails: string | meetingData,
    userName?: string,
  ) => Promise<
    [
      meetingData,
      (userName?: string) => Promise<RoomInfoContextInterface['data']>,
    ]
  >;
  setMicrophone: (deviceId: deviceId) => Promise<void>;
  setCamera: (deviceId: deviceId) => Promise<void>;
  setSpeaker: (deviceId: deviceId) => Promise<void>;
  muteAudio: (
    mute: boolean | ((currentMute: boolean) => boolean),
  ) => Promise<void>;
  muteVideo: (
    mute: boolean | ((currentMute: boolean) => boolean),
  ) => Promise<void>;
  createCustomization: (
    customization: CustomizationApiInterface,
  ) => CustomizationApiInterface;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  customEvents: typeof customEvents;
  on: <T extends keyof userEventsMapInterface>(
    userEventName: T,
    cb: userEventsMapInterface[T],
  ) => Unsubscribe;
}

export const AppBuilderSdkApi: AppBuilderSdkApiInterface = {
  login: async (token: string) => {
    return await SDKMethodEventsManager.emit('login', token);
  },
  logout: async () => {
    return await SDKMethodEventsManager.emit('logout');
  },
  customize: async customization => {
    return await SDKMethodEventsManager.emit('customize', customization);
  },
  customEvents: customEvents,
  joinRoom: async (roomDetails, userName) => {
    return await SDKMethodEventsManager.emit(
      'join',
      roomDetails,
      true,
      userName,
    );
  },
  joinPrecall: async (roomDetails, userName) => {
    if (!$config.PRECALL)
      throw new Error('Precall disabled in config, cant join precall');
    const t = await SDKMethodEventsManager.emit(
      'join',
      roomDetails,
      false,
      userName,
    );
    return t as unknown as [
      RoomInfoContextInterface['data'],
      (userName?: string) => Promise<RoomInfoContextInterface['data']>,
    ];
  },
  setMicrophone: async deviceId => {
    return await SDKMethodEventsManager.emit('microphoneDevice', deviceId);
  },
  setSpeaker: async deviceId => {
    return await SDKMethodEventsManager.emit('speakerDevice', deviceId);
  },
  setCamera: async deviceId => {
    return await SDKMethodEventsManager.emit('cameraDevice', deviceId);
  },
  muteAudio: async state => {
    return await SDKMethodEventsManager.emit('muteAudio', state);
  },
  muteVideo: async state => {
    return await SDKMethodEventsManager.emit('muteVideo', state);
  },
  createCustomization: customize,
  on: (userEventName, cb) => {
    console.log('SDKEvents: Event Registered', userEventName);
    return SDKEvents.on(userEventName, cb);
  },
};

const SDKAppWrapper = () => {
  return (
    <SdkApiContextProvider>
      <CustomizationProvider>
        <App />
      </CustomizationProvider>
    </SdkApiContextProvider>
  );
};

export default SDKAppWrapper;
