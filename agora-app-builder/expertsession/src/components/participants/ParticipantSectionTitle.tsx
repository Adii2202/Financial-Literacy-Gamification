import ImageIcon from '../../atoms/ImageIcon';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ThemeConfig from '../../theme';

interface PropsInterface {
  title: string;
  count?: number;
  isOpen?: boolean;
  onPress?: () => void;
}

export default function ParticipantSectionTitle(props: PropsInterface) {
  const {title, count = 0} = props;
  if (!count) {
    return null;
  }
  return (
    <TouchableOpacity
      style={style.container}
      onPress={() => props?.onPress && props?.onPress()}>
      <Text style={style.subheading}>
        {title} {count > 0 ? '(' + count + ')' : ''}
      </Text>
      <View style={style.iconView}>
        <ImageIcon
          iconType="plain"
          name={props?.isOpen ? 'arrow-up' : 'arrow-down'}
          iconSize={20}
          tintColor={$config.SECONDARY_ACTION_COLOR}
        />
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: $config.CARD_LAYER_2_COLOR,
    paddingHorizontal: 20,
  },
  subheading: {
    fontSize: 12,
    fontFamily: 'Source Sans Pro',
    fontWeight: '700',
    color: $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  iconView: {
    paddingVertical: 8,
    alignSelf: 'center',
  },
});
