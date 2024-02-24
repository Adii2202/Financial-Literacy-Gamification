import React, {useContext} from 'react';
import {Text} from 'react-native';
import chatContext from '../ChatContext';
import {useString} from '../../utils/useString';
import {
  ContentInterface,
  UidType,
  useRoomInfo,
  useContent,
} from 'customization-api';
import Participant from './Participant';
import {useLiveStreamDataContext} from '../contexts/LiveStreamDataContext';
import {useScreenContext} from '../contexts/ScreenShareContext';
import ScreenshareParticipants from './ScreenshareParticipants';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import {videoRoomUserFallbackText} from '../../language/default-labels/videoCallScreenLabels';

const AllAudienceParticipants = (props: any) => {
  const {screenShareData} = useScreenContext();
  const {
    uids,
    isMobile = false,
    handleClose,
    updateActionSheet,
    emptyMessage,
  } = props;
  const {defaultContent} = useContent();
  const {localUid} = useContext(chatContext);
  const remoteUserDefaultLabel = useString(videoRoomUserFallbackText)();
  const getParticipantName = (uid: UidType) => {
    return defaultContent[uid]?.name || remoteUserDefaultLabel;
  };
  const {
    data: {isHost},
  } = useRoomInfo();
  const {hostUids} = useLiveStreamDataContext();

  const renderScreenShare = (user: ContentInterface) => {
    if (screenShareData[user.screenUid]?.isActive) {
      return (
        <ScreenshareParticipants
          user={defaultContent[user.screenUid]}
          key={user.screenUid}
        />
      );
    } else {
      <></>;
    }
  };

  return (
    <>
      {uids.length == 0 ? (
        emptyMessage ? (
          <Text
            style={{
              alignSelf: 'center',
              paddingVertical: 20,
              fontFamily: 'Source Sans Pro',
              fontWeight: '400',
              fontSize: 14,
              color: $config.FONT_COLOR + hexadecimalTransparency['40%'],
            }}>
            {emptyMessage}
          </Text>
        ) : (
          <></>
        )
      ) : (
        <>
          {/**Audience should see his name first */}
          {uids.filter(i => i === localUid).length ? (
            <>
              <Participant
                isLocal={true}
                name={getParticipantName(localUid)}
                user={defaultContent[localUid]}
                isAudienceUser={
                  $config.EVENT_MODE && hostUids.indexOf(localUid) !== -1
                    ? false
                    : true
                }
                showControls={
                  (defaultContent[localUid]?.type === 'rtc' && isHost) ||
                  (defaultContent[localUid]?.type === 'rtc' &&
                    $config.EVENT_MODE &&
                    hostUids.indexOf(localUid) !== -1)
                    ? true
                    : false
                }
                isHostUser={false}
                key={localUid}
                isMobile={isMobile}
                handleClose={handleClose}
                updateActionSheet={updateActionSheet}
              />
              {renderScreenShare(defaultContent[localUid])}
            </>
          ) : (
            <></>
          )}
          {/* Others Audience in the call */}
          {uids
            .filter(i => i !== localUid)
            .map((uid: any, index: number) => (
              <>
                <Participant
                  isLocal={false}
                  name={getParticipantName(uid)}
                  user={defaultContent[uid]}
                  showControls={defaultContent[uid]?.type === 'rtc' && isHost}
                  isAudienceUser={true}
                  isHostUser={false}
                  key={uid}
                  isMobile={isMobile}
                  handleClose={handleClose}
                  updateActionSheet={updateActionSheet}
                />
                {renderScreenShare(defaultContent[uid])}
              </>
            ))}
        </>
      )}
    </>
  );
};

export default AllAudienceParticipants;
