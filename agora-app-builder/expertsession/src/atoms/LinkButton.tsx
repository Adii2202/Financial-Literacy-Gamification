import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import ThemeConfig from '../theme';

interface LinkButtonProps {
  onPress: () => void;
  text: string;
}

const LinkButton = ({onPress, text}: LinkButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}> {text} </Text>
    </TouchableOpacity>
  );
};

export default LinkButton;

const styles = StyleSheet.create({
  text: {
    color: $config.PRIMARY_ACTION_BRAND_COLOR,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.normal,
    lineHeight: ThemeConfig.FontSize.normal,
  },
});
