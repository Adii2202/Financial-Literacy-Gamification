import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  TextStyle,
} from 'react-native';

import ThemeConfig from '../theme';
import ImageIcon from './ImageIcon';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelStye?: TextStyle;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  labelStye = {},
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  React.useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleCheckboxToggle = () => {
    if (disabled) return;
    const updatedChecked = !isChecked;
    setIsChecked(updatedChecked);
    onChange(updatedChecked);
  };

  return (
    <TouchableOpacity onPress={handleCheckboxToggle} style={styles.container}>
      <View
        style={[styles.checkboxContainer, isChecked && styles.fillSelected]}>
        {isChecked && (
          <ImageIcon
            iconType="plain"
            name={'tick'}
            iconSize={8}
            tintColor={$config.FONT_COLOR}
          />
        )}
      </View>
      <Text
        style={[
          styles.label,
          labelStye,
          !isChecked && disabled && styles.disabledText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: $config.SEMANTIC_NEUTRAL,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    position: 'absolute',
  },
  label: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    fontSize: ThemeConfig.FontSize.normal,
    color: $config.SECONDARY_ACTION_COLOR,
    marginLeft: 14,
  },
  fillSelected: {
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
  disabledText: {
    color: $config.SEMANTIC_NEUTRAL,
  },
});

export default Checkbox;
