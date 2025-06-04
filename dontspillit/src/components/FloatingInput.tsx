import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Animated,
  TextInputProps,
  Platform,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface FloatingInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  error,
  value,
  onChangeText,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);
  const animation = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle: Animated.WithAnimatedObject<TextStyle> = {
    position: 'absolute' as const,
    left: 0,
    top: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 0],
    }),
    fontSize: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.secondaryText, theme.colors.primary],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            borderBottomColor: error
              ? theme.colors.error
              : isFocused
              ? theme.colors.primary
              : theme.colors.border,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor={theme.colors.secondaryText}
        selectionColor={theme.colors.primary}
        {...props}
      />
      {error && (
        <Animated.Text
          style={[
            styles.error,
            { color: theme.colors.error },
          ]}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingTop: 18,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderBottomWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
}); 