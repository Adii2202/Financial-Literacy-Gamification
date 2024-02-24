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
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {ClientRole, RtcContext} from '../../agora-rn-uikit';
import DeviceContext from './DeviceContext';
import AgoraRTC, {DeviceInfo} from 'agora-rtc-sdk-ng';
import {useRtc} from 'customization-api';
import Toast from '../../react-native-toast-message';
import {Text} from 'react-native';
import StorageContext from './StorageContext';

import type RtcEngine from '../../bridge/rtc/webNg/';
import ColorContext from './ColorContext';
import {SdkApiContext} from './SdkApiContext';
import SDKEvents from '../utils/SdkEvents';
import {getOS} from '../utils/common';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../rtm-events-api/LocalEvents';
import {useString} from '../utils/useString';
import {
  deviceDetectionSecondaryBtnText,
  deviceDetectionCheckboxText,
  deviceDetectionPrimaryBtnText,
  deviceDetectionToastHeading,
  deviceDetectionToastSubHeading,
} from '../language/default-labels/videoCallScreenLabels';

const log = (...args: any[]) => {
  console.log('[DeviceConfigure] ', ...args);
};

type WebRtcEngineInstance = InstanceType<typeof RtcEngine>;

interface Props {
  userRole: ClientRole;
}
export type deviceInfo = MediaDeviceInfo;
export type deviceId = deviceInfo['deviceId'];
export type deviceKind = deviceInfo['kind'];

