import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { BlurView } from 'expo-blur';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';

type Props = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

export const BarcodeScanner: React.FC<Props> = ({ onScan, onClose }) => {
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);
  const [isScanning, setIsScanning] = React.useState(true);

  const SCAN_AREA_SIZE = Math.min(Dimensions.get('window').width * 0.8, 300);
  const scanLinePosition = useSharedValue(0);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  React.useEffect(() => {
    if (isScanning) {
      scanLinePosition.value = withRepeat(
        withSequence(
          withTiming(SCAN_AREA_SIZE - 2, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [isScanning, SCAN_AREA_SIZE]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value }],
  }));

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    if (isScanning) {
      setIsScanning(false);
      onScan(data);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          Camera toegang aanvragen...
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.message, { color: theme.colors.text }]}>
          Geen toegang tot de camera
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.buttonText}>Toegang Aanvragen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={CameraType.back}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
        }}
        onBarCodeScanned={handleBarCodeScanned}
      >
        <Pressable style={styles.closeButton} onPress={onClose}>
          <BlurView intensity={80} style={styles.closeButtonBlur}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </BlurView>
        </Pressable>

        <View style={styles.overlay}>
          <View style={[styles.scanArea, { width: SCAN_AREA_SIZE, height: SCAN_AREA_SIZE }]}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
            <Animated.View
              style={[
                styles.scanLine,
                { backgroundColor: theme.colors.primary + '80' },
                scanLineStyle,
              ]}
            />
          </View>
          <BlurView intensity={40} tint="light" style={styles.instructionContainer}>
            <Text style={[styles.instruction, { color: theme.colors.text }]}>
              Plaats de barcode binnen het kader
            </Text>
          </BlurView>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FF9F9F',
    borderWidth: 3,
  },
  cornerTL: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTR: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBL: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBR: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#FF9F9F80',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 