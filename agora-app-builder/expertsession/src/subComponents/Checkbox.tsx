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
//@ts-ignore
import {CheckBox, StyleSheet} from 'react-native';
import ColorContext from '../components/ColorContext';

/**
 * A checkbox component for the web and electron
 */
const Checkbox = (props: any) => {
  const {primaryColor} = useContext(ColorContext);
  const urlCheckbox = props.value;
  const setUrlCheckbox = props.onValueChange;
  return (
    <CheckBox
      disabled={props?.disabled}
      value={urlCheckbox}
      onValueChange={setUrlCheckbox}
      //@ts-ignore Color prop exists on react-native-web but it not present in @react-native-community/checkbox
      color={props.color ?? primaryColor}
      style={{...styles.check, ...props.style}}
    />
  );
};

const styles = StyleSheet.create({
  check: {width: 15, height: 15},
});

export default Checkbox;
