import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle, StyleProp } from 'react-native';

type Props = {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  rotate?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function FloatingIcon({
  children,
  amplitude = 6,
  duration = 2400,
  rotate = false,
  style,
}: Props) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t, duration]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -amplitude] });
  const rotateZ = t.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '4deg'] });

  const transform: any[] = [{ translateY }];
  if (rotate) transform.push({ rotate: rotateZ });

  return <Animated.View style={[{ transform }, style]}>{children}</Animated.View>;
}
