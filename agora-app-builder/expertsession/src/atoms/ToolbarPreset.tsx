import React from 'react';
import Navbar from '../components/Navbar';
import Controls from '../components/Controls';
import Leftbar from '../components/Leftbar';
import Rightbar from '../components/Rightbar';
import {isMobileUA} from '../utils/common';
import NavbarMobile from '../components/NavbarMobile';
import ActionSheet from '../pages/video-call/ActionSheet';

export interface ToolbarCustomItem {
  component: () => JSX.Element;
  align: 'start' | 'center' | 'end';
  hide: 'yes' | 'no' | 'never';
  order?: number;
}

export interface ToolbarBottomPresetProps {
  align: 'bottom';
  customItems?: Array<ToolbarCustomItem>;
  snapPointsMinMax: [number, number];
}
export interface ToolbarOtherPresetProps {
  align: 'top' | 'left' | 'right';
  customItems?: Array<ToolbarCustomItem>;
  snapPointsMinMax?: never;
}

export type ToolbarPresetProps =
  | ToolbarBottomPresetProps
  | ToolbarOtherPresetProps;

const ToolbarPreset = (props: ToolbarPresetProps) => {
  const {align} = props;
  if (!align) {
    console.log(
      'ToolbarPreset align prop is empty. please provide align prop to get the corresponding toolbar preset',
    );
    return null;
  }
  if (align === 'left') {
    return (
      <Leftbar customItems={props?.customItems} includeDefaultItems={true} />
    );
  } else if (align === 'right') {
    return (
      <Rightbar customItems={props?.customItems} includeDefaultItems={true} />
    );
  } else if (align === 'top') {
    return isMobileUA() ? (
      <NavbarMobile
        customItems={props?.customItems}
        includeDefaultItems={true}
      />
    ) : (
      <Navbar customItems={props?.customItems} includeDefaultItems={true} />
    );
  } else if (align === 'bottom') {
    return isMobileUA() ? (
      <ActionSheet
        customItems={props?.customItems}
        includeDefaultItems={true}
        snapPointsMinMax={props?.snapPointsMinMax}
      />
    ) : (
      <Controls customItems={props?.customItems} includeDefaultItems={true} />
    );
  } else {
    return null;
  }
};
export default ToolbarPreset;
