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
import Join from './pages/Join';
import VideoCall from './pages/VideoCall';
import Create from './pages/Create';
import {Route, Switch, Redirect} from './components/Router';
import AuthRoute from './auth/AuthRoute';
import {IDPAuth} from './auth/IDPAuth';
import {Text} from 'react-native';

function AppRoutes() {
  return (
    <Switch>
      <Route exact path={'/'}>
        <Redirect to={'/create'} />
      </Route>
      <Route exact path={'/authorize/:token?'}>
        <IDPAuth />
      </Route>
      <AuthRoute exact path={'/join'}>
        <Join />
      </AuthRoute>
      <AuthRoute exact path={'/create'}>
        <Create />
      </AuthRoute>
      <AuthRoute path={'/:phrase'}>
        <VideoCall />
      </AuthRoute>
      <Route path="*">
        <Text>Page not found</Text>
      </Route>
    </Switch>
  );
}
export default AppRoutes;
