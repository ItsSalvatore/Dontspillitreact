import React from 'react';
import { StyleSheet, Pressable, ViewStyle, Animated, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';
import * as Haptics from 'expo-haptics';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
};

export const GlassCard: React.FC<Props> = ({ children, style, onPress }) => {
  const { theme } = useTheme();
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(scale, {
        toValue: 0.98,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const animatedStyle = {
    transform: [{ scale }],
  };

  const Card = (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <BlurView intensity={40} tint="light" style={styles.blurContainer}>
        <View style={[
          styles.content,
          {
            backgroundColor: theme.colors.background + '20',
          }
        ]}>
          {children}
        </View>
      </BlurView>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {Card}
      </Pressable>
    );
  }

  return Card;
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
}); 