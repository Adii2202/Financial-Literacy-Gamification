import React from 'react';
import {View, StyleSheet} from 'react-native';
import Toolbar from '../atoms/Toolbar';
import {ToolbarCustomItem} from '../atoms/ToolbarPreset';
import {
  MeetingTitleToolbarItem,
  ParticipantCountToolbarItem,
  RecordingStatusToolbarItem,
} from './Navbar';
import {useRecording} from '../subComponents/recording/useRecording';
import {CustomToolbarSort} from '../utils/common';

export interface NavbarProps {
  customItems?: ToolbarCustomItem[];
  includeDefaultItems?: boolean;
}

const NavbarMobile = (props: NavbarProps) => {
  const {isRecordingActive} = useRecording();
  const defaultStartItems: ToolbarCustomItem[] = [
    {
      align: 'start',
      component: MeetingTitleToolbarItem,
      order: 0,
      hide: 'no',
    },
    {
      align: 'start',
      component: ParticipantCountToolbarItem,
      order: 1,
      hide: 'no',
    },
    {
      align: 'start',
      component: isRecordingActive ? RecordingStatusToolbarItem : null,
      order: 2,
      hide: 'no',
    },
  ];
  const defaultCenterItems: ToolbarCustomItem[] = [];
  const defaultEndItems: ToolbarCustomItem[] = [];
  const {customItems = [], includeDefaultItems = true} = props;
  const isHidden = (i) => {
    return i?.hide === 'yes';
  };

  // const customStartItems = customItems
  //   ?.filter((i) => i.align === 'start' && !isHidden(i))
  //   ?.concat(includeDefaultItems ? defaultStartItems : [])
  //   ?.sort((a, b) => a?.order - b?.order);

  // const customCenterItems = customItems
  //   ?.filter((i) => i.align === 'center' && !isHidden(i))
  //   ?.concat(includeDefaultItems ? defaultCenterItems : [])
  //   ?.sort((a, b) => a?.order - b?.order);

  // const customEndItems = customItems
  //   ?.filter((i) => i.align === 'end' && !isHidden(i))
  //   ?.concat(includeDefaultItems ? defaultEndItems : [])
  //   ?.sort((a, b) => a?.order - b?.order);

  const customTopBarItems = customItems
    ?.concat(includeDefaultItems ? defaultStartItems : [])
    ?.filter((i) => !isHidden(i) && i?.component)
    ?.sort(CustomToolbarSort);

  const renderContent = (
    items: ToolbarCustomItem[],
    type: 'start' | 'center' | 'end',
  ) => {
    return items?.map((item, index) => {
      const ToolbarItem = item?.component;
      if (ToolbarItem) {
        return <ToolbarItem key={`top-toolbar-${type}` + index} />;
      } else {
        return null;
      }
    });
  };
  return (
    <Toolbar>
      <View style={style.startContent}>
        {renderContent(customTopBarItems, 'start')}
      </View>
      {/*<View style={style.startContent}>
        {renderContent(customStartItems, 'start')}
      </View>
       <View style={style.centerContent}>
        {renderContent(customCenterItems, 'center')}
      </View>
      <View style={style.endContent}>
        {renderContent(customEndItems, 'end')}
      </View> */}
    </Toolbar>
  );
};
export default NavbarMobile;
const style = StyleSheet.create({
  startContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  centerContent: {
    zIndex: 2,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endContent: {
    flex: 1,
    zIndex: 9,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
