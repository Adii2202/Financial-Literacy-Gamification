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
import {UidType} from '../../agora-rn-uikit';
import {useLiveStreamDataContext} from '../components/contexts/LiveStreamDataContext';
import {useVideoMeetingData} from '../components/contexts/VideoMeetingDataContext';

/**
 * Returns a function that checks whether the given uid is a host and returns true/false
 * @returns function
 */
function useIsHost() {
  const {hostUids: liveStreamHostUids} = useLiveStreamDataContext();
  const {hostUids: videoMeetingHostUids} = useVideoMeetingData();
  const isHost = (uid: UidType) => {
    const hostUidsData = $config.EVENT_MODE
      ? liveStreamHostUids
      : videoMeetingHostUids;
    return hostUidsData.filter((hostId) => hostId === uid).length
      ? true
      : false;
  };
  return isHost;
}

export default useIsHost;
