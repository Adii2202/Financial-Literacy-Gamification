import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  Platform,
  TextStyle,
} from 'react-native';
import React from 'react';
import Spacer from './Spacer';
import ThemeConfig from '../theme';

interface InputProps extends TextInputProps {
  helpText?: string;
  label?: string;
  labelStyle?: TextStyle;
  autoFocus?: boolean;
}
const Input = (props: InputProps) => {
  const {style, labelStyle, helpText, label, autoFocus, ...otherProps} = props;
  const [isFocussed, setIsFocussed] = React.useState(() =>
    autoFocus ? true : false,
  );
  return (
    <>
      {label ? (
        <>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <Spacer size={8} />
        </>
      ) : (
        <></>
      )}

      <TextInput
        style={[
          styles.input,
          style,
          // {borderColor: isFocussed ? $config.FONT_COLOR : '#666666'},
        ]}
        placeholderTextColor={
          $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled
        }
        autoCorrect={false}
        // autoFocus
        {...otherProps}
        // onFocus={() => setIsFocussed(true)}
        // onBlur={() => setIsFocussed(false)}
      />
      {/* {helpText && <Text style={styles.helpText}>{props.helpText}</Text>} */}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    // height: 60, //causes text cut off in android
    width: '100%',
    borderWidth: 1,
    paddingVertical: 21,
    paddingHorizontal: 16,
    borderColor: $config.INPUT_FIELD_BORDER_COLOR,
    color: $config.FONT_COLOR,
    backgroundColor: $config.INPUT_FIELD_BACKGROUND_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontSize: ThemeConfig.FontSize.medium,
    borderRadius: ThemeConfig.BorderRadius.medium,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  label: {
    fontWeight: '600',
    fontSize: ThemeConfig.FontSize.medium,
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.medium,
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
  helpText: {
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
  },
});
