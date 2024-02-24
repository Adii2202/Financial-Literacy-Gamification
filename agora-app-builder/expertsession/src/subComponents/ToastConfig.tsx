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
// @ts-nocheck
import React from 'react';
import {Platform, TouchableOpacity, View, StyleSheet} from 'react-native';
import ThemeConfig from '../theme';
import Toast, {BaseToast} from '../../react-native-toast-message';
import CheckBoxBaseToast from '../../react-native-toast-message/src/components/checkbox';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import ImageIcon from '../atoms/ImageIcon';
import {IconsInterface} from 'src/atoms/CustomIcon';
import {autoUpdater} from 'electron';

const trailingIcon = (
  <TouchableOpacity onPress={() => Toast.hide()} style={{}}>
    <ImageIcon
      iconType="plain"
      tintColor={$config.SECONDARY_ACTION_COLOR}
      name="close"
      iconSize={24}
    />
  </TouchableOpacity>
);

const leadingIcon = (iconName: keyof IconsInterface, color: string) => {
  return (
    <View style={{marginRight: 4, alignSelf: 'center'}}>
      <ImageIcon
        iconType="plain"
        tintColor={color}
        name={iconName}
        iconSize={20}
      />
    </View>
  );
};

const warnIcon = () => {
  return (
    <View style={{marginRight: 4, alignSelf: 'center', width: 26, height: 26}}>
      <ImageIcon base64={true} iconType="plain" name={'warning'} />
    </View>
  );
};

const ToastConfig = {
  /* 
      overwrite 'success' type, 
      modifying the existing `BaseToast` component
    */
  success: ({text1, text2, leadingIconName, props, ...rest}) => (
    <BaseToast
      {...rest}
      //BaseToast is modified to have zIndex: 100
      leadingIcon={leadingIcon(
        leadingIconName ? leadingIconName : 'tick-fill',
        $config.SEMANTIC_SUCCESS,
      )}
      trailingIcon={trailingIcon}
      style={{
        borderTopColor: $config.SEMANTIC_SUCCESS,
      }}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text1={text1}
      text2={text2}
      primaryBtn={null}
      secondaryBtn={null}
    />
  ),
  error: ({text1, text2, leadingIconName, props, ...rest}) => (
    <BaseToast
      {...rest}
      //BaseToast is modified to have zIndex: 100
      leadingIcon={leadingIcon(
        leadingIconName ? leadingIconName : 'alert',
        $config.SEMANTIC_ERROR,
      )}
      trailingIcon={trailingIcon}
      style={{
        borderTopColor: $config.SEMANTIC_ERROR,
      }}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text1={text1}
      text2={text2}
      primaryBtn={null}
      secondaryBtn={null}
    />
  ),
  warn: ({text1, text2, props, ...rest}) => (
    <BaseToast
      {...rest}
      //BaseToast is modified to have zIndex: 100
      leadingIcon={warnIcon()}
      trailingIcon={trailingIcon}
      style={{
        borderTopColor: '#FFAB00',
      }}
      contentContainerStyle={styles.contentContainerStyle}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      text1={text1}
      text2={text2}
      primaryBtn={null}
      secondaryBtn={null}
    />
  ),
  info: ({
    text1,
    text2,
    props,
    primaryBtn,
    leadingIconName,
    secondaryBtn,
    ...rest
  }) => {
    return (
      <BaseToast
        {...rest}
        //BaseToast is modified to have zIndex: 100
        leadingIcon={leadingIcon(
          leadingIconName ? leadingIconName : 'info',
          $config.FONT_COLOR,
        )}
        trailingIcon={trailingIcon}
        style={{
          borderTopColor: $config.PRIMARY_ACTION_BRAND_COLOR,
        }}
        text1Style={styles.text1Style}
        text2Style={styles.text2Style}
        text1={text1}
        text2={text2}
        primaryBtn={primaryBtn ? primaryBtn : null}
        secondaryBtn={secondaryBtn ? secondaryBtn : null}
      />
    );
  },
  checked: ({
    text1,
    text2,
    props,
    primaryBtn,
    secondaryBtn,
    checkbox,
    leadingIconName,
    ...rest
  }) => (
    <CheckBoxBaseToast
      {...rest}
      //BaseToast is modified to have zIndex: 100
      leadingIcon={leadingIcon(
        leadingIconName ? leadingIconName : 'info',
        $config.FONT_COLOR,
      )}
      trailingIcon={trailingIcon}
      style={{
        borderTopColor: $config.PRIMARY_ACTION_BRAND_COLOR,
      }}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
      subTextStyle={styles.subTextStyle}
      text1={text1}
      text2={text2}
      primaryBtn={primaryBtn ? primaryBtn : null}
      secondaryBtn={secondaryBtn ? secondaryBtn : null}
      checkbox={checkbox}
    />
  ),
};

export default ToastConfig;

const styles = StyleSheet.create({
  text1Style: {
    color: $config.FONT_COLOR,
    alignSelf: 'center',
  },
  text2Style: {
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.medium,
  },
  subTextStyle: {
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.medium,
  },
});
