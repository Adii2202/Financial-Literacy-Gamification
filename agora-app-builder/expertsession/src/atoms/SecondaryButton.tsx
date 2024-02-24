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
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {secondaryBtn, secondaryButtonText} from '../../theme.json';
// import ColorContext from '../components/ColorContext';

export interface SecondaryButtonProps extends TouchableOpacityProps {
  text?: string;
  children?: React.ReactNode;
}

export default function SecondaryButton(props: SecondaryButtonProps) {
  // const primaryColor = $config.FONT_COLOR; //useContext(ColorContext);
  const {children, ...otherProps} = props;
  return (
    <TouchableOpacity
      style={[
        styles.secondaryBtn,
        {
          borderColor: props.disabled
            ? $config.PRIMARY_ACTION_BRAND_COLOR +
              hexadecimalTransparency['80%']
            : $config.PRIMARY_ACTION_BRAND_COLOR,
        },
      ]}
      {...otherProps}>
      {props.text ? (
        <Text
          style={[
            styles.secondaryButtonText as StyleProp<TextStyle>,
            {
              color: props.disabled
                ? $config.PRIMARY_ACTION_BRAND_COLOR +
                  hexadecimalTransparency['80%']
                : $config.PRIMARY_ACTION_BRAND_COLOR,
            },
          ]}>
          {props.text}
        </Text>
      ) : (
        <></>
      )}
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  //@ts-ignore
  secondaryBtn,
  //@ts-ignore
  secondaryButtonText,
});
