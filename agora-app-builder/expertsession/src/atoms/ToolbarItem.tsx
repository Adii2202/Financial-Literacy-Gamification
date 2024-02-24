import React from 'react';
import {View, ViewProps, ViewStyle, StyleSheet} from 'react-native';
import {ToolbarPosition, useToolbar} from '../utils/useToolbar';
import {isMobileUA, isWebInternal} from '../utils/common';

export interface ToolbarItemProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
}
const ToolbarItem = (props: ToolbarItemProps) => {
  const {isHorizontal, position} = useToolbar();
  //isHorizontal true -> top/bottom bar
  //isHorizontal false -> left/right bar
  // todo hari - first item shouldnot contain the margin right
  // todo hari - last item shouldnot contain the margin right

  //action sheet
  if (isMobileUA() && position === ToolbarPosition.bottom) {
    return (
      <View {...props} style={[props?.style, toolbarItemStyles.iconWithText]}>
        {props?.children}
      </View>
    );
  } else {
    return (
      <View
        {...props}
        style={[
          props?.style,
          // isHorizontal ? {flexDirection: 'column'} : {flexDirection: 'row'},
          position === ToolbarPosition.left
            ? toolbarItemStyles.leftBarItemStyle
            : position === ToolbarPosition.right
            ? toolbarItemStyles.rightBarItemStyle
            : position === ToolbarPosition.bottom
            ? toolbarItemStyles.bottomBarItemStyle
            : isWebInternal() && position === ToolbarPosition.top
            ? toolbarItemStyles.topBarItemNonNativeStyle
            : !isWebInternal() && position === ToolbarPosition.top
            ? toolbarItemStyles.topBarItemNativeStyle
            : {},
        ]}>
        {props?.children}
      </View>
    );
  }
};
export default ToolbarItem;

const toolbarItemStyles = StyleSheet.create({
  iconWithText: {
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
    flexBasis: '25%',
    paddingBottom: 24,
  },
  topBarItemNativeStyle: {
    marginTop: 8,
    marginBottom: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  topBarItemNonNativeStyle: {
    marginTop: $config.ICON_TEXT ? 8 : 0,
    marginBottom: $config.ICON_TEXT ? 10 : 0,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  bottomBarItemStyle: {
    marginTop: $config.ICON_TEXT ? 10 : 0,
    marginBottom: $config.ICON_TEXT ? 16 : 0,
    marginHorizontal: 10,
  },
  leftBarItemStyle: {
    marginLeft: 16,
    marginRight: 10,
    marginVertical: 10,
  },
  rightBarItemStyle: {
    marginRight: 16,
    marginLeft: 10,
    marginVertical: 10,
  },
});
