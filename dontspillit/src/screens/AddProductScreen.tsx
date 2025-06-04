import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { storage, ProductCategory, StorageLocation } from '../utils/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useProducts } from '../hooks/useProducts';
import { nanoid } from 'nanoid/non-secure';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SPACING = 8;
const GRID_PADDING = 16;
const OPTION_WIDTH = (SCREEN_WIDTH - (GRID_PADDING * 2) - GRID_SPACING) / 2;

const categories: { value: ProductCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'fruits', label: 'Fruit', icon: 'nutrition' },
  { value: 'vegetables', label: 'Groenten', icon: 'leaf' },
  { value: 'dairy', label: 'Zuivel', icon: 'water' },
  { value: 'meat', label: 'Vlees', icon: 'restaurant' },
  { value: 'bread', label: 'Brood', icon: 'pizza' },
  { value: 'pantry', label: 'Voorraadkast', icon: 'file-tray' },
  { value: 'other', label: 'Overig', icon: 'fast-food' },
];

const locations: { value: StorageLocation; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'fridge', label: 'Koelkast', icon: 'snow' },
  { value: 'freezer', label: 'Vriezer', icon: 'thermometer' },
  { value: 'pantry', label: 'Voorraadkast', icon: 'file-tray' },
  { value: 'counter', label: 'Aanrecht', icon: 'home' },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const AddProductScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<ProductCategory>('other');
  const [location, setLocation] = React.useState<StorageLocation>('pantry');
  const [expiryDate, setExpiryDate] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [notes, setNotes] = React.useState('');

  const inputScale = useSharedValue(0.95);
  const saveScale = useSharedValue(1);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const { addProduct } = useProducts();

  React.useEffect(() => {
    inputScale.value = withSpring(1, {
      mass: 1,
      damping: 15,
      stiffness: 120,
    });
  }, []);

  React.useEffect(() => {
    // Auto-calculate expiry date when category changes
    const date = new Date();
    date.setDate(date.getDate() + storage.getExpiryDays(category));
    setExpiryDate(date);
  }, [category]);

  const handleSave = async () => {
    if (!name || !category || !location) return;

    try {
      await addProduct({
        id: nanoid(),
        name,
        category,
        location,
        expiryDate,
        notes: notes || undefined,
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving product:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      backgroundColor: theme.colors.background + '80',
    };
  });

  const inputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const saveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const renderOption = (
    option: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap },
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable
      key={option.value}
      style={styles.optionButton}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      <View style={[
        styles.optionInner,
        isSelected && { backgroundColor: theme.colors.primary + '20' }
      ]}>
        <Ionicons
          name={option.icon}
          size={24}
          color={isSelected ? theme.colors.primary : theme.colors.text}
        />
        <Text
          style={[
            styles.optionLabel,
            { color: isSelected ? theme.colors.primary : theme.colors.text }
          ]}
        >
          {option.label}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AnimatedBlurView
        intensity={30}
        tint="light"
        style={[styles.header, headerStyle]}
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.inputContainer, inputStyle]}>
          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Productnaam</Text>
              <TextInput
                style={[styles.input, {
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }]}
                value={name}
                onChangeText={setName}
                placeholder="Voer productnaam in"
                placeholderTextColor={theme.colors.secondaryText}
              />
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Categorie</Text>
              <View style={styles.optionsGrid}>
                {categories.map((cat) =>
                  renderOption(cat, category === cat.value, () => setCategory(cat.value))
                )}
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Locatie</Text>
              <View style={styles.optionsGrid}>
                {locations.map((loc) =>
                  renderOption(loc, location === loc.value, () => setLocation(loc.value))
                )}
              </View>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Houdbaarheidsdatum</Text>
              <Pressable
                style={[styles.dateButton, {
                  borderColor: theme.colors.border,
                }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowDatePicker(true);
                }}
              >
                <BlurView intensity={30} tint="light" style={[StyleSheet.absoluteFill, styles.dateBlur]} />
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.dateText, { color: theme.colors.text }]}>
                  {expiryDate.toLocaleDateString('nl-NL')}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={expiryDate}
                  mode="date"
                  display="default"
                  onChange={(event: any, date?: Date) => {
                    setShowDatePicker(false);
                    if (date) setExpiryDate(date);
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Notities</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.notesInput,
                  {
                    color: theme.colors.text,
                    borderColor: theme.colors.border,
                  },
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optionele notities"
                placeholderTextColor={theme.colors.secondaryText}
                multiline
                numberOfLines={4}
              />
            </View>
          </GlassCard>
        </Animated.View>
      </Animated.ScrollView>

      <Animated.View style={[styles.saveButtonContainer, saveButtonStyle]}>
        <BlurView intensity={80} tint="light" style={styles.saveButtonBlur}>
          <Pressable
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Opslaan</Text>
          </Pressable>
        </BlurView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  inputContainer: {
    gap: 12,
  },
  card: {
    padding: 0,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  cardContent: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    width: '50%',
    padding: 4,
  },
  optionInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 8,
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateBlur: {
    borderRadius: 12,
  },
  dateText: {
    fontSize: 16,
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  saveButtonBlur: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveButton: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 