import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  base: {
    flexDirection: 'row',
    borderRadius: 4,
    borderTopWidth: 4,
    backgroundColor: $config.CARD_LAYER_4_COLOR,
    width: '100%',
    paddingHorizontal: Platform.OS === 'android' ? 16 : 24,
    paddingVertical: 16,
    height: 'auto',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2
  },
  contentContainer: {
    flex: 1,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  text1: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Source Sans Pro',
    fontWeight: '700'
  },
  text2: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    fontFamily: 'Source Sans Pro'
  }
});
