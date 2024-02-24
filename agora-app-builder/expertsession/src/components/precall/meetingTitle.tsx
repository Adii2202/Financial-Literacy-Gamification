import React from 'react';
import {Text, StyleSheet, View, TextStyle} from 'react-native';
import {isMobileUA, trimText} from '../../utils/common';
import ThemeConfig from '../../theme';
import {useRoomInfo} from '../room-info/useRoomInfo';

export interface MeetingTitleProps {
  prefix?: string;
}
const isMobile = isMobileUA();
const MeetingTitle = (props?: MeetingTitleProps) => {
  const {
    data: {meetingTitle},
  } = useRoomInfo();

  return (
    <View style={isMobile ? style.mobileContainer : style.desktopContainer}>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[style.textStyle, style.prefixStyle]}>
        {props.prefix}
      </Text>
      <Text style={[style.textStyle, {fontWeight: '600'}]}>
        {trimText(meetingTitle)}
      </Text>
    </View>
  );
};

export default MeetingTitle;

const style = StyleSheet.create({
  mobileContainer: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  desktopContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  textStyle: {
    fontSize: ThemeConfig.FontSize.large,
    lineHeight: 28,
    fontWeight: '400',
    color: $config.FONT_COLOR,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    textAlign: 'center',
  },
  prefixStyle: {
    marginRight: 8,
    color: isMobile
      ? $config.FONT_COLOR + ThemeConfig.EmphasisPlus.disabled
      : $config.FONT_COLOR,
  },
});
