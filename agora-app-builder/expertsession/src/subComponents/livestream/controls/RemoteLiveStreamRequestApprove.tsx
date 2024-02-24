import React, {useContext} from 'react';
import {View} from 'react-native';
import {PropsContext, UidType} from '../../../../agora-rn-uikit';
import LiveStreamContext from '../../../components/livestream';
import PrimaryButton from '../../../atoms/PrimaryButton';
import ThemeConfig from '../../../theme';
import Toast from '../../../../react-native-toast-message';
import {useString} from '../../../utils/useString';
import {peoplePanelLivestreamingApprovalBtnText} from '../../../language/default-labels/videoCallScreenLabels';

export interface RemoteLiveStreamControlProps {
  uid: UidType;
  toastId: number;
}

const RemoteLiveStreamRequestApprove = (
  props: RemoteLiveStreamControlProps,
) => {
  const {uid, toastId} = props;
  const {hostApprovesRequestOfUID} = useContext(LiveStreamContext);
  const btnText = useString(peoplePanelLivestreamingApprovalBtnText)();
  return (
    <View>
      <PrimaryButton
        containerStyle={{
          minWidth: 'auto',
          paddingHorizontal: 13,
          paddingVertical: 8,
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
        text={btnText}
        onPress={() => {
          //Hiding the toast if its get approved in the participant panel
          if (Toast.getToastId() === toastId) {
            Toast.hide();
          }
          hostApprovesRequestOfUID(uid);
        }}
      />
    </View>
  );
};

export default RemoteLiveStreamRequestApprove;
