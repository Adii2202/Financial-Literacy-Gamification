import React, {SetStateAction, useContext} from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Modal} from 'react-native';
import {isMobileUA, isWebInternal} from '../utils/common';
import useLayoutsData from '../pages/video-call/useLayoutsData';
import {useLayout} from '../utils/useLayout';
import IconButton, {IconButtonProps} from '../atoms/IconButton';
import Spacer from '../atoms/Spacer';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import {getPinnedLayoutName} from '../pages/video-call/DefaultLayouts';
import {useContent} from 'customization-api';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import {useString} from '../utils/useString';
import {
  toolbarItemLayoutOptionGridText,
  toolbarItemLayoutOptionSidebarText,
} from '../language/default-labels/videoCallScreenLabels';

interface LayoutIconDropdownProps {
  modalPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<SetStateAction<boolean>>;
  caretPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  onHoverPlaceHolder?: 'vertical' | 'horizontal';
}

const LayoutIconDropdown = (props: LayoutIconDropdownProps) => {
  const {
    showDropdown,
    setShowDropdown,
    modalPosition = {top: 0, left: 0},
    onHoverPlaceHolder = 'horizontal',
  } = props;
  const {activeUids, customContent} = useContent();

  const layouts = useLayoutsData();
  const {setLayout, currentLayout} = useLayout();
  const isMobileView = isMobileUA();

  const gridLabel = useString(toolbarItemLayoutOptionGridText)();
  const sidebarLabel = useString(toolbarItemLayoutOptionSidebarText)();

  const renderDropdown = () => {
    const data = layouts.map((item, index) => {
      let onPress = () => {
        setLayout(item.name);
        setShowDropdown(false);
      };
      let content = [];
      const disabled =
        item.name === getPinnedLayoutName() &&
        //activeUids?.filter((i) => customContent[i])?.length === 1
        activeUids?.length === 1
          ? true
          : false;
      let iconButtonProps: IconButtonProps = {
        disabled,
        hoverEffect: disabled
          ? false
          : currentLayout !== item.name
          ? true
          : false,
        hoverEffectStyle: {
          backgroundColor:
            $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['15%'],
        },
        containerStyle: {
          opacity: disabled ? 0.4 : 1,
          flexDirection: 'row',
          marginHorizontal: 8,
          marginTop: 8,
          marginBottom: layouts.length - 1 === index ? 8 : 0,
          borderRadius: 4,
          backgroundColor:
            currentLayout === item.name
              ? $config.PRIMARY_ACTION_BRAND_COLOR
              : 'transparent',
        },
        onPress,
        iconProps: {
          iconContainerStyle: {
            padding: 10,
          },
          iconType: 'plain',
          icon: item.icon,
          tintColor: $config.SECONDARY_ACTION_COLOR,
        },
        btnTextProps: {
          textStyle: {
            marginTop: 0,
          },
          //text: $config.ICON_TEXT ? item.label : '',
          text:
            item?.translationKey === toolbarItemLayoutOptionGridText
              ? gridLabel
              : item?.translationKey === toolbarItemLayoutOptionSidebarText
              ? sidebarLabel
              : item.label,
          textColor: $config.FONT_COLOR,
        },
      };
      content.push(
        <IconButton key={'layout_button' + item.name} {...iconButtonProps} />,
      );
      return content;
    });

    let viewContent = (
      <View style={[style.dropdownContainer, modalPosition]}>
        <View
          style={[
            {
              width: 20,
              height: 20,
              backgroundColor: $config.CARD_LAYER_4_COLOR,
              position: 'absolute',
              borderRadius: 2,
              transform: [{rotate: '45deg'}],
              zIndex: -1,
            },
            props?.caretPosition,
          ]}></View>
        {!isMobileUA() && (
          <View
            style={[
              {
                zIndex: -2,
                position: 'absolute',
              },
              onHoverPlaceHolder === 'vertical'
                ? {width: 20, height: '100%', bottom: 0, right: -20}
                : {width: '100%', height: 20, bottom: -20},
            ]}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          {data}
        </View>
      </View>
    );

    return !isMobileOrTablet() ? (
      showDropdown ? (
        viewContent
      ) : (
        <></>
      )
    ) : (
      <Modal
        animationType="none"
        transparent={true}
        visible={showDropdown}
        onRequestClose={() => {
          setShowDropdown(false);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowDropdown(false);
          }}>
          <View style={style.backDrop} />
        </TouchableWithoutFeedback>
        {viewContent}
      </Modal>
    );
  };
  return <>{renderDropdown()}</>;
};

const style = StyleSheet.create({
  dropdownContainer: {
    width: 140,
    position: 'absolute',
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 8,
    zIndex: 999,
    shadowColor: $config.HARD_CODED_BLACK_COLOR,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 1,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default LayoutIconDropdown;
