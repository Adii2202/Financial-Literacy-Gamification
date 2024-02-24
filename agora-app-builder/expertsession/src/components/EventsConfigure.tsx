/*
********************************************
 Copyright © 2022 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {
  RtcContext,
  DispatchContext,
  useLocalUid,
  PropsContext,
  PermissionState,
} from '../../agora-rn-uikit';
import events, {PersistanceLevel} from '../rtm-events-api';
import {controlMessageEnum} from '../components/ChatContext';
import Toast from '../../react-native-toast-message';
import TertiaryButton from '../atoms/TertiaryButton';
import {useContent, useLocalUserInfo} from 'customization-api';
import {isAndroid, isIOS, isWebInternal} from '../utils/common';
import {useScreenshare} from '../subComponents/screenshare/useScreenshare';
import {
  RoomInfoContextInterface,
  useRoomInfo,
} from '../components/room-info/useRoomInfo';
import {useSetRoomInfo} from '../components/room-info/useSetRoomInfo';
import {EventNames} from '../rtm-events';
import {useWaitingRoomContext} from './contexts/WaitingRoomContext';
import useWaitingRoomAPI from '../../src/subComponents/waiting-rooms/useWaitingRoomAPI';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../../src/rtm-events-api/LocalEvents';
import {ENABLE_AUTH} from '../auth/config';
import {useAuth} from '../auth/AuthProvider';
import ThemeConfig from '../theme';
import {
  I18nMuteType,
  hostMutedUserToastHeading,
  hostRemovedUserToastHeading,
  hostRequestedUserToastHeading,
  hostRequestedUserToastPrimaryBtnText,
  hostRequestedUserToastSecondaryBtnText,
  waitingRoomApprovalRequiredPrimaryBtnText,
  waitingRoomApprovalRequiredSecondaryBtnText,
  waitingRoomApprovalRequiredToastHeading,
  waitingRoomApprovalRequiredToastSubHeading,
} from '../language/default-labels/videoCallScreenLabels';
import {useString} from '../utils/useString';

interface Props {
  children: React.ReactNode;
}

const EventsConfigure: React.FC<Props> = props => {
  // mute user audio
  const hostMutedUserAudioToastHeadingTT = useString<I18nMuteType>(
    hostMutedUserToastHeading,
  )(I18nMuteType.audio);

  const audioMuteToastRef = useRef(hostMutedUserAudioToastHeadingTT);
  useEffect(() => {
    audioMuteToastRef.current = hostMutedUserAudioToastHeadingTT;
  }, [hostMutedUserAudioToastHeadingTT]);

  // mute user video
  const hostMutedUserVideoToastHeadingTT = useString<I18nMuteType>(
    hostMutedUserToastHeading,
  )(I18nMuteType.video);

  const videoMuteToastRef = useRef(hostMutedUserVideoToastHeadingTT);
  useEffect(() => {
    videoMuteToastRef.current = hostMutedUserVideoToastHeadingTT;
  }, [hostMutedUserVideoToastHeadingTT]);

  //request user video
  const hostRequestedUserVideoToastHeadingTT = useString<I18nMuteType>(
    hostRequestedUserToastHeading,
  )(I18nMuteType.video);

  const videoRequestToastRef = useRef(hostRequestedUserVideoToastHeadingTT);
  useEffect(() => {
    videoRequestToastRef.current = hostRequestedUserVideoToastHeadingTT;
  }, [hostRequestedUserVideoToastHeadingTT]);

  //request user audio
  const hostRequestedUserAudioToastHeadingTT = useString<I18nMuteType>(
    hostRequestedUserToastHeading,
  )(I18nMuteType.audio);

  const audioRequestToastRef = useRef(hostRequestedUserAudioToastHeadingTT);
  useEffect(() => {
    audioRequestToastRef.current = hostRequestedUserAudioToastHeadingTT;
  }, [hostRequestedUserAudioToastHeadingTT]);

  //request user video primary btn
  const hostRequestedUserVideoToastPrimaryBtnTextTT = useString<I18nMuteType>(
    hostRequestedUserToastPrimaryBtnText,
  )(I18nMuteType.video);

  const requestUserVideoPrimaryBtnRef = useRef(
    hostRequestedUserVideoToastPrimaryBtnTextTT,
  );

  useEffect(() => {
    requestUserVideoPrimaryBtnRef.current =
      hostRequestedUserVideoToastPrimaryBtnTextTT;
  }, [hostRequestedUserVideoToastPrimaryBtnTextTT]);

  //request user audio primary btn
  const hostRequestedUserAudioToastPrimaryBtnTextTT = useString<I18nMuteType>(
    hostRequestedUserToastPrimaryBtnText,
  )(I18nMuteType.audio);

  const requestUserAudioPrimaryBtnRef = useRef(
    hostRequestedUserAudioToastPrimaryBtnTextTT,
  );

  useEffect(() => {
    requestUserAudioPrimaryBtnRef.current =
      hostRequestedUserAudioToastPrimaryBtnTextTT;
  }, [hostRequestedUserAudioToastPrimaryBtnTextTT]);

  //request user video secondary btn
  const hostRequestedUserVideoToastSecondaryBtnTextTT = useString<I18nMuteType>(
    hostRequestedUserToastSecondaryBtnText,
  )(I18nMuteType.video);

  const requestUserVideoSecondaryBtnRef = useRef(
    hostRequestedUserVideoToastSecondaryBtnTextTT,
  );
  useEffect(() => {
    requestUserVideoSecondaryBtnRef.current =
      hostRequestedUserVideoToastSecondaryBtnTextTT;
  }, [hostRequestedUserVideoToastSecondaryBtnTextTT]);

  //request user audio secondary btn
  const hostRequestedUserAudioToastSecondaryBtnTextTT = useString<I18nMuteType>(
    hostRequestedUserToastSecondaryBtnText,
  )(I18nMuteType.audio);

  const requestUserAudioSecondaryBtnRef = useRef(
    hostRequestedUserAudioToastSecondaryBtnTextTT,
  );
  useEffect(() => {
    requestUserAudioSecondaryBtnRef.current =
      hostRequestedUserAudioToastSecondaryBtnTextTT;
  }, [hostRequestedUserAudioToastSecondaryBtnTextTT]);

  //host removed
  const hostRemovedUserToastHeadingTT = useString(
    hostRemovedUserToastHeading,
  )();

  const removedUserToastRef = useRef(hostRemovedUserToastHeadingTT);

  useEffect(() => {
    removedUserToastRef.current = hostRemovedUserToastHeadingTT;
  }, [hostRemovedUserToastHeadingTT]);

  //waiting room heading
  const waitingRoomApprovalRequiredToastHeadingTT = useString(
    waitingRoomApprovalRequiredToastHeading,
  )();

  const waitingRoomAppovalHeadingRef = useRef(
    waitingRoomApprovalRequiredToastHeadingTT,
  );

  useEffect(() => {
    waitingRoomAppovalHeadingRef.current =
      waitingRoomApprovalRequiredToastHeadingTT;
  }, [waitingRoomApprovalRequiredToastHeadingTT]);

  //waiting room subheading
  const waitingRoomApprovalRequiredToastSubHeadingTT = useString(
    waitingRoomApprovalRequiredToastSubHeading,
  );

  const waitingRoomApprovalSubHeadingRef = useRef(
    waitingRoomApprovalRequiredToastSubHeadingTT,
  );

  useEffect(() => {
    waitingRoomApprovalSubHeadingRef.current =
      waitingRoomApprovalRequiredToastSubHeadingTT;
  }, [waitingRoomApprovalRequiredToastSubHeadingTT]);

  //waiting room primary btn
  const waitingRoomApprovalRequiredPrimaryBtnTextTT = useString(
    waitingRoomApprovalRequiredPrimaryBtnText,
  )();

  const waitingRoomApprovalPrimaryBtnRef = useRef(
    waitingRoomApprovalRequiredPrimaryBtnTextTT,
  );

  useEffect(() => {
    waitingRoomApprovalPrimaryBtnRef.current =
      waitingRoomApprovalRequiredPrimaryBtnTextTT;
  }, [waitingRoomApprovalRequiredPrimaryBtnTextTT]);

  //waiting room secondary btn
  const waitingRoomApprovalRequiredSecondaryBtnTextTT = useString(
    waitingRoomApprovalRequiredSecondaryBtnText,
  )();

  const waitingRoomApprovalSecondaryBtnRef = useRef(
    waitingRoomApprovalRequiredSecondaryBtnTextTT,
  );

  useEffect(() => {
    waitingRoomApprovalSecondaryBtnRef.current =
      waitingRoomApprovalRequiredSecondaryBtnTextTT;
  }, [waitingRoomApprovalRequiredSecondaryBtnTextTT]);

  //@ts-ignore
  const {isScreenshareActive, ScreenshareStoppedCallback, stopUserScreenShare} =
    useScreenshare();
  const isLiveStream = $config.EVENT_MODE;
  const {dispatch} = useContext(DispatchContext);
  const {RtcEngineUnsafe} = useContext(RtcContext);
  const {defaultContent, activeUids} = useContent();
  const defaultContentRef = useRef({defaultContent});
  const isScreenshareActiveRef = useRef({isScreenshareActive});
  useEffect(() => {
    isScreenshareActiveRef.current.isScreenshareActive = isScreenshareActive;
  }, [isScreenshareActive]);
  useEffect(() => {
    defaultContentRef.current.defaultContent = defaultContent;
  }, [defaultContent]);
  const {
    data: {isHost},
  } = useRoomInfo();
  const {setRoomInfo} = useSetRoomInfo();
  const isHostRef = React.useRef(isHost);
  const {permissionStatus} = useLocalUserInfo();
  const permissionStatusRef = React.useRef(permissionStatus);
  const {waitingRoomUids, waitingRoomRef} = useWaitingRoomContext();
  const waitingRoomUidsRef = React.useRef(waitingRoomUids);
  const {approval} = useWaitingRoomAPI();
  const localUid = useLocalUid();
  const activeUidsRef = React.useRef(activeUids);
  const {authLogin} = useAuth();
  React.useEffect(() => {
    activeUidsRef.current = activeUids;
  }, [activeUids]);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    permissionStatusRef.current = permissionStatus;
  }, [permissionStatus]);

  useEffect(() => {
    //user joined event listener
    // events.on(controlMessageEnum.newUserJoined, ({payload}) => {
    //   const data = JSON.parse(payload);
    //   if (data?.name) {
    //     Toast.show({
    //       text1: `${trimText(data.name)} has joined the call`,
    //       visibilityTime: 3000,
    //       type: 'info',
    //       primaryBtn: null,
    //       secondaryBtn: null,
    //     });
    //   }
    // });
    events.on(controlMessageEnum.muteVideo, async ({payload, sender}) => {
      Toast.show({
        leadingIconName: 'video-off',
        type: 'info',
        // text1: `${
        //   defaultContentRef.current.defaultContent[sender].name || 'The host'
        // } muted you.`,
        text1: videoMuteToastRef.current,
        visibilityTime: 3000,
        primaryBtn: null,
        secondaryBtn: null,
        leadingIcon: null,
      });
      if (
        (isAndroid() || isIOS()) &&
        isScreenshareActiveRef.current.isScreenshareActive
      ) {
        //@ts-ignore
        stopUserScreenShare(false, true);
      } else {
        isWebInternal()
          ? await RtcEngineUnsafe.muteLocalVideoStream(true)
          : //@ts-ignore
            await RtcEngineUnsafe.enableLocalVideo(false);
        await updateVideoStream(true);
        dispatch({
          type: 'LocalMuteVideo',
          value: [0],
        });
      }
    });
    events.on(controlMessageEnum.muteAudio, ({sender}) => {
      Toast.show({
        leadingIconName: 'mic-off',
        type: 'info',
        // text1: `${
        //   defaultContentRef.current.defaultContent[sender].name || 'The host'
        // } muted you.`,
        text1: audioMuteToastRef.current,
        visibilityTime: 3000,
        primaryBtn: null,
        secondaryBtn: null,
        leadingIcon: null,
      });
      RtcEngineUnsafe.muteLocalAudioStream(true);
      dispatch({
        type: 'LocalMuteAudio',
        value: [0],
      });
    });
    events.on(controlMessageEnum.kickUser, async () => {
      //before kickoff the user we have check whether screenshare on/off
      //if its on then stop screenshare and emit event for screensharing is stopped
      try {
        if (isScreenshareActiveRef?.current?.isScreenshareActive) {
          ScreenshareStoppedCallback && ScreenshareStoppedCallback();
        }
      } catch (error) {
        console.log('error on stop the screeshare', error);
      }

      if (!ENABLE_AUTH) {
        // await authLogout();
        await authLogin();
      }
      Toast.show({
        leadingIconName: 'info',
        type: 'info',
        text1: removedUserToastRef.current,
        visibilityTime: 5000,
        primaryBtn: null,
        secondaryBtn: null,
      });
      setTimeout(() => {
        dispatch({
          type: 'EndCall',
          value: [],
        });
      }, 5000);
    });
    events.on(controlMessageEnum.requestAudio, () => {
      Toast.show({
        leadingIconName: 'mic-on',
        type: 'info',
        text1: audioRequestToastRef.current,
        visibilityTime: 3000,
        leadingIcon: null,
        primaryBtn:
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_CAM_AND_MIC ||
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_MIC_ONLY ? (
            <PrimaryButton
              containerStyle={style.primaryBtn}
              textStyle={style.textStyle}
              text={requestUserAudioPrimaryBtnRef.current}
              onPress={() => {
                RtcEngineUnsafe.muteLocalAudioStream(false);
                dispatch({
                  type: 'LocalMuteAudio',
                  value: [1],
                });
                Toast.hide();
              }}
            />
          ) : null,
        secondaryBtn:
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_CAM_AND_MIC ||
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_MIC_ONLY ? (
            <SecondaryBtn text={requestUserAudioSecondaryBtnRef.current} />
          ) : null,
      });
    });
    events.on(controlMessageEnum.requestVideo, () => {
      Toast.show({
        leadingIconName: 'video-on',
        type: 'info',
        text1: videoRequestToastRef.current,
        visibilityTime: 3000,
        leadingIcon: null,
        primaryBtn:
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_CAM_AND_MIC ||
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_CAM_ONLY ? (
            <PrimaryButton
              containerStyle={style.primaryBtn}
              textStyle={style.textStyle}
              text={requestUserVideoPrimaryBtnRef.current}
              onPress={async () => {
                isWebInternal()
                  ? await RtcEngineUnsafe.muteLocalVideoStream(false)
                  : //@ts-ignore
                    await RtcEngineUnsafe.enableLocalVideo(true);
                await updateVideoStream(false);
                dispatch({
                  type: 'LocalMuteVideo',
                  value: [1],
                });
                Toast.hide();
              }}
            />
          ) : null,
        secondaryBtn:
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_CAM_AND_MIC ||
          permissionStatusRef.current ===
            PermissionState.GRANTED_FOR_CAM_ONLY ? (
            <SecondaryBtn text={requestUserVideoSecondaryBtnRef.current} />
          ) : null,
      });
    });

    events.on(EventNames.WHITEBOARD_ACTIVE, ({payload}) => {
      const data = JSON.parse(payload);
      if (data && data?.status) {
        if ($config.ENABLE_WAITING_ROOM && !isHostRef.current) {
          setRoomInfo(prev => {
            return {
              ...prev,
              isWhiteBoardOn: true,
            };
          });
        } else {
          LocalEventEmitter.emit(LocalEventsEnum.WHITEBOARD_ACTIVE_LOCAL, {
            status: data?.status,
          });
        }
      } else {
        if ($config.ENABLE_WAITING_ROOM && !isHostRef.current) {
          setRoomInfo(prev => {
            return {
              ...prev,
              isWhiteBoardOn: false,
            };
          });
        } else {
          LocalEventEmitter.emit(LocalEventsEnum.WHITEBOARD_ACTIVE_LOCAL, {
            status: data?.status,
          });
        }
      }
    });

    events.on(EventNames.BOARD_COLOR_CHANGED, ({payload}) => {
      const data = JSON.parse(payload);
      if (data?.boardColor) {
        if ($config.ENABLE_WAITING_ROOM && !isHostRef.current) {
          setRoomInfo(prev => {
            return {
              ...prev,
              boardColor: data?.boardColor,
            };
          });
        } else {
          LocalEventEmitter.emit(LocalEventsEnum.BOARD_COLOR_CHANGED_LOCAL, {
            boardColor: data?.boardColor,
          });
        }
      }
    });

    events.on(EventNames.WHITEBOARD_LAST_IMAGE_UPLOAD_POSITION, ({payload}) => {
      const data = JSON.parse(payload);
      if ($config.ENABLE_WAITING_ROOM && !isHostRef.current) {
        setRoomInfo(prev => {
          return {
            ...prev,
            whiteboardLastImageUploadPosition: {height: data?.height || 0},
          };
        });
      } else {
        LocalEventEmitter.emit(
          LocalEventsEnum.WHITEBOARD_LAST_IMAGE_UPLOAD_POSITION_LOCAL,
          {
            height: data?.height || 0,
          },
        );
      }
    });

    events.on(EventNames.STT_ACTIVE, data => {
      const payload = JSON.parse(data?.payload);
      setRoomInfo(prev => {
        return {
          ...prev,
          isSTTActive: payload.active,
        };
      });
    });

    events.on(EventNames.STT_LANGUAGE, data => {
      const {
        username,
        prevLang,
        newLang,
        uid,
      }: RoomInfoContextInterface['sttLanguage'] = JSON.parse(data?.payload);
      // set this on roominfo then use it in Controls
      const sttLangObj = {
        username,
        prevLang,
        newLang,
        uid,
        langChanged: true,
      };
      setRoomInfo(prev => {
        return {
          ...prev,
          sttLanguage: sttLangObj,
        };
      });
    });

    events.on(EventNames.WAITING_ROOM_STATUS_UPDATE, data => {
      if (!isHostRef.current) return;
      const {attendee_uid, approved} = JSON.parse(data?.payload);
      // update waiting room status in other host's panel
      dispatch({
        type: 'UpdateRenderList',
        value: [attendee_uid, {isInWaitingRoom: false}],
      });

      waitingRoomRef.current[attendee_uid] = approved ? 'APPROVED' : 'REJECTED';
      // hide toast in other host's screen
      if (Toast.getToastId() === attendee_uid) {
        Toast.hide();
      }
    });

    events.on(EventNames.WAITING_ROOM_REQUEST, data => {
      if (!isHostRef.current) return;

      console.log(
        'waitingRoomRef on WAITING_ROOM_REQUEST',
        waitingRoomRef.current,
      );

      const {attendee_uid, attendee_screenshare_uid} = JSON.parse(
        data?.payload,
      );
      if (attendee_uid == '') return;

      //condition1 -if user request already approved(in the call)
      if (activeUidsRef.current.indexOf(attendee_uid) !== -1) {
        console.log('debugging in active uids');
        return;
      }
      //condition2 -if user request already pending(in the waiting room)
      if (waitingRoomUidsRef.current.indexOf(attendee_uid) !== -1) {
        console.log('debugging in waitingRoomUidsRef');
        return;
      }
      if (
        waitingRoomRef.current[attendee_uid] &&
        (waitingRoomRef.current[attendee_uid] === 'PENDING' ||
          waitingRoomRef.current[attendee_uid] === 'APPROVED')
      ) {
        return;
      }

      const userName =
        //@ts-ignore
        defaultContentRef.current.defaultContent[attendee_uid]?.name ||
        'Attendee';
      // put the attendee in waitingroom in renderlist
      dispatch({
        type: 'UpdateRenderList',
        value: [attendee_uid, {isInWaitingRoom: true}],
      });

      waitingRoomRef.current[attendee_uid] = 'PENDING';
      // check if any other host has approved then dont show permission to join the room

      let btns: any = {};
      btns.toastId = attendee_uid;
      btns.primaryBtn = (
        <PrimaryButton
          containerStyle={style.primaryBtn}
          textStyle={style.textStyle}
          text={waitingRoomApprovalPrimaryBtnRef.current}
          onPress={() => {
            // user approving waiting room request
            const res = approval({
              host_uid: localUid,
              attendee_uid: attendee_uid,
              attendee_screenshare_uid: attendee_screenshare_uid,
              approved: true,
            });
            dispatch({
              type: 'UpdateRenderList',
              value: [attendee_uid, {isInWaitingRoom: false}],
            });

            waitingRoomRef.current[attendee_uid] = 'APPROVED';

            console.log('waitingRoomRef on APPROVAL', waitingRoomRef.current);
            // inform other that hosts as well
            events.send(
              EventNames.WAITING_ROOM_STATUS_UPDATE,
              JSON.stringify({attendee_uid, approved: true}),
              PersistanceLevel.None,
            );
            // server will send the RTM message with approved status and RTC token to the approved attendee.
            Toast.hide();
          }}
        />
      );
      btns.secondaryBtn = (
        <TertiaryButton
          containerStyle={style.secondaryBtn}
          textStyle={style.textStyle}
          text={waitingRoomApprovalSecondaryBtnRef.current}
          onPress={() => {
            // user rejecting waiting room request
            const res = approval({
              host_uid: localUid,
              attendee_uid: attendee_uid,
              attendee_screenshare_uid: attendee_screenshare_uid,
              approved: false,
            });
            dispatch({
              type: 'UpdateRenderList',
              value: [attendee_uid, {isInWaitingRoom: false}],
            });

            waitingRoomRef.current[attendee_uid] = 'REJECTED';

            console.log('waitingRoomRef on REJECTION', waitingRoomRef.current);
            // inform other that hosts as well
            events.send(
              'WAITING_ROOM_STATUS_UPDATE',
              JSON.stringify({attendee_uid, approved: false}),
              PersistanceLevel.None,
            );
            console.log('waiting-room:reject', res);
            // server will send the RTM message with rejected status and RTC token to the approved attendee.
            Toast.hide();
          }}
        />
      );

      Toast.show({
        leadingIconName: 'info',
        leadingIcon: null,
        type: 'info',
        text1: waitingRoomAppovalHeadingRef.current,
        text2: waitingRoomApprovalSubHeadingRef.current(userName),
        visibilityTime: 30000,
        ...btns,
      });
    });

    // events.on(EventNames.WAITING_ROOM_STATUS_UPDATE, data => {
    //   if (!isHost) return;
    //   const {attendee_uid} = JSON.parse(data?.payload);
    //   // update waiting room status in other host's panel
    //   dispatch({
    //     type: 'UpdateRenderList',
    //     value: [attendee_uid, {isInWaitingRoom: false}],
    //   });
    //   // hide toast in other host's screen
    //   if (Toast.getToastId() === attendee_uid) {
    //     Toast.hide();
    //   }
    // });

    // events.on(EventNames.WAITING_ROOM_REQUEST, data => {
    //   if (!isHost) return;

    //   const {attendee_uid, attendee_screenshare_uid} = JSON.parse(
    //     data?.payload,
    //   );
    //   const userName =
    //     defaultContentRef.current.defaultContent[attendee_uid]?.name || 'OO';
    //   // put the attendee in waitingroom in renderlist
    //   dispatch({
    //     type: 'UpdateRenderList',
    //     value: [attendee_uid, {isInWaitingRoom: true}],
    //   });
    //   // check if any other host has approved then dont show permission to join the room
    //   let btns: any = {};
    //   btns.toastId = attendee_uid;
    //   btns.primaryBtn = (
    //     <PrimaryButton
    //       containerStyle={style.primaryBtn}
    //       textStyle={style.primaryBtnText}
    //       text="Admit"
    //       onPress={() => {
    //         // user approving waiting room request
    //         const res = approval({
    //           host_uid: localUid,
    //           attendee_uid: attendee_uid,
    //           attendee_screenshare_uid: attendee_screenshare_uid,
    //           approved: true,
    //         });
    //         dispatch({
    //           type: 'UpdateRenderList',
    //           value: [attendee_uid, {isInWaitingRoom: false}],
    //         });
    //         // inform other that hosts as well
    //         events.send(
    //           EventNames.WAITING_ROOM_STATUS_UPDATE,
    //           JSON.stringify({attendee_uid, approved: true}),
    //           PersistanceLevel.None,
    //         );
    //         // server will send the RTM message with approved status and RTC token to the approved attendee.
    //         Toast.hide();
    //       }}
    //     />
    //   );
    //   btns.secondaryBtn = (
    //     <TertiaryButton
    //       containerStyle={style.secondaryBtn}
    //       textStyle={style.primaryBtnText}
    //       text="Deny"
    //       onPress={() => {
    //         // user rejecting waiting room request
    //         const res = approval({
    //           host_uid: localUid,
    //           attendee_uid: attendee_uid,
    //           attendee_screenshare_uid: attendee_screenshare_uid,
    //           approved: false,
    //         });
    //         dispatch({
    //           type: 'UpdateRenderList',
    //           value: [attendee_uid, {isInWaitingRoom: false}],
    //         });
    //         // inform other that hosts as well
    //         events.send(
    //           'WAITING_ROOM_STATUS_UPDATE',
    //           JSON.stringify({attendee_uid, approved: false}),
    //           PersistanceLevel.None,
    //         );
    //         // server will send the RTM message with rejected status and RTC token to the approved attendee.
    //         Toast.hide();
    //       }}
    //     />
    //   );

    //   callActive &&
    //     Toast.show({
    //       type: 'info',
    //       text1: 'Approval Required',
    //       text2: `${userName} is waiting for approval to join the call`,
    //       visibilityTime: 30000,
    //       ...btns,
    //     });
    // });

    const updateVideoStream = async (enabled: boolean) => {
      if ((isAndroid() || isIOS()) && isLiveStream) {
        await RtcEngineUnsafe.muteLocalVideoStream(enabled);
      }
    };

    return () => {
      //events.off(controlMessageEnum.newUserJoined);
      events.off(controlMessageEnum.requestAudio);
      events.off(controlMessageEnum.requestVideo);
      events.off(controlMessageEnum.muteVideo);
      events.off(controlMessageEnum.muteAudio);
      events.off(controlMessageEnum.kickUser);
      events.off(EventNames.WAITING_ROOM_REQUEST);
      events.off(EventNames.WAITING_ROOM_STATUS_UPDATE);
      events.off(EventNames.WHITEBOARD_ACTIVE);
      events.off(EventNames.WHITEBOARD_LAST_IMAGE_UPLOAD_POSITION);
      events.off(EventNames.BOARD_COLOR_CHANGED);
      events.off(EventNames.STT_ACTIVE);
      events.off(EventNames.STT_LANGUAGE);
    };
  }, []);

  return <>{props.children}</>;
};

export default EventsConfigure;

const style = StyleSheet.create({
  secondaryBtn: {marginLeft: 12, paddingVertical: 6, paddingHorizontal: 10},
  primaryBtn: {
    borderRadius: 4,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  textStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 14,
    color: $config.FONT_COLOR,
  },
});
const SecondaryBtn = props => (
  <TertiaryButton
    containerStyle={style.secondaryBtn}
    textStyle={style.textStyle}
    text={props?.text || 'LATER'}
    onPress={() => {
      Toast.hide();
    }}
  />
);

const PrimaryButton = props => {
  const {text, containerStyle, textStyle, onPress} = props;
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <Text style={textStyle}>{text}</Text>
    </TouchableOpacity>
  );
};
