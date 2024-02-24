import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { stylePropType } from '../utils/prop-types';
import styles from './base/styles';
import Checkbox from '../../../src/subComponents/Checkbox';
import PrimaryButton from '../../../src/atoms/PrimaryButton';
import TertiaryButton from '../../../src/atoms/TertiaryButton';

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
  subTextStyle,
  activeOpacity,
  text1NumberOfLines,
  text2NumberOfLines,
  primaryBtn,
  secondaryBtn,
  checkbox
}) {
  const [checked, setChecked] = useState(false);

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
              justifyContent: 'space-between'
            }}>
            <View
              style={{
                flexDirection: 'row',
                flex: 1
              }}>
              {leadingIcon ? leadingIcon : <></>}
              <Text
                testID='text1'
                style={[styles.text1, text1Style]}
                numberOfLines={text1NumberOfLines}>
                {text1}
              </Text>
            </View>
            <View style={{ justifyContent: 'flex-start', alignSelf: 'center' }}>
              {trailingIcon ? trailingIcon : <></>}
            </View>
          </View>
        )}
        {(text2 || text2?.length > 0) && (
          <View>
            <Text
              testID='text2'
              style={[styles.text2, text2Style]}
              numberOfLines={text2NumberOfLines}>
              {text2}
            </Text>
          </View>
        )}
        {checkbox && (
          <Pressable
            style={{
              flex: 1,
              flexDirection: 'row',
              paddingTop: 12
            }}
            onPress={() => {
              setChecked((e) => !e);
            }}>
            <Checkbox
              {...checkbox}
              value={checked}
              onValueChange={setChecked}
              style={{
                marginRight: 8
              }}
            />
            <Text style={subTextStyle}>{checkbox.text}</Text>
          </Pressable>
        )}
        {primaryBtn || secondaryBtn ? (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 16
            }}>
            {primaryBtn && (
              <PrimaryButton
                textStyle={{
                  fontWeight: '600',
                  fontSize: 14,
                  lineHeight: 14,
                  paddingLeft: 0
                }}
                containerStyle={{
                  height: 32,
                  borderRadius: 4,
                  paddingVertical: 9,
                  paddingHorizontal: 20,
                  minWidth: 'unset'
                }}
                {...primaryBtn}
                onPress={(e) => {
                  primaryBtn.onPress(checked, e);
                  setChecked(false);
                }}
              />
            )}
            {secondaryBtn && (
              <TertiaryButton
                textStyle={{
                  fontWeight: '600',
                  fontSize: 14,
                  paddingLeft: 0,
                  lineHeight: 14
                }}
                containerStyle={{
                  height: 32,
                  marginLeft: 12,
                  paddingVertical: 9,
                  paddingHorizontal: 20
                }}
                {...secondaryBtn}
                onPress={(e) => {
                  secondaryBtn.onPress(checked, e);
                  setChecked(false);
                }}
              />
            )}
          </View>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  );
}

BaseToast.propTypes = {
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  text1: PropTypes.string,
  text2: PropTypes.string || PropTypes.element || PropTypes.any,
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
