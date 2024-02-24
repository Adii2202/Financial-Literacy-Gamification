import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useContent} from 'customization-api';
import {filterObject} from '../../utils';
import Participant from './Participant';
import ParticipantSectionTitle from './ParticipantSectionTitle';
import {useWaitingRoomContext} from '../contexts/WaitingRoomContext';
import {useString} from '../../utils/useString';
import {
  peoplePanelWaitingText,
  peoplePanelWantToJoinText,
  videoRoomUserFallbackText,
} from '../../language/default-labels/videoCallScreenLabels';

const WaitingRoomParticipants = props => {
  const wanttojoinLabel = useString(peoplePanelWantToJoinText)();
  const waitingLabel = useString(peoplePanelWaitingText)();
  const {defaultContent} = useContent();
  const [showWaitingRoomSection, setShowWaitingRoomSection] = useState(true);
  const {isMobile = false, handleClose, updateActionSheet} = props;
  const WaitingRoomParticipantsLabel = $config.EVENT_MODE
    ? wanttojoinLabel
    : waitingLabel;

  const videoRoomUserFallbackTextLabel = useString(videoRoomUserFallbackText)();

  const getParticipantName = uid => {
    return defaultContent[uid]?.name || videoRoomUserFallbackTextLabel;
  };

  const getScreenShareUid = uid => {
    return defaultContent[uid]?.screenUid || '';
  };

  const {waitingRoomUids} = useWaitingRoomContext();

  return (
    <>
      <ParticipantSectionTitle
        title={WaitingRoomParticipantsLabel}
        count={waitingRoomUids.length}
        isOpen={showWaitingRoomSection}
        onPress={() => setShowWaitingRoomSection(!showWaitingRoomSection)}
      />
      {showWaitingRoomSection ? (
        <View>
          {waitingRoomUids.map(uid => (
            <Participant
              isLocal={false}
              name={getParticipantName(uid)}
              user={defaultContent[uid]}
              showControls={false}
              isAudienceUser={true}
              isHostUser={false}
              key={uid}
              isMobile={isMobile}
              handleClose={handleClose}
              updateActionSheet={updateActionSheet}
              waitingRoomUser={true}
              uid={uid}
              screenUid={getScreenShareUid(uid)}
            />
          ))}
        </View>
      ) : (
        <></>
      )}
    </>
  );
};

export default WaitingRoomParticipants;

const styles = StyleSheet.create({});
