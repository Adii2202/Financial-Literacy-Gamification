import React, {createContext, useState, useEffect, useRef} from 'react';
import SDKMethodEventsManager, {
  _InternalSDKMethodEventsMap,
} from '../utils/SdkMethodEvents';
import {
  validateMeetingInfoData,
  RoomInfoContextInterface,
} from './room-info/useRoomInfo';
import {CustomizationApiInterface} from 'customization-api';
import {Unsubscribe} from 'nanoevents';

type extractPromises<T extends (...p: any) => any> = {
  res: Parameters<T>[0];
  rej: Parameters<T>[1];
};

// Should correspond to the same SdkMethodEvent name
type SdkApiContextInterface = {
  enterRoom: {
    set: (p: extractPromises<_InternalSDKMethodEventsMap['join']>) => void;
    promise?: extractPromises<_InternalSDKMethodEventsMap['join']>;
  };
  join:
    | {
        initialized: true;
        phrase: string;
        meetingDetails?: Partial<RoomInfoContextInterface['data']>;
        userName: string;
        skipPrecall: boolean;
        promise: extractPromises<_InternalSDKMethodEventsMap['join']>;
      }
    | {
        initialized: false;
      };
  customize: {
    customization?: CustomizationApiInterface;
    promise?: extractPromises<_InternalSDKMethodEventsMap['customize']>;
  };
  microphoneDevice: {
    deviceId?: string;
    promise?: extractPromises<_InternalSDKMethodEventsMap['microphoneDevice']>;
  };
  speakerDevice: {
    deviceId?: string;
    promise?: extractPromises<_InternalSDKMethodEventsMap['speakerDevice']>;
  };
  cameraDevice: {
    deviceId?: string;
    promise?: extractPromises<_InternalSDKMethodEventsMap['cameraDevice']>;
  };
  onMuteAudio: (callback: _InternalSDKMethodEventsMap['muteAudio']) => void;
  onMuteVideo: (callback: _InternalSDKMethodEventsMap['muteVideo']) => void;
  clearState: (
    key: keyof _InternalSDKMethodEventsMap | 'enterRoom',
    param?: any,
  ) => void;
};

const defaultMuteListener = ((_, rej) => {
  rej(
    new Error(
      "Video call not initialized, call this method on 'join' or 'ready-to-join' event listener callback",
    ),
  );
}) as _InternalSDKMethodEventsMap['muteVideo'];

const SdkApiInitState: SdkApiContextInterface = {
  enterRoom: {
    set: () => {},
  },
  join: {
    initialized: false,
  },
  customize: {},
  // mediaDevice: {},
  microphoneDevice: {},
  speakerDevice: {},
  cameraDevice: {},
  onMuteVideo: _ => {},
  onMuteAudio: _ => {},
  clearState: () => {},
};

export const SDK_MEETING_TAG = 'sdk-initiated-meeting';

export const SdkApiContext =
  createContext<SdkApiContextInterface>(SdkApiInitState);

let moduleEventsUnsub: any[] = [];

type commonEventHandlers = {
  [K in keyof Omit<
    _InternalSDKMethodEventsMap,
    'muteVideo' | 'muteAudio' | 'login' | 'logout'
  >]?: (setter: (p: SdkApiContextInterface[K]) => void) => Unsubscribe;
};

const commonEventHandlers: commonEventHandlers = {
  join: setter => {
    return SDKMethodEventsManager.on(
      'join',
      (res, rej, roomDetail, skipPrecall, userName) => {
        if (typeof roomDetail === 'object') {
          if (!validateMeetingInfoData(roomDetail)) {
            rej(new Error('Invalid meeting details'));
            return;
          }
          setter({
            initialized: true,
            phrase: SDK_MEETING_TAG,
            meetingDetails: roomDetail,
            skipPrecall,
            userName,
            promise: {res, rej},
          });
        } else if (
          typeof roomDetail === 'string' &&
          roomDetail.trim().length > 0
        ) {
          setter({
            initialized: true,
            phrase: roomDetail,
            skipPrecall,
            userName,
            promise: {res, rej},
          });
        } else {
          rej(new Error('Invalid room detail'));
        }
      },
    );
  },
  customize: setter => {
    return SDKMethodEventsManager.on('customize', (res, rej, customization) => {
      setter({
        customization: customization,
      });
      res();
    });
  },
  microphoneDevice: setter => {
    return SDKMethodEventsManager.on(
      'microphoneDevice',
      (res, rej, deviceId) => {
        setter({
          deviceId,
          promise: {res, rej},
        });
      },
    );
  },
  speakerDevice: setter => {
    return SDKMethodEventsManager.on('speakerDevice', (res, rej, deviceId) => {
      setter({
        deviceId,
        promise: {res, rej},
      });
    });
  },
  cameraDevice: setter => {
    return SDKMethodEventsManager.on('cameraDevice', (res, rej, deviceId) => {
      setter({
        deviceId,
        promise: {res, rej},
      });
    });
  },
};

