/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {PropsContext, ClientRole} from '../../agora-rn-uikit';
import CopyJoinInfo from '../subComponents/CopyJoinInfo';
import ParticipantSectionTitle from './participants/ParticipantSectionTitle';
import AllHostParticipants from './participants/AllHostParticipants';
import AllAudienceParticipants from './participants/AllAudienceParticipants';
import CurrentLiveStreamRequestsView from '../subComponents/livestream/CurrentLiveStreamRequestsView';
import {useString} from '../utils/useString';
import {isMobileUA, isWebInternal, useIsSmall} from '../utils/common';
import {useRoomInfo} from './room-info/useRoomInfo';
import {useLiveStreamDataContext} from './contexts/LiveStreamDataContext';
import {numFormatter} from '../utils';
import ChatContext from './ChatContext';
import {useSidePanel} from '../utils/useSidePanel';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import TertiaryButton from '../atoms/TertiaryButton';
import HostControlView from './HostControlView';
import Spacer from '../atoms/Spacer';
import IconButton from '../atoms/IconButton';
import ThemeConfig from '../theme';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import CommonStyles from './CommonStyles';
import SidePanelHeader, {
  SidePanelStyles,
} from '../subComponents/SidePanelHeader';
import {useVideoMeetingData} from './contexts/VideoMeetingDataContext';
import {useLayout, useContent} from 'customization-api';
import {getGridLayoutName} from '../pages/video-call/DefaultLayouts';
import {PeopleHeader} from '../pages/video-call/SidePanelHeader';
import useCaptionWidth from '../../src/subComponents/caption/useCaptionWidth';
import WaitingRoomParticipants from './participants/WaitingRoomParticipants';
import {
  peoplePanelAudienceSectionHeaderText,
  peoplePanelHostSectionHeaderText,
  peoplePanelInThisMeetingLabel,
  peoplePanelNoAudienceJoinedContent,
  peoplePanelNoHostJoinedContent,
  peoplePanelNoUsersJoinedContent,
} from '../../src/language/default-labels/videoCallScreenLabels';

