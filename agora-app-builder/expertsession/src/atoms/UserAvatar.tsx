import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ThemeConfig from '../theme';
import {isWeb} from '../utils/common';

function getInitials(name: string) {
  if (name && name?.length) {
    return name[0].toUpperCase();
  }
  return 'U';
}

const UserAvatar = ({name, containerStyle, textStyle}) => {
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
          {getInitials(name)}
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

export default UserAvatar;

const styles = StyleSheet.create({});
