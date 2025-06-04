import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { GlassModal } from '../components/GlassModal';
import { FloatingInput } from '../components/FloatingInput';
import { useTheme } from '../theme/ThemeContext';
import { GlassCard } from '../components/GlassCard';

export const ScanScreen = () => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = React.useState(false);
  const [scannedBarcode, setScannedBarcode] = React.useState('');
  const [productName, setProductName] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');

  const handleScan = (barcode: string) => {
    setScannedBarcode(barcode);
    setShowModal(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BarcodeScanner
        onScan={handleScan}
        onClose={() => {}}
      />
      <GlassModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <View style={styles.modalContent}>
          <GlassCard style={styles.card}>
            <FloatingInput
              label="Product Naam"
              value={productName}
              onChangeText={setProductName}
              autoFocus
            />
            <FloatingInput
              label="Vervaldatum"
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="YYYY-MM-DD"
            />
          </GlassCard>
        </View>
      </GlassModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    padding: 16,
  },
  card: {
    padding: 16,
  },
}); 