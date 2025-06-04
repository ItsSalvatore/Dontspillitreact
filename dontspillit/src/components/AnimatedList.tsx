import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export const AnimatedList: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {React.Children.map(children, (child, index) => (
        <Animated.View
          entering={FadeInDown.delay(index * 100).springify()}
          style={styles.item}
        >
          {child}
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  item: {
    marginBottom: 8,
  },
}); 