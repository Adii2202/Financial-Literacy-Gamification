declare module "src/SDKAppWrapper" {
    import { CustomizationApiInterface, MeetingInfoContextInterface, customEvents } from "customization-api/index";
    import { userEventsMapInterface } from "src/utils/SdkEvents";
    import { Unsubscribe } from 'nanoevents';
    import { deviceId } from "src/components/DeviceConfigure";
    type meetingData = Partial<MeetingInfoContextInterface['data']>;
    export interface AppBuilderSdkApiInterface {
        customize: (customization: CustomizationApiInterface) => Promise<void>;
        joinRoom: (roomDetails: string | meetingData, userName?: string) => Promise<meetingData>;
        joinPrecall: (roomDetails: string | meetingData, userName?: string) => Promise<[meetingData, (userName?: string) => Promise<MeetingInfoContextInterface['data']>]>;
        setMicrophone: (deviceId: deviceId) => Promise<void>;
        setCamera: (deviceId: deviceId) => Promise<void>;
        setSpeaker: (deviceId: deviceId) => Promise<void>;
        muteAudio: (mute: boolean | ((currentMute: boolean) => boolean)) => Promise<void>;
        muteVideo: (mute: boolean | ((currentMute: boolean) => boolean)) => Promise<void>;
        createCustomization: (customization: CustomizationApiInterface) => CustomizationApiInterface;
        login: (token: string) => Promise<void>;
        logout: () => Promise<void>;
        customEvents: typeof customEvents;
        on: <T extends keyof userEventsMapInterface>(userEventName: T, cb: userEventsMapInterface[T]) => Unsubscribe;
    }
    export const AppBuilderSdkApi: AppBuilderSdkApiInterface;
    const SDKAppWrapper: () => JSX.Element;
    export default SDKAppWrapper;
}
declare module "index.rsdk" {
    /**
     * @format
     */
    import { AppBuilderSdkApiInterface } from "src/SDKAppWrapper";
    import React from 'react';
    import * as RN from 'react-native-web';
    import './src/assets/font-styles.css';
    export * from "customization-api/index";
    export * from "customization-implementation/index";
    interface AppBuilderReactSdkInterface extends AppBuilderSdkApiInterface {
        View: React.FC;
    }
    const AppBuilderReactSdkApi: AppBuilderReactSdkInterface;
    export { React, RN };
    export default AppBuilderReactSdkApi;
}
