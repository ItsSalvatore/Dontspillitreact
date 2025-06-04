import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useTheme, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { ProductCard, Product } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  AddProduct: undefined;
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const categories: Array<{ id: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'all', label: 'Alles', icon: 'apps' },
  { id: 'fruit', label: 'Fruit', icon: 'nutrition' },
  { id: 'groenten', label: 'Groenten', icon: 'leaf' },
  { id: 'zuivel', label: 'Zuivel', icon: 'water' },
  { id: 'vlees', label: 'Vlees', icon: 'restaurant' },
  { id: 'brood', label: 'Brood', icon: 'pizza' },
];

const locations: Array<{ id: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'all', label: 'Alle locaties', icon: 'location' },
  { id: 'koelkast', label: 'Koelkast', icon: 'snow' },
  { id: 'vriezer', label: 'Vriezer', icon: 'thermometer' },
  { id: 'voorraadkast', label: 'Voorraadkast', icon: 'file-tray' },
  { id: 'aanrecht', label: 'Aanrecht', icon: 'home' },
];

const sortOptions: Array<{ id: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { id: 'expiry', label: 'Vervaldatum', icon: 'time' },
  { id: 'name', label: 'Naam', icon: 'text' },
  { id: 'category', label: 'Categorie', icon: 'apps' },
];

export const InventoryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  const scrollY = useSharedValue(0);
  const { products, loading, refreshProducts } = useProducts();

  const filteredProducts = products
    .filter(product => selectedLocation === 'all' || product.location === selectedLocation)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  }, [refreshProducts]);

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('AddProduct');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.filterButtons}>
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterButton, selectedLocation === 'koelkast' && styles.filterButtonActive]}
            onPress={() => setSelectedLocation('koelkast')}
          >
            <Ionicons name="snow" size={20} color={theme.colors.text} />
            <Text style={[styles.filterText, { color: theme.colors.text }]}>Koelkast</Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, selectedLocation === 'vriezer' && styles.filterButtonActive]}
            onPress={() => setSelectedLocation('vriezer')}
          >
            <Ionicons name="thermometer" size={20} color={theme.colors.text} />
            <Text style={[styles.filterText, { color: theme.colors.text }]}>Vriezer</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterButton, sortBy === 'name' && styles.filterButtonActive]}
            onPress={() => setSortBy('name')}
          >
            <Ionicons name="text" size={20} color={theme.colors.text} />
            <Text style={[styles.filterText, { color: theme.colors.text }]}>Naam</Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, sortBy === 'category' && styles.filterButtonActive]}
            onPress={() => setSortBy('category')}
          >
            <Ionicons name="apps" size={20} color={theme.colors.text} />
            <Text style={[styles.filterText, { color: theme.colors.text }]}>Categorie</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredProducts.length > 0 ? (
          <View style={styles.productList}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={(p) => {
                  // Handle product press
                  console.log('Product pressed:', p);
                }}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="file-tray-outline" size={48} color={theme.colors.text + '40'} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Geen producten gevonden
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.text + '80' }]}>
              Voeg producten toe om ze hier te zien verschijnen
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterButtons: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterText: {
    fontSize: 15,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  productList: {
    gap: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH * 0.7,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 90, // Account for tab bar
    paddingHorizontal: 16,
    alignItems: 'flex-end',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 