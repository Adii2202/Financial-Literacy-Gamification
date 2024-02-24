import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {isMobileUA, useResponsive} from '../utils/common';
import ThemeConfig from '../theme';

interface CardProps {
  style?: ViewStyle;
  margin?: 'dense' | 'normal';
  padding?: 'dense' | 'normal';
  children?: React.ReactNode;
  cardContainerStyle?: ViewStyle;
}

const Card = (props: CardProps) => {
  const {
    style,
    margin = 'normal',
    padding = 'normal',
    children,
    cardContainerStyle = {},
    ...rest
  } = props;
  const styles = useStyles(margin, padding);
  return (
    <View
      style={[
        styles.root,
        isMobileUA() ? styles.mobile : styles.desktop,
        style,
        cardContainerStyle,
      ]}
      {...rest}>
      {children}
    </View>
  );
};

export default Card;

const useStyles = (margin: 'dense' | 'normal', padding: 'dense' | 'normal') => {
  const getResponsiveValue = useResponsive();
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: $config.CARD_LAYER_1_COLOR,
      elevation: 5,
      maxWidth: 676,
      width: '100%',
      overflow: 'hidden',
    },
    mobile: {
      paddingHorizontal: 16,
      paddingVertical: 20,
      justifyContent: 'space-between',
    },
    desktop: {
      justifyContent: 'center',
      alignSelf: 'center',
      borderWidth: 1,
      paddingHorizontal:
        padding === 'dense' ? getResponsiveValue(30) : getResponsiveValue(60),
      paddingVertical:
        padding === 'dense' ? getResponsiveValue(30) : getResponsiveValue(60),
      margin:
        margin === 'dense' ? getResponsiveValue(20) : getResponsiveValue(40),
      borderRadius: ThemeConfig.BorderRadius.extraLarge,
      borderColor: $config.CARD_LAYER_3_COLOR,
      shadowColor: $config.HARD_CODED_BLACK_COLOR,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 20,
    },
  });
};
