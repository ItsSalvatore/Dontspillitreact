import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';

interface AnimationConfig {
  scale?: boolean;
  fade?: boolean;
  rotate?: boolean;
  translateY?: boolean;
  duration?: number;
  useHaptics?: boolean;
}

interface AnimatedValues {
  scale: Animated.Value;
  opacity: Animated.Value;
  rotation: Animated.Value;
  translateY: Animated.Value;
}

type TransformProperty = 
  | { scale: Animated.Value }
  | { rotate: Animated.AnimatedInterpolation<string> }
  | { translateY: Animated.Value };

interface AnimatedStyle {
  transform: TransformProperty[];
  opacity?: Animated.Value;
}

export const useAnimatedInteraction = (config: AnimationConfig = {}) => {
  const {
    scale = true,
    fade = false,
    rotate = false,
    translateY = false,
    duration = 150,
    useHaptics = true,
  } = config;

  const animatedValues = useRef<AnimatedValues>({
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    rotation: new Animated.Value(0),
    translateY: new Animated.Value(0),
  }).current;

  const animate = useCallback(
    (toValue: number) => {
      const animations = [];

      if (scale) {
        animations.push(
          Animated.timing(animatedValues.scale, {
            toValue: toValue === 1 ? 1 : 0.95,
            duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          })
        );
      }

      if (fade) {
        animations.push(
          Animated.timing(animatedValues.opacity, {
            toValue: toValue === 1 ? 1 : 0.7,
            duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          })
        );
      }

      if (rotate) {
        animations.push(
          Animated.timing(animatedValues.rotation, {
            toValue: toValue === 1 ? 0 : 1,
            duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          })
        );
      }

      if (translateY) {
        animations.push(
          Animated.timing(animatedValues.translateY, {
            toValue: toValue === 1 ? 0 : -2,
            duration,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
          })
        );
      }

      Animated.parallel(animations).start();
    },
    [scale, fade, rotate, translateY, duration]
  );

  const handlePressIn = useCallback(() => {
    if (useHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    animate(0);
  }, [animate, useHaptics]);

  const handlePressOut = useCallback(() => {
    animate(1);
  }, [animate]);

  const getAnimatedStyle = useCallback((): AnimatedStyle => {
    const transform: TransformProperty[] = [];

    if (scale) {
      transform.push({ scale: animatedValues.scale });
    }

    if (rotate) {
      const rotation = animatedValues.rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '2deg'],
      });
      transform.push({ rotate: rotation });
    }

    if (translateY) {
      transform.push({ translateY: animatedValues.translateY });
    }

    const style: AnimatedStyle = { transform };

    if (fade) {
      style.opacity = animatedValues.opacity;
    }

    return style;
  }, [scale, fade, rotate, translateY]);

  return {
    handlePressIn,
    handlePressOut,
    getAnimatedStyle,
  };
}; 