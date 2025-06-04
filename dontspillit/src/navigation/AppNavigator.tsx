import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { PillNavBar } from '../components/PillNavBar';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ScanScreen } from '../screens/ScanScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AddProductScreen } from '../screens/AddProductScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useTheme();
  
  const tabs = [
    {
      name: 'Home',
      component: HomeScreen,
      options: {
        title: 'Home',
        icon: 'home-outline',
      },
    },
    {
      name: 'Inventory',
      component: InventoryScreen,
      options: {
        title: 'Voorraad',
        icon: 'list-outline',
      },
    },
    {
      name: 'Scan',
      component: ScanScreen,
      options: {
        title: 'Scannen',
        icon: 'scan-outline',
      },
    },
    {
      name: 'Settings',
      component: SettingsScreen,
      options: {
        title: 'Instellingen',
        icon: 'settings-outline',
      },
    },
  ];

  return (
    <Tab.Navigator
      tabBar={props => (
        <PillNavBar
          tabs={tabs.map(tab => ({
            icon: tab.options.icon as keyof typeof Ionicons.glyphMap,
            label: tab.options.title,
            screen: tab.name,
          }))}
          activeTab={props.state.routes[props.state.index].name}
          onTabPress={(screen) => props.navigation.navigate(screen)}
        />
      )}
      screenOptions={{
        headerStyle: {
          backgroundColor: 'transparent',
        },
        headerTransparent: true,
        headerTintColor: theme.colors.text,
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={tab.options}
        />
      ))}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { theme } = useTheme();
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerTintColor: theme.colors.text,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{
            title: 'Product toevoegen',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator; 