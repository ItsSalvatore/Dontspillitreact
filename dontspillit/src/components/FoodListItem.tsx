import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { GlassCard } from './GlassCard';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: string;
  expiryDate: string;
  daysUntilExpiry: number;
  category: string;
  onPress: () => void;
};

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  switch (category.toLowerCase()) {
    case 'dairy':
      return 'water-outline';
    case 'bread':
      return 'restaurant-outline';
    case 'vegetables':
      return 'leaf-outline';
    case 'fruits':
      return 'nutrition-outline';
    case 'meat':
      return 'fast-food-outline';
    default:
      return 'cube-outline';
  }
};

const getExpiryColor = (days: number): string => {
  if (days <= 1) return '#FF453A';
  if (days <= 3) return '#FFD60A';
  return '#32D74B';
};

export const FoodListItem: React.FC<Props> = ({
  name,
  expiryDate,
  daysUntilExpiry,
  category,
  onPress,
}) => {
  const { theme } = useTheme();
  const icon = getCategoryIcon(category);
  const expiryColor = getExpiryColor(daysUntilExpiry);

  return (
    <GlassCard onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {name}
          </Text>
          <Text style={[styles.date, { color: theme.colors.secondaryText }]}>
            Vervalt op {expiryDate}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: expiryColor }]}>
          <Text style={styles.badgeText}>
            {daysUntilExpiry} {daysUntilExpiry === 1 ? 'dag' : 'dagen'}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
}); 