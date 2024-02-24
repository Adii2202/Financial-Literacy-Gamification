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
import React from 'react';
import {View, StyleSheet} from 'react-native';
import Toolbar from '../atoms/Toolbar';
import {ToolbarCustomItem} from '../atoms/ToolbarPreset';
import {CustomToolbarSort} from '../utils/common';

const defaultStartItems: ToolbarCustomItem[] = [];
const defaultCenterItems: ToolbarCustomItem[] = [];
const defaultEndItems: ToolbarCustomItem[] = [];

export interface RightbarProps {
  customItems?: ToolbarCustomItem[];
  includeDefaultItems?: boolean;
}
const Rightbar = (props: RightbarProps) => {
  const {customItems = [], includeDefaultItems = true} = props;

  const isHidden = (i) => {
    return i?.hide === 'yes';
  };

  const customStartItems = customItems
    ?.filter((i) => i?.align === 'start' && !isHidden(i))
    ?.concat(includeDefaultItems ? defaultStartItems : [])
    ?.sort(CustomToolbarSort);

  const customCenterItems = customItems
    ?.filter((i) => i?.align === 'center' && !isHidden(i))
    ?.concat(includeDefaultItems ? defaultCenterItems : [])
    ?.sort(CustomToolbarSort);

  const customEndItems = customItems
    ?.filter((i) => i?.align === 'end' && !isHidden(i))
    ?.concat(includeDefaultItems ? defaultEndItems : [])
    ?.sort(CustomToolbarSort);

  const renderContent = (
    items: ToolbarCustomItem[],
    type: 'start' | 'center' | 'end',
  ) => {
    return items?.map((item, index) => {
      const ToolbarItem = item?.component;
      if (ToolbarItem) {
        return <ToolbarItem key={`left-toolbar-${type}` + index} />;
      } else {
        return null;
      }
    });
  };
  return (
    <Toolbar>
      <View style={style.startContent}>
        {customStartItems && customStartItems?.length ? (
          renderContent(customStartItems, 'start')
        ) : (
          <></>
        )}
      </View>
      <View style={style.centerContent}>
        {customCenterItems && customCenterItems?.length ? (
          renderContent(customCenterItems, 'center')
        ) : (
          <></>
        )}
      </View>
      <View style={style.endContent}>
        {customEndItems && customEndItems?.length ? (
          renderContent(customEndItems, 'end')
        ) : (
          <></>
        )}
      </View>
    </Toolbar>
  );
};

const style = StyleSheet.create({
  startContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endContent: {
    flex: 1,
    zIndex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Rightbar;
