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
import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PropsContext, ClientRole, ToggleState} from '../../agora-rn-uikit';
import {isValidReactComponent, isWebInternal, trimText} from '../utils/common';
import ColorContext from './ColorContext';
import {useRoomInfo} from './room-info/useRoomInfo';
import PreCallLogo from './common/Logo';
import {useCustomization} from 'customization-implementation';
import PreCallLocalMute from './precall/LocalMute';
import {
  PreCallJoinBtn,
  PreCallTextInput,
  PreCallMeetingTitle,
  PreCallSelectDevice,
  PreCallVideoPreview,
  PreCallJoinCallBtnProps,
} from './precall/index';
import SDKEvents from '../utils/SdkEvents';
import isSDKCheck from '../utils/isSDK';
import Logo from './common/Logo';
import Card from '../atoms/Card';
import Spacer from '../atoms/Spacer';
import {useLocalUserInfo, useRtc} from 'customization-api';
import {MeetingTitleProps} from './precall/meetingTitle';
import {PreCallTextInputProps} from './precall/textInput';

import StorageContext from './StorageContext';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import IDPLogoutComponent from '../auth/IDPLogoutComponent';
import JoinWaitingRoomBtn from './precall/joinWaitingRoomBtn.native';
import {DeviceSelectProps} from './precall/selectDevice';
import PreCallSettings from './precall/PreCallSettings';
import VBPanel from './virtual-background/VBPanel';
import {useVB} from './virtual-background/useVB';
import LocalSwitchCamera from '../../src/subComponents/LocalSwitchCamera';
import {useString} from '../../src/utils/useString';
import {precallYouAreJoiningAsHeading} from '../../src/language/default-labels/precallScreenLabels';
import {loadingText} from '../../src/language/default-labels/commonLabels';

const JoinRoomInputView = ({isDesktop}) => {
  const {rtcProps} = useContext(PropsContext);
  const {JoinButton, Textbox} = useCustomization(data => {
    let components: {
      JoinButton: React.ComponentType<PreCallJoinCallBtnProps>;
      Textbox: React.ComponentType<PreCallTextInputProps>;
    } = {
      Textbox: PreCallTextInput,
      JoinButton: PreCallJoinBtn,
    };
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall === 'object'
    // ) {
    //   if (
    //     data?.components?.precall?.joinButton &&
    //     typeof data?.components?.precall?.joinButton !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.joinButton)) {
    //       components.JoinButton = data?.components?.precall?.joinButton;
    //     }
    //   }

    //   if (
    //     data?.components?.precall?.textBox &&
    //     typeof data?.components?.precall?.textBox !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.textBox)) {
    //       components.Textbox = data?.components?.precall?.textBox;
    //     }
    //   }
    // }
    return components;
  });
  return (
    <View
      style={$config.EVENT_MODE ? style.lsBtnContainer : style.btnContainer}>
      <Textbox
        isDesktop={isDesktop}
        labelStyle={$config.EVENT_MODE ? style.labelStyle : {}}
      />
      {$config.EVENT_MODE ? (
        <>
          {/* <Text style={style.subTextStyle}>
            Enter the name you would like to join the room as
          </Text> */}
          {rtcProps.role == ClientRole.Audience && <Spacer size={20} />}
        </>
      ) : (
        <></>
      )}
      <View
        style={
          $config.EVENT_MODE &&
          rtcProps.role == ClientRole.Audience && {
            justifyContent: 'space-between',
            flex: 1,
          }
        }>
        <Spacer size={10} />
        <View
          style={
            $config.EVENT_MODE && isDesktop
              ? style.btnContainerStyle
              : {width: '100%'}
          }>
          {$config.ENABLE_WAITING_ROOM &&
          rtcProps.role === ClientRole.Audience ? (
            <JoinWaitingRoomBtn />
          ) : (
            <JoinButton />
          )}
        </View>
      </View>
    </View>
  );
};

const JoinRoomName = ({isDesktop, isOnPrecall}) => {
  const {JoinButton, Textbox} = useCustomization(data => {
    let components: {
      JoinButton: React.ComponentType<PreCallJoinCallBtnProps>;
      Textbox: React.ComponentType<PreCallTextInputProps>;
    } = {
      Textbox: PreCallTextInput,
      JoinButton: PreCallJoinBtn,
    };
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall === 'object'
    // ) {
    //   if (
    //     data?.components?.precall?.joinButton &&
    //     typeof data?.components?.precall?.joinButton !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.joinButton)) {
    //       components.JoinButton = data?.components?.precall?.joinButton;
    //     }
    //   }

    //   if (
    //     data?.components?.precall?.textBox &&
    //     typeof data?.components?.precall?.textBox !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.textBox)) {
    //       components.Textbox = data?.components?.precall?.textBox;
    //     }
    //   }
    // }
    return components;
  });
  return <Textbox isDesktop={isDesktop} isOnPrecall={isOnPrecall} />;
};

