import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RemoteLiveStreamRequestApprove from './controls/RemoteLiveStreamRequestApprove';
import RemoteLiveStreamRequestReject from './controls/RemoteLiveStreamRequestReject';
import LiveStreamContext, {RaiseHandValue} from '../../components/livestream';
import {filterObject} from '../../utils/index';
import ParticipantSectionTitle from '../../components/participants/ParticipantSectionTitle';
import {useString} from '../../utils/useString';
import {ClientRole} from '../../../agora-rn-uikit';
import {useContent} from 'customization-api';
import UserAvatar from '../../atoms/UserAvatar';
import Spacer from '../../atoms/Spacer';
import {
  peoplePanelStreamingRequestSectionHeader,
  peoplePanelUserNotFoundLabel,
} from '../../language/default-labels/videoCallScreenLabels';

const CurrentLiveStreamRequestsView = (props: any) => {
  const noUserFoundLabel = useString(peoplePanelUserNotFoundLabel)();
  const raisedHandsListTitleLabel = useString(
    peoplePanelStreamingRequestSectionHeader,
  )();
  const {defaultContent} = useContent();
  const {raiseHandList, setLastCheckedRequestTimestamp} =
    useContext(LiveStreamContext);
  const [activeLiveStreamRequests, setActiveLiveStreamRequests] =
    React.useState({});

  useEffect(() => {
    setActiveLiveStreamRequests(
      filterObject(
        raiseHandList,
        ([k, v]) =>
          v?.raised === RaiseHandValue.TRUE && v?.role == ClientRole.Audience,
      ),
    );
  }, [raiseHandList]);

  React.useEffect(() => {
    // On unmount update the timestamp, if the user was already active in this view
    return () => {
      setLastCheckedRequestTimestamp(new Date().getTime());
    };
  }, []);
  const containerStyle = {
    backgroundColor: $config.VIDEO_AUDIO_TILE_AVATAR_COLOR,
    width: 36,
    height: 36,
    borderRadius: 18,
  };
  const textStyle = {
    fontSize: 12,
    fontWeight: '400',
    color: $config.CARD_LAYER_1_COLOR,
  };
  const [showRequestSection, setShowRequestSection] = useState(true);
  return (
    <>
      {Object.keys(raiseHandList).length == 0 ||
      Object.keys(activeLiveStreamRequests).length == 0 ? (
        <></>
      ) : (
        <>
          <ParticipantSectionTitle
            title={raisedHandsListTitleLabel + ' '}
            count={Object.keys(activeLiveStreamRequests).length}
            isOpen={showRequestSection}
            onPress={() => setShowRequestSection(!showRequestSection)}
          />
          {showRequestSection ? (
            Object.keys(activeLiveStreamRequests).map(
              (userUID: any, index: number) =>
                defaultContent[userUID] ? (
                  <View style={styles.container}>
                    <View style={styles.userInfoContainer}>
                      <UserAvatar
                        name={defaultContent[userUID].name}
                        containerStyle={containerStyle}
                        textStyle={textStyle}
                      />
                      <View style={{alignSelf: 'center', flex: 1}}>
                        <Text
                          style={styles.participantNameText}
                          numberOfLines={1}>
                          {defaultContent[userUID].name}
                        </Text>
                      </View>
                    </View>
                    <Spacer size={24} horizontal={true} />
                    <View style={styles.btnContainer}>
                      <RemoteLiveStreamRequestReject
                        uid={userUID}
                        toastId={raiseHandList[userUID].ts}
                      />
                      <Spacer size={8} horizontal={true} />
                      <RemoteLiveStreamRequestApprove
                        uid={userUID}
                        toastId={raiseHandList[userUID].ts}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{alignSelf: 'center'}} key={index}>
                    <Text>{noUserFoundLabel}</Text>
                  </View>
                ),
            )
          ) : (
            <Spacer size={1} />
          )}
        </>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  btnContainer: {
    //  flex: 1,
    flexDirection: 'row',
    //  justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    flex: 0.7,
    flexDirection: 'row',
  },
  participantNameText: {
    fontWeight: '400',
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    flexDirection: 'row',
    color: $config.FONT_COLOR,
    textAlign: 'left',
    marginHorizontal: 8,
  },
});

export default CurrentLiveStreamRequestsView;
