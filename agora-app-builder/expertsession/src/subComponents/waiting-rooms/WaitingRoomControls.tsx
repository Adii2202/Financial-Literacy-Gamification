import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useContext} from 'react';
import TertiaryButton from '../../atoms/TertiaryButton';
import PrimaryButton from '../../atoms/PrimaryButton';
import ThemeConfig from '../../theme';
import useWaitingRoomAPI from './useWaitingRoomAPI';
import {DispatchContext, useLocalUid} from '../../../agora-rn-uikit';
import events, {PersistanceLevel} from '../../rtm-events-api';
import {EventNames} from '../../rtm-events';
import Toast from '../../../react-native-toast-message';
import {useWaitingRoomContext} from '../../../src/components/contexts/WaitingRoomContext';
import {useString} from '../../../src/utils/useString';
import {
  peoplePanelWaitingRoomRequestApprovalBtnTxt,
  peoplePanelWaitingRoomRequestDenyBtnTxt,
} from '../../../src/language/default-labels/videoCallScreenLabels';

const WaitingRoomButton = props => {
  const {uid, screenUid, isAccept} = props;
  const {approval} = useWaitingRoomAPI();
  const localUid = useLocalUid();
  const {dispatch} = useContext(DispatchContext);
  const {waitingRoomRef} = useWaitingRoomContext();
  const admintext = useString(peoplePanelWaitingRoomRequestApprovalBtnTxt)();
  const denytext = useString(peoplePanelWaitingRoomRequestDenyBtnTxt)();
  const buttonText = isAccept ? admintext : denytext;

  const handleButtonClick = () => {
    const approved = isAccept ? true : false;

    const res = approval({
      host_uid: localUid,
      attendee_uid: uid,
      attendee_screenshare_uid: screenUid,
      approved: approved,
    });

    // hide Toast if approve/reject from panel
    if (Toast.getToastId() === uid) {
      Toast.hide();
    }

    dispatch({
      type: 'UpdateRenderList',
      value: [uid, {isInWaitingRoom: false}],
    });

    if (waitingRoomRef.current) {
      waitingRoomRef.current[uid] = approved ? 'APPROVED' : 'REJECTED';
    }

    events.send(
      EventNames.WAITING_ROOM_STATUS_UPDATE,
      JSON.stringify({attendee_uid: uid, approved: isAccept}),
      PersistanceLevel.None,
    );
  };

  const ButtonComponent = isAccept ? PrimaryButton : TertiaryButton;
  const buttonStyles = {
    minWidth: 'auto',
    borderRadius: ThemeConfig.BorderRadius.small,
    paddingHorizontal: 13,
    paddingVertical: isAccept ? 8 : 7,
  };

  return (
    <View style={{flex: 1}}>
      <ButtonComponent
        containerStyle={buttonStyles as ViewStyle}
        textStyle={{
          fontWeight: '600',
          fontSize: 12,
          lineHeight: 12,
          fontFamily: ThemeConfig.FontFamily.sansPro,
          textTransform: 'capitalize',
        }}
        text={buttonText}
        onPress={handleButtonClick}
      />
    </View>
  );
};

export default WaitingRoomButton;
