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

import {createNanoEvents} from 'nanoevents';
import {UidType} from 'agora-rn-uikit';
import {IRemoteTrack} from 'agora-rtc-sdk-ng';

export interface userEventsMapInterface {
  leave: () => void;
  create: (
    hostPhrase: string,
    attendeePhrase?: string,
    pstnNumer?: {
      number: string;
      pin: string;
    },
  ) => void;
  'ready-to-join': (meetingTitle: string, devices: MediaDeviceInfo[]) => void;
  join: (
    meetingTitle: string,
    devices: MediaDeviceInfo[],
    isHost: boolean,
  ) => void;
  'rtc-user-published': (uid: UidType, trackType: 'audio' | 'video') => void;
  'rtc-user-unpublished': (uid: UidType, trackType: 'audio' | 'video') => void;
  'rtc-user-joined': (uid: UidType) => void;
  'rtc-user-left': (uid: UidType) => void;
  '_rtm-joined': (uid: UidType) => void;
  'devices-selected-microphone-changed': (
    deviceId: MediaDeviceInfo['deviceId'],
  ) => void;
  'devices-selected-camera-changed': (
    deviceId: MediaDeviceInfo['deviceId'],
  ) => void;
  'devices-selected-speaker-changed': (
    deviceId: MediaDeviceInfo['deviceId'],
  ) => void;
  'token-not-found': () => void;
  'will-token-expire': () => void;
  'did-token-expire': () => void;
  'token-refreshed': () => void;
}

const SDKEvents = createNanoEvents<userEventsMapInterface>();

export default SDKEvents;
