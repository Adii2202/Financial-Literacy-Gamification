import React from 'react';
import {TextInput, StyleSheet, Animated, Easing, View} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';
import ThemeConfig from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

interface CircleProgressProps {
  onComplete?: () => void;
  timer?: number; // in seconds
}

export default function CircularProgress(props: CircleProgressProps) {
  const {onComplete = () => {}, timer = 60} = props;
  const percentage = 100, // progress completion percentage
    radius = 30,
    strokeWidth = 5,
    color = $config.FONT_COLOR,
    delay = 0,
    max = 100;
  const duration = timer * 1000;

  const animatedvalue = React.useRef(new Animated.Value(100)).current;
  const circleRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  const animation = (toValue) => {
    return Animated.timing(animatedvalue, {
      toValue: toValue,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      onComplete();
    });
  };

  //to animate
  React.useEffect(() => {
    animation(0);
    animatedvalue.addListener((v) => {
      if (circleRef?.current) {
        const maxPercentage = (100 * v.value) / max;
        const strokeDashoffset =
          circleCircumference - (circleCircumference * maxPercentage) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }

      // for text
      if (inputRef?.current) {
        const value = Math.round((v.value / 100) * timer);
        inputRef.current.setNativeProps({
          text: `${value}`,
        });
      }
    });
    return () => {
      animatedvalue.removeAllListeners();
    };
  }, [max, percentage]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
      <Svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle} `}>
          <AnimatedCircle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.2}
          />
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference} // 0 or cicleCircumferen
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <AnimatedInput
        ref={inputRef}
        underlineColorAndroid="transparent"
        editable={false}
        style={[
          StyleSheet.absoluteFillObject,
          {
            fontFamily: ThemeConfig.FontFamily.sansPro,
            fontWeight: '700',
            fontSize: 16,
            textAlign: 'center',
            color: $config.FONT_COLOR,
          },
        ]}
      />
    </View>
  );
}
