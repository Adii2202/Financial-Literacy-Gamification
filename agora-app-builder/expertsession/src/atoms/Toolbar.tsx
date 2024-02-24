import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useToolbar, ToolbarPosition} from '../utils/useToolbar';
import {isMobileUA, isWebInternal, useIsDesktop} from '../utils/common';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {ToolbarCustomItem} from './ToolbarPreset';
import ActionSheet from '../pages/video-call/ActionSheet';

// export interface ToolbarProps {
//   children: React.ReactNode;
//   bottomSheetOnMobile?: boolean;
//   customItems?: ToolbarCustomItem[];
// }

export interface ToolbarPropsBase {
  children: React.ReactNode;
}

export interface ToolbarPropsDesktop extends ToolbarPropsBase {
  bottomSheetOnMobile?: never;
  snapPointsMinMax?: never;
}
export interface ToolbarPropsMobile extends ToolbarPropsBase {
  bottomSheetOnMobile: boolean;
  snapPointsMinMax: [number, number];
}
export type ToolbarProps = ToolbarPropsDesktop | ToolbarPropsMobile;

const Toolbar = (props: ToolbarProps) => {
  const {position} = useToolbar();
  const {children, bottomSheetOnMobile = false, snapPointsMinMax} = props;
  const isDesktop = useIsDesktop();
  const paddingHorizontal = $config.ICON_TEXT
    ? isDesktop('toolbar')
      ? 32
      : 10
    : 0;

  if (isMobileUA() && bottomSheetOnMobile) {
    return (
      <ActionSheet
        displayCustomBottomSheetContent={true}
        customBottomSheetContent={children}
        snapPointsMinMax={snapPointsMinMax}
      />
    );
  } else {
    return (
      <View
        style={[
          position === ToolbarPosition.left ||
          position === ToolbarPosition.right
            ? {
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingVertical: paddingHorizontal,
              }
            : position === ToolbarPosition.top
            ? isWebInternal()
              ? toolBarStyles.topBarNonNativeStyle
              : toolBarStyles.topBarNativeStyle
            : position === ToolbarPosition.bottom
            ? toolBarStyles.bottomBarStyle
            : {},
          position === ToolbarPosition.top ||
          position === ToolbarPosition.bottom
            ? {paddingHorizontal}
            : {},
        ]}>
        {children}
      </View>
    );
  }
};

export default Toolbar;

const toolBarStyles = StyleSheet.create({
  topBarNonNativeStyle: {
    width: '100%',
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: $config.TOOLBAR_COLOR,
  },
  topBarNativeStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    height: '8%',
    backgroundColor: $config.TOOLBAR_COLOR,
    //$config.SECONDARY_ACTION_COLOR + hexadecimalTransparency['80%'],
  },
  bottomBarStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: $config.TOOLBAR_COLOR,
  },
});
