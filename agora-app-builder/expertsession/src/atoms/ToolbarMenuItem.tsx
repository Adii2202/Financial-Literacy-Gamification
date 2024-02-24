import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacityProps,
  TouchableOpacity,
  Text,
} from 'react-native';
import ThemeConfig from '../theme';
import ImageIcon from './ImageIcon';
import {IconButtonProps} from './IconButton';
import {isWebInternal} from '../utils/common';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';

export interface ToolbarMenuItemProps extends IconButtonProps {
  // disabled?: boolean;
  // onPress: TouchableOpacityProps['onPress'];
  // isHovered?: boolean;
  // menuIcon?: string;
  // menuText?: string;
  // menuIconColor?: string;
}
const ToolbarMenuItem = (props: ToolbarMenuItemProps) => {
  return (
    <PlatformWrapper>
      {(isHovered: boolean) => (
        <>
          <TouchableOpacity
            disabled={props.disabled}
            style={[
              props.disabled ? {opacity: 0.4} : {},
              isHovered
                ? {
                    backgroundColor:
                      $config.CARD_LAYER_5_COLOR +
                      hexadecimalTransparency['15%'],
                  }
                : {},
              ToolbarMenuItemStyles.container,
            ]}
            onPress={props.onPress}>
            <View style={ToolbarMenuItemStyles.iconContainer}>
              <ImageIcon
                base64={false}
                iconType="plain"
                iconSize={20}
                name={props?.iconProps?.name}
                tintColor={props?.iconProps?.tintColor}
              />
            </View>
            <Text
              style={[
                ToolbarMenuItemStyles.textStyle,
                props?.btnTextProps?.textStyle,
                props?.btnTextProps?.textColor
                  ? {color: props?.btnTextProps?.textColor}
                  : {},
              ]}>
              {props?.btnTextProps?.text}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </PlatformWrapper>
  );
};
export default ToolbarMenuItem;
const PlatformWrapper = ({children}) => {
  const [isHovered, setIsHovered] = useState(false);
  return isWebInternal() ? (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}>
      {children(isHovered)}
    </div>
  ) : (
    <>{children(false)}</>
  );
};
const ToolbarMenuItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: $config.CARD_LAYER_3_COLOR,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 12,
    marginLeft: 12,
  },
  textStyle: {
    paddingVertical: 14,
    color: $config.SECONDARY_ACTION_COLOR,
    fontSize: ThemeConfig.FontSize.normal,
    fontWeight: '400',
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
});
