import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Linking,
  Pressable,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../components/GlassCard';
import { AnimatedHeader } from '../components/AnimatedHeader';
import * as Haptics from 'expo-haptics';
import { useSharedValue } from 'react-native-reanimated';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const scrollY = useSharedValue(0);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const handleNotificationToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(prev => !prev);
  };

  const handleSoundToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSoundEnabled(prev => !prev);
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTheme();
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://www.dontspillit.com/privacy');
  };

  const handleHelpPress = () => {
    Linking.openURL('https://www.dontspillit.com/help');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedHeader
        title="Instellingen"
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
        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Profiel
          </Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="person-outline" size={24} color={theme.colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Thema
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
                  {theme.dark ? 'Donker thema actief' : 'Licht thema actief'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme.dark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={theme.colors.primary}
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Notificaties
          </Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Meldingen
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
                  Ontvang herinneringen over bijna verlopen producten
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={theme.colors.primary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-medium-outline" size={24} color={theme.colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Geluiden
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
                  Geluid bij meldingen
                </Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={theme.colors.primary}
            />
          </View>
        </GlassCard>

        <GlassCard style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Over de app
          </Text>
          <Pressable onPress={handlePrivacyPress} style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={24} color={theme.colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Privacy Policy
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
                  Lees ons privacybeleid
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.secondaryText} />
          </Pressable>

          <Pressable onPress={handleHelpPress} style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Help
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
                  Veelgestelde vragen en ondersteuning
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.secondaryText} />
          </Pressable>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} style={styles.icon} />
              <View>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                  Versie
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.secondaryText }]}>
                  1.0.0
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>
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
    gap: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  icon: {
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 19,
  },
}); 