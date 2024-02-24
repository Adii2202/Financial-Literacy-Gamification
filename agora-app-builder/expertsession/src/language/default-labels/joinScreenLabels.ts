import {I18nBaseType} from '../i18nTypes';
import {room} from './createScreenLabels';

export const joinRoomHeading = `join${room}Heading`;
export const joinRoomInputLabel = `join${room}InputLabel`;
export const joinRoomInputPlaceHolderText = `join${room}InputPlaceHolderText`;
export const joinRoomBtnText = `join${room}BtnText`;
export const joinRoomCreateBtnText = `join${room}CreateBtnText`;

export const joinRoomErrorToastHeading = `join${room}ErrorToastHeading`;
export const joinRoomErrorToastSubHeading = `join${room}ErrorToastSubHeading`;

export interface I18nJoinScreenLabelsInterface {
  [joinRoomHeading]?: I18nBaseType;
  [joinRoomInputLabel]?: I18nBaseType;
  [joinRoomInputPlaceHolderText]?: I18nBaseType;
  [joinRoomBtnText]?: I18nBaseType;
  [joinRoomCreateBtnText]?: I18nBaseType;
  [joinRoomErrorToastHeading]?: I18nBaseType;
  [joinRoomErrorToastSubHeading]?: I18nBaseType;
}

export const JoinScreenLabels: I18nJoinScreenLabelsInterface = {
  [joinRoomHeading]: ({eventMode}) => {
    if (eventMode) {
      return 'Join a Room';
    } else {
      return 'Join a Stream';
    }
  },
  [joinRoomInputLabel]: ({eventMode}) => {
    if (eventMode) {
      return 'Stream ID';
    } else {
      return 'Room ID';
    }
  },
  [joinRoomInputPlaceHolderText]: ({eventMode}) => {
    if (eventMode) {
      return 'Enter Stream ID';
    } else {
      return 'Enter Room ID';
    }
  },
  [joinRoomBtnText]: ({eventMode}) => (eventMode ? 'Join Stream' : 'Join Room'),
  [joinRoomCreateBtnText]: ({eventMode}) =>
    eventMode ? 'Create a Stream' : 'Create a Room',
  [joinRoomErrorToastHeading]: ({eventMode}) =>
    `${eventMode ? 'Stream' : 'Room'} ID Invalid.`,
  [joinRoomErrorToastSubHeading]: ({eventMode}) =>
    `Please enter a valid ${eventMode ? 'Stream' : 'Room'} ID`,
};
