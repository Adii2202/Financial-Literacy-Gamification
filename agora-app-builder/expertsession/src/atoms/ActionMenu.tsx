import {
  Modal,
  StyleSheet,
  Text,
  ModalProps,
  TouchableWithoutFeedback,
  View,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {SetStateAction, useState} from 'react';

import ImageIcon from '../atoms/ImageIcon';
import {IconsInterface} from '../atoms/CustomIcon';
import ThemeConfig from '../theme';
import {isWebInternal} from '../utils/common';
import hexadecimalTransparency from '../utils/hexadecimalTransparency';
import Toggle from './Toggle';

export interface ActionMenuItem {
  isExternalIcon?: boolean;
  externalIconString?: string;
  isBase64Icon?: boolean;
  icon: keyof IconsInterface;
  onHoverIcon?: keyof IconsInterface;
  iconColor: string;
  textColor: string;
  title: string;
  toggleStatus?: boolean;
  callback: () => void;
  onHoverCallback?: (isHovered: boolean) => void;
  onHoverContent?: JSX.Element;
  disabled?: boolean;
}
export interface ActionMenuProps {
  from: string;
  actionMenuVisible: boolean;
  setActionMenuVisible: React.Dispatch<SetStateAction<boolean>>;
  modalPosition?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  items: ActionMenuItem[];
  hoverMode?: boolean;
  onHover?: (hover: boolean) => void;
  containerStyle?: ViewStyle;
}

const ActionMenu = (props: ActionMenuProps) => {
  const {
    actionMenuVisible,
    setActionMenuVisible,
    modalPosition,
    items,
    hoverMode = false,
  } = props;

  const renderItems = () => {
    return items?.map(
      (
        {
          icon = '',
          onHoverIcon,
          isBase64Icon = false,
          isExternalIcon = false,
          externalIconString = '',
          title,
          toggleStatus,
          callback,
          iconColor,
          textColor,
          disabled = false,
          onHoverCallback = undefined,
          onHoverContent = undefined,
        },
        index,
      ) => (
        <PlatformWrapper key={props.from + '_' + title + index}>
          {(isHovered: boolean) => (
            <>
              {/* {onHoverCallback && onHoverCallback(isHovered)} */}
              {isHovered ? onHoverContent ? onHoverContent : <></> : <></>}
              <TouchableOpacity
                disabled={disabled}
                style={[
                  styles.row,
                  isHovered && !disabled
                    ? //first item should have border-radius on top left and top right
                      index === 0
                      ? styles.rowHoveredFirstChild
                      : //last item should have border-radius on bottom left and top right
                      items?.length - 1 === index
                      ? styles.rowHoveredLastChild
                      : //middle items don't need any border-radius
                        styles.rowHoveredMiddleItems
                    : {},
                  disabled ? {opacity: 0.4} : {},
                  items?.length - 1 === index
                    ? {borderBottomColor: 'transparent'}
                    : {},
                ]}
                onPress={callback}
                key={icon + index}>
                <View style={styles.iconContainer}>
                  {isExternalIcon ? (
                    <ImageIcon
                      base64={isBase64Icon}
                      base64TintColor={iconColor}
                      iconType="plain"
                      iconSize={20}
                      icon={externalIconString}
                      tintColor={iconColor}
                    />
                  ) : (
                    <ImageIcon
                      base64={isBase64Icon}
                      base64TintColor={iconColor}
                      iconType="plain"
                      iconSize={20}
                      name={
                        isHovered && onHoverIcon && !disabled
                          ? onHoverIcon
                          : icon
                      }
                      tintColor={iconColor}
                    />
                  )}
                </View>
                <Text
                  style={[styles.text, textColor ? {color: textColor} : {}]}>
                  {title}
                </Text>
                {toggleStatus !== undefined && toggleStatus !== null ? (
                  <View style={styles.toggleContainer}>
                    <Toggle
                      disabled={disabled}
                      isEnabled={toggleStatus}
                      toggleSwitch={callback}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </>
          )}
        </PlatformWrapper>
      ),
    );
  };

  return (
    <View>
      {hoverMode ? (
        actionMenuVisible && (
          <View
            style={[styles.modalView, props?.containerStyle, modalPosition]}>
            <div
              onMouseEnter={() => props?.onHover && props.onHover(true)}
              onMouseLeave={() => props?.onHover && props.onHover(false)}>
              {renderItems()}
            </div>
          </View>
        )
      ) : (
        <Modal
          testID="action-menu"
          animationType="none"
          transparent={true}
          visible={actionMenuVisible}>
          <TouchableWithoutFeedback
            onPress={() => {
              setActionMenuVisible(false);
            }}>
            <View style={styles.backDrop} />
          </TouchableWithoutFeedback>
          <View
            style={[styles.modalView, props?.containerStyle, modalPosition]}>
            {renderItems()}
          </View>
        </Modal>
      )}
    </View>
  );
};

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

export default ActionMenu;

const styles = StyleSheet.create({
  modalView: {
    //don't added overflow: hidden, bottombar minimized version layout popup will be shown in the overflow
    position: 'absolute',
    // width: 230,
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 1,
    elevation: 1,
  },
  rowHoveredMiddleItems: {
    backgroundColor:
      $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['15%'],
  },
  rowHoveredFirstChild: {
    backgroundColor:
      $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['15%'],
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  rowHoveredLastChild: {
    backgroundColor:
      $config.CARD_LAYER_5_COLOR + hexadecimalTransparency['15%'],
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: $config.CARD_LAYER_3_COLOR,
    flexDirection: 'row',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginVertical: 12,
    marginLeft: 12,
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginLeft: 'auto',
  },
  text: {
    paddingVertical: 14,
    color: $config.SECONDARY_ACTION_COLOR,
    fontSize: ThemeConfig.FontSize.normal,
    fontWeight: '400',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    marginRight: 8,
  },
  backDrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
