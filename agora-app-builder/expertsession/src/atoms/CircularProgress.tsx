import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import ThemeConfig from '../theme';

interface CircleProgressProps {
  onComplete?: () => void;
  timer?: number; // in seconds
}

const CircularProgress = (props: CircleProgressProps) => {
  const {onComplete = () => {}, timer = 60} = props;
  const [seconds, setSeconds] = useState(timer);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const circleRef = React.useRef(null);
  const inputRef = React.useRef(null);
  let timeInterval;
  React.useEffect(() => {
    timeInterval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => {
      clearInterval(timeInterval); //when user exits, clear this interval.
    };
  }, []);

  useEffect(() => {
    const maxPercentage = (100 * seconds) / timer;
    const strokeDashoffset =
      circleCircumference - (circleCircumference * maxPercentage) / 100;
    setStrokeDashoffset(strokeDashoffset);
    if (seconds <= 0) {
      clearInterval(timeInterval);
      onComplete();
    }
  }, [seconds]);

  //configs
  const radius = 30,
    strokeWidth = 5,
    color = $config.FONT_COLOR;
  const halfCircle = radius + strokeWidth;
  const circleCircumference = 2 * Math.PI * radius;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <g transform={`rotate(-90,${halfCircle},${halfCircle}) `}>
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeOpacity={0.2}
          />
          <circle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset} // 0 or cicleCircumferen
            strokeLinecap="round"
          />
        </g>
      </svg>
      <Text
        style={[
          {
            fontFamily: ThemeConfig.FontFamily.sansPro,
            fontWeight: '700',
            fontSize: 16,
            textAlign: 'center',
            color: $config.FONT_COLOR,
            alignSelf: 'center',
            justifyContent: 'center',
            position: 'absolute',
          },
        ]}>
        {seconds}
      </Text>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({});
