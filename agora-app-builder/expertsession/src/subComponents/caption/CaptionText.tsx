import {Text, View, StyleSheet, LayoutChangeEvent} from 'react-native';
import React from 'react';

import ThemeConfig from '../../../src/theme';
import hexadecimalTransparency from '../../../src/utils/hexadecimalTransparency';
import {isAndroid, isMobileUA} from '../../utils/common';

interface CaptionTextProps {
  user: string;
  value: string;
  activeSpeakersCount: number;
  isActiveSpeaker?: boolean;
  activelinesAvailable?: number;
  setActiveLinesAvailable?: React.Dispatch<React.SetStateAction<number>>;
  inActiveLinesAvailable?: number;
  setInActiveLinesAvaialble?: React.Dispatch<React.SetStateAction<number>>;
}

const DESKTOP_LINE_HEIGHT = 28;
const MOBILE_LINE_HEIGHT = 21;
const MAX_CAPTIONS_LINES_ALLOWED = 3;

const CaptionText = ({
  user,
  value,
  activeSpeakersCount,
  isActiveSpeaker = false,
  activelinesAvailable,
  setActiveLinesAvailable,
  inActiveLinesAvailable,
  setInActiveLinesAvaialble,
}: CaptionTextProps) => {
  const isMobile = isMobileUA();

  const LINE_HEIGHT = isMobile ? MOBILE_LINE_HEIGHT : DESKTOP_LINE_HEIGHT;

  // callback triggers whenevere captions reaches next line
  const handleTextLayout = (event: LayoutChangeEvent) => {
    let textHeight = event.nativeEvent.layout.height; // height of the <Text>

    /* safari at only zoom level 85% gives value as 27,54,81... for lineHeight instead of 28,56,84... */
    /* IOS,Androis gives 21.33 instead of 21 */
    /* so added the threshold of 1 in isDiffLineHeight */

    const lineHeightOffset = textHeight % LINE_HEIGHT;
    const isDiffLineHeight = lineHeightOffset > 1;
    const isLineHeightGreater = lineHeightOffset < 15;
    const delta = isDiffLineHeight
      ? isLineHeightGreater
        ? -lineHeightOffset
        : LINE_HEIGHT - lineHeightOffset
      : 0;

    const currentLines = Math.floor((textHeight + delta) / LINE_HEIGHT); // calculate numberOfLines
    const currentAllowedLines = Math.min(
      currentLines,
      MAX_CAPTIONS_LINES_ALLOWED,
    );

    if (isActiveSpeaker) {
      setActiveLinesAvailable(currentAllowedLines);
    } else {
      setInActiveLinesAvaialble(currentAllowedLines);
    }
  };

  /**
   * Total 5 lines (2-nameTags, MAX_CAPTIONS_LINES_ALLOWED-captions) => 1/5 = 0.2 flex for 1 line
   * activeSpeaker Container will take flex depending on number of lines taken + 1 (name tag)
   * prevSpeaker Conatiner will take 1 - flex , calculated in prev step
   * If activeSpaker has three lines , then it will take entire space with flex:1 and preSpeaker flex:0
   *
   */

  return (
    <View
      style={[
        styles.captionContainer,
        {borderColor: isActiveSpeaker ? 'yellow' : 'white'},
        {
          flex:
            activeSpeakersCount === 1
              ? 1
              : isActiveSpeaker
              ? activelinesAvailable === MAX_CAPTIONS_LINES_ALLOWED
                ? 1
                : (activelinesAvailable + 1) * 0.2
              : activelinesAvailable === MAX_CAPTIONS_LINES_ALLOWED
              ? 0
              : 1 - (activelinesAvailable + 1) * 0.2,
        },
        !isActiveSpeaker && activelinesAvailable === 3 && {height: 0},
      ]}>
      <Text
        style={[
          styles.captionUserName,
          isMobile ? styles.mobileNameFontSize : styles.desktopNameFontSize,
        ]}
        numberOfLines={1}
        textBreakStrategy="simple"
        ellipsizeMode="tail">
        {user}
      </Text>
      <View
        style={[
          styles.captionTextContainerStyle,
          {
            height:
              (isActiveSpeaker
                ? activelinesAvailable
                : Math.min(
                    inActiveLinesAvailable,
                    MAX_CAPTIONS_LINES_ALLOWED - activelinesAvailable,
                  )) * LINE_HEIGHT,
          },
        ]}>
        <Text
          onLayout={handleTextLayout}
          style={[
            styles.captionText,
            isMobile
              ? styles.mobileCaptionFontSize
              : styles.desktopCaptionFontSize,
            isAndroid() && {lineHeight: MOBILE_LINE_HEIGHT - 2},
          ]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default CaptionText;

const styles = StyleSheet.create({
  captionContainer: {
    alignItems: 'flex-start',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 620,
    justifyContent: 'flex-end',
    borderStyle: 'dotted',
  },

  captionTextContainerStyle: {
    overflow: 'hidden',
    width: '100%',
    position: 'relative',
  },

  captionText: {
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    color: $config.FONT_COLOR,
    position: 'absolute',
    bottom: 0,
  },

  captionUserName: {
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    color: $config.FONT_COLOR + hexadecimalTransparency['70%'],
    fontSize: ThemeConfig.FontSize.medium,
    maxWidth: 200,
  },
  mobileNameFontSize: {
    fontSize: 16,
    lineHeight: 19,
  },
  desktopNameFontSize: {
    fontSize: 18,
    lineHeight: 22,
  },
  mobileCaptionFontSize: {
    fontSize: 16,
    lineHeight: MOBILE_LINE_HEIGHT,
  },
  desktopCaptionFontSize: {
    fontSize: 24,
    lineHeight: DESKTOP_LINE_HEIGHT,
  },
});