const ParticipantView = props => {
  const {activeUids, customContent, defaultContent} = useContent();
  const {liveStreamData, audienceUids, hostUids} = useLiveStreamDataContext();
  const {
    attendeeUids: attendeeUidsVideoMeeting,
    hostUids: hostUidsVideoMeeting,
  } = useVideoMeetingData();
  const {onlineUsersCount} = useContext(ChatContext);
  const {sidePanel, setSidePanel} = useSidePanel();
  const {rtcProps} = useContext(PropsContext);
  const {showHeader = true} = props;
  const hostLabel = useString(peoplePanelHostSectionHeaderText)();
  const audienceLabel = useString(peoplePanelAudienceSectionHeaderText)();
  const meetingParticpantsLabel = useString(peoplePanelInThisMeetingLabel)();
  const noHostJoinedYet = useString(peoplePanelNoHostJoinedContent)();
  const noAudienceJoinedYet = useString(peoplePanelNoAudienceJoinedContent)();
  const noUsersJoinedYet = useString(peoplePanelNoUsersJoinedContent)();
  const {
    data: {isHost},
  } = useRoomInfo();
  const isSmall = useIsSmall();
  const [showWaitingRoomSection, setShowWaitingRoomSection] = useState(true);
  //video meeting
  const [showHostSection, setShowHostSection] = useState(true);
  const [showParticipantSection, setShowParticipantSection] = useState(true);
  const [showMeetingParticipants, setShowMeetingParticipants] = useState(true);
  //live streaming
  const [showTempHostSection, setShowTempHostSection] = useState(true);
  const [showAudienceSection, setShowAudienceSection] = useState(true);
  const {currentLayout} = useLayout();
  const {transcriptHeight} = useCaptionWidth();

  return (
    <View
      testID="videocall-participants"
      style={[
        isMobileUA()
          ? //mobile and mobile web
            CommonStyles.sidePanelContainerNative
          : isSmall()
          ? // desktop minimized
            CommonStyles.sidePanelContainerWebMinimzed
          : // desktop maximized
            CommonStyles.sidePanelContainerWeb,
        isWebInternal() && !isSmall() && currentLayout === getGridLayoutName()
          ? {marginVertical: 4}
          : {},
        //@ts-ignore
        transcriptHeight && !isMobileUA() && {height: transcriptHeight},
      ]}>
      {showHeader && <PeopleHeader />}
      {/* Waiting Room Participants */}

      <ScrollView style={[style.bodyContainer]}>
        {$config.EVENT_MODE ? (
          <>
            {
              /*Live streaming is true            
                Host and New host view */
              rtcProps?.role == ClientRole.Broadcaster &&
                (isHost ? (
                  /**
                   * Original Host
                   * a) Can view streaming requests
                   * b) Can view all hosts with remote controls
                   * c) Can admit from waiting room
                   */
                  <>
                    {/* c) Waiting Room View */}
                    {$config.ENABLE_WAITING_ROOM ? (
                      <WaitingRoomParticipants />
                    ) : (
                      <></>
                    )}
                    {/* a) Live streaming view */}

                    <CurrentLiveStreamRequestsView userList={liveStreamData} />
                    {/* b) Host view with remote controls*/}
                    <ParticipantSectionTitle
                      title={hostLabel}
                      count={hostUids.length}
                      isOpen={showHostSection}
                      onPress={() => setShowHostSection(!showHostSection)}
                    />
                    {showHostSection ? (
                      <AllHostParticipants
                        emptyMessage={noHostJoinedYet}
                        uids={hostUids}
                        isMobile={isSmall()}
                        updateActionSheet={props.updateActionSheet}
                        handleClose={props.handleClose}
                      />
                    ) : (
                      <Spacer size={1} />
                    )}
                  </>
                ) : (
                  /** New Host ( earlier was 'audience' and now is host )
                   *  a) Can view all hosts without remote controls
                   */
                  <>
                    <ParticipantSectionTitle
                      title={hostLabel}
                      count={hostUids.length}
                      isOpen={showTempHostSection}
                      onPress={() =>
                        setShowTempHostSection(!showTempHostSection)
                      }
                    />
                    {showTempHostSection ? (
                      <AllAudienceParticipants
                        emptyMessage={noHostJoinedYet}
                        uids={hostUids}
                        isMobile={isSmall()}
                        updateActionSheet={props.updateActionSheet}
                        handleClose={props.handleClose}
                      />
                    ) : (
                      <Spacer size={1} />
                    )}
                  </>
                ))
            }
            {
              /**
               *  Audience views all hosts without remote controls
               */
              rtcProps?.role == ClientRole.Audience && (
                <>
                  <ParticipantSectionTitle
                    title={hostLabel}
                    count={hostUids.length}
                    isOpen={showHostSection}
                    onPress={() => setShowHostSection(!showHostSection)}
                  />
                  {showHostSection ? (
                    <AllHostParticipants
                      emptyMessage={noHostJoinedYet}
                      uids={hostUids}
                      isMobile={isSmall()}
                      updateActionSheet={props.updateActionSheet}
                      handleClose={props.handleClose}
                    />
                  ) : (
                    <Spacer size={1} />
                  )}
                </>
              )
            }
            {
              /* Everyone can see audience */
              <>
                <ParticipantSectionTitle
                  title={audienceLabel}
                  count={audienceUids.length}
                  isOpen={showAudienceSection}
                  onPress={() => setShowAudienceSection(!showAudienceSection)}
                />
                {showAudienceSection ? (
                  <AllAudienceParticipants
                    emptyMessage={noAudienceJoinedYet}
                    uids={audienceUids}
                    isMobile={isSmall()}
                    updateActionSheet={props.updateActionSheet}
                    handleClose={props.handleClose}
                  />
                ) : (
                  <></>
                )}
              </>
            }
          </>
        ) : (
          <>
            {$config.ENABLE_WAITING_ROOM && isHost ? (
              <WaitingRoomParticipants />
            ) : (
              <></>
            )}

            <ParticipantSectionTitle
              title={meetingParticpantsLabel}
              count={onlineUsersCount}
              isOpen={showMeetingParticipants}
              onPress={() =>
                setShowMeetingParticipants(!showMeetingParticipants)
              }
            />
            {showMeetingParticipants ? (
              <AllHostParticipants
                emptyMessage={noUsersJoinedYet}
                //custom content shouldn't be shown in the participant list. so filtering the activeuids
                uids={activeUids.filter(i => !customContent[i])}
                isMobile={isSmall()}
                updateActionSheet={props.updateActionSheet}
                handleClose={props.handleClose}
              />
            ) : (
              <></>
            )}
          </>
        )}
      </ScrollView>

      {isHost && (
        <View style={style.footer}>
          <HostControlView />
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  footer: {
    width: '100%',
    padding: 12,
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $config.CARD_LAYER_2_COLOR,
  },
  bodyContainer: {
    flex: 1,
  },
});

export default ParticipantView;
