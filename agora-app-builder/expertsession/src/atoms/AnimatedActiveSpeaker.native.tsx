import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  withDelay,
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

interface AnimatedActiveSpeakerProps {
  isSpeaking: boolean;
}

const Line = ({delay, styleProp, isSpeaking}) => {
  const bar = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      height: interpolate(bar.value, [0, 1], [6, 12]),
      //   transform: [
      //     {
      //       scale: interpolate(bar.value, [0, 1], [0.7, 1.2]),

      //     },
      //   ],
    };
  });
  React.useEffect(() => {
    bar.value = withDelay(
      delay,
      withRepeat(withTiming(1, {duration: 1200}), -1),
    );
  }, []);
  return (
    <Animated.View style={[styles.line, styleProp, isSpeaking && style]} />
  );
};

const AnimatedActiveSpeaker = ({isSpeaking}: AnimatedActiveSpeakerProps) => {
  return (
    <View style={styles.container}>
      <Line
        delay={0}
        styleProp={{height: 6, marginRight: 2.5}}
        isSpeaking={isSpeaking}
      />
      <Line
        delay={400}
        styleProp={{height: 12, marginRight: 2.5}}
        isSpeaking={isSpeaking}
      />
      <Line delay={800} styleProp={{height: 6}} isSpeaking={isSpeaking} />
    </View>
  );
};

export default AnimatedActiveSpeaker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    width: 2.5,
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    borderRadius: 25,
  },
});
