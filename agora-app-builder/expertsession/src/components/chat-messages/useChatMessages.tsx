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
import {createHook} from 'customization-implementation';
import React, {useState, useEffect, useRef, useContext} from 'react';
import {useContent, useRoomInfo} from 'customization-api';
import {SidePanelType} from '../../subComponents/SidePanelEnum';
import {
  useLocalUid,
  UidType,
  ContentInterface,
  DispatchContext,
} from '../../../agora-rn-uikit';
import events, {PersistanceLevel} from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import {ChatType, useChatUIControls} from '../chat-ui/useChatUIControls';
import {useChatNotification} from '../chat-notification/useChatNotification';
import Toast from '../../../react-native-toast-message';
import {timeNow} from '../../rtm/utils';
import {useSidePanel} from '../../utils/useSidePanel';
import getUniqueID from '../../utils/getUniqueID';
import {trimText} from '../../utils/common';
import {useStringRef} from '../../utils/useString';
import {
  publicChatToastHeading,
  multiplePublicChatToastHeading,
  multiplePrivateChatToastHeading,
  privateChatToastHeading,
  multiplePublicAndPrivateChatToastHeading,
  multiplePublicAndPrivateChatToastSubHeading,
  multiplePublicChatToastSubHeading,
} from '../../language/default-labels/videoCallScreenLabels';

enum ChatMessageActionEnum {
  Create = 'Create_Chat_Message',
  Update = 'Update_Chat_Message',
  Delete = 'Delete_Chat_Message',
}

interface ChatMessagesProviderProps {
  children: React.ReactNode;
  callActive: boolean;
}
export interface messageInterface {
  createdTimestamp: number;
  updatedTimestamp?: number;
  msg: string;
  msgId: string;
  isDeleted: boolean;
}
export interface messageStoreInterface extends messageInterface {
  uid: UidType;
}

interface ChatMessagesInterface {
  messageStore: messageStoreInterface[];
  privateMessageStore: {[key: string]: messageStoreInterface[]};
  sendChatMessage: (msg: string, toUid?: UidType) => void;
  editChatMessage: (msgId: string, msg: string, toUid?: UidType) => void;
  deleteChatMessage: (msgId: string, toUid?: UidType) => void;
  openPrivateChat: (toUid: UidType) => void;
}

const ChatMessagesContext = React.createContext<ChatMessagesInterface>({
  messageStore: [],
  privateMessageStore: {},
  sendChatMessage: () => {},
  editChatMessage: () => {},
  deleteChatMessage: () => {},
  openPrivateChat: () => {},
});

