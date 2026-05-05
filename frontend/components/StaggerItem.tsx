import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle, StyleProp } from 'react-native';

type Props = {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  step?: number;
  duration?: number;
  translateY?: number;
  style?: StyleProp<ViewStyle>;
};

export default function StaggerItem({
  children,
  index = 0,
  delay = 0,
  step = 70,
  duration = 480,
  translateY = 14,
  style,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    const startDelay = delay + index * step;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay: startDelay,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
      Animated.timing(ty, {
        toValue: 0,
        duration,
        delay: startDelay,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, ty, index, delay, step, duration]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY: ty }] }, style]}>
      {children}
    </Animated.View>
  );
}
