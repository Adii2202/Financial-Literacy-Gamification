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
import {TextInputProps, StyleSheet, TextInput, Platform} from 'react-native';
import {isWebInternal} from '../utils/common';
import {textInput} from '../../theme.json';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

interface TextInputCustomProps extends TextInputProps {
  setRef?: (ref: any) => void;
}

const TextInputCustom = (props: TextInputCustomProps) => {
  const {style, setRef, ...otherProps} = props;
  return (
    <TextInput
      ref={ref => props?.setRef && props.setRef(ref)}
      style={[styles.textInput, styles.textWrapFix, styles.noOutline, style]}
      placeholderTextColor={$config.FONT_COLOR + hexadecimalTransparency['70%']}
      autoCorrect={false}
      {...otherProps}
    />
  );
};

export default TextInputCustom;

const styles = StyleSheet.create({
  // @ts-ignore
  textInput,
  // @ts-ignore
  noOutline: isWebInternal() ? {outlineStyle: 'none'} : {},
  textWrapFix: Platform.select({
    ios: {
      paddingVertical: 5,
    },
  }),
});
