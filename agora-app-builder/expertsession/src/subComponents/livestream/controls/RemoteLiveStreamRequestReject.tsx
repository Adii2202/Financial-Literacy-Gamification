import React, {useContext} from 'react';
import {View} from 'react-native';
import {PropsContext, UidType} from '../../../../agora-rn-uikit';
import LiveStreamContext from '../../../components/livestream';
import TertiaryButton from '../../../atoms/TertiaryButton';
import Toast from '../../../../react-native-toast-message';
import ThemeConfig from '../../../theme';
import {useString} from '../../../utils/useString';
import {peoplePanelLivestreamingDenyBtnText} from '../../../language/default-labels/videoCallScreenLabels';

interface RemoteLiveStreamControlProps {
  uid: UidType;
  toastId: number;
}

const RemoteLiveStreamRequestReject = (props: RemoteLiveStreamControlProps) => {
  const {uid, toastId} = props;
  const {hostRejectsRequestOfUID} = useContext(LiveStreamContext);
  const denyBtntext = useString(peoplePanelLivestreamingDenyBtnText)();
  return (
    <TertiaryButton
      containerStyle={{
        minWidth: 'auto',
        paddingHorizontal: 13,
        paddingVertical: 7,
        borderRadius: 4,
      }}
      textStyle={{
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 12,
        fontFamily: ThemeConfig.FontFamily.sansPro,
        textTransform: 'capitalize',
      }}
      disabled={!uid}
      onPress={() => {
        //Hiding the toast if its get rejected in the participant panel
        if (Toast.getToastId() === toastId) {
          Toast.hide();
        }
        hostRejectsRequestOfUID(uid);
      }}
      text={denyBtntext}
    />
  );
};

export default RemoteLiveStreamRequestReject;
