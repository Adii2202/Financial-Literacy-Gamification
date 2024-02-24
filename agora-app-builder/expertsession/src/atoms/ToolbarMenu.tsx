import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {ToolbarMenuProvider} from '../utils/useMenu';

export interface ToolbarMenuProps {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}
const ToolbarMenu = (props: ToolbarMenuProps) => {
  const {children, containerStyle} = props;
  if (!children) {
    return null;
  }
  return (
    <ToolbarMenuProvider>
      <View style={[ToolbarMenuStyle.containerStyle, containerStyle]}>
        {children}
      </View>
    </ToolbarMenuProvider>
  );
};
export default ToolbarMenu;

const ToolbarMenuStyle = StyleSheet.create({
  containerStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1,
    elevation: 1,
  },
});
