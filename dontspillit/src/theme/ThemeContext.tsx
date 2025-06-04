import React from 'react';
import { useColorScheme } from 'react-native';

type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    secondaryText: string;
    border: string;
    notification: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#FF9F9F',
    background: '#F2F2F7',
    card: 'rgba(255, 255, 255, 0.8)',
    text: '#000000',
    secondaryText: '#8E8E93',
    border: '#C6C6C8',
    notification: '#FF3B30',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#FF9F9F',
    background: '#000000',
    card: 'rgba(28, 28, 30, 0.8)',
    text: '#FFFFFF',
    secondaryText: '#8E8E93',
    border: '#38383A',
    notification: '#FF453A',
  },
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = React.useState(colorScheme === 'dark');

  const toggleTheme = React.useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const theme = React.useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 