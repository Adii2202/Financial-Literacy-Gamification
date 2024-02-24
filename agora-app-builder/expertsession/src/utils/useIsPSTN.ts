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
import {UidType} from '../../agora-rn-uikit';

/**
 * Returns a function that checks whether the given uid is a PSTN user and returns true/false
 * @returns function
 */
function useIsPSTN() {
  const {defaultContent} = useContent();
  /**
   *
   * @param uid number
   * @returns boolean
   */
  const isPSTN = (uid: UidType) =>
    !defaultContent[uid] && String(uid)[0] === '1' ? true : false;
  return isPSTN;
}

export default useIsPSTN;
