import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  useDerivedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type TabItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  screen: string;
};

type Props = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (screen: string) => void;
};

export const PillNavBar: React.FC<Props> = ({ tabs, activeTab, onTabPress }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const activeIndex = tabs.findIndex(tab => tab.screen === activeTab);
  const windowWidth = Dimensions.get('window').width;
  const TAB_WIDTH = windowWidth / tabs.length;

  const pillPosition = useDerivedValue(() => {
    return withSpring(activeIndex * TAB_WIDTH, {
      damping: 20,
      stiffness: 180,
      mass: 1,
    });
  });

  const pillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: pillPosition.value,
        },
      ],
    };
  });

  const handleTabPress = (screen: string, index: number) => {
    onTabPress(screen);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          backgroundColor: 'transparent',
        },
      ]}
    >
      <BlurView intensity={50} tint="light" style={styles.blurView}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.pill,
              {
                width: TAB_WIDTH * 0.8,
                left: TAB_WIDTH * 0.1,
                backgroundColor: theme.colors.primary + '80',
              },
              pillStyle,
            ]}
          />
          {tabs.map((tab, index) => (
            <Pressable
              key={tab.screen}
              style={[
                styles.tab,
                {
                  width: TAB_WIDTH,
                },
              ]}
              onPress={() => handleTabPress(tab.screen, index)}
            >
              <Animated.View style={styles.iconContainer}>
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={activeTab === tab.screen ? '#FFFFFF' : theme.colors.secondaryText}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: activeTab === tab.screen ? '#FFFFFF' : theme.colors.secondaryText,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Animated.View>
            </Pressable>
          ))}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  blurView: {
    overflow: 'hidden',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flexDirection: 'row',
    height: 64,
    position: 'relative',
    marginHorizontal: 8,
  },
  pill: {
    position: 'absolute',
    height: '80%',
    top: '10%',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
}); 