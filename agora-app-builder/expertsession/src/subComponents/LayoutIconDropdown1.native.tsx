import React, {SetStateAction} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from 'react-native';
import ImageIcon from '../atoms/ImageIcon';
import useLayoutsData from '../pages/video-call/useLayoutsData';
import {useLayout} from '../utils/useLayout';

const deviceHeight = Dimensions.get('screen').height;
interface LayoutIconDropdownProps {
  dropdownPosition: {
    top: number;
    right: number;
  };
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<SetStateAction<boolean>>;
}

const LayoutIconDropdown = (props: LayoutIconDropdownProps) => {
  const {showDropdown, setShowDropdown} = props;
  const layouts = useLayoutsData();
  const {currentLayout, setLayout} = useLayout();
  const selectedItemHighlighter = (isSelected: boolean) => {
    return <View style={isSelected ? style.highlighter : {}} />;
  };
  const renderDropdown = () => {
    const data = layouts.map((item, index) => {
      let onPress = () => {
        setLayout(item.name);
        setShowDropdown(false);
      };
      let content = [];
      let BtnTemplateLocal = [
        item?.iconName ? (
          <ImageIcon
            key={'btnTemplateNameDropdown' + index}
            name={item?.iconName}
          />
        ) : (
          <ImageIcon
            key={'btnTemplateIconDropdown' + index}
            name={item?.iconName}
          />
        ),
      ];
      content.push(
        <TouchableOpacity
          style={style.dropdownIconContainer}
          onPress={onPress}
          key={'dropdownLayoutIcon' + index}>
          <>
            <View style={style.highlighterContainer}>
              {selectedItemHighlighter(item.name === currentLayout)}
            </View>
            <View style={{flex: 1}}>{BtnTemplateLocal}</View>
            <View style={style.layoutNameContainer}>
              <Text numberOfLines={2} style={style.layoutNameText}>
                {item.label}
              </Text>
            </View>
          </>
        </TouchableOpacity>,
      );
      return content;
    });
    return (
      <Modal
        animationType="fade"
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
        <View style={style.dropdownContentContainer}>{data}</View>
      </Modal>
    );
  };
  return <>{renderDropdown()}</>;
};

const style = StyleSheet.create({
  layoutNameContainer: {
    flex: 3,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  layoutNameText: {
    textAlign: 'left',
  },
  highlighterContainer: {
    flex: 0.3,
    justifyContent: 'center',
  },
  highlighter: {
    justifyContent: 'center',
    alignSelf: 'center',
    height: 1,
    width: 1,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  dropdownIconContainer: {
    flexDirection: 'row',
    maxHeight: 40,
    marginVertical: 5,
  },
  navItem: {
    height: '100%',
    alignItems: 'center',
    position: 'relative',
  },

  separaterContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
  },
  dropdownContentContainer: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: '70%',
    marginTop: (1 / 3) * deviceHeight,
    marginBottom: 30,
    borderRadius: 10,
    padding: 10,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default LayoutIconDropdown;
