import React, {useContext, useEffect, useState} from 'react';
import {isAndroid, isIOS, useContent} from 'customization-api';
import EndcallPopup from './EndcallPopup';
import {Prompt} from '../components/Router';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {Platform} from 'react-native';
import useSTTAPI from './caption/useSTTAPI';
import {useCaption} from './caption/useCaption';
import {useScreenshare} from './screenshare/useScreenshare';
import {DispatchContext, PropsContext} from '../../agora-rn-uikit';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import RTMEngine from '../rtm/RTMEngine';
import {useAuth} from '../../src/auth/AuthProvider';
import {ENABLE_AUTH} from '../../src/auth/config';
import {useString} from '../../src/utils/useString';
import {toolbarItemLeaveText} from '../../src/language/default-labels/videoCallScreenLabels';

export interface LocalEndcallProps {
  render?: (onPress: () => void) => JSX.Element;
  customExit?: () => void;
}

/* For android only, bg audio */
const stopForegroundService = () => {
  if (Platform.OS === 'android') {
    ReactNativeForegroundService.stop();
    console.log('stopping foreground service');
  }
};

const LocalEndcall = (props: LocalEndcallProps) => {
  const {isScreenshareActive, stopUserScreenShare} = useScreenshare();
  const {isToolbarMenuItem} = useToolbarMenu();
  const {dispatch} = useContext(DispatchContext);
  const {isOnActionSheet, showLabel} = useActionSheet();
  const endCallLabel = useString(toolbarItemLeaveText)();
  const {defaultContent} = useContent();
  const [endcallVisible, setEndcallVisible] = useState(false);
  const {stop} = useSTTAPI();
  const {isSTTActive} = useCaption();
  const onPress = () => {
    setEndcallVisible(true);
  };
  const [endCallState, setEndCallState] = useState(false);
  const {rtcProps} = useContext(PropsContext);
  const {authLogout, authLogin} = useAuth();

  const executeEndCall = async () => {
    setTimeout(() => {
      dispatch({
        type: 'EndCall',
        value: [],
      });
    });
    // stopping foreground servie on end call
    stopForegroundService();
    // stopping STT on call end,if only last user is remaining in call
    const usersInCall = Object.entries(defaultContent).filter(
      item => item[1].type === 'rtc',
    );
    usersInCall.length === 1 && isSTTActive && stop();
    RTMEngine.getInstance().engine.leaveChannel(rtcProps.channel);
    if (!ENABLE_AUTH) {
      // await authLogout();
      await authLogin();
    }
  };

  useEffect(() => {
    if (!isScreenshareActive && endCallState) {
      executeEndCall();
      setEndCallState(false);
    }
  }, [isScreenshareActive, endCallState]);

  const endCall = async () => {
    if (props?.customExit) {
      props.customExit();
    } else {
      if ((isAndroid() || isIOS()) && isScreenshareActive) {
        stopUserScreenShare();
        setEndCallState(true);
      } else {
        executeEndCall();
      }
    }
  };

  let iconButtonProps: IconButtonProps = {
    iconProps: {
      name: 'end-call',
      tintColor: $config.PRIMARY_ACTION_TEXT_COLOR,
      iconBackgroundColor: $config.SEMANTIC_ERROR,
      iconContainerStyle: !isOnActionSheet && {
        width: 72,
        height: $config.ICON_TEXT ? 52 : 48,
      },
    },
    onPress,
    btnTextProps: {
      text: showLabel ? endCallLabel : '',
      textColor: $config.FONT_COLOR,
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
  if (isOnActionSheet) {
    // iconButtonProps.containerStyle = {
    //   backgroundColor: 'white',
    //   width: 52,
    //   height: 52,
    //   borderRadius: 26,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // };
    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }

  return props?.render ? (
    props.render(onPress)
  ) : (
    <>
      <Prompt
        when={true}
        message={(location, action) => {
          if (action === 'POP') {
            onPress();
            return false;
          }
          return true;
        }}
      />
      <EndcallPopup
        endCall={endCall}
        setModalVisible={setEndcallVisible}
        modalVisible={endcallVisible}
      />
      {isToolbarMenuItem ? (
        <ToolbarMenuItem {...iconButtonProps} />
      ) : (
        <IconButton {...iconButtonProps} />
      )}
    </>
  );
};
export default LocalEndcall;
