import React, {useContext} from 'react';
import {View} from 'react-native';
import RemoteLiveStreamApprovedRequestRecall from './controls/RemoteLiveStreamApprovedRequestRecall';
import LiveStreamContext, {RaiseHandValue} from '../../components/livestream';
import {ClientRole} from '../../../agora-rn-uikit';

const ApprovedLiveStreamControlsView = (props: {
  uid: number;
  p_styles: any;
}) => {
  const {uid, p_styles} = props;
  const {raiseHandList} = useContext(LiveStreamContext);

  if (
    raiseHandList[uid]?.raised === RaiseHandValue.TRUE &&
    raiseHandList[uid]?.role == ClientRole.Broadcaster
  ) {
    return (
      <View style={[p_styles.actionBtnIcon, {marginRight: 10}]}>
        <RemoteLiveStreamApprovedRequestRecall uid={uid} />
      </View>
    );
  }
  return <></>;
};

export default ApprovedLiveStreamControlsView;
