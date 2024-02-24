import React, {useEffect} from 'react';
import {
  ViewStyle,
  TextStyle,
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageIcon, {ImageIconProps} from './ImageIcon';
import {isMobileUA, isWebInternal} from '../utils/common';
import ToolTip from './Tooltip';
import ThemeConfig from '../theme';

export interface BtnTextProps {
  textStyle?: TextStyle;
  textColor?: string;
  text?: string;
  numberOfLines?: number;
}

export interface IconButtonProps {
  setRef?: (ref: any) => void;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  containerStyle?: ViewStyle;
  rootContainerStyle?: ViewStyle;
  iconContainerStyle?: ViewStyle;
  btnTextProps?: BtnTextProps;
  iconProps: ImageIconProps;
  toolTipMessage?: string;
  isToolTipVisible?: boolean;
  setToolTipVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  isOnActionSheet?: boolean;
  hoverEffect?: boolean;
  hoverEffectStyle?: ViewStyle;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  showTooltipArrow?: boolean;
  isClickable?: boolean;
  onHoverCallBack?: (isHovered: boolean) => void;
}

const IconButton = (props: IconButtonProps) => {
  return (
    <IconButtonWrapper {...props}>
      {props?.iconProps ? (
        <ImageIcon {...props.iconProps} isHovered={props?.isToolTipVisible} />
      ) : (
        <></>
      )}
      {props?.btnTextProps?.text ? (
        <Text
          numberOfLines={props?.btnTextProps?.numberOfLines || 1}
          ellipsizeMode="tail"
          style={[
            styles.btnTextStyle,
            props?.btnTextProps?.textColor
              ? {color: props.btnTextProps.textColor}
              : {},
            props?.btnTextProps.textStyle,
          ]}>
          {props.btnTextProps.text}
        </Text>
      ) : (
        <></>
      )}
    </IconButtonWrapper>
  );
};

const IconButtonWrapper = props => {
  const {isOnActionSheet = false, children, rootContainerStyle} = props;
  if (!isOnActionSheet) {
    return <ButtonWrapper {...props}>{children}</ButtonWrapper>;
  }
  const [child1, ...restChildren] = React.Children.toArray(children);
  return (
    <View style={[styles.rootContainerStyle, rootContainerStyle]}>
      <ButtonWrapper {...props}>{child1}</ButtonWrapper>
      {restChildren}
    </View>
  );
};

const ButtonWrapper = ({children, ...props}) => {
  const isMobileView = isMobileUA();
  return isMobileView ? (
    <TouchableOpacity
      ref={ref => props?.setRef && props.setRef(ref)}
      style={
        !props.isOnActionSheet && [
          styles.containerStyle,
          props?.containerStyle,
          props?.hoverEffect && props?.isToolTipVisible
            ? props?.hoverEffectStyle
            : {},
        ]
      }
      onPress={props.onPress}
      disabled={props.disabled}>
      {children}
    </TouchableOpacity>
  ) : (
    <Pressable
      ref={ref => props?.setRef && props.setRef(ref)}
      style={
        !props.isOnActionSheet && [
          styles.containerStyle,
          props?.containerStyle,
          props?.hoverEffect && props?.isToolTipVisible
            ? props?.hoverEffectStyle
            : {},
        ]
      }
      onPress={props.onPress}
      disabled={props.disabled}>
      {children}
    </Pressable>
  );
};

const PlatformWrapper = ({children, ...props}) => {
  return isWebInternal() ? (
    <div
      onMouseEnter={() => {
        props?.setIsHovered(true);
      }}
      onMouseLeave={() => {
        props?.setIsHovered(false);
      }}>
      {children}
    </div>
  ) : (
    children
  );
};

const IconButtonWithToolTip = (props: IconButtonProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    if (isHovered) {
      props?.onHoverCallBack && props?.onHoverCallBack(true);
    } else {
      props?.onHoverCallBack && props?.onHoverCallBack(false);
    }
  }, [isHovered]);

  const {
    placement = 'top',
    isClickable = false,
    showTooltipArrow = true,
  } = props;
  if (props?.toolTipMessage) {
    return (
      <ToolTip
        isClickable={isClickable}
        toolTipMessage={props.toolTipMessage}
        //@ts-ignore
        placement={placement}
        showTooltipArrow={showTooltipArrow}
        renderContent={(isToolTipVisible, setToolTipVisible) => {
          return (
            <IconButton
              {...props}
              isToolTipVisible={isToolTipVisible}
              setToolTipVisible={setToolTipVisible}
            />
          );
        }}
      />
    );
  }
  return (
    <PlatformWrapper isHovered={isHovered} setIsHovered={setIsHovered}>
      <IconButton
        {...props}
        isToolTipVisible={isHovered}
        setToolTipVisible={setIsHovered}
      />
    </PlatformWrapper>
  );
};

export default IconButtonWithToolTip;

const styles = StyleSheet.create({
  rootContainerStyle: {
    alignItems: 'center',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  btnTextStyle: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.tiny,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
  },
});
