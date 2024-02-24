import {Text, View} from 'react-native';
import React from 'react';
import ThemeConfig from '../theme';
import {isWeb} from '../utils/common';

const Avatar = ({name, containerStyle, textStyle}) => {
  return (
    <View
      style={[
        containerStyle,
        {
          alignSelf: 'center',
          alignContent: 'center',
          justifyContent: 'center',
        },
      ]}>
      <PlatformWrapper>
        <Text
          style={[
            textStyle,
            {
              fontFamily: ThemeConfig.FontFamily.sansPro,
              alignSelf: 'center',
              textAlign: 'center',
            },
          ]}>
          {name}
        </Text>
      </PlatformWrapper>
    </View>
  );
};

const PlatformWrapper = ({children}) => {
  return isWeb() ? (
    <div
      style={{
        userSelect: 'none',
        MozUserSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        alignSelf: 'center',
      }}>
      {children}
    </div>
  ) : (
    <>{children}</>
  );
};

export default Avatar;
