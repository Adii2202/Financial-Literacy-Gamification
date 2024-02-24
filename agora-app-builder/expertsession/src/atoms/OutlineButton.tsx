import {IconsInterface} from '../atoms/CustomIcon';
import ImageIcon from './ImageIcon';
import React from 'react';
import {
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface OutlineButtonProps {
  onPress: () => void;
  text: string;
  containerStyle?: ViewStyle;
  iconName?: keyof IconsInterface;
  iconStyle?: ImageStyle;
  textStyle?: TextStyle;
}

const OutlineButton = (props: OutlineButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.containerStyle, props?.containerStyle]}>
      {props?.iconName ? (
        <View style={styles.iconStyleView}>
          <ImageIcon iconSize={20} iconType="plain" name={props.iconName} />
        </View>
      ) : (
        <></>
      )}
      <Text style={[styles.textStyle, props?.textStyle]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default OutlineButton;
const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#099DFD',
    borderRadius: 4,
  },
  iconStyleView: {
    margin: 8,
    alignSelf: 'center',
  },
  textStyle: {
    paddingVertical: 12,
    paddingRight: 12,
    color: '#099DFD',
    textAlign: 'left',
  },
});
