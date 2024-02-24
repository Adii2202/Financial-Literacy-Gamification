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
import React from 'react';
import {Text} from 'react-native';
import TextWithToolTipNative from './TextWithTooltip.native';
import isMobileOrTablet from '../utils/isMobileOrTablet';
/**
 * Text with tooltip
 * web - used title attribute to show the tooltip
 */
const TextWithToolTip = (props: {
  touchable?: boolean;
  value: string;
  style: object;
}) => {
  return (
    <div style={style.containerStyle} title={props.value}>
      <Text numberOfLines={1} textBreakStrategy="simple" style={[props.style]}>
        {props.value}
      </Text>
    </div>
  );
};

const style = {
  containerStyle: {
    display: 'flex',
  },
};
/**
 * Web and Desktop : using the TextWithToolTip - which have the browser tooltip
 * Mobile and Mobile Web : using the TextWithToolTipNative - which have the custom tooltip using modal
 */
export default isMobileOrTablet() ? TextWithToolTipNative : TextWithToolTip;
