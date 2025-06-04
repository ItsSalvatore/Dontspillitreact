/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanScreen } from './src/screens/ScanScreen';
import { InventoryScreen } from './src/screens/InventoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AddProductScreen } from './src/screens/AddProductScreen';
import { PillNavBar } from './src/components/PillNavBar';
import { View } from 'react-native';
import { useTheme } from './src/theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Inventory: undefined;
  Scan: undefined;
  Settings: undefined;
  AddProduct: undefined;
};

type ScreenName = keyof RootStackParamList;

const Stack = createNativeStackNavigator<RootStackParamList>();

const tabs = [
  { icon: 'home-outline' as const, label: 'Home', screen: 'Home' as const },
  { icon: 'list-outline' as const, label: 'Inventory', screen: 'Inventory' as const },
  { icon: 'scan-outline' as const, label: 'Scan', screen: 'Scan' as const },
  { icon: 'settings-outline' as const, label: 'Settings', screen: 'Settings' as const },
];

function AppContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<ScreenName>('Home');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen 
          name="AddProduct" 
          component={AddProductScreen}
          options={{
            presentation: 'modal',
            headerShown: true,
            headerTransparent: true,
            headerTitle: 'Product toevoegen',
            headerTintColor: theme.colors.text,
            headerBackTitle: 'Terug',
          }}
        />
      </Stack.Navigator>
      <PillNavBar
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={(screen) => {
          const screenName = screen as ScreenName;
          setActiveTab(screenName);
          navigation.navigate(screenName);
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
