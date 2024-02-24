import React, {useContext, useEffect} from 'react';
import {
  PersistanceLevel,
  ToolbarItem,
  customEvents,
  useLayout,
  useRoomInfo,
} from 'customization-api';
import {whiteboardContext} from './WhiteboardConfigure';
import {RoomPhase} from 'white-web-sdk';
import IconButton from '../../atoms/IconButton';
import {EventNames} from '../../rtm-events';

const WhiteboardButton = () => {
  const {
    whiteboardRoomState,
    whiteboardActive,
    joinWhiteboardRoom,
    leaveWhiteboardRoom,
  } = useContext(whiteboardContext);
  const {
    data: {isHost},
  } = useRoomInfo();

  const {setLayout, currentLayout} = useLayout();

  const WhiteboardStoppedCallBack = () => {
    toggleWhiteboard(true, false);
  };

  const WhiteboardStartedCallBack = () => {
    toggleWhiteboard(false, false);
  };

  useEffect(() => {
    whiteboardActive && currentLayout !== 'pinned' && setLayout('pinned');
  }, []);

  const toggleWhiteboard = (
    whiteboardActive: boolean,
    triggerEvent: boolean,
  ) => {
    if (whiteboardActive) {
      leaveWhiteboardRoom();
      setLayout('grid');
      triggerEvent &&
        customEvents.send(
          EventNames.WHITEBOARD_ACTIVE,
          JSON.stringify({status: false}),
          PersistanceLevel.Session,
        );
    } else {
      joinWhiteboardRoom();
      setLayout('pinned');
      triggerEvent &&
        customEvents.send(
          EventNames.WHITEBOARD_ACTIVE,
          JSON.stringify({status: true}),
          PersistanceLevel.Session,
        );
    }
  };
  const disabled =
    !isHost ||
    whiteboardRoomState === RoomPhase.Connecting ||
    whiteboardRoomState === RoomPhase.Disconnecting;
  return (
    <ToolbarItem>
      <IconButton
        hoverEffect={disabled ? false : true}
        iconProps={{
          iconBackgroundColor: whiteboardActive
            ? $config.PRIMARY_ACTION_BRAND_COLOR
            : '',
          base64: true,
          base64TintColor: whiteboardActive
            ? $config.SECONDARY_ACTION_COLOR
            : $config.SEMANTIC_ERROR,
          //@ts-ignore
          name: 'white-board',
          iconSize: 26,
        }}
        btnTextProps={{
          textColor: $config.FONT_COLOR,
          text: whiteboardActive ? 'Whiteboard On' : 'Whiteboard Off',
        }}
        onPress={() => isHost && toggleWhiteboard(whiteboardActive, true)}
        disabled={disabled}
      />
    </ToolbarItem>
  );
};
export default WhiteboardButton;
