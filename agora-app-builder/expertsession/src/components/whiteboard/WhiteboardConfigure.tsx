import {UidType, useContent, useLayout, useRoomInfo} from 'customization-api';
import {createHook} from 'customization-implementation';
import React, {useState, useRef, useEffect} from 'react';
import {createContext} from 'react';
import {
  isMobileUA,
  isWebInternal,
  randomIntFromInterval,
  randomString,
} from '../../utils/common';
import {WhiteWebSdk, RoomPhase, Room, ViewMode} from 'white-web-sdk';
import LocalEventEmitter, {
  LocalEventsEnum,
} from '../../rtm-events-api/LocalEvents';
import {CursorTool} from './WhiteboardCursor';
import useUserName from '../../utils/useUserName';
import {DefaultLayouts} from '../../pages/video-call/DefaultLayouts';
import events, {PersistanceLevel} from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';

export const whiteboardPaper = isWebInternal()
  ? document.createElement('div')
  : null;
if (whiteboardPaper) {
  whiteboardPaper.className = 'whiteboardPaper';
  whiteboardPaper.setAttribute('style', 'height:100%');
}

const dummyHeight = 409;
const dummyWidth = 317;

export const CursorColor = [
  {
    cursorColor: '#EAC443',
    textColor: '#000000',
  },
  {
    cursorColor: '#EB42B9',
    textColor: '#000000',
  },
  {
    cursorColor: '#FF5733',
    textColor: '#000000',
  },
  {
    cursorColor: '#C70039',
    textColor: '#FFFFFF',
  },
  {
    cursorColor: '#196F3D',
    textColor: '#FFFFFF',
  },
  {
    cursorColor: '#2E86C1',
    textColor: '#000000',
  },
  {
    cursorColor: '#A569BD',
    textColor: '#000000',
  },
  {
    cursorColor: '#AED6F1',
    textColor: '#000000',
  },
  {
    cursorColor: '#581845',
    textColor: '#FFFFFF',
  },
  {
    cursorColor: '#1B4F72',
    textColor: '#FFFFFF',
  },
];

export const whiteboardContext = createContext(
  {} as whiteboardContextInterface,
);
export enum BoardColor {
  Black = 1,
  White = 2,
}
export interface whiteboardContextInterface {
  whiteboardUid: UidType;
  whiteboardActive: boolean;
  whiteboardRoomState: RoomPhase;
  joinWhiteboardRoom: () => void;
  leaveWhiteboardRoom: () => void;
  whiteboardRoom: React.Ref<Room>;
  boardColor: BoardColor;
  setBoardColor: React.Dispatch<React.SetStateAction<BoardColor>>;
  setUploadRef: () => void;
  insertImageIntoWhiteboard: (url: string) => void;
  getWhiteboardUid: () => number;
  whiteboardStartedFirst?: boolean;
  clearAllCallback?: () => void;
}

export interface WhiteboardPropsInterface {
  children: React.ReactNode;
}

