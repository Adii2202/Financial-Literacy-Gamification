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
import {useLiveStreamDataContext} from '../components/contexts/LiveStreamDataContext';
import {UidType} from '../../agora-rn-uikit';
import {useVideoMeetingData} from '../components/contexts/VideoMeetingDataContext';

/**
 * Returns a function that checks whether the given uid is an attendee and returns true/false
 * @returns function
 */
function useIsAttendee() {
  const {audienceUids: lsAudienceUids} = useLiveStreamDataContext();
  const {attendeeUids: vmAudienceUids} = useVideoMeetingData();
  const isAttendee = (uid: UidType) => {
    const attUidsData = $config.EVENT_MODE ? lsAudienceUids : vmAudienceUids;
    return attUidsData.filter((attId) => attId === uid).length ? true : false;
  };
  return isAttendee;
}

export default useIsAttendee;
