import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import IconButton from '../atoms/IconButton';
import ThemeConfig from '../theme';
import {IconsInterface} from '../atoms/CustomIcon';
import {isWebInternal} from '../utils/common';
import styles from 'react-native-toast-message/src/styles';

export interface SidePanelHeaderProps {
  centerComponent?: React.ReactNode;
  leadingIconName?: keyof IconsInterface;
  leadingIconOnPress?: () => void;
  trailingIconName?: keyof IconsInterface;
  trailingIconOnPress?: () => void;
  trailingIconName2?: keyof IconsInterface;
  trailingIconOnPress2?: () => void;
  isChat?: boolean;
  children?: React.ReactNode;
}
const SidePanelHeader = React.forwardRef<View, SidePanelHeaderProps>(
  (props: SidePanelHeaderProps, ref) => {
    const {isChat = false, children = <></>} = props;
    return (
      <>
        <View
          style={[
            SidePanelStyles.sidePanelHeader,
            isChat ? SidePanelStyles.chatPadding : {},
          ]}>
          {props?.leadingIconName ? (
            <View>
              <IconButton
                hoverEffect={true}
                hoverEffectStyle={{
                  backgroundColor: $config.ICON_BG_COLOR,
                  borderRadius: 20,
                }}
                iconProps={{
                  iconType: 'plain',
                  iconContainerStyle: {
                    padding: 5,
                  },
                  iconSize: 20,
                  name: props.leadingIconName,
                  tintColor: $config.SECONDARY_ACTION_COLOR,
                }}
                onPress={() => {
                  props?.leadingIconOnPress && props.leadingIconOnPress();
                }}
              />
            </View>
          ) : isChat ? (
            <View style={{width: 30, height: 'auto'}}></View>
          ) : null}
          {props?.centerComponent ? props.centerComponent : null}
          <View style={props?.trailingIconName2 && SidePanelStyles.row}>
            {props?.trailingIconName ? (
              <View ref={ref} collapsable={false} style={{flex: 1}}>
                <IconButton
                  hoverEffect={true}
                  hoverEffectStyle={{
                    backgroundColor: $config.ICON_BG_COLOR,
                    borderRadius: 20,
                  }}
                  iconProps={{
                    iconType: 'plain',
                    iconContainerStyle: {
                      padding: 5,
                    },
                    iconSize: 20,
                    name: props?.trailingIconName,
                    tintColor: $config.SECONDARY_ACTION_COLOR,
                  }}
                  onPress={() => {
                    props?.trailingIconOnPress && props.trailingIconOnPress();
                  }}
                />
              </View>
            ) : null}
            {props?.trailingIconName2 ? (
              <IconButton
                hoverEffect={true}
                hoverEffectStyle={{
                  backgroundColor: $config.ICON_BG_COLOR,
                  borderRadius: 20,
                }}
                iconProps={{
                  iconType: 'plain',
                  iconContainerStyle: {
                    padding: 5,
                  },
                  iconSize: 20,
                  name: props?.trailingIconName2,
                  tintColor: $config.SECONDARY_ACTION_COLOR,
                }}
                onPress={() => {
                  props?.trailingIconOnPress2 && props.trailingIconOnPress2();
                }}
              />
            ) : null}
          </View>
        </View>
        {children}
      </>
    );
  },
);

export const SidePanelStyles = StyleSheet.create({
  sidePanelHeader: {
    height: isWebInternal() ? 60 : 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: $config.CARD_LAYER_3_COLOR,
  },
  chatPadding: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  heading: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.normal,
    lineHeight: 1.6 * ThemeConfig.FontSize.normal,
    fontWeight: '600',
    color: $config.FONT_COLOR,
    alignSelf: 'center',
  },
  alignCenterNoPadding: {
    padding: 0,
    display: 'flex',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.3,
  },
});
export default SidePanelHeader;
