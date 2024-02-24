import React from 'react';
import {Text} from 'react-native';
import ScreenshareParticipants from './ScreenshareParticipants';
import Participant from './Participant';
import {useString} from '../../utils/useString';
import {ContentInterface, UidType, useLocalUid} from '../../../agora-rn-uikit';
import {useRoomInfo, useContent} from 'customization-api';
import Spacer from '../../atoms/Spacer';
import {useVideoMeetingData} from '../contexts/VideoMeetingDataContext';
import {useScreenContext} from '../contexts/ScreenShareContext';
import hexadecimalTransparency from '../../utils/hexadecimalTransparency';
import {videoRoomUserFallbackText} from '../../language/default-labels/videoCallScreenLabels';

export default function AllHostParticipants(props: any) {
  const localUid = useLocalUid();
  const {screenShareData} = useScreenContext();
  const remoteUserDefaultLabel = useString(videoRoomUserFallbackText)();
  const {defaultContent} = useContent();
  const getParticipantName = (uid: UidType) => {
    return defaultContent[uid]?.name || remoteUserDefaultLabel;
  };
  const {hostUids} = useVideoMeetingData();
  const {
    data: {isHost},
  } = useRoomInfo();
  const {
    isMobile = false,
    handleClose,
    updateActionSheet,
    uids,
    emptyMessage,
  } = props;

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
          <Spacer size={4} />
          {/* User should see his name first */}
          {uids.filter(uid => uid === localUid).length > 0 ? (
            <>
              <Participant
                isLocal={true}
                isAudienceUser={false}
                name={getParticipantName(localUid)}
                user={defaultContent[localUid]}
                showControls={true}
                isHostUser={hostUids.indexOf(localUid) !== -1}
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
          {/* Others Users in the call */}
          {uids
            .filter(
              uid => uid !== localUid && defaultContent[uid].type === 'rtc',
            )
            .map(
              uid => (
                // defaultContent[uid]?.type === 'screenshare' ? (
                //   <ScreenshareParticipants
                //     name={getParticipantName(uid)}
                //     key={uid}
                //   />
                // ) : (
                <>
                  <Participant
                    isLocal={false}
                    isAudienceUser={false}
                    name={getParticipantName(uid)}
                    user={defaultContent[uid]}
                    showControls={defaultContent[uid]?.type === 'rtc' && isHost}
                    isHostUser={hostUids.indexOf(uid) !== -1}
                    key={uid}
                    isMobile={isMobile}
                    handleClose={handleClose}
                    updateActionSheet={updateActionSheet}
                  />
                  {renderScreenShare(defaultContent[uid])}
                </>
              ),
              //),
            )}
        </>
      )}
    </>
  );
}
