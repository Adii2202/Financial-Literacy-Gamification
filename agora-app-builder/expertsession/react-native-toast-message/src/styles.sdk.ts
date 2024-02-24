import isMobileOrTablet from '../../src/utils/isMobileOrTablet';
import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
  base: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  top: {
    top: 30
  },
  bottom: {
    bottom: 0
  }
});
