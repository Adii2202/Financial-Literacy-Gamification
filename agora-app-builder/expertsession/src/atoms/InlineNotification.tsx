import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import ThemeConfig from '../theme';
import ImageIcon from './ImageIcon';
import {isMobileUA} from '../../src/utils/common';

const InlineNotification = (props: {
  text: string;
  customStyle?: ViewStyle;
  warning?: boolean;
}) => {
  const {text, customStyle, warning = false} = props;
  const isMobile = isMobileUA();
  return (
    <View
      style={[
        styles.container,
        isMobile && styles.mobileContainer,
        customStyle ? customStyle : {},
      ]}>
      {!warning && !isMobile && (
        <View style={styles.iconStyleView}>
          <ImageIcon
            base64={false}
            iconSize={20}
            iconType="plain"
            name={'video-off'}
            tintColor={$config.SEMANTIC_NEUTRAL}
          />
        </View>
      )}
      {warning && !isMobile && (
        <View style={styles.iconStyleView}>
          <ImageIcon
            base64={true}
            iconSize={20}
            iconType="plain"
            name={'warning'}
            tintColor={$config.SEMANTIC_NEUTRAL}
          />
        </View>
      )}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default InlineNotification;

const styles = StyleSheet.create({
  text: {
    color: $config.SECONDARY_ACTION_COLOR,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    flex: 1,
  },
  mobileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: $config.CARD_LAYER_2_COLOR,
  },
  container: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  iconStyleView: {
    marginRight: 8,
    width: 20,
    height: 20,
  },
});