const DeviceConfigure: React.FC<Props> = (props: any) => {
  const rtc = useContext(RtcContext);
  const [uiSelectedCam, setUiSelectedCam] = useState('');
  const [uiSelectedMic, setUiSelectedMic] = useState('');
  const [uiSelectedSpeaker, setUiSelectedSpeaker] = useState('');
  const [deviceList, setDeviceList] = useState<deviceInfo[]>([]);

  const toastHeading = useString(deviceDetectionToastHeading);
  const toastSubHeading = useString<{name: string; label: string}>(
    deviceDetectionToastSubHeading,
  );
  const toastPrimaryBtnText = useString(deviceDetectionPrimaryBtnText)();
  const toastCancelBtnText = useString(deviceDetectionSecondaryBtnText)();
  const toastCheckboxBtnText = useString(deviceDetectionCheckboxText)();

  const micSelectInProgress = useRef(false);
  const micSelectQueue = useRef([]);

  const camSelectInProgress = useRef(false);
  const camSelectQueue = useRef([]);

  const speakerSelectInProgress = useRef(false);
  const speakerSelectQueue = useRef([]);

  const {primaryColor} = useContext(ColorContext);

  const {store, setStore} = useContext(StorageContext);
  const {rememberedDevicesList, activeDeviceId} = store;

  // const {mediaDevice: sdkMediaDevice} = useContext(SdkApiContext);
  const {
    microphoneDevice: sdkMicrophoneDevice,
    speakerDevice: sdkSpeakerDevice,
    cameraDevice: sdkCameraDevice,
    clearState,
  } = useContext(SdkApiContext);

  // const sdkMediaDevice = useMemo(() => {
  //   return {
  //     audioinput: sdkMicrophoneDevice,
  //     audiooutput: sdkSpeakerDevice,
  //     videoinput: sdkCameraDevice,
  //   };
  // }, [sdkMicrophoneDevice, sdkSpeakerDevice, sdkCameraDevice]);

  const isChrome = useMemo(() => {
    return (
      deviceList.filter(device => device.deviceId === 'default').length > 0
    );
  }, [deviceList]);

  // const rememberedDevicesList = useRef<
  //   Record<MediaDeviceInfo['kind'], savedDeviceInfo[]>
  // >({
  //   audioinput: [],
  //   videoinput: [],
  //   audiooutput: [],
  // });

  const updateActiveDeviceId = (
    kind: MediaDeviceInfo['kind'],
    deviceId: string,
  ) => {
    // const {kind, deviceId} = device;

    setStore(prevState => ({
      ...prevState,
      activeDeviceId: {
        ...activeDeviceId,
        [kind]: deviceId,
      },
    }));
  };

  const updateRememberedDeviceList = (
    device: MediaDeviceInfo,
    switchOnConnect: boolean,
  ) => {
    const {kind} = device;
    // rememberedDevicesList.current[kind].push({...device, switchOnConnect});
    // window.localStorage.setItem(
    //   'rememberedDevicesList',
    //   JSON.stringify(rememberedDevicesList.current),
    // );
    setStore(prevState => ({
      ...prevState,
      rememberedDevicesList: {
        ...prevState.rememberedDevicesList,
        [kind]: {
          [device.deviceId]: switchOnConnect
            ? 'switch-on-connect'
            : 'ignore-on-connect',
          ...prevState.rememberedDevicesList[kind],
        },
      },
    }));
  };

  const {RtcEngineUnsafe} = rtc as unknown as {
    RtcEngineUnsafe: WebRtcEngineInstance;
  };
  const {localStream} = RtcEngineUnsafe;

  const refreshDeviceList = useCallback(async (noEmitLog?: boolean) => {
    let updatedDeviceList: MediaDeviceInfo[];
    await RtcEngineUnsafe.getDevices(function (devices: deviceInfo[]) {
      !noEmitLog && log('Fetching all devices: ', devices);
      /**
       * Some browsers list the same microphone twice with different Id's,
       * their group Id's match as they are the same physical device.
       * deviceId == default is an oddity in chrome which stores the user
       * preference
       */
      /**
       *  1. Fetch devices and filter so the deviceId with empty
       *     values are exluded
       *  2. Store only unique devices with unique groupIds
       */

      updatedDeviceList = devices.filter(
        (device: deviceInfo) =>
          // device?.deviceId !== 'default' &&
          device?.deviceId !== '' &&
          (device.kind == 'audioinput' ||
            device.kind == 'videoinput' ||
            device.kind == 'audiooutput'),
      );

      !noEmitLog && log('Setting unique devices', updatedDeviceList);
      if (updatedDeviceList.length > 0) {
        setDeviceList(updatedDeviceList);
      }
    });

    return updatedDeviceList;
  }, []);

  const getAgoraTrackDeviceId = (type: 'audio' | 'video') => {
    const mutedState =
      //@ts-ignore
      type === 'audio'
        ? //@ts-ignore
          !RtcEngineUnsafe.isAudioEnabled
        : //@ts-ignore
          !RtcEngineUnsafe.isVideoEnabled;

    let currentDevice: string;

    if (mutedState) {
      currentDevice =
        //@ts-ignore
        type === 'audio'
          ? //@ts-ignore
            RtcEngineUnsafe.audioDeviceId
          : //@ts-ignore
            RtcEngineUnsafe.videoDeviceId;
      log(`Agora ${type} Engine is using`, currentDevice);
    } else {
      currentDevice = localStream[type]
        ?.getMediaStreamTrack()
        .getSettings().deviceId;
      log(`Agora ${type} Track is using`, currentDevice);
    }
    return currentDevice ?? '';
  };

  /**
   * Retrieves the devices being used by agora tracks and
   * updates the selected Ui states with them.
   * Ignores for audioOutput since state acts as ground
   * truth.
   */
  const syncSelectedDeviceUi = (kind?: deviceKind) => {
    log('Refreshing', kind ?? 'all');
    switch (kind) {
      case 'audioinput':
        let micId = getAgoraTrackDeviceId('audio');
        micId && SDKEvents.emit('devices-selected-microphone-changed', micId);
        setUiSelectedMic(micId);
        break;
      case 'videoinput':
        let camId = getAgoraTrackDeviceId('video');
        camId && SDKEvents.emit('devices-selected-camera-changed', camId);
        setUiSelectedCam(camId);
        break;
      case 'audiooutput':
        //@ts-ignore
        let speakerId = RtcEngineUnsafe.speakerDeviceId;
        speakerId &&
          SDKEvents.emit('devices-selected-speaker-changed', speakerId);
        setUiSelectedSpeaker(speakerId);
        break;
      default:
        micId = getAgoraTrackDeviceId('audio');
        camId = getAgoraTrackDeviceId('video');
        //@ts-ignore
        speakerId = RtcEngineUnsafe.speakerDeviceId;

        micId && SDKEvents.emit('devices-selected-microphone-changed', micId);
        setUiSelectedMic(micId);

        camId && SDKEvents.emit('devices-selected-camera-changed', camId);
        setUiSelectedCam(camId);

        speakerId &&
          SDKEvents.emit('devices-selected-speaker-changed', speakerId);
        setUiSelectedSpeaker(speakerId);
    }
  };

  /**
   * Sets the devices to the default device on chrome or
   * the first item on the devices list on other browsers
   * optionally takes device list to use that instead
   * of state which might be stale
   */
  const fallbackToDefaultDevice = (
    kind: deviceKind,
    uniqueDevices?: MediaDeviceInfo[],
  ) => {
    const deviceListLocal = uniqueDevices || deviceList;
    switch (kind) {
      case 'audioinput':
        const audioInputFallbackDeviceId = deviceListLocal.find(
          device =>
            device.kind === 'audioinput' &&
            (isChrome ? device.deviceId === 'default' : true),
        )?.deviceId;
        setSelectedMic(audioInputFallbackDeviceId);
        break;
      case 'videoinput':
        const videoInputFallbackDeviceId = deviceListLocal.find(
          device => device.kind === 'videoinput',
        )?.deviceId;
        setSelectedCam(videoInputFallbackDeviceId);
        break;
      case 'audiooutput':
        const audioOutputFallbackDeviceId = deviceListLocal.find(
          device =>
            device.kind === 'audiooutput' &&
            (isChrome ? device.deviceId === 'default' : true),
        )?.deviceId;

        setSelectedSpeaker(audioOutputFallbackDeviceId);
        break;
    }
  };

  const checkDeviceExists = (
    deviceId: deviceId,
    deviceList: MediaDeviceInfo[],
  ) => {
    return deviceList.find(device => device.deviceId === deviceId)
      ? true
      : false;
  };

  const applySdkDeviceChangeRequest = (kind: deviceKind) => {
    const {sdkStateName, sdkState} = {
      audioinput: {
        sdkStateName: 'microphoneDevice',
        sdkState: sdkMicrophoneDevice,
      },
      audiooutput: {sdkStateName: 'speakerDevice', sdkState: sdkSpeakerDevice},
      videoinput: {sdkStateName: 'cameraDevice', sdkState: sdkCameraDevice},
    }[kind];

    const {deviceId, promise} = sdkState;
    const queuedSetWrapper = (deviceId: deviceId) =>
      setDeviceQueued(deviceId, kind);

    const {setMethod} = {
      audiooutput: {
        setMethod: speakerSelectInProgress.current
          ? queuedSetWrapper
          : setSelectedSpeaker,
      },
      audioinput: {
        setMethod: micSelectInProgress.current
          ? queuedSetWrapper
          : setSelectedMic,
      },
      videoinput: {
        setMethod: camSelectInProgress.current
          ? queuedSetWrapper
          : setSelectedCam,
      },
    }[kind];

    setMethod(deviceId)
      .then(() => {
        promise.res();
      })
      .catch(e => {
        promise.rej(e);
      })
      .finally(() => {
        clearState(sdkStateName[kind]);
      });
  };

  useEffect(() => {
    // Notify updated state every 20s
    if (getOS() !== 'macos') {
      let count = 0;
      const interval = setInterval(() => {
        count = count + 1;
        refreshDeviceList(count % 10 !== 0);
      }, 2000);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    if (sdkMicrophoneDevice?.deviceId && uiSelectedMic) {
      applySdkDeviceChangeRequest('audioinput');
    }
  }, [sdkMicrophoneDevice]);
  useEffect(() => {
    if (sdkSpeakerDevice?.deviceId && uiSelectedSpeaker) {
      applySdkDeviceChangeRequest('audiooutput');
    }
  }, [sdkSpeakerDevice]);
  useEffect(() => {
    if (sdkCameraDevice?.deviceId && uiSelectedCam) {
      applySdkDeviceChangeRequest('videoinput');
    }
  }, [sdkCameraDevice]);

  useEffect(() => {
    // Labels are empty in firefox when permission is granted first time
    // refresh device list if labels are empty

    const logTag = 'useEffect[rtc,store]';

    if (activeDeviceId && deviceList.length > 0) {
      const initializeDevice = (kind: deviceKind) => {
        const {uiSelectedState} = {
          videoinput: {
            uiSelectedState: uiSelectedCam,
          },
          audioinput: {
            uiSelectedState: uiSelectedMic,
          },
          audiooutput: {
            uiSelectedState: uiSelectedSpeaker,
          },
        }[kind];

        // non chrome, ignore speaker
        if (!isChrome && kind === 'audiooutput') {
          setUiSelectedSpeaker('');
          return;
        }

        if (uiSelectedState && uiSelectedState.trim().length != 0) {
          return;
        }

        const defaultSpeaker = deviceList.find(
          device =>
            device.deviceId === 'default' &&
            (isChrome ? device.deviceId === 'default' : true),
        )?.deviceId;

        const storedDevice = activeDeviceId[kind];
        const {
          currentDevice,
          deviceLogTag,
          setDevice,
          setDeviceUi,
          eventEmitter,
          sdkDevice,
        } = {
          videoinput: {
            currentDevice: getAgoraTrackDeviceId('video'),
            deviceLogTag: 'cam:',
            setDevice: setSelectedCam,
            setDeviceUi: setUiSelectedCam,
            eventEmitter: (deviceId: deviceId) => {
              SDKEvents.emit('devices-selected-camera-changed', deviceId);
            },
            sdkDevice: sdkCameraDevice,
          },
          audioinput: {
            currentDevice: getAgoraTrackDeviceId('audio'),
            deviceLogTag: 'mic:',
            setDevice: setSelectedMic,
            setDeviceUi: setUiSelectedMic,
            eventEmitter: (deviceId: deviceId) => {
              SDKEvents.emit('devices-selected-microphone-changed', deviceId);
            },
            sdkDevice: sdkMicrophoneDevice,
          },
          audiooutput: {
            currentDevice: defaultSpeaker,
            deviceLogTag: 'speaker:',
            setDevice: setSelectedSpeaker,
            setDeviceUi: setUiSelectedSpeaker,
            eventEmitter: (deviceId: deviceId) => {
              SDKEvents.emit('devices-selected-speaker-changed', deviceId);
            },
            sdkDevice: sdkSpeakerDevice,
          },
        }[kind];

        log(logTag, deviceLogTag, 'Device list populated but none selected');

        if (sdkDevice?.deviceId && currentDevice) {
          if (checkDeviceExists(sdkDevice.deviceId, deviceList)) {
            applySdkDeviceChangeRequest(kind);
          } else {
            sdkDevice.promise.rej(new Error('Provided device not detected'));
          }
        } else if (
          storedDevice &&
          currentDevice &&
          currentDevice !== storedDevice &&
          checkDeviceExists(storedDevice, deviceList)
        ) {
          log(logTag, deviceLogTag, 'Setting to active id', storedDevice);
          setDevice(storedDevice).catch((e: Error) => {
            log(
              logTag,
              deviceLogTag,
              'ERROR:Setting to active id',
              storedDevice,
              e.message,
            );
          });
        } else {
          eventEmitter(currentDevice);
          setDeviceUi(currentDevice);
        }
      };

      // If stream exists and selected devices are empty, check for devices again
      initializeDevice('videoinput');
      initializeDevice('audioinput');
      initializeDevice('audiooutput');
    }

    if (
      deviceList.length === 0 ||
      deviceList.find((device: MediaDeviceInfo) => device.label === '')
    ) {
      log(logTag, 'Empty device list');
      refreshDeviceList();
    }
  }, [rtc, store, deviceList]);

  const commonOnChangedEvent = async (changedDeviceData: DeviceInfo) => {
    // Extracted devicelist because we want to perform fallback with
    // the most current version.
    const previousDeviceList = deviceList;
    const updatedDeviceList = await refreshDeviceList();
    const changedDevice = changedDeviceData.device;

    const {logTag, currentDevice, setCurrentDevice} = {
      audioinput: {
        logTag: 'mic: on-microphone-changed',
        currentDevice: uiSelectedMic,
        setCurrentDevice: setSelectedMic,
      },
      audiooutput: {
        logTag: 'speaker: on-speaker-changed',
        currentDevice: uiSelectedSpeaker,
        setCurrentDevice: setSelectedSpeaker,
      },
      videoinput: {
        logTag: 'cam: on-camera-changed',
        currentDevice: uiSelectedCam,
        setCurrentDevice: setSelectedCam,
      },
    }[changedDevice.kind];

    log(logTag, changedDeviceData);

    if (currentDevice === 'default') {
      // const previousDefaultDevice = previousDeviceList.find(
      //   (device) => device.deviceId === 'default',
      // );
      // const currentDefaultDevice = updatedDeviceList.find(
      //   (device) => device.deviceId === 'default',
      // );
      //   log(logTag, 'current Default device', {
      //     changedDeviceData,
      //     previousDeviceList,
      //     updatedDeviceList,
      //     previousDefaultDevice,
      //     currentDefaultDevice,
      //   });
      // if (previousDefaultDevice.groupId !== currentDefaultDevice.groupId) {
      //   log(logTag, 'Default device changed', {
      //     changedDeviceData,
      //     previousDeviceList,
      //     updatedDeviceList,
      //     previousDefaultDevice,
      //     currentDefaultDevice,
      //   });
      //   setCurrentDevice('default');
      // }
      setCurrentDevice('default');
    }

    const didChangeDeviceExistBefore = previousDeviceList.find(
      device => device.deviceId === changedDevice.deviceId,
    )
      ? true
      : false;

    if (changedDeviceData.state === 'ACTIVE' && !didChangeDeviceExistBefore) {
      const rememberedDevice =
        rememberedDevicesList[changedDevice.kind][changedDevice.deviceId];

      if (!rememberedDevice) {
        showNewDeviceDetectedToast(changedDevice);
      } else {
        if (rememberedDevice === 'switch-on-connect') {
          setCurrentDevice(changedDevice.deviceId);
          return;
        }
      }
    } else if (changedDeviceData.state === 'INACTIVE') {
      if (changedDevice.deviceId === currentDevice) {
        fallbackToDefaultDevice(changedDevice.kind, updatedDeviceList);
        return;
      }
    }
  };

  // Port this to useEffectEvent(https://beta.reactjs.org/reference/react/useEffectEvent) when
  // released
  useEffect(() => {
    AgoraRTC.onMicrophoneChanged = data => {
      LocalEventEmitter.emit(LocalEventsEnum.MIC_CHANGED);
      commonOnChangedEvent(data);
    };
    return () => {
      AgoraRTC.onMicrophoneChanged = null;
    };
  }, [uiSelectedMic, deviceList]);

  useEffect(() => {
    AgoraRTC.onPlaybackDeviceChanged = commonOnChangedEvent;
    return () => {
      AgoraRTC.onPlaybackDeviceChanged = null;
    };
  }, [uiSelectedSpeaker, deviceList]);

  useEffect(() => {
    AgoraRTC.onCameraChanged = commonOnChangedEvent;
    return () => {
      AgoraRTC.onCameraChanged = null;
    };
  }, [uiSelectedCam, deviceList]);

  const setDeviceQueued = async (deviceId: deviceId, kind: deviceId) => {
    const {queue} = {
      audiooutput: {
        queue: speakerSelectQueue.current,
      },
      audioinput: {
        queue: micSelectQueue.current,
      },
      videoinput: {
        queue: camSelectQueue.current,
      },
    }[kind];

    return new Promise((res, rej) => {
      queue.push({
        deviceId,
        resolveQueued: res,
        rejectQueued: rej,
      });
    });
  };

  const setDeviceCommon = (deviceId: deviceId, kind: deviceKind) => {
    const {mutexRef, queueRef, setMethod, logtag} = {
      audioinput: {
        mutexRef: micSelectInProgress,
        queueRef: micSelectQueue,
        setMethod: 'changeMic',
        logtag: 'setMic:',
      },
      audiooutput: {
        mutexRef: speakerSelectInProgress,
        queueRef: speakerSelectQueue,
        setMethod: 'changeSpeaker',
        logtag: 'setSpeaker:',
      },
      videoinput: {
        mutexRef: camSelectInProgress,
        queueRef: camSelectQueue,
        setMethod: 'changeCamera',
        logtag: 'setCam:',
      },
    }[kind];

    log(logtag, kind, 'setting to', deviceId);

    const handleQueue = () => {
      if (queueRef.current.length > 0) {
        const queueItem = queueRef.current.shift();
        setDeviceCommon(queueItem.deviceId, kind)
          .then(() => {
            queueItem.resolveQueued();
          })
          .catch(e => queueItem.rejectQueued(e));
      }
    };
    return new Promise<void>((res, rej) => {
      if (mutexRef.current) {
        const e = new Error(logtag + ' Change already in progress');
        log('DeviceConfigure:', logtag, 'Error setting', kind, e.message);
        rej(e);
        return;
      }
      mutexRef.current = true;
      RtcEngineUnsafe[setMethod](
        deviceId,
        () => {
          syncSelectedDeviceUi(kind);
          updateActiveDeviceId(kind, deviceId);
          mutexRef.current = false;
          res(null);
          handleQueue();
        },
        (e: any) => {
          mutexRef.current = false;
          console.error('DeviceConfigure:', logtag, 'Error setting', kind, e);
          rej(e);
          handleQueue();
        },
      );
    });
  };

  const setSelectedMic = (deviceId: deviceId) => {
    return setDeviceCommon(deviceId, 'audioinput');
  };

  const setSelectedCam = (deviceId: deviceId) => {
    return setDeviceCommon(deviceId, 'videoinput');
  };

  const setSelectedSpeaker = (deviceId: deviceId) => {
    return setDeviceCommon(deviceId, 'audiooutput');
  };

  const showNewDeviceDetectedToast = (device: MediaDeviceInfo) => {
    const {name, setAction} = {
      audioinput: {
        name: 'mic',
        setAction: setSelectedMic,
      },
      videoinput: {
        name: 'webcam',
        setAction: setSelectedCam,
      },
      audiooutput: {
        name: 'speaker',
        setAction: setSelectedSpeaker,
      },
    }[device.kind];

    Toast.show({
      type: 'checked',
      leadingIconName: 'mic-on',
      // leadingIcon: <CustomIcon name={'mic-on'} />,
      text1: toastHeading(name),
      text2: toastSubHeading({name, label: device?.label}),
      // @ts-ignore
      // text2: (
      //   <Text>
      //     <Text>New {name} named </Text>
      //     <Text style={{fontWeight: 'bold'}}>{device.label}</Text>
      //     <Text> detected. Do you want to switch?</Text>
      //   </Text>
      // ),
      visibilityTime: 6000,
      //@ts-ignore
      checkbox: {
        disabled: false,
        color: primaryColor,
        text: toastCheckboxBtnText,
      },
      primaryBtn: {
        text: toastPrimaryBtnText,
        onPress: (checked: boolean) => {
          setAction(device.deviceId);
          checked && updateRememberedDeviceList(device, true);
          Toast.hide();
        },
      },
      secondaryBtn: {
        text: toastCancelBtnText,
        onPress: (checked: boolean) => {
          checked && updateRememberedDeviceList(device, false);
          Toast.hide();
        },
      },
    });
  };

  return (
    <DeviceContext.Provider
      value={{
        selectedCam: uiSelectedCam,
        setSelectedCam,
        selectedMic: uiSelectedMic,
        setSelectedMic,
        selectedSpeaker: uiSelectedSpeaker,
        setSelectedSpeaker,
        deviceList,
        setDeviceList,
        isChrome,
      }}>
      {props.children}
    </DeviceContext.Provider>
  );
};

export default DeviceConfigure;
