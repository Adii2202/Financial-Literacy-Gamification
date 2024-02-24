import React, {createContext, useState} from 'react';
import {useRtc} from 'customization-api';
import {createHook} from 'customization-implementation';
import {Platform} from 'react-native';

export type VideoQualityType = typeof $config.PROFILE;

interface VideoQualityContextInterface {
  videoQuality: VideoQualityType;
  setVideoQuality: (videoQuality: VideoQualityType) => void;
}

export const VideoQualityContext = createContext<VideoQualityContextInterface>({
  videoQuality: $config.PROFILE,
  setVideoQuality: (_p: VideoQualityType) => {},
});

export const VideoQualityContextProvider = props => {
  const [currentVideoQuality, setCurrentVideoQuality] =
    useState<VideoQualityType>($config.PROFILE);
  const {RtcEngineUnsafe} = useRtc();

  const setVideoQuality = async (p: VideoQualityType) => {
    if (Platform.OS === 'web' && RtcEngineUnsafe) {
      // @ts-ignore
      await RtcEngineUnsafe.setVideoProfile(p);
      setCurrentVideoQuality(p);
    }
  };

  return (
    <VideoQualityContext.Provider
      value={{videoQuality: currentVideoQuality, setVideoQuality}}>
      {props.children}
    </VideoQualityContext.Provider>
  );
};

export const useVideoQuality = createHook(VideoQualityContext);
