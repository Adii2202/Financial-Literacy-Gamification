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
import {StyleSheet, View} from 'react-native';
import ColorContext from './ColorContext';
import {SidePanelType} from '../subComponents/SidePanelEnum';
import {useSidePanel} from '../utils/useSidePanel';
import {useString} from '../utils/useString';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import {useToolbarMenu} from '../utils/useMenu';
import ToolbarMenuItem from '../atoms/ToolbarMenuItem';
import {useActionSheet} from '../utils/useActionSheet';
import {toolbarItemSettingText} from '../language/default-labels/videoCallScreenLabels';

export interface SettingsIconButtonProps {
  render?: (onPress: () => void, isPanelActive: boolean) => JSX.Element;
}

const Settings = (props: SettingsIconButtonProps) => {
  const {sidePanel, setSidePanel} = useSidePanel();
  const {isToolbarMenuItem} = useToolbarMenu();
  //commented for v1 release
  const settingsLabel = useString(toolbarItemSettingText)();

  const isPanelActive = sidePanel === SidePanelType.Settings;
  const onPress = () => {
    isPanelActive
      ? setSidePanel(SidePanelType.None)
      : setSidePanel(SidePanelType.Settings);
  };
  const {isOnActionSheet, showLabel} = useActionSheet();
  let iconButtonProps: IconButtonProps = {
    onPress: onPress,

    iconProps: {
      name: 'settings',
      tintColor: isPanelActive
        ? $config.PRIMARY_ACTION_TEXT_COLOR
        : $config.SECONDARY_ACTION_COLOR,
      iconBackgroundColor: isPanelActive
        ? $config.PRIMARY_ACTION_BRAND_COLOR
        : '',
    },
    btnTextProps: {
      text: showLabel ? settingsLabel : '',
      textColor: $config.FONT_COLOR,
    },
  };
  iconButtonProps.isOnActionSheet = isOnActionSheet;
  if (isOnActionSheet) {
    // iconButtonProps.containerStyle = {
    //   backgroundColor: $config.CARD_LAYER_2_COLOR,
    //   width: 52,
    //   height: 52,
    //   borderRadius: 26,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    // };

    iconButtonProps.btnTextProps.textStyle = {
      color: $config.FONT_COLOR,
      marginTop: 8,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Source Sans Pro',
      textAlign: 'center',
    };
  }
  return props?.render ? (
    props.render(onPress, isPanelActive)
  ) : (
    <>
      <View>
        {isToolbarMenuItem ? (
          <ToolbarMenuItem {...iconButtonProps} />
        ) : (
          <IconButton {...iconButtonProps} />
        )}
      </View>
    </>
  );
};

export const SettingsWithViewWrapper = (props: SettingsIconButtonProps) => {
  return <Settings {...props} />;
};

const style = StyleSheet.create({
  localButton: {
    borderRadius: 2,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    width: 30,
    height: 30,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
});

export default Settings;
