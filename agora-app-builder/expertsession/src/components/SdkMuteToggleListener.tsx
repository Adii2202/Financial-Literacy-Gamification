import React, {useContext, useEffect, createContext, useRef} from 'react';
import {SdkApiContext} from './SdkApiContext';
import {useLocalUserInfo, ToggleState} from 'customization-api';
import useMuteToggleLocal, {MUTE_LOCAL_TYPE} from '../utils/useMuteToggleLocal';

export const SdkMuteQueueContext = createContext({
  videoMuteQueue: {current: []},
  audioMuteQueue: {current: []},
});

const SdkMuteToggleListener = props => {
  const videoMuteQueue = useRef([]);
  const audioMuteQueue = useRef([]);

  const {
    onMuteVideo: onSdkMuteVideo,
    onMuteAudio: onSdkMuteAudio,
    clearState,
  } = useContext(SdkApiContext);
  const local = useLocalUserInfo();
  const toggleMute = useMuteToggleLocal();

  const queuedToggleMute = (type, status) => {
    const localstatus =
      local[type === MUTE_LOCAL_TYPE.video ? 'video' : 'audio'];

    // if ([ToggleState.enabling, ToggleState.disabling].includes(localstatus)) {
    // if ({[ToggleState.enabling]: true, [ToggleState.disabling]: true}[localstatus]) {
    if (
      ToggleState.enabling === localstatus ||
      ToggleState.disabling === localstatus
    ) {
      return new Promise((res, rej) => {
        if (type === MUTE_LOCAL_TYPE.video) {
          videoMuteQueue.current.push({
            resolveQueued: res,
            rejectQueued: rej,
            action: status ? ToggleState.disabled : ToggleState.enabled,
          });
        } else {
          audioMuteQueue.current.push({
            resolveQueued: res,
            rejectQueued: rej,
            action: status ? ToggleState.disabled : ToggleState.enabled,
          });
        }
      });
    } else
      return toggleMute(
        type,
        status ? ToggleState.disabled : ToggleState.enabled,
      );
  };

  useEffect(() => {
    onSdkMuteVideo(async (res, rej, mute) => {
      const status = typeof mute === 'function' ? mute(!local.video) : mute;
      try {
        await queuedToggleMute(MUTE_LOCAL_TYPE.video, status);
        res();
      } catch (e) {
        rej(e);
      }
    });
    onSdkMuteAudio(async (res, rej, mute) => {
      const status = typeof mute === 'function' ? mute(!local.audio) : mute;
      try {
        await queuedToggleMute(MUTE_LOCAL_TYPE.audio, status);
        res();
      } catch (e) {
        rej(e);
      }
    });

    return () => {
      clearState('muteVideo');
      clearState('muteAudio');
    };
  }, [local]);

  return (
    <SdkMuteQueueContext.Provider value={{videoMuteQueue, audioMuteQueue}}>
      {props.children}
    </SdkMuteQueueContext.Provider>
  );
};

export default SdkMuteToggleListener;
