import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {StyleSheet} from 'react-native';
import ChatContext, {controlMessageEnum} from '../ChatContext';
import Toast from '../../../react-native-toast-message';
import {
  LiveStreamControlMessageEnum,
  LSNotificationObject,
  liveStreamContext,
  liveStreamPropsInterface,
  raiseHandItemInterface,
  RaiseHandValue,
  raiseHandListInterface,
} from './Types';
import {ClientRole, useLocalUid, UidType} from '../../../agora-rn-uikit';
import {filterObject, isEmptyObject} from '../../utils';
import {useRoomInfo} from '../room-info/useRoomInfo';
import {useScreenshare} from '../../subComponents/screenshare/useScreenshare';
import events, {PersistanceLevel} from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import {SidePanelType, useContent, useSidePanel} from 'customization-api';
import TertiaryButton from '../../atoms/TertiaryButton';
import PrimaryButton from '../../atoms/PrimaryButton';
import {trimText} from '../../utils/common';
import {useStringRef} from '../../utils/useString';
import {
  livestreamRequestAlreadyProcessed,
  livestreamToastApprovalBtnText,
  livestreamToastDenyBtnText,
} from '../../language/default-labels/videoCallScreenLabels';

const LiveStreamContext = createContext(null as unknown as liveStreamContext);

export const LiveStreamContextConsumer = LiveStreamContext.Consumer;

export const LiveStreamContextProvider: React.FC<
  liveStreamPropsInterface