const registerListener = () => {
  moduleEventsUnsub = [
    commonEventHandlers.customize(state => {
      SdkApiInitState.customize = state;
    }),
    commonEventHandlers.join(state => {
      SdkApiInitState.join = state;
    }),
    commonEventHandlers.microphoneDevice(state => {
      SdkApiInitState.microphoneDevice = state;
    }),
    commonEventHandlers.speakerDevice(state => {
      SdkApiInitState.speakerDevice = state;
    }),
    commonEventHandlers.cameraDevice(state => {
      SdkApiInitState.cameraDevice = state;
    }),
    SDKMethodEventsManager.on('muteVideo', defaultMuteListener),
    SDKMethodEventsManager.on('muteAudio', defaultMuteListener),
  ];
};

registerListener();

const deRegisterListener = () => {
  moduleEventsUnsub.forEach(v => v());
};

const SdkApiContextProvider: React.FC = props => {
  const [joinState, setJoinState] = useState(SdkApiInitState.join);
  const [enterRoom, setEnterRoom] =
    useState<extractPromises<_InternalSDKMethodEventsMap['join']>>();
  const [userCustomization, setUserCustomization] = useState(
    SdkApiInitState.customize,
  );
  const [microphoneDeviceState, setMicrophoneDeviceState] = useState(
    SdkApiInitState.microphoneDevice,
  );
  const [speakerDeviceState, setSpeakerDeviceState] = useState(
    SdkApiInitState.speakerDevice,
  );
  const [cameraDeviceState, setCameraDeviceState] = useState(
    SdkApiInitState.cameraDevice,
  );

  const muteVideoListener = useRef(defaultMuteListener);
  const muteAudioListener = useRef(defaultMuteListener);

  const setMuteVideoListener = (
    value: _InternalSDKMethodEventsMap['muteVideo'],
  ) => {
    muteVideoListener.current = value;
  };

  const setMuteAudioListener = (
    value: _InternalSDKMethodEventsMap['muteAudio'],
  ) => {
    muteAudioListener.current = value;
  };

  const clearState: SdkApiContextInterface['clearState'] = key => {
    switch (key) {
      case 'join':
        setJoinState(SdkApiInitState.join);
        break;
      case 'enterRoom':
        setEnterRoom(null);
        break;
      case 'customize':
        setUserCustomization(SdkApiInitState.customize);
        break;
      case 'microphoneDevice':
        setMicrophoneDeviceState({});
        break;
      case 'speakerDevice':
        setSpeakerDeviceState({});
        break;
      case 'cameraDevice':
        setCameraDeviceState({});
        break;
      case 'muteVideo':
        setMuteVideoListener(defaultMuteListener);
        break;
      case 'muteAudio':
        setMuteVideoListener(defaultMuteListener);
        break;
    }
  };

  useEffect(() => {
    deRegisterListener();

    const unsub = [
      commonEventHandlers.customize(state => {
        setUserCustomization(state);
      }),
      commonEventHandlers.join(state => {
        setJoinState(state);
      }),
      commonEventHandlers.microphoneDevice(state => {
        setMicrophoneDeviceState(state);
      }),
      commonEventHandlers.speakerDevice(state => {
        setSpeakerDeviceState(state);
      }),
      commonEventHandlers.cameraDevice(state => {
        setCameraDeviceState(state);
      }),
      SDKMethodEventsManager.on('muteVideo', (...args) => {
        muteVideoListener.current(...args);
      }),
      SDKMethodEventsManager.on('muteAudio', (...args) => {
        muteAudioListener.current(...args);
      }),
    ];

    return () => {
      unsub.forEach(v => v());
      registerListener();
    };
  }, []);

  return (
    <SdkApiContext.Provider
      value={{
        enterRoom: {
          set: setEnterRoom,
          promise: enterRoom,
        },
        join: joinState,
        customize: userCustomization,
        microphoneDevice: microphoneDeviceState,
        speakerDevice: speakerDeviceState,
        cameraDevice: cameraDeviceState,
        onMuteAudio: setMuteAudioListener,
        onMuteVideo: setMuteVideoListener,
        clearState,
      }}>
      {props.children}
    </SdkApiContext.Provider>
  );
};

export default SdkApiContextProvider;
