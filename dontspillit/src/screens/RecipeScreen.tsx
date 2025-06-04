import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  FlatList,
} from 'react-native';
import { Header } from '../components/Header';
import { FloatingButton } from '../components/FloatingButton';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Pasta Carbonara',
    ingredients: ['Pasta', 'Eggs', 'Cheese', 'Bacon'],
    time: '30 min',
    difficulty: 'Medium',
  },
  {
    id: '2',
    name: 'Chicken Curry',
    ingredients: ['Chicken', 'Rice', 'Curry Sauce'],
    time: '45 min',
    difficulty: 'Easy',
  },
];

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
      <BlurView intensity={80} style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="restaurant" size={24} color="#FF9F9F" />
          <View style={styles.cardTitleContainer}>
            <Animated.Text style={styles.cardTitle}>{recipe.name}</Animated.Text>
            <Animated.Text style={styles.cardSubtitle}>
              {recipe.time} • {recipe.difficulty}
            </Animated.Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
        </View>
        <View style={styles.ingredientsContainer}>
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <View key={index} style={styles.ingredientTag}>
              <Animated.Text style={styles.ingredientText}>
                {ingredient}
              </Animated.Text>
            </View>
          ))}
        </View>
      </BlurView>
    </Animated.View>
  );
};

export const RecipeScreen = () => {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const handleAddRecipe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement add recipe functionality
  };

  return (
    <View style={styles.container}>
      <Header title="Recepten" scrollY={scrollY} />
      
      <Animated.FlatList
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: 100 + insets.top }
        ]}
        data={RECIPES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => {}} />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <FloatingButton onPress={handleAddRecipe}>
        <Ionicons name="add" size={24} color="white" />
      </FloatingButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 36,
  },
  ingredientTag: {
    backgroundColor: '#FF9F9F20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 13,
    color: '#FF9F9F',
    fontWeight: '500',
  },
}); 