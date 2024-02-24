import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

import Icon from '../icon';
import { icons } from '../../assets';
import { stylePropType } from '../../utils/prop-types';
import styles from './styles';

function BaseToast({
  leadingIcon,
  trailingIcon,
  text1,
  text2,
  onPress,
  style,
  contentContainerStyle,
  text1Style,
  text2Style,
  activeOpacity,
  text1NumberOfLines,
  text2NumberOfLines,
  primaryBtn,
  secondaryBtn
}) {
  return (
    <TouchableOpacity
      testID='rootView'
      style={[styles.base, style]}
      onPress={onPress}
      activeOpacity={onPress ? activeOpacity : 1}>
      <View
        testID='contentContainer'
        style={[styles.contentContainer, contentContainerStyle]}>
        {(text1 || text1?.length > 0) && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
            {leadingIcon ? leadingIcon : <></>}

            <Text
              testID='text1'
              style={[styles.text1, text1Style]}
              numberOfLines={text1NumberOfLines}>
              {text1}
            </Text>
          </View>
        )}
        {(text2 || text2?.length > 0) && (
          <Text
            testID='text2'
            style={[styles.text2, text2Style]}
            numberOfLines={text2NumberOfLines}>
            {text2}
          </Text>
        )}
        {primaryBtn || secondaryBtn ? (
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 16
            }}>
            {primaryBtn ? primaryBtn : <></>}
            {secondaryBtn ? secondaryBtn : <></>}
          </View>
        ) : (
          <></>
        )}
      </View>
      {trailingIcon ? trailingIcon : <></>}
    </TouchableOpacity>
  );
}

BaseToast.propTypes = {
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  text1: PropTypes.string,
  text2: PropTypes.string,
  onPress: PropTypes.func,
  style: stylePropType,
  contentContainerStyle: stylePropType,
  text1Style: stylePropType,
  text2Style: stylePropType,
  activeOpacity: PropTypes.number,
  text1NumberOfLines: PropTypes.number,
  text2NumberOfLines: PropTypes.number
};

BaseToast.defaultProps = {
  leadingIcon: null,
  trailingIcon: null,
  leadingIconName: null,
  text1: undefined,
  text2: undefined,
  onPress: undefined,
  style: undefined,
  contentContainerStyle: undefined,
  text1Style: undefined,
  text2Style: undefined,
  activeOpacity: 0.8,
  text1NumberOfLines: 1,
  text2NumberOfLines: 2
};

export default BaseToast;
