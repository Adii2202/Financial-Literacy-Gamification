import {StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';
import React from 'react';
import {useCaption} from './useCaption';
import PrimaryButton from '../../atoms/PrimaryButton';
import useTranscriptDownload from './useTranscriptDownload';
import ThemeConfig from '../../../src/theme';
import {IconsInterface} from '../../../src/atoms/CustomIcon';
import {useString} from '../../../src/utils/useString';
import {sttDownloadTranscriptBtnText} from '../../../src/language/default-labels/videoCallScreenLabels';

interface DownloadTranscriptBtn {
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  iconName?: keyof IconsInterface;
  text?: string;
}

const DownloadTranscriptBtn = (props: DownloadTranscriptBtn) => {
  const downloadTranscriptLabel = useString(sttDownloadTranscriptBtnText)();
  const {
    textStyle = {},
    containerStyle = {},
    iconName = 'download',
    text = downloadTranscriptLabel,
  } = props;
  const {isSTTActive} = useCaption();
  const {downloadTranscript} = useTranscriptDownload();
  return (
    <View style={styles.btnContainer}>
      <PrimaryButton
        iconSize={20}
        iconColor={$config.FONT_COLOR}
        iconName={iconName}
        containerStyle={[styles.btnContainerStyle, containerStyle] as Object}
        textStyle={[styles.btnTxtStyle, textStyle] as Object}
        onPress={() => {
          downloadTranscript();
        }}
        text={text}
      />
    </View>
  );
};

export default DownloadTranscriptBtn;

const styles = StyleSheet.create({
  btnContainerStyle: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  btnContainer: {
    // margin: 20,
  },

  btnTxtStyle: {
    fontSize: ThemeConfig.FontSize.small,
    lineHeight: ThemeConfig.FontSize.small,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: $config.FONT_COLOR,
  },
});
