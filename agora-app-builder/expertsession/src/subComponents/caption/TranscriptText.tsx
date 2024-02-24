import {Text, View, StyleSheet} from 'react-native';
import React from 'react';

import ThemeConfig from '../../../src/theme';
import hexadecimalTransparency from '../../../src/utils/hexadecimalTransparency';
import {formatTime} from './utils';

interface TranscriptTextProps {
  user: string;
  time: number;
  value: string;
  searchQuery?: string;
}

export const TranscriptText = ({
  user,
  time,
  value,
  searchQuery = '',
}: TranscriptTextProps) => {
  const t = time ? formatTime(Number(time)) : '';
  const regex = searchQuery ? new RegExp(`(${searchQuery})`, 'gi') : ' ';
  const parts = value.split(regex);

  return (
    <View key={user} style={styles.transcriptTextContainer}>
      <View style={styles.nameTimeContainer}>
        <Text
          numberOfLines={1}
          textBreakStrategy="simple"
          ellipsizeMode="tail"
          style={[styles.transcriptName]}>
          {user}
        </Text>
        <Text style={styles.timestamp}>{t}</Text>
      </View>

      <View>
        <Text style={[styles.transciptText]}>
          {/* If substring matches search query then highlight it */}
          {parts.map((part, index) =>
            part.toLowerCase() === searchQuery.toLowerCase() &&
            searchQuery !== '' ? (
              <Text key={index} style={styles.highlightedText}>
                {searchQuery ? part : part + ' '}
              </Text>
            ) : (
              <Text key={index}>{searchQuery ? part : part + ' '}</Text>
            ),
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nameTimeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    justifyContent: 'flex-start',
  },

  transcriptTextContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  transciptText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
    color: $config.FONT_COLOR + hexadecimalTransparency['70%'],
  },

  transcriptName: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    fontFamily: ThemeConfig.FontFamily.sansPro,
    color: $config.FONT_COLOR,
    maxWidth: 160,
  },

  timestamp: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 8,
    color: $config.FONT_COLOR + hexadecimalTransparency['40%'],
    fontFamily: ThemeConfig.FontFamily.sansPro,
    fontWeight: '400',
  },
  highlightedText: {
    backgroundColor: $config.SEMANTIC_NEUTRAL,
  },
});
