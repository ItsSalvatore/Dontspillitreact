import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';

type Props = {
  title: string;
  scrollY: SharedValue<number>;
  backgroundColor: string;
};

export const AnimatedHeader: React.FC<Props> = ({ title, scrollY, backgroundColor }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const headerHeight = 44 + insets.top;
  const inputRange = [0, 100];

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0, 1],
      'clamp'
    );

    return {
      opacity,
      backgroundColor: backgroundColor + '80',
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [1, 0],
      'clamp'
    );

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [1.1, 0.9],
      'clamp'
    );

    const translateY = interpolate(
      scrollY.value,
      inputRange,
      [0, -8],
      'clamp'
    );

    return {
      opacity,
      transform: [
        { scale },
        { translateY },
      ],
    };
  });

  return (
    <View style={[styles.container, { height: headerHeight }]}>
      <Animated.View style={[styles.background, headerStyle]}>
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill}>
          <View style={styles.blur} />
        </BlurView>
      </Animated.View>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <Animated.Text style={[styles.title, { color: theme.colors.text }, titleStyle]}>
          {title}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  blur: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
}); 