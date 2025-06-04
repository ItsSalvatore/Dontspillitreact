import React from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  View,
  Platform,
} from 'react-native';

interface ExpiryBadgeProps {
  daysUntilExpiry: number;
}

export const ExpiryBadge: React.FC<ExpiryBadgeProps> = ({
  daysUntilExpiry,
}) => {
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const getColor = () => {
    if (daysUntilExpiry <= 2) return '#FF4B4B';
    if (daysUntilExpiry <= 5) return '#FFB23F';
    return '#4CAF50';
  };

  const getText = () => {
    if (daysUntilExpiry === 0) return 'Vervalt vandaag!';
    if (daysUntilExpiry === 1) return 'Vervalt morgen!';
    if (daysUntilExpiry < 0) return 'Vervallen!';
    return `Vervalt over ${daysUntilExpiry} dagen`;
  };

  const scale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.7, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getColor(),
          transform: [{ scale }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>{getText()}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
}); 