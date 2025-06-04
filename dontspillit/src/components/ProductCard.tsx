import React from 'react';
import { StyleSheet, Pressable, View, Text, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';

export interface Product {
  id: string;
  name: string;
  category: string;
  location: string;
  expiryDate: Date;
  notes?: string;
}

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const theme = useTheme();
  const daysUntilExpiry = Math.ceil((product.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getExpiryColor = () => {
    if (daysUntilExpiry <= 2) return '#FF4444';
    if (daysUntilExpiry <= 5) return '#FFAA33';
    return '#44DD44';
  };

  const getCategoryIcon = () => {
    switch (product.category) {
      case 'fruit': return 'nutrition';
      case 'groenten': return 'leaf';
      case 'zuivel': return 'water';
      case 'vlees': return 'restaurant';
      case 'brood': return 'pizza';
      default: return 'file-tray';
    }
  };

  return (
    <AnimatedPressable
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout.springify()}
      style={styles.container}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(product);
      }}
    >
      <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.categoryIcon}>
            <Ionicons name={getCategoryIcon()} size={20} color={theme.colors.text} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[styles.location, { color: theme.colors.text + '80' }]} numberOfLines={1}>
              {product.location}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={[styles.expiryBadge, { backgroundColor: getExpiryColor() + '20' }]}>
            <Ionicons 
              name={daysUntilExpiry <= 2 ? 'warning' : 'time'} 
              size={14} 
              color={getExpiryColor()} 
            />
            <Text style={[styles.expiryText, { color: getExpiryColor() }]}>
              {daysUntilExpiry === 0 ? 'Vandaag' : 
               daysUntilExpiry === 1 ? 'Morgen' : 
               `${daysUntilExpiry} dagen`}
            </Text>
          </View>
          {product.notes && (
            <View style={styles.notesBadge}>
              <Ionicons name="document-text" size={12} color={theme.colors.text + '60'} />
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  notesBadge: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}); 