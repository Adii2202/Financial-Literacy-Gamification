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
import React, {useState, useContext} from 'react';
import {Platform} from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import AppWrapper from './AppWrapper';
import {
  RoomInfoContextInterface,
  RoomInfoDefaultValue,
  RoomInfoProvider,
} from './components/room-info/useRoomInfo';
import {SetRoomInfoProvider} from './components/room-info/useSetRoomInfo';
import {ShareLinkProvider} from './components/useShareLink';
import AppRoutes from './AppRoutes';

// hook can't be used in the outside react function calls. so directly checking the platform.
if (Platform.OS === 'ios') {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableAutoToolbar(false);
  KeyboardManager.setShouldShowToolbarPlaceholder(false);
  KeyboardManager.setShouldResignOnTouchOutside(true);
}

//Extending the UI Kit Type defintion to add custom attribute to render interface
declare module 'agora-rn-uikit' {
  // interface DefaultContentInterface {
  //   name: string;
  //   screenUid: number;
  //   offline: boolean;
  //   lastMessageTimeStamp: number;
  // }
  // interface RtcPropsInterface {
  //   screenShareUid: number;
  //   screenShareToken?: string;
  // }
}

const App: React.FC = () => {
  //commented for v1 release
  //const CustomRoutes = useCustomization((data) => data?.customRoutes);
  // const RenderCustomRoutes = () => {
  //   try {
  //     return (
  //       CustomRoutes &&
  //       Array.isArray(CustomRoutes) &&
  //       CustomRoutes.length &&
  //       CustomRoutes?.map((item: CustomRoutesInterface, i: number) => {
  //         let RouteComponent = item?.isPrivateRoute ? PrivateRoute : Route;
  //         return (
  //           <RouteComponent
  //             path={CUSTOM_ROUTES_PREFIX + item.path}
  //             exact={item.exact}
  //             key={i}
  //             failureRedirectTo={
  //               item.failureRedirectTo ? item.failureRedirectTo : '/'
  //             }
  //             {...item.routeProps}>
  //             <item.component {...item.componentProps} />
  //           </RouteComponent>
  //         );
  //       })
  //     );
  //   } catch (error) {
  //     console.error('Error on rendering the custom routes');
  //     return null;
  //   }
  // };
  const [roomInfo, setRoomInfo] =
    useState<RoomInfoContextInterface>(RoomInfoDefaultValue);

  return (
    <AppWrapper>
      <SetRoomInfoProvider value={{setRoomInfo}}>
        <RoomInfoProvider value={{...roomInfo}}>
          <ShareLinkProvider>
            <AppRoutes />
          </ShareLinkProvider>
        </RoomInfoProvider>
      </SetRoomInfoProvider>
    </AppWrapper>
  );
};

export default App;
