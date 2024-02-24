import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import VideoCallMobileView from './VideoCallMobileView';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {AppRegistry, Platform} from 'react-native';

const VideoCallleScreen = () => {
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      ReactNativeForegroundService.register();
      AppRegistry.registerComponent($config.APP_NAME, () => VideoCallleScreen);
      ReactNativeForegroundService.add_task(
        () => {
          //console.log('App is active!')
        },
        {
          delay: 1000,
          onLoop: true,
          taskId: 'taskid',
          onError: e => console.log(`Error logging:`, e),
        },
      );
      ReactNativeForegroundService.start({
        id: 145,
        title: $config.APP_NAME,
        message: 'Call is active',
      });
    }
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <VideoCallMobileView native={true} />
    </GestureHandlerRootView>
  );
};

export default VideoCallleScreen;
