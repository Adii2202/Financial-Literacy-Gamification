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
import {useScreenContext} from '../components/contexts/ScreenShareContext';

/**
 * This hook will return the function which take UID and return true if screensharing active on the UID
 * @returns function
 */
function useIsScreenShare() {
  const {screenShareData} = useScreenContext();
  /**
   *
   * @param uid number | string
   * @returns boolean
   */
  const isScreenShare = (uid: UidType): boolean =>
    screenShareData[uid]?.isActive ? true : false;
  return isScreenShare;
}

export default useIsScreenShare;
