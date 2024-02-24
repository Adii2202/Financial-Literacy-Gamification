import React from 'react';
import IconButton from '../../../atoms/IconButton';
import {UidType} from '../../../../agora-rn-uikit';
import {LiveStreamControlMessageEnum} from '../../../components/livestream';
import events, {PersistanceLevel} from '../../../rtm-events-api';

export interface RemoteLiveStreamApprovedRequestRecallProps {
  uid: UidType;
}
const RemoteLiveStreamApprovedRequestRecall = (
  props: RemoteLiveStreamApprovedRequestRecallProps,
) => {
  return (
    //@ts-ignore
    <IconButton
      onPress={() => {
        events.send(
          LiveStreamControlMessageEnum.raiseHandRequestRejected,
          '',
          PersistanceLevel.None,
          props.uid,
        );
      }}
      // color="#FD0845"
      //todo hari
      //icon={Icons['demoteIcon']}
    />
  );
};

export default RemoteLiveStreamApprovedRequestRecall;