const JoinRoomButton = () => {
  const {rtcProps} = useContext(PropsContext);
  const {JoinButton, Textbox, WaitingRoomButton} = useCustomization(data => {
    let components: {
      WaitingRoomButton: React.ComponentType<PreCallJoinCallBtnProps>;
      JoinButton: React.ComponentType<PreCallJoinCallBtnProps>;
      Textbox: React.ComponentType<PreCallTextInputProps>;
    } = {
      Textbox: PreCallTextInput,
      JoinButton: PreCallJoinBtn,
      WaitingRoomButton: JoinWaitingRoomBtn,
    };
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall === 'object'
    // ) {
    //   if (
    //     data?.components?.precall?.joinButton &&
    //     typeof data?.components?.precall?.joinButton !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.joinButton)) {
    //       components.JoinButton = data?.components?.precall?.joinButton;
    //     }
    //   }

    //   if (
    //     data?.components?.precall?.textBox &&
    //     typeof data?.components?.precall?.textBox !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.textBox)) {
    //       components.Textbox = data?.components?.precall?.textBox;
    //     }
    //   }
    // }
    return components;
  });
  return $config.ENABLE_WAITING_ROOM &&
    rtcProps.role === ClientRole.Audience ? (
    <JoinWaitingRoomBtn />
  ) : (
    <JoinButton />
  );
};

const Precall = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const {rtcProps} = useContext(PropsContext);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(true);
  const [isVBOpen, setIsVBOpen] = React.useState(false);
  const {isVBActive, setIsVBActive} = useVB();
  const isVBAvaialble =
    $config.ENABLE_VIRTUAL_BACKGROUND && !$config.AUDIO_ROOM && isVBActive;
  const {
    VideoPreview,
    MeetingName,
    DeviceSelect,
    PrecallAfterView,
    PrecallBeforeView,
  } = useCustomization(data => {
    const components: {
      PrecallAfterView: React.ComponentType;
      PrecallBeforeView: React.ComponentType;
      DeviceSelect: React.ComponentType<DeviceSelectProps>;
      VideoPreview: React.ComponentType;
      MeetingName: React.ComponentType<MeetingTitleProps>;
    } = {
      PrecallAfterView: React.Fragment,
      PrecallBeforeView: React.Fragment,
      MeetingName: PreCallMeetingTitle,
      VideoPreview: PreCallVideoPreview,
      DeviceSelect: PreCallSelectDevice,
    };
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall === 'object'
    // ) {
    //   if (
    //     data?.components?.precall?.after &&
    //     isValidReactComponent(data?.components?.precall?.after)
    //   ) {
    //     components.PrecallAfterView = data?.components?.precall?.after;
    //   }
    //   if (
    //     data?.components?.precall?.before &&
    //     isValidReactComponent(data?.components?.precall?.before)
    //   ) {
    //     components.PrecallBeforeView = data?.components?.precall?.before;
    //   }

    //   if (
    //     data?.components?.precall?.meetingName &&
    //     typeof data?.components?.precall?.meetingName !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.meetingName)) {
    //       components.MeetingName = data?.components?.precall?.meetingName;
    //     }
    //   }

    //   if (
    //     data?.components?.precall?.deviceSelect &&
    //     typeof data?.components?.precall?.deviceSelect !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.deviceSelect)) {
    //       components.DeviceSelect = data?.components?.precall?.deviceSelect;
    //     }
    //   }

    //   if (
    //     data?.components?.precall?.preview &&
    //     typeof data?.components?.precall?.preview !== 'object'
    //   ) {
    //     if (isValidReactComponent(data?.components?.precall?.preview)) {
    //       components.VideoPreview = data?.components?.precall?.preview;
    //     }
    //   }
    // }
    return components;
  });
  const {
    isJoinDataFetched,
    data: {meetingTitle},
  } = useRoomInfo();
  const rtc = useRtc();
  const isSDK = isSDKCheck();

  const {store} = useContext(StorageContext);
  const local = useLocalUserInfo();
  const isLocalVideoON = local.video === ToggleState.enabled;

  useEffect(() => {
    if (isWebInternal() && !isSDK) {
      if (meetingTitle) {
        document.title = trimText(meetingTitle) + ' | ' + $config.APP_NAME;
      }
    }
  });

  useEffect(() => {
    if (isJoinDataFetched) {
      new Promise(res =>
        // @ts-ignore
        rtc.RtcEngineUnsafe.getDevices(function (devices: MediaDeviceInfo[]) {
          res(devices);
        }),
      ).then((devices: MediaDeviceInfo[]) => {
        //@ts-ignore
        SDKEvents.emit('preJoin', meetingTitle, devices);
      });
    }
  }, [isJoinDataFetched]);

  const FpePrecallComponent = useCustomization(data => {
    // commented for v1 release
    // if (
    //   data?.components?.precall &&
    //   typeof data?.components?.precall !== 'object'
    // ) {
    //   if (isValidReactComponent(data?.components?.precall)) {
    //     return data?.components?.precall;
    //   }
    //   return undefined;
    // }
    return undefined;
  });

  const youAreJoiningAs = useString(precallYouAreJoiningAsHeading)();
  const loading = useString(loadingText)();

  if (isVBAvaialble) {
    return <VBPanel isOnPrecall={true} />;
  }

  if (!isJoinDataFetched) return <Text style={style.titleFont}>{loading}</Text>;
  return FpePrecallComponent ? (
    <FpePrecallComponent />
  ) : (
    <>
      <PrecallBeforeView />
      <View style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={style.mainMobile}
          testID="precall-screen">
          {/* Precall screen only changes for audience in Live Stream event */}
          {$config.EVENT_MODE && rtcProps.role == ClientRole.Audience ? (
            //  Live (Audience)
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                }}>
                <MeetingName prefix={youAreJoiningAs} />
                <IDPLogoutComponent
                  containerStyle={{marginTop: 0, marginRight: 0}}
                />
              </View>

              <Spacer size={12} />
              <View
                testID="precall-mobile-join"
                style={{flex: 1, paddingBottom: 20}}>
                <JoinRoomInputView isDesktop={false} />
              </View>
            </View>
          ) : (
            // Conferncing / Live (Host)
            <View style={{flex: 1}}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <IDPLogoutComponent
                  containerStyle={{marginTop: 0, marginRight: 0}}
                />
              </View>
              <View style={{flex: 1}} testID="precall-mobile-preview">
                <View style={style.preCallContainer}>
                  <View style={style.header}>
                    <MeetingName prefix={youAreJoiningAs} />
                    {isWebInternal() ? <PreCallSettings /> : <></>}
                  </View>
                  <View style={style.content}>
                    <View style={style.preview}>
                      <View
                        style={{
                          flex: 1,
                          position: 'relative',
                          overflow: 'hidden',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}>
                        {isLocalVideoON ? (
                          <View style={style.switchCamera}>
                            <LocalSwitchCamera
                              showText={false}
                              iconBackgroundColor={$config.CARD_LAYER_5_COLOR}
                              iconSize={20}
                              iconContainerStyle={{padding: 6}}
                            />
                          </View>
                        ) : (
                          <></>
                        )}
                        <VideoPreview />
                      </View>
                      <View>
                        <PreCallLocalMute
                          isMobileView={true}
                          isSettingsOpen={isSettingsOpen}
                          setIsSettingsOpen={setIsSettingsOpen}
                          isVBOpen={isVBActive}
                          setIsVBOpen={setIsVBActive}
                        />
                      </View>
                    </View>
                    <View style={style.footer}>
                      <JoinRoomName isDesktop={false} isOnPrecall={true} />
                      <Spacer size={8} horizontal={false} />
                      <JoinRoomButton />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <PrecallAfterView />
    </>
  );
};

