import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GlassCard } from '../components/GlassCard';
import { AnimatedHeader } from '../components/AnimatedHeader';
import * as Haptics from 'expo-haptics';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const scrollY = useSharedValue(0);

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Scan' as never);
  };

  const handleInventoryPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Inventory' as never);
  };

  const cardScale = useSharedValue(1);

  React.useEffect(() => {
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 0 }),
      withSpring(1, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedHeader
        title="Don't Spill It"
        scrollY={scrollY}
        backgroundColor={theme.colors.background}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollY.value = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.cardsContainer, animatedStyle]}>
          <GlassCard style={styles.welcomeCard}>
            <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
              Welkom bij Don't Spill It
            </Text>
            <Text style={[styles.welcomeText, { color: theme.colors.secondaryText }]}>
              Beheer je voorraad en voorkom voedselverspilling
            </Text>
          </GlassCard>

          <Pressable onPress={handleScanPress} style={styles.cardWrapper}>
            <GlassCard style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name="scan-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                    Product Scannen
                  </Text>
                  <Text style={[styles.actionSubtitle, { color: theme.colors.secondaryText }]}>
                    Scan een product om toe te voegen
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.secondaryText} />
              </View>
            </GlassCard>
          </Pressable>

          <Pressable onPress={handleInventoryPress} style={styles.cardWrapper}>
            <GlassCard style={styles.actionCard}>
              <View style={styles.actionContent}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                  <Ionicons name="list-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.actionText}>
                  <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                    Voorraad Bekijken
                  </Text>
                  <Text style={[styles.actionSubtitle, { color: theme.colors.secondaryText }]}>
                    Bekijk en beheer je producten
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.colors.secondaryText} />
              </View>
            </GlassCard>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  welcomeCard: {
    padding: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionCard: {
    padding: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
  },
}); 