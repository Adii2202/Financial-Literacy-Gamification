import {useLocalUserInfo} from 'customization-api';
import hark from 'hark';
import {useEffect, useRef, useState} from 'react';
import {useAsyncEffect} from './useAsyncEffect';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../rtm-events-api/LocalEvents';

const useIsLocalUserSpeaking = () => {
  const log: (arg1: string, ...args: any[]) => void = (arg1, ...args) => {
    console.log('[ActiveSpeaker]' + arg1, ...args);
  };
  const [isSpeaking, setIsSpeaking] = useState(false);
  const {audio} = useLocalUserInfo();
  const speechRef = useRef(null);
  const audioRef = useRef(audio);
  const audioTrackRef = useRef(null);

  useEffect(() => {
    audioRef.current = audio;
    /**
     * if user mute the mic while speaking then stoppedSpeakingCallBack won't be executed because of if (audioRef.current) condition
     * so if audio is muted then set speaking as false
     */
    if (!audio) {
      setIsSpeaking(false);
    }
  }, [audio]);

  const speakingCallBack = () => {
    if (audioRef.current) {
      setIsSpeaking(true);
    }
  };
  const stoppedSpeakingCallBack = () => {
    if (audioRef.current) {
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    LocalEventEmitter.on(LocalEventsEnum.MIC_CHANGED, () => {
      listenForSpeaker();
    });
  }, []);

  const listenForSpeaker = async () => {
    try {
      if (speechRef.current) {
        speechRef.current?.stop && speechRef.current?.stop();
      }
      if (audioTrackRef?.current) {
        audioTrackRef.current?.length &&
          audioTrackRef.current[0]?.stop &&
          audioTrackRef.current[0]?.stop();
      }
    } catch (error) {
      log(' Error on stopping the hark', error);
    }
    try {
      //detect local user speaking or not
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioTrackRef.current = audioStream.getAudioTracks();
      speechRef.current = null;
      speechRef.current = hark(audioStream, {
        interval: 100,
      });
      speechRef.current.on('speaking', speakingCallBack);
      speechRef.current.on('stopped_speaking', stoppedSpeakingCallBack);
    } catch (error) {
      log(' Error on starting the hark', error);
    }
  };

  useAsyncEffect(async () => {
    if ($config.ACTIVE_SPEAKER) {
      await listenForSpeaker();
      return () => {
        try {
          speechRef.current &&
            speechRef.current.stop &&
            speechRef.current.stop();
          audioTrackRef.current &&
            audioTrackRef.current?.length &&
            audioTrackRef.current[0]?.stop &&
            audioTrackRef.current[0]?.stop();
        } catch (error) {
          console.log('error couldnt stop the track');
        }
      };
    }
  }, []);

  return isSpeaking;
};
export default useIsLocalUserSpeaking;