const style = StyleSheet.create({
  full: {flex: 1},
  switchCamera: {
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    top: 8,
    right: 8,
    opacity: 0.7,
  },
  labelStyle: {
    paddingLeft: 8,
  },
  preCallContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  preview: {
    // paddingHorizontal: 20,
    // paddingBottom: 8,
    //  paddingTop: 24,
    flex: 1,

    width: 250,
    alignSelf: 'center',
  },
  header: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    marginVertical: 20,

    flexGrow: 0,
  },
  subTextStyle: {
    marginTop: 8,
    marginLeft: 8,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: 18,
    color: $config.SEMANTIC_NEUTRAL,
    textAlign: 'left',
  },
  btnContainerStyle: {maxWidth: 337, alignSelf: 'center', marginTop: 50},
  main: {
    flexGrow: 1,
    padding: 32,
    justifyContent: 'center',
  },
  mainMobile: {
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
  },
  nav: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: '80%',
  },
  leftContent: {
    flex: 2.5,
    borderRadius: ThemeConfig.BorderRadius.large,
    overflow: 'hidden',
  },
  boxStyle: {
    borderWidth: 1,
    borderColor: $config.CARD_LAYER_3_COLOR,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: '100%',
  },
  mobileBoxStyle: {
    marginRight: 0,
    borderRadius: ThemeConfig.BorderRadius.large,
    flex: 3,
  },
  rightContent: {
    borderRadius: ThemeConfig.BorderRadius.large,
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    maxWidth: 450,
    height: '100%',
    justifyContent: 'space-between',
  },
  rightInputContent: {
    padding: 32,
  },
  titleFont: {
    textAlign: 'center',
    fontSize: 20,
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
  },
  btnContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    //alignItems: 'center',
  },
  lsBtnContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  meetingTitleContainer: {
    marginVertical: 10,
  },
});

export default Precall;
