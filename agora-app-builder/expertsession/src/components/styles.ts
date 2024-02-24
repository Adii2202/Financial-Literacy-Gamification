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
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import ThemeConfig from '../theme';
import {isWebInternal} from '../utils/common';

const styles = {
  temp: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    borderWidth: 0,
  },
  bottomBar: {
    flex: isWebInternal() ? 1.3 : 1.6,
    paddingHorizontal: isWebInternal() ? '20%' : '1%',
    backgroundColor:
      $config.SECONDARY_ACTION_COLOR + hexadecimalTransparency['80%'],
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative',
    margin: 0,
    bottom: 0,
  },
  localButton: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheetButton: {
    width: 25,
    height: 25,
  },
  localButtonSmall: {
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  localButtonText: {
    fontFamily: 'Source Sans Pro',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
  localButtonWithoutBG: {
    borderRadius: 23,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderWidth: 0,
    width: 40,
    height: 40,
    padding: 3,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButton: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  endCall: {
    width: 20,
    height: 20,
  },
  endCallContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: $config.SEMANTIC_ERROR,
    borderRadius: 8,
  },
  endCallText: {
    color: $config.PRIMARY_ACTION_TEXT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '700',
  },
  remoteButton: {
    width: 25,
    height: 25,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginHorizontal: 0,
    backgroundColor: $config.SECONDARY_ACTION_COLOR, //'#fff',
  },
  liveStreamHostControlBtns: {
    width: 20,
    height: 20,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    marginHorizontal: 0,
    backgroundColor: $config.SECONDARY_ACTION_COLOR,
  },
  minCloseBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 25,
    height: 25,
    borderRadius: 0,
    position: 'absolute',
    right: 5,
    top: 5,
  },
};

export default styles;
