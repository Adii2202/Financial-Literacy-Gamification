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

const Ring = ({delay}) => {
  const ring = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 4]),
        },
      ],
    };
  });
  React.useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(withTiming(1, {duration: 4000}), -1),
    );
  }, []);

  return <Animated.View style={[styles.ring, style]} />;
};

const AnimatedRings = ({isActiveSpeaker, children, isMobileView}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isActiveSpeaker ? (
        <>
          <Ring delay={0} />
          <Ring delay={1000} />
          <Ring delay={2000} />
          <Ring delay={3000} />
        </>
      ) : (
        <></>
      )}
      {children}
    </View>
  );
};

export default AnimatedRings;

const styles = StyleSheet.create({
  ring: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: $config.PRIMARY_ACTION_BRAND_COLOR,
    position: 'absolute',
  },
});
