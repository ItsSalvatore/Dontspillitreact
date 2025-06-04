import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  scrollY?: Animated.Value;
}

export const Header: React.FC<HeaderProps> = ({ title, scrollY = new Animated.Value(0) }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  
  const headerHeight = 44 + insets.top;
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const smallTitleOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { height: headerHeight }]}>
      <BlurView intensity={80} style={[styles.blur, { paddingTop: insets.top }]}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          {title}
        </Animated.Text>
        <Animated.Text 
          style={[
            styles.smallTitle,
            { opacity: smallTitleOpacity, transform: [{ translateY: insets.top }] }
          ]}
        >
          {title}
        </Animated.Text>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  blur: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.7)' : 'white',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  smallTitle: {
    position: 'absolute',
    top: 0,
    left: 16,
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
}); 