const ChatMessagesProvider = (props: ChatMessagesProviderProps) => {
  const isToastVisibleRef = useRef(false);
  const previousNotificationRef = useRef([]);
  const timeoutRef = useRef<any>();
  const {callActive} = props;
  const {
    data: {isHost},
  } = useRoomInfo();
  const {dispatch} = useContext(DispatchContext);
  const {defaultContent} = useContent();
  const localUid = useLocalUid();
  const {setSidePanel, sidePanel} = useSidePanel();
  const {chatType, setChatType, privateChatUser, setPrivateChatUser} =
    useChatUIControls();
  const {setUnreadGroupMessageCount, setUnreadIndividualMessageCount} =
    useChatNotification();
  const [messageStore, setMessageStore] = useState<messageStoreInterface[]>([]);
  const [privateMessageStore, setPrivateMessageStore] = useState<{
    [key: string]: messageStoreInterface[];
  }>({});

  const defaultContentRef = useRef({defaultContent: defaultContent});

  const isHostRef = useRef({isHost: isHost});
  const callActiveRef = useRef({callActive: callActive});

  const groupActiveRef = useRef<boolean>(false);
  const individualActiveRef = useRef<string | number>();

  //public single
  const fromText = useStringRef(publicChatToastHeading);

  //public multple
  const multiplePublicChatToastHeadingTT = useStringRef(
    multiplePublicChatToastHeading,
  );
  //@ts-ignore
  const multiplePublicChatToastSubHeadingTT = useStringRef<{
    count: number;
    from: string;
  }>(multiplePublicChatToastSubHeading);

  //private single
  const privateMessageLabel = useStringRef(privateChatToastHeading);

  //private multiple
  //@ts-ignore
  const multiplePrivateChatToastHeadingTT = useStringRef<{count: number}>(
    multiplePrivateChatToastHeading,
  );

  //multiple private and public toast
  const multiplePublicAndPrivateChatToastHeadingTT = useStringRef(
    multiplePublicAndPrivateChatToastHeading,
  );
  //@ts-ignore
  const multiplePublicAndPrivateChatToastSubHeadingTT = useStringRef<{
    publicChatCount: number;
    privateChatCount: number;
    from: string;
  }>(multiplePublicAndPrivateChatToastSubHeading);

  useEffect(() => {
    callActiveRef.current.callActive = callActive;
  }, [callActive]);
  useEffect(() => {
    isHostRef.current.isHost = isHost;
  }, [isHost]);

  useEffect(() => {
    defaultContentRef.current.defaultContent = defaultContent;
  }, [defaultContent]);

  useEffect(() => {
    groupActiveRef.current =
      chatType === ChatType.Group && sidePanel === SidePanelType.Chat;
  }, [chatType, sidePanel]);

  useEffect(() => {
    individualActiveRef.current = privateChatUser;
  }, [privateChatUser]);

  const allEqual = arr => arr.every(val => val === arr[0]);
  const openPrivateChat = uidAsNumber => {
    //move this logic into ChatContainer
    // setUnreadPrivateMessageCount(
    //   unreadPrivateMessageCount -
    //     (unreadIndividualMessageCount[uidAsNumber] || 0),
    // );
    // setUnreadIndividualMessageCount((prevState) => {
    //   return {
    //     ...prevState,
    //     [uidAsNumber]: 0,
    //   };
    // });

    setPrivateChatUser(uidAsNumber);
    setChatType(ChatType.Private);
    setSidePanel(SidePanelType.Chat);
  };

  const updateRenderListState = (
    uid: number,
    data: Partial<ContentInterface>,
  ) => {
    dispatch({type: 'UpdateRenderList', value: [uid, data]});
  };

  React.useEffect(() => {
    const showMessageNotification = (
      msg: string,
      uid: string,
      isPrivateMessage: boolean = false,
      forceStop: boolean = false,
    ) => {
      //don't show group message notification if group chat is open
      if (!isPrivateMessage && groupActiveRef.current) {
        return;
      }
      const uidAsNumber = parseInt(uid);
      //don't show private message notification if private chat is open
      if (isPrivateMessage && uidAsNumber === individualActiveRef.current) {
        return;
      }
      if (forceStop) {
        return;
      }
      clearTimeout(timeoutRef.current);
      isToastVisibleRef.current = true;
      timeoutRef.current = setTimeout(() => {
        isToastVisibleRef.current = false;
        previousNotificationRef.current = [];
      }, 3000);

      previousNotificationRef.current.push({
        isPrivateMessage: isPrivateMessage,
        fromUid: isPrivateMessage ? uidAsNumber : 0,
        from:
          !isPrivateMessage &&
          //@ts-ignore
          defaultContentRef.current.defaultContent[uidAsNumber]?.name
            ? trimText(
                //@ts-ignore
                defaultContentRef.current.defaultContent[uidAsNumber]?.name,
              )
            : '',
      });

      const privateMessages = previousNotificationRef.current.filter(
        i => i.isPrivateMessage,
      );
      const publicMessages = previousNotificationRef.current.filter(
        i => !i.isPrivateMessage,
      );

      //if 1 or more public and private messages
      if (publicMessages && publicMessages.length > 1) {
        const fromNamesArray = publicMessages
          .filter(i => i.from !== undefined && i.from !== null && i.from !== '')
          .map(i => i.from);
        //removing the duplicate names
        const fromNamesArrayUnique = [...new Set(fromNamesArray)];
        //public chat with two name will seperated by "and"
        //public chat with two or more name will have "and more" at the end
        const fromNamesArrayUpdated =
          fromNamesArrayUnique.length > 2
            ? fromNamesArrayUnique
                .slice(0, 2)
                .map((i, index) => (index === 0 ? i + ', ' : i))
                .concat(privateMessages?.length ? ', more' : ' and more')
            : fromNamesArrayUnique.length == 2
            ? fromNamesArrayUnique.map((i, index) =>
                index === 0 ? i + ' and ' : i,
              )
            : fromNamesArrayUnique;
        //converting the names array to string
        const fromNames = fromNamesArrayUpdated.join('');
        Toast.show({
          //@ts-ignore
          update: isToastVisibleRef.current ? true : false,
          primaryBtn: null,
          secondaryBtn: null,
          type: 'info',
          leadingIconName: 'chat-nav',
          text1:
            privateMessages && privateMessages.length
              ? multiplePublicAndPrivateChatToastHeadingTT?.current()
              : multiplePublicChatToastHeadingTT?.current(),
          text2:
            privateMessages && privateMessages.length
              ? //@ts-ignore
                multiplePublicAndPrivateChatToastSubHeadingTT?.current({
                  publicChatCount: publicMessages.length,
                  privateChatCount: privateMessages.length,
                  from: fromNames,
                })
              : //@ts-ignore
                multiplePublicChatToastSubHeadingTT?.current({
                  count: publicMessages.length,
                  from: fromNames,
                }),
          visibilityTime: 3000,
          onPress: () => {
            if (isPrivateMessage) {
              openPrivateChat(uidAsNumber);
            } else {
              //move this logic into ChatContainer
              // setUnreadGroupMessageCount(0);
              setPrivateChatUser(0);
              setChatType(ChatType.Group);
              setSidePanel(SidePanelType.Chat);
            }
          },
        });
      }
      //if one or more private message and no public messages
      else if (privateMessages && privateMessages.length > 1) {
        Toast.show({
          //@ts-ignore
          update: isToastVisibleRef.current ? true : false,
          primaryBtn: null,
          secondaryBtn: null,
          type: 'info',
          leadingIconName: 'chat-nav',
          text1:
            //@ts-ignore
            multiplePrivateChatToastHeadingTT?.current({
              count: privateMessages.length,
            }),
          text2: ``,
          visibilityTime: 3000,
          onPress: () => {
            const openPrivateChatDetails = allEqual(
              privateMessages.map(i => i.fromUid),
            );
            //if all private message comes from the single user then open details private chat
            if (openPrivateChatDetails) {
              openPrivateChat(privateMessages[0].fromUid);
            }
            //if private message comes from different user then open private tab not the private chatting window
            else {
              //open private tab (not the detail of private chat user)
              setPrivateChatUser(0);
              setChatType(ChatType.Group);
              setSidePanel(SidePanelType.Chat);
            }
          },
        });
      }
      //either 1 public or 1 private message
      else {
        Toast.show({
          //@ts-ignore
          update: isToastVisibleRef.current ? true : false,
          primaryBtn: null,
          secondaryBtn: null,
          type: 'info',
          leadingIconName: 'chat-nav',
          text1: isPrivateMessage
            ? privateMessageLabel?.current()
            : //@ts-ignore
            defaultContentRef.current.defaultContent[uidAsNumber]?.name
            ? fromText?.current(
                trimText(
                  //@ts-ignore
                  defaultContentRef.current.defaultContent[uidAsNumber]?.name,
                ),
              )
            : '',
          text2: isPrivateMessage
            ? ''
            : msg.length > 30
            ? msg.slice(0, 30) + '...'
            : msg,
          visibilityTime: 3000,
          onPress: () => {
            if (isPrivateMessage) {
              openPrivateChat(uidAsNumber);
            } else {
              //move this logic into ChatContainer
              // setUnreadGroupMessageCount(0);
              setPrivateChatUser(0);
              setChatType(ChatType.Group);
              setSidePanel(SidePanelType.Chat);
            }
          },
        });
      }
    };
    const unsubPublicChatMessage = events.on(
      EventNames.PUBLIC_CHAT_MESSAGE,
      data => {
        const forceStop =
          $config.ENABLE_WAITING_ROOM &&
          !isHostRef.current.isHost &&
          !callActiveRef.current.callActive;
        //if call is not active don't store the message in the state
        if (forceStop) {
          return;
        }
        const payload = JSON.parse(data.payload);
        const messageAction = payload.action;
        const messageData = payload.value;
        switch (messageAction) {
          case ChatMessageActionEnum.Create:
            showMessageNotification(
              messageData.msg,
              `${data.sender}`,
              false,
              forceStop,
            );
            addMessageToStore(data.sender, {
              msg: messageData.msg,
              createdTimestamp: messageData.createdTimestamp,
              isDeleted: messageData.isDeleted,
              msgId: messageData.msgId,
            });
            /**
             * if chat group window is not active.
             * then we will increment the unread count
             */
            if (!groupActiveRef.current) {
              setUnreadGroupMessageCount(prevState => {
                return prevState + 1;
              });
            }
            break;
          case ChatMessageActionEnum.Update:
            setMessageStore(prevState => {
              const newState = prevState.map(item => {
                if (
                  item.msgId === messageData.msgId &&
                  item.uid === data.sender
                ) {
                  return {
                    ...item,
                    msg: messageData.msg,
                    updatedTimestamp: messageData.updatedTimestamp,
                  };
                } else {
                  return item;
                }
              });
              return newState;
            });
            break;
          case ChatMessageActionEnum.Delete:
            setMessageStore(prevState => {
              const newState = prevState.map(item => {
                if (
                  item.msgId === messageData.msgId &&
                  item.uid === data.sender
                ) {
                  return {
                    ...item,
                    isDeleted: true,
                    updatedTimestamp: messageData.updatedTimestamp,
                  };
                } else {
                  return item;
                }
              });
              return newState;
            });
            break;
          default:
            break;
        }
      },
    );

    const unsubPrivateChatMessage = events.on(
      EventNames.PRIVATE_CHAT_MESSAGE,
      data => {
        const payload = JSON.parse(data.payload);
        const messageAction = payload.action;
        const messageData = payload.value;
        switch (messageAction) {
          case ChatMessageActionEnum.Create:
            //To order chat participant based on recent message
            try {
              updateRenderListState(data.sender, {
                lastMessageTimeStamp: new Date().getTime(),
              });
            } catch (error) {
              console.log("ERROR : couldn't update the last message timestamp");
            }
            showMessageNotification(messageData.msg, `${data.sender}`, true);
            addMessageToPrivateStore(
              data.sender,
              {
                msg: messageData.msg,
                createdTimestamp: messageData.createdTimestamp,
                msgId: messageData.msgId,
                isDeleted: messageData.isDeleted,
              },
              false,
            );
            /**
             * if user's private window is active.
             * then we will not increment the unread count
             */

            if (!(individualActiveRef.current === data.sender)) {
              setUnreadIndividualMessageCount(prevState => {
                const prevCount =
                  prevState && prevState[data.sender]
                    ? prevState[data.sender]
                    : 0;
                return {
                  ...prevState,
                  [data.sender]: prevCount + 1,
                };
              });
            }
            break;
          case ChatMessageActionEnum.Update:
            setPrivateMessageStore(prevState => {
              const privateChatOfUid = prevState[data.sender];
              const updatedData = privateChatOfUid.map(item => {
                if (
                  item.msgId === messageData.msgId &&
                  item.uid === data.sender
                ) {
                  return {
                    ...item,
                    msg: messageData.msg,
                    updatedTimestamp: messageData.updatedTimestamp,
                  };
                } else {
                  return item;
                }
              });
              const newState = {
                ...prevState,
                [data.sender]: updatedData,
              };
              return newState;
            });
            break;
          case ChatMessageActionEnum.Delete:
            setPrivateMessageStore(prevState => {
              const privateChatOfUid = prevState[data.sender];
              const updatedData = privateChatOfUid.map(item => {
                if (
                  item.msgId === messageData.msgId &&
                  item.uid === data.sender
                ) {
                  return {
                    ...item,
                    isDeleted: true,
                    updatedTimestamp: messageData.updatedTimestamp,
                  };
                } else {
                  return item;
                }
              });
              const newState = {
                ...prevState,
                [data.sender]: updatedData,
              };
              return newState;
            });
            break;
          default:
            break;
        }
      },
    );

    return () => {
      unsubPublicChatMessage();
      unsubPrivateChatMessage();
    };
  }, []);

  const addMessageToStore = (uid: UidType, body: messageInterface) => {
    setMessageStore((m: messageStoreInterface[]) => {
      return [
        ...m,
        {
          createdTimestamp: body.createdTimestamp,
          uid,
          msg: body.msg,
          msgId: body.msgId,
          isDeleted: body.isDeleted,
        },
      ];
    });
  };

  const addMessageToPrivateStore = (
    uid: UidType,
    body: messageInterface,
    local: boolean,
  ) => {
    setPrivateMessageStore(state => {
      let newState = {...state};
      newState[uid] !== undefined
        ? (newState[uid] = [
            ...newState[uid],
            {
              createdTimestamp: body.createdTimestamp,
              uid: local ? localUid : uid,
              msg: body.msg,
              msgId: body.msgId,
              isDeleted: body.isDeleted,
            },
          ])
        : (newState = {
            ...newState,
            [uid]: [
              {
                createdTimestamp: body.createdTimestamp,
                uid: local ? localUid : uid,
                msg: body.msg,
                msgId: body.msgId,
                isDeleted: body.isDeleted,
              },
            ],
          });
      return {...newState};
    });
  };

  const sendChatMessage = (msg: string, toUid?: UidType) => {
    if (typeof msg == 'string' && msg.trim() === '') return;
    if (toUid) {
      const messageData = {
        msg,
        createdTimestamp: timeNow(),
        msgId: getUniqueID(),
        isDeleted: false,
      };
      events.send(
        EventNames.PRIVATE_CHAT_MESSAGE,
        JSON.stringify({
          value: messageData,
          action: ChatMessageActionEnum.Create,
        }),
        PersistanceLevel.None,
        toUid,
      );
      addMessageToPrivateStore(toUid, messageData, true);
    } else {
      const messageData = {
        msg,
        msgId: getUniqueID(),
        isDeleted: false,
        createdTimestamp: timeNow(),
      };
      events.send(
        EventNames.PUBLIC_CHAT_MESSAGE,
        JSON.stringify({
          value: messageData,
          action: ChatMessageActionEnum.Create,
        }),
        PersistanceLevel.None,
      );
      addMessageToStore(localUid, messageData);
    }
  };

  const editChatMessage = (msgId: string, msg: string, toUid?: UidType) => {
    if (typeof msg == 'string' && msg.trim() === '') return;
    if (toUid) {
      const checkData = privateMessageStore[toUid].filter(
        item => item.msgId === msgId && item.uid === localUid,
      );
      if (checkData && checkData.length) {
        const editMsgData = {msg, updatedTimestamp: timeNow()};
        events.send(
          EventNames.PRIVATE_CHAT_MESSAGE,
          JSON.stringify({
            value: {msgId, ...editMsgData},
            action: ChatMessageActionEnum.Update,
          }),
          PersistanceLevel.None,
          toUid,
        );
        setPrivateMessageStore(prevState => {
          const privateChatOfUid = prevState[toUid];
          const updatedData = privateChatOfUid.map(item => {
            if (item.msgId === msgId) {
              return {...item, ...editMsgData};
            } else {
              return item;
            }
          });
          const newState = {...prevState, [toUid]: updatedData};
          return newState;
        });
      } else {
        console.log("You don't have permission to edit");
      }
    } else {
      //check if user has permission to edit
      const checkData = messageStore.filter(
        item => item.msgId === msgId && item.uid === localUid,
      );
      if (checkData && checkData.length) {
        const editMsgData = {msg, updatedTimestamp: timeNow()};
        events.send(
          EventNames.PUBLIC_CHAT_MESSAGE,
          JSON.stringify({
            value: {msgId, ...editMsgData},
            action: ChatMessageActionEnum.Update,
          }),
          PersistanceLevel.None,
        );
        setMessageStore(prevState => {
          const newState = prevState.map(item => {
            if (item.msgId === msgId) {
              return {...item, ...editMsgData};
            } else {
              return item;
            }
          });
          return newState;
        });
      } else {
        console.log("You don't have permission to edit");
      }
    }
  };

  const deleteChatMessage = (msgId: string, toUid?: UidType) => {
    if (toUid) {
      const checkData = privateMessageStore[toUid].filter(
        item => item.msgId === msgId && item.uid === localUid,
      );
      if (checkData && checkData.length) {
        const deleteMsgData = {updatedTimestamp: timeNow()};
        events.send(
          EventNames.PRIVATE_CHAT_MESSAGE,
          JSON.stringify({
            value: {msgId, ...deleteMsgData},
            action: ChatMessageActionEnum.Delete,
          }),
          PersistanceLevel.None,
          toUid,
        );
        setPrivateMessageStore(prevState => {
          const privateChatOfUid = prevState[toUid];
          const updatedData = privateChatOfUid.map(item => {
            if (item.msgId === msgId) {
              return {...item, isDeleted: true, ...deleteMsgData};
            } else {
              return item;
            }
          });
          const newState = {...prevState, [toUid]: updatedData};
          return newState;
        });
      } else {
        console.log("You don't have permission to delete");
      }
    } else {
      //check if user has permission to delete
      const checkData = messageStore.filter(
        item => item.msgId === msgId && item.uid === localUid,
      );
      if (checkData && checkData.length) {
        const deleteMsgData = {updatedTimestamp: timeNow()};
        events.send(
          EventNames.PUBLIC_CHAT_MESSAGE,
          JSON.stringify({
            value: {msgId, ...deleteMsgData},
            action: ChatMessageActionEnum.Delete,
          }),
          PersistanceLevel.None,
        );
        setMessageStore(prevState => {
          const newState = prevState.map(item => {
            if (item.msgId === msgId) {
              return {...item, isDeleted: true, ...deleteMsgData};
            } else {
              return item;
            }
          });
          return newState;
        });
      } else {
        console.log("You don't have permission to delete");
      }
    }
  };

  return (
    <ChatMessagesContext.Provider
      value={{
        messageStore,
        privateMessageStore,
        sendChatMessage,
        editChatMessage,
        deleteChatMessage,
        openPrivateChat,
      }}>
      {props.children}
    </ChatMessagesContext.Provider>
  );
};

const useChatMessages = createHook(ChatMessagesContext);

export {ChatMessagesProvider, useChatMessages};