const WhiteboardConfigure: React.FC<WhiteboardPropsInterface> = props => {
  // Defines intent, whether whiteboard should be active or not
  const [whiteboardActive, setWhiteboardActive] = useState(false);
  const [whiteboardStartedFirst, setWhiteboardStartedFirst] = useState(false);
  const [boardColor, setBoardColor] = useState<BoardColor>(BoardColor.White);
  // Defines whiteboard room state, whether disconnected, Connected, Connecting etc.
  const [whiteboardRoomState, setWhiteboardRoomState] = useState(
    RoomPhase.Disconnected,
  );
  const whiteboardUidRef = useRef(Date.now());
  const whiteWebSdkClient = useRef({} as WhiteWebSdk);
  const whiteboardRoom = useRef({} as Room);
  const {pinnedUid, activeUids} = useContent();
  const prevImageUploadHeightRef = useRef(0);
  const cursorAdapter = new CursorTool();
  const uploadPendingRef = useRef(false);

  useEffect(() => {
    if (
      whiteboardRoomState === RoomPhase.Connected &&
      pinnedUid &&
      pinnedUid == whiteboardUidRef.current
    ) {
      whiteboardRoom?.current?.moveCamera &&
        whiteboardRoom?.current?.moveCamera({
          centerX: 0,
          centerY: 0,
          scale: 1,
        });
    }
  }, [pinnedUid, whiteboardRoomState]);

  const [name] = useUserName();
  const {
    data: {isHost, whiteboard: {room_token, room_uuid} = {}},
    boardColor: boardColorRemote,
    whiteboardLastImageUploadPosition: whiteboardLastImageUploadPositionRemote,
  } = useRoomInfo();
  const {currentLayout} = useLayout();

  useEffect(() => {
    try {
      if (
        whiteboardRoomState === RoomPhase.Connected &&
        isHost &&
        !isMobileUA()
      ) {
        if (
          currentLayout === DefaultLayouts[1].name &&
          activeUids &&
          activeUids?.length &&
          (activeUids[0] === getWhiteboardUid() ||
            pinnedUid === getWhiteboardUid())
        ) {
          whiteboardRoom?.current?.setWritable(true);
        } else {
          whiteboardRoom?.current?.setWritable(false);
        }
      }
    } catch (error) {
      console.log('debugging error on whiteboard setWritable ', error);
    }
  }, [currentLayout, isHost, whiteboardRoomState, activeUids, pinnedUid]);

  const BoardColorChangedCallBack = ({boardColor}) => {
    setBoardColor(boardColor);
  };
  const SetLastImageUploadHeightCallBack = ({height}) => {
    prevImageUploadHeightRef.current = height;
  };
  React.useEffect(() => {
    if ($config.ENABLE_WAITING_ROOM && !isHost) {
      BoardColorChangedCallBack({boardColor: boardColorRemote});
    }
  }, [boardColorRemote, isHost]);

  React.useEffect(() => {
    if ($config.ENABLE_WAITING_ROOM && !isHost) {
      SetLastImageUploadHeightCallBack({
        height: whiteboardLastImageUploadPositionRemote?.height || 0,
      });
    }
  }, [whiteboardLastImageUploadPositionRemote, isHost]);

  React.useEffect(() => {
    LocalEventEmitter.on(
      LocalEventsEnum.BOARD_COLOR_CHANGED_LOCAL,
      BoardColorChangedCallBack,
    );
    LocalEventEmitter.on(
      LocalEventsEnum.WHITEBOARD_LAST_IMAGE_UPLOAD_POSITION_LOCAL,
      SetLastImageUploadHeightCallBack,
    );
    return () => {
      LocalEventEmitter.off(
        LocalEventsEnum.BOARD_COLOR_CHANGED_LOCAL,
        BoardColorChangedCallBack,
      );
      LocalEventEmitter.off(
        LocalEventsEnum.WHITEBOARD_LAST_IMAGE_UPLOAD_POSITION_LOCAL,
        SetLastImageUploadHeightCallBack,
      );
    };
  }, []);

  const fileUploadCallBack = images => {
    if (uploadPendingRef.current) {
      let prevImageWidth = 0;
      let prevImageHeight = prevImageUploadHeightRef.current;
      let count = 0;
      let focus = {
        x: 0,
        y: 0,
      };
      for (const key in images) {
        if (Object.prototype.hasOwnProperty.call(images, key)) {
          const element = images[key];
          const uuid = key + ' ' + randomString();
          const x = 0 + prevImageWidth + 50;
          const y = 0 + prevImageUploadHeightRef?.current + 50;
          whiteboardRoom.current?.insertImage({
            centerX: x,
            centerY: y,
            height: dummyHeight,
            width: dummyWidth,
            uuid: uuid,
            locked: false,
          });
          if (count === 0) {
            focus.x = x;
            focus.y = y;
          }
          setTimeout(() => {
            whiteboardRoom.current?.completeImageUpload(uuid, element.url);
          }, 1000);
          prevImageWidth = prevImageWidth + 50 + dummyWidth;
          if ((count + 1) % 4 === 0) {
            prevImageUploadHeightRef.current =
              prevImageUploadHeightRef.current + 50 + dummyHeight;
            prevImageWidth = 0;
          } else {
            prevImageHeight = dummyHeight;
          }
          count = count + 1;
        }
      }

      //for next image upload
      if ((count + 1) % 4 !== 0) {
        prevImageUploadHeightRef.current =
          prevImageUploadHeightRef.current + 50 + prevImageHeight;
      }
      uploadPendingRef.current = false;

      //focus the uploaded doc/image
      whiteboardRoom.current?.moveCamera({
        centerX: focus.x,
        centerY: focus.y,
      });
      sendLastImageUploadPositionToRemoteUsers(
        prevImageUploadHeightRef.current,
      );
    }
  };

  const setUploadRef = () => {
    uploadPendingRef.current = true;
  };

  const insertImageIntoWhiteboard = url => {
    if (!url) {
      return;
    }
    const uuid = randomString();
    const y = 0 + prevImageUploadHeightRef?.current + 50;
    whiteboardRoom.current?.insertImage({
      centerX: 0,
      centerY: y,
      height: 300,
      width: 300,
      uuid: uuid,
      locked: false,
    });
    setTimeout(() => {
      whiteboardRoom.current?.completeImageUpload(uuid, url);
    }, 1000);
    whiteboardRoom.current?.moveCamera({
      centerX: 0,
      centerY: y,
    });
    prevImageUploadHeightRef.current =
      prevImageUploadHeightRef.current + 50 + 300 + 100;
    sendLastImageUploadPositionToRemoteUsers(prevImageUploadHeightRef.current);
  };

  const sendLastImageUploadPositionToRemoteUsers = (height: number) => {
    /**
     * Sending last image upload postion to remote user
     */
    events.send(
      EventNames.WHITEBOARD_LAST_IMAGE_UPLOAD_POSITION,
      JSON.stringify({height: height || 0}),
      PersistanceLevel.Session,
    );
  };
  useEffect(() => {
    LocalEventEmitter.on(
      LocalEventsEnum.WHITEBOARD_FILE_UPLOAD,
      fileUploadCallBack,
    );
    return () => {
      LocalEventEmitter.off(
        LocalEventsEnum.WHITEBOARD_FILE_UPLOAD,
        fileUploadCallBack,
      );
    };
  }, []);

  const join = () => {
    const InitState = whiteboardRoomState;
    try {
      const index = randomIntFromInterval(0, 9);
      setWhiteboardRoomState(RoomPhase.Connecting);
      whiteWebSdkClient.current
        .joinRoom({
          cursorAdapter: cursorAdapter,
          uid: `${whiteboardUidRef.current}`,
          uuid: room_uuid,
          roomToken: room_token,
          floatBar: true,
          isWritable: isHost && !isMobileUA(),
          userPayload: {
            cursorName: name,
            cursorColor: CursorColor[index].cursorColor,
            textColor: CursorColor[index].textColor,
          },
        })
        .then(room => {
          whiteboardRoom.current = room;
          cursorAdapter.setRoom(room);
          whiteboardRoom.current?.setViewMode(ViewMode.Freedom);
          whiteboardRoom.current?.bindHtmlElement(whiteboardPaper);
          if (isHost && !isMobileUA()) {
            whiteboardRoom.current?.setMemberState({
              strokeColor: [0, 0, 0],
            });
          }
          setWhiteboardRoomState(RoomPhase.Connected);
        })
        .catch(err => {
          setWhiteboardRoomState(InitState);
          console.log(err);
        });
    } catch (err) {
      setWhiteboardRoomState(InitState);
      console.log(err);
    }
  };

  const leave = () => {
    const InitState = whiteboardRoomState;
    try {
      setWhiteboardRoomState(RoomPhase.Disconnecting);
      whiteboardRoom.current
        ?.disconnect()
        .then(() => {
          whiteboardUidRef.current = Date.now();
          whiteboardRoom.current?.bindHtmlElement(null);
          setWhiteboardRoomState(RoomPhase.Disconnected);
        })
        .catch(err => {
          setWhiteboardRoomState(InitState);
          console.log(err);
        });
    } catch (err) {
      setWhiteboardRoomState(InitState);
      console.log(err);
    }
  };

  const joinWhiteboardRoom = () => {
    setWhiteboardActive(true);
  };

  const leaveWhiteboardRoom = () => {
    setWhiteboardActive(false);
  };

  useEffect(() => {
    if (!whiteWebSdkClient.current.joinRoom && whiteboardActive) {
      const appIdentifier = $config.WHITEBOARD_APPIDENTIFIER;
      whiteWebSdkClient.current = new WhiteWebSdk({
        appIdentifier: appIdentifier,
        region: $config.WHITEBOARD_REGION,
      });
      join();
      setWhiteboardStartedFirst(true);
    } else if (whiteboardActive) {
      join();
    } else {
      if (whiteboardRoom.current) {
        leave();
      }
    }
  }, [whiteboardActive]);

  const getWhiteboardUid = () => {
    return whiteboardUidRef?.current;
  };

  const clearAllCallback = () => {
    prevImageUploadHeightRef.current = 0;
    sendLastImageUploadPositionToRemoteUsers(0);
  };

  return (
    <whiteboardContext.Provider
      value={{
        whiteboardActive,
        whiteboardRoomState,
        joinWhiteboardRoom,
        leaveWhiteboardRoom,
        whiteboardRoom,
        whiteboardUid: whiteboardUidRef.current,
        getWhiteboardUid,
        boardColor,
        setBoardColor,
        setUploadRef,
        insertImageIntoWhiteboard,
        whiteboardStartedFirst,
        clearAllCallback,
      }}>
      {props.children}
    </whiteboardContext.Provider>
  );
};

export const useWhiteboard = createHook(whiteboardContext);

export default WhiteboardConfigure;
