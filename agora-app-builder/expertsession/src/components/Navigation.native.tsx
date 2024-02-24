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
import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import {useHistory} from './Router.native';
import {BackButton} from './Router.native';

const processUrl = (url: string): string => {
  return url
    .replace(`${$config.PRODUCT_ID.toLowerCase()}://my-host`, '')
    .replace($config.FRONTEND_ENDPOINT, '');
};

const Navigation = () => {
  //moved deeplink handling into AuthProvider
  return (
    <>
      <BackButton />
    </>
  );
};

export default Navigation;