> = props => {
  const requestAlreadyProcessed = useStringRef(
    livestreamRequestAlreadyProcessed,
  );

  const raiseHandRequestReceivedToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_RECEIVED.text1TranslationKey,
  );
  const raiseHandRequestReceivedToastSubHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_RECEIVED.text2TranslationKey,
  );

  const raiseHandRequestRecallToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_REQUEST_RECALL.text1TranslationKey,
  );

  const raiseHandRequestAcceptedToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_ACCEPTED.text1TranslationKey,
  );
  const raiseHandRequestAcceptedToastSubHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_ACCEPTED.text2TranslationKey,
  );

  const raiseHandRequestRejectedToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_REJECTED.text1TranslationKey,
  );

  const raiseHandApprovedRequestRecallToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_APPROVED_REQUEST_RECALL.text1TranslationKey,
  );

  const promoteAsCoHostToastHeading = useStringRef(
    LSNotificationObject.PROMOTE_AS_CO_HOST.text1TranslationKey,
  );

  const raiseHandRequestToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_REQUEST.text1TranslationKey,
  );
  const raiseHandRequestToastSubHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_REQUEST.text2TranslationKey,
  );

  const raiseHandRequestRecallLocalToastHeading = useStringRef(
    LSNotificationObject.RAISE_HAND_REQUEST_RECALL_LOCAL.text1TranslationKey,
  );

  const screenshareContextInstance = useScreenshare();
  const screenshareContextInstanceRef = useRef<any>();
  screenshareContextInstanceRef.current = screenshareContextInstance;

  const {defaultContent} = useContent();
  const defaultContentRef = useRef<any>();
  defaultContentRef.current = defaultContent;

  const [raiseHandList, setRaiseHandList] = useState<raiseHandListInterface>(
    {},
  );
  const raiseHandListRef = useRef<any>();
  raiseHandListRef.current = raiseHandList;

  const [coHostUids, setCoHostUids] = useState<UidType[]>([]);
  const coHostUidsRef = useRef<any>();
  coHostUidsRef.current = coHostUids;

  const {sidePanel} = useSidePanel();
  const sidePanelRef = useRef<any>();
  sidePanelRef.current = sidePanel;

  React.useEffect(() => {
    sidePanelRef.current = sidePanel;
  }, [sidePanel]);

  React.useEffect(() => {
    defaultContentRef.current = defaultContent;
  }, [defaultContent]);

  React.useEffect(() => {
    raiseHandListRef.current = raiseHandList;
  }, [raiseHandList]);

  React.useEffect(() => {
    coHostUidsRef.current = coHostUids;
  }, [coHostUids]);

  React.useEffect(() => {
    /**
     * when user rejoin the meeting. its showing previosly raised livesteaming request.
     * so deleting raise hand data once the user is offline
     * */
    let newRaiseHandList = raiseHandList;
    const data = Object.keys(
      filterObject(
        defaultContent,
        //@ts-ignore
        ([k, v]) => v?.type === 'rtc' && v.offline === true,
      ),
    );
    let isRaiseHandListChanged = false;
    data &&
      data.length &&
      data.forEach((uid, index) => {
        if (newRaiseHandList[uid]) {
          isRaiseHandListChanged = true;
          delete newRaiseHandList[uid];
        }
        if (data.length - 1 === index && isRaiseHandListChanged) {
          setRaiseHandList(newRaiseHandList);
        }
      });
  }, [defaultContent]);

  const localUid = useLocalUid();
  const localUidRef = useRef<any>();
  localUidRef.current = localUid;

  const {hasUserJoinedRTM, rtmInitTimstamp} = useContext(ChatContext);

  const {setRtcProps, rtcProps, callActive} = props?.value;
  const {
    data: {isHost},
  } = useRoomInfo();

  const [lastCheckedRequestTimestamp, setLastCheckedRequestTimestamp] =
    useState(0);

  const [lastRequestReceivedTimestamp, setLastRequestReceivedTimestamp] =
    useState(0);

  const [isPendingRequestToReview, setPendingRequestToReview] = useState(false);

  const allowToBePresenter = useStringRef(livestreamToastApprovalBtnText);
  const deny = useStringRef(livestreamToastDenyBtnText);
  const showToast = (
    text: string,
    text2: string,
    uid?: UidType,
    toastId?: number,
  ) => {
    let btns: any = {};
    if (uid) {
      //toastId used to hide this particular notification
      btns.toastId = toastId;
      btns.primaryBtn = (
        <PrimaryButton
          containerStyle={style.primaryBtn}
          textStyle={style.primaryBtnText}
          text={allowToBePresenter?.current()}
          onPress={() => {
            hostApprovesRequestOfUID(uid);
            Toast.hide();
          }}
        />
      );
      btns.secondaryBtn = (
        <TertiaryButton
          containerStyle={style.secondaryBtn}
          text={deny?.current()}
          onPress={() => {
            hostRejectsRequestOfUID(uid);
            Toast.hide();
          }}
        />
      );
    } else {
      btns.primaryBtn = null;
      btns.secondaryBtn = null;
    }

    Toast.show({
      leadingIconName: 'info',
      type: 'info',
      text1: text,
      text2: text2 ? text2 : null,
      visibilityTime: 3000,
      ...btns,
    });
  };

  const updateRtcProps = (newClientRole: ClientRole) => {
    setRtcProps((prevState: any) => ({
      ...prevState,
      role:
        newClientRole === ClientRole.Audience
          ? ClientRole.Audience
          : ClientRole.Broadcaster,
    }));
  };

  const getAttendeeName = (uid: number | string) => {
    return defaultContentRef.current?.[uid]?.name
      ? defaultContentRef.current[uid].name
      : 'user';
  };

  const addOrUpdateLiveStreamRequest = (
    userUID: UidType,
    payload: Partial<raiseHandItemInterface>,
  ) => {
    if (userUID && !isEmptyObject(payload)) {
      const userId = `${userUID}`;
      setRaiseHandList(oldRaisedHandList => ({
        ...oldRaisedHandList,
        [userId]: {
          raised: payload?.raised || RaiseHandValue.FALSE,
          ts: payload?.ts || Date.now(),
          isProcessed: payload?.isProcessed || false,
          role:
            payload?.role ||
            oldRaisedHandList[userId]?.role ||
            ClientRole.Audience,
        },
      }));
    }
  };

  const changeClientRoleTo = (newRole: ClientRole) => {
    updateRtcProps(newRole);
  };

  const UpdtLocStateAndBCastAttr = (newRole: ClientRole, ts: number) => {
    switch (newRole) {
      case ClientRole.Audience:
        addOrUpdateLiveStreamRequest(localUidRef.current, {
          raised: RaiseHandValue.FALSE,
          ts: ts,
          role: ClientRole.Audience,
        });
        // Audience notfies all host when request is rejected
        events.send(
          EventNames.RAISED_ATTRIBUTE,
          JSON.stringify({
            action: LiveStreamControlMessageEnum.notifyHostsInChannel,
            value: RaiseHandValue.FALSE,
            ts: new Date().getTime(),
            isProcessed: true,
          }),
          PersistanceLevel.Sender,
        );
        //update local cohost state
        setCoHostUids(prevState => {
          return [
            ...prevState.filter(i => i !== parseInt(localUidRef.current)),
          ];
        });
        // Audience notfies all users that co-host permission removed
        events.send(
          LiveStreamControlMessageEnum.coHostRemoved,
          JSON.stringify({uid: localUidRef.current}),
          PersistanceLevel.Sender,
        );
        break;
      case ClientRole.Broadcaster:
        // Update local state
        addOrUpdateLiveStreamRequest(localUidRef.current, {
          raised: RaiseHandValue.TRUE,
          ts: ts,
          role: ClientRole.Broadcaster,
        });
        // Audience notfies all host when request is approved
        events.send(
          EventNames.RAISED_ATTRIBUTE,
          JSON.stringify({
            action: LiveStreamControlMessageEnum.notifyHostsInChannel,
            value: RaiseHandValue.TRUE,
            ts: new Date().getTime(),
            isProcessed: true,
          }),
          PersistanceLevel.Sender,
        );
        //update local cohost state
        setCoHostUids(prevState => {
          return [...prevState, localUidRef.current];
        });
        // Audience notfies all users that co-host has joined
        events.send(
          LiveStreamControlMessageEnum.coHostJoined,
          JSON.stringify({uid: localUidRef.current}),
          PersistanceLevel.Sender,
        );
      default:
        break;
    }
  };

  // Get feeback for performance wise from @nitesh
  const pendingRequests = filterObject(
    raiseHandList,
    ([k, v]) =>
      v?.raised === RaiseHandValue.TRUE && v?.role == ClientRole.Audience,
  );

  React.useEffect(() => {
    // Get the time timestamp of recent request
    const recentRequest = Object.values(pendingRequests).sort(
      (a, b) => b?.ts - a?.ts || 0,
    )[0]; // sorting in descending order and take the first request

    if (recentRequest?.ts) {
      setLastRequestReceivedTimestamp(recentRequest.ts);
    }
    if (Object.keys(pendingRequests).length === 0) {
      setPendingRequestToReview(false);
    }
  }, [raiseHandList]);

  React.useEffect(() => {
    if (
      // Only true host should see the pending request
      Object.keys(pendingRequests).length !== 0 &&
      lastRequestReceivedTimestamp >= lastCheckedRequestTimestamp &&
      isHost
    ) {
      setPendingRequestToReview(true);
    } else {
      setPendingRequestToReview(false);
    }
  }, [lastRequestReceivedTimestamp, lastCheckedRequestTimestamp]);

  /** ******* SETTING UP ROLES BEGINS ******* */
  React.useEffect(() => {
    const unsubRoleAttribute = events.on(EventNames.ROLE_ATTRIBUTE, data => {
      setRaiseHandList(prevState => {
        return {
          ...prevState,
          [data.sender]: {
            ...prevState[data.sender],
            role:
              data.payload in ClientRole
                ? parseInt(data.payload)
                : ClientRole.Audience,
          },
        };
      });
    });

    return () => {
      unsubRoleAttribute();
    };
  }, []);

  React.useEffect(() => {
    if (!callActive || !hasUserJoinedRTM) return;
    events.send(
      EventNames.ROLE_ATTRIBUTE,
      JSON.stringify(
        rtcProps.role in ClientRole ? rtcProps.role : ClientRole.Audience,
      ),
      PersistanceLevel.Sender,
    );
    setRaiseHandList(prevState => {
      return {
        ...prevState,
        [localUid]: {
          ...prevState[localUid],
          role:
            rtcProps.role in ClientRole ? rtcProps.role : ClientRole.Audience,
        },
      };
    });
  }, [callActive, rtcProps.role, hasUserJoinedRTM]);

  /** ******* SETTING UP ROLES ENDS ********/

  /** ******* EVENT LISTENERS SECTION BEGINS ******* */

  React.useEffect(() => {
    /** ********************** HOST EVENTS SECTION BEGINS ********************** */
    const unsubRaisedAttribute = events.on(
      EventNames.RAISED_ATTRIBUTE,
      data => {
        if (!isHost) return;
        const payload = JSON.parse(data.payload);
        const action = payload.action;
        const value = payload.value;
        const isProcessed = payload?.isProcessed || false;

        switch (action) {
          // 1. Host can receive raise hand request with true or false value
          case LiveStreamControlMessageEnum.raiseHandRequest:
            switch (value) {
              case RaiseHandValue.TRUE:
                // Step 1: Show notifications
                if (
                  payload.ts > rtmInitTimstamp &&
                  sidePanelRef.current !== SidePanelType.Participants
                ) {
                  showToast(
                    raiseHandRequestReceivedToastHeading?.current(
                      trimText(getAttendeeName(data.sender)),
                    ),
                    raiseHandRequestReceivedToastSubHeading?.current(),
                    data.sender,
                    data.ts,
                  );
                }
                // 2. All Hosts in channel update their raised state to "true" when attendee raise their hand
                addOrUpdateLiveStreamRequest(data.sender, {
                  ts: data.ts,
                  raised: RaiseHandValue.TRUE,
                  role: ClientRole.Audience,
                  isProcessed: isProcessed,
                });
                break;
              case RaiseHandValue.FALSE:
                // Step 1: Show notifications
                if (
                  payload.ts > rtmInitTimstamp &&
                  sidePanelRef.current !== SidePanelType.Participants
                ) {
                  showToast(
                    raiseHandRequestRecallToastHeading?.current(
                      trimText(getAttendeeName(data.sender)),
                    ),
                    null,
                  );
                }
                // 2. All Hosts in channel update raised state to "false" when attendee recalls their request
                addOrUpdateLiveStreamRequest(data.sender, {
                  ts: data.ts,
                  raised: RaiseHandValue.FALSE,
                  role: ClientRole.Audience,
                  isProcessed: isProcessed,
                });
              default:
                break;
            }
            break;
          // 2. All Hosts in channel gets notified when an attendee's request gets approved or rejected
          case LiveStreamControlMessageEnum.notifyHostsInChannel:
            if (!isHost) return;
            switch (value) {
              case RaiseHandValue.TRUE:
                addOrUpdateLiveStreamRequest(data.sender, {
                  ts: data.ts,
                  raised: RaiseHandValue.TRUE,
                  role: ClientRole.Broadcaster,
                  isProcessed: isProcessed,
                });
                break;
              case RaiseHandValue.FALSE:
                addOrUpdateLiveStreamRequest(data.sender, {
                  ts: data.ts,
                  raised: RaiseHandValue.FALSE,
                  role: ClientRole.Audience,
                  isProcessed: isProcessed,
                });
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      },
    );
    /** ********************** HOST EVENTS SECTION ENDS ********************** */

    /** ********************** AUDIENCE EVENTS SECTION BEGINS ********************** */
    // 1. Audience receives this when the request is accepted by host
    const unsubRaiseHandReqAcpt = events.on(
      LiveStreamControlMessageEnum.raiseHandRequestAccepted,
      data => {
        if (raiseHandList[localUidRef.current]?.raised === RaiseHandValue.FALSE)
          return;
        showToast(
          raiseHandRequestAcceptedToastHeading?.current(),
          raiseHandRequestAcceptedToastSubHeading?.current(),
        );
        // Promote user's privileges to host
        changeClientRoleTo(ClientRole.Broadcaster);
        // Audience updates its local attributes and notfies all host when request is approved
        UpdtLocStateAndBCastAttr(ClientRole.Broadcaster, data.ts);
      },
    );
    /** 2. Audience receives this when the request is rejected by host
     * 2.a  Audience receives this when the request is rejected by host which is not yet approved
     * 2.b  Audience receives this when the request when is demoted by the host
     */
    const unsubRaiseHandReqRej = events.on(
      LiveStreamControlMessageEnum.raiseHandRequestRejected,
      data => {
        /** 2.a */
        if (
          raiseHandListRef.current[localUidRef.current].role ==
          ClientRole.Audience
        ) {
          showToast(raiseHandRequestRejectedToastHeading?.current(), null);
        } else if (
          raiseHandListRef.current[localUidRef.current].role ==
          ClientRole.Broadcaster
        ) {
          /** 2.b */
          showToast(
            raiseHandApprovedRequestRecallToastHeading?.current(),
            null,
          );
          screenshareContextInstanceRef?.current?.stopUserScreenShare(); // This will not exist on ios

          // Demote user's privileges to audience
          changeClientRoleTo(ClientRole.Audience);
        }
        // Audience updates its local attributes and notfies all host when demoted/request rejected
        UpdtLocStateAndBCastAttr(ClientRole.Audience, data.ts);
      },
    );
    // 3. Audience when receives kickUser notifies all host when is kicked out
    const unsubKickUser = events.on(controlMessageEnum.kickUser, data => {
      // Audience updates its local attributes and notfies all host when they(audience) are kicked out
      UpdtLocStateAndBCastAttr(ClientRole.Audience, data.ts);
    });
    // 4. Host promote audience as co-host
    const unsubPromoteAsCoHost = events.on(
      LiveStreamControlMessageEnum.promoteAsCoHost,
      data => {
        showToast(promoteAsCoHostToastHeading.current(), null);
        // Promote user's privileges to host
        changeClientRoleTo(ClientRole.Broadcaster);
        // Audience updates its local attributes and notfies all host when request is approved
        UpdtLocStateAndBCastAttr(ClientRole.Broadcaster, data.ts);
      },
    );
    // 4. New co-host has joined
    const unsubCoHostJoined = events.on(
      LiveStreamControlMessageEnum.coHostJoined,
      ({payload}) => {
        try {
          const data = JSON.parse(payload);
          if (data?.uid) {
            setCoHostUids(prevState => {
              return [...prevState, parseInt(data.uid)];
            });
          }
        } catch (error) {}
      },
    );
    // 5. Co-host removed
    const unsubCoHostRemoved = events.on(
      LiveStreamControlMessageEnum.coHostRemoved,
      ({payload}) => {
        try {
          const data = JSON.parse(payload);
          if (data?.uid) {
            setCoHostUids(prevState => {
              return [...prevState.filter(i => i !== parseInt(data.uid))];
            });
          }
        } catch (error) {}
      },
    );
    /** ********************** AUDIENCE EVENTS SECTION ENDS ********************** */

    return () => {
      unsubRaisedAttribute();
      unsubRaiseHandReqAcpt();
      unsubRaiseHandReqRej();
      unsubKickUser();
      unsubPromoteAsCoHost();
      unsubCoHostJoined();
      unsubCoHostRemoved();
    };
  }, []);

  /** ******* EVENT LISTENERS SECTION ENDS ******* */

  /** ******* HOST CONTROLS SECTION BEGINS ******* */
  /* Host controls for Live Streaming
   * a. Host can approve streaming request sent by audience
   * b. Host can reject streaming request sent by audience
   */

  const hostApprovesRequestOfUID = (uid: UidType) => {
    if (!raiseHandListRef.current[uid]?.isProcessed) {
      addOrUpdateLiveStreamRequest(uid, {
        raised: RaiseHandValue.TRUE,
        ts: new Date().getTime(),
        isProcessed: true,
      });
      events.send(
        LiveStreamControlMessageEnum.raiseHandRequestAccepted,
        '',
        PersistanceLevel.None,
        uid,
      );
    } else {
      Toast.hide();
      setTimeout(() => {
        showToast(requestAlreadyProcessed?.current(), null);
      });
    }
  };

  const hostRejectsRequestOfUID = (uid: UidType) => {
    if (!raiseHandListRef.current[uid]?.isProcessed) {
      addOrUpdateLiveStreamRequest(uid, {
        raised: RaiseHandValue.FALSE,
        ts: new Date().getTime(),
        isProcessed: true,
      });
      events.send(
        LiveStreamControlMessageEnum.raiseHandRequestRejected,
        '',
        PersistanceLevel.None,
        uid,
      );
    } else {
      Toast.hide();
      setTimeout(() => {
        showToast(requestAlreadyProcessed?.current(), null);
      });
    }
  };

  // promote audience as co-host
  const promoteAudienceAsCoHost = async (uid: UidType): Promise<void> => {
    events.send(
      LiveStreamControlMessageEnum.promoteAsCoHost,
      '',
      PersistanceLevel.None,
      uid,
    );
  };

  /** ******* HOST CONTROLS SECTION ENDS ******* */

  /** ******* AUDIENCE CONTROLS SECTION BEGINS *******
   * Audience have below controls
   * a. Audience can raise a request to live stream
   * b. Audience can recalls his request to live stream
   *   i. While recalling the request could be either approved or not approved
   */

  const audienceSendsRequest = async (): Promise<void> => {
    // If hand is already raised, skip the call
    if (raiseHandList[localUidRef.current]?.raised === RaiseHandValue.TRUE)
      return;
    showToast(
      raiseHandRequestToastHeading?.current(),
      raiseHandRequestToastSubHeading?.current(),
    );
    events.send(
      EventNames.RAISED_ATTRIBUTE,
      JSON.stringify({
        action: LiveStreamControlMessageEnum.raiseHandRequest,
        value: RaiseHandValue.TRUE,
        ts: new Date().getTime(),
        isProcessed: false,
      }),
      PersistanceLevel.Sender,
    );
    // Update local state
    addOrUpdateLiveStreamRequest(localUidRef.current, {
      raised: RaiseHandValue.TRUE,
      ts: new Date().getTime(),
    });
  };

  const audienceRecallsRequest = async (): Promise<void> => {
    // If hand is already down, skip the call
    if (raiseHandList[localUidRef.current]?.raised === RaiseHandValue.FALSE)
      return;
    /**
     * if: Check if request is already approved
     * else: Audience Request was not approved by host, and was pending
     */
    if (
      raiseHandList[localUidRef.current]?.role == ClientRole.Broadcaster &&
      raiseHandList[localUidRef.current]?.raised === RaiseHandValue.TRUE
    ) {
      screenshareContextInstanceRef?.current?.stopUserScreenShare(); // This will not exist on ios
      // Change role
      changeClientRoleTo(ClientRole.Audience);
    }
    //notify host users
    events.send(
      EventNames.RAISED_ATTRIBUTE,
      JSON.stringify({
        action: LiveStreamControlMessageEnum.raiseHandRequest,
        value: RaiseHandValue.FALSE,
        ts: new Date().getTime(),
        isProcessed: true,
      }),
      PersistanceLevel.Sender,
    );
    UpdtLocStateAndBCastAttr(ClientRole.Audience, new Date().getTime());
    showToast(raiseHandRequestRecallLocalToastHeading?.current(), null);
  };

  /** ******* AUDIENCE CONTROLS SECTION ENDS ******* */

  return (
    <LiveStreamContext.Provider
      value={{
        coHostUids: coHostUids,
        setLastCheckedRequestTimestamp,
        isPendingRequestToReview,
        raiseHandList,
        hostApprovesRequestOfUID,
        hostRejectsRequestOfUID,
        audienceSendsRequest,
        audienceRecallsRequest,
        promoteAudienceAsCoHost,
      }}>
      {props.children}
    </LiveStreamContext.Provider>
  );
};

export default LiveStreamContext;

const style = StyleSheet.create({
  secondaryBtn: {marginLeft: 16, height: 40, paddingVertical: 5},
  primaryBtn: {
    minWidth: 'auto',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 4,
    paddingVertical: 5,
  },
  primaryBtnText: {
    fontWeight: '600',
    fontSize: 16,
    paddingLeft: 0,
  },
});
