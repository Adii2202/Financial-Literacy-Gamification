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
import React, {useContext} from 'react';
import {Router} from './components/Router';
import Navigation from './components/Navigation';
import {StorageProvider} from './components/StorageContext';
import GraphQLProvider from './components/GraphQLProvider';
import {SessionProvider} from './components/SessionContext';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
} from 'react-native';
import ColorConfigure from './components/ColorConfigure';
import {isValidReactComponent} from './utils/common';
import DimensionProvider from './components/dimension/DimensionProvider';
import Error from './components/common/Error';
import {ErrorProvider} from './components/common';
import {useCustomization} from 'customization-implementation';
import {LanguageProvider} from './language/useLanguage';
import {AuthProvider} from './auth/AuthProvider';
import {PropsConsumer} from 'agora-rn-uikit';
import ToastComponent from './components/ToastComponent';
import {ToastContext, ToastProvider} from './components/useToast';
import {SdkApiContext} from './components/SdkApiContext';
import isSDK from './utils/isSDK';

interface AppWrapperProps {
  children: React.ReactNode;
}

const ImageBackgroundComp = (props: {
  bg?: string;
  color?: string;
  children?: React.ReactNode;
}) => {
  if (props?.bg) {
    return (
      <ImageBackground
        source={{uri: props.bg}}
        style={{flex: 1}}
        resizeMode={'cover'}>
        {props.children}
      </ImageBackground>
    );
  } else if (props?.color) {
    return (
      <View style={{flex: 1, backgroundColor: props.color}}>
        {props.children}
      </View>
    );
  } else {
    return <>{props.children}</>;
  }
};

const AppWrapper = (props: AppWrapperProps) => {
  const AppRoot = useCustomization(data => {
    if (
      data?.components?.appRoot &&
      isValidReactComponent(data?.components?.appRoot)
    ) {
      return data.components.appRoot;
    }
    return React.Fragment;
  });

  const {join: SdkJoinState} = useContext(SdkApiContext);

  return (
    <AppRoot>
      <ImageBackgroundComp bg={$config.BG} color={$config.BACKGROUND_COLOR}>
        <SafeAreaView
          // @ts-ignore textAlign not supported by TS definitions but is applied to web regardless
          style={[{flex: 1}, Platform.select({web: {textAlign: 'left'}})]}>
          <StatusBar hidden={true} />
          <StorageProvider>
            <LanguageProvider>
              <ToastProvider>
                <ToastContext.Consumer>
                  {({isActionSheetVisible}) => {
                    return !isActionSheetVisible ? <ToastComponent /> : null;
                  }}
                </ToastContext.Consumer>
                <GraphQLProvider>
                  <Router
                    /*@ts-ignore Router will be memory Router in sdk*/
                    initialEntries={[
                      //@ts-ignore
                      isSDK && SdkJoinState.phrase
                        ? //@ts-ignore
                          `/${SdkJoinState.phrase}`
                        : '',
                    ]}>
                    <AuthProvider>
                      <SessionProvider>
                        <ColorConfigure>
                          <DimensionProvider>
                            <ErrorProvider>
                              <Error />
                              <Navigation />
                              {props.children}
                            </ErrorProvider>
                          </DimensionProvider>
                        </ColorConfigure>
                      </SessionProvider>
                    </AuthProvider>
                  </Router>
                </GraphQLProvider>
              </ToastProvider>
            </LanguageProvider>
          </StorageProvider>
        </SafeAreaView>
      </ImageBackgroundComp>
    </AppRoot>
  );
  // return <div> hello world</div>; {/* isn't join:phrase redundant now, also can we remove joinStore */}
};

export default AppWrapper;
