import {UidType, useContent, useLayout, useRoomInfo} from 'customization-api';
import {createHook} from 'customization-implementation';
import React, {useState, useRef, useEffect} from 'react';
import {createContext} from 'react';
import {isWeb, randomIntFromInterval, randomString} from '../../utils/common';

export const whiteboardPaper = isWeb() ? document.createElement('div') : null;
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
  whiteboardRoomState: any;
  joinWhiteboardRoom: () => void;
  leaveWhiteboardRoom: () => void;
  whiteboardRoom: React.Ref<any>;
  boardColor: BoardColor;
  setBoardColor: React.Dispatch<React.SetStateAction<BoardColor>>;
  setUploadRef: () => void;
  insertImageIntoWhiteboard: (url: string) => void;
  getWhiteboardUid: () => number;
  whiteboardStartedFirst?: boolean;
  clearAllCallback: () => void;
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
  const [whiteboardRoomState, setWhiteboardRoomState] = useState();
  const whiteboardUidRef = useRef(Date.now());
  const whiteboardRoom = useRef({});

  const setUploadRef = () => {};

  const insertImageIntoWhiteboard = url => {};

  const joinWhiteboardRoom = () => {
    setWhiteboardActive(true);
  };

  const leaveWhiteboardRoom = () => {
    setWhiteboardActive(false);
  };

  const getWhiteboardUid = () => {
    return whiteboardUidRef?.current;
  };

  const clearAllCallback = () => {};
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
