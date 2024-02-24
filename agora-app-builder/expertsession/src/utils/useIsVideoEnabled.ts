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
import {useContent} from 'customization-api';
import {UidType, ToggleState} from '../../agora-rn-uikit';

/**
 * Returns a function that checks the video state for a given uid and returns true/false
 * @returns function
 */
function useIsVideoEnabled() {
  const {defaultContent} = useContent();

  /**
   *
   * @param uid UidType
   * @returns boolean
   */
  const isVideoEnabled = (uid: UidType): boolean =>
    defaultContent[uid]?.video === ToggleState.enabled;

  return isVideoEnabled;
}
export default useIsVideoEnabled;
