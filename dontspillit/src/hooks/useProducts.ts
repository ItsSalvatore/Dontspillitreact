import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../components/ProductCard';

const STORAGE_KEY = '@products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert string dates back to Date objects
        const withDates = parsed.map((p: any) => ({
          ...p,
          expiryDate: new Date(p.expiryDate),
        }));
        setProducts(withDates);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProducts = async (newProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const addProduct = async (product: Product) => {
    const newProducts = [...products, product];
    await saveProducts(newProducts);
  };

  const updateProduct = async (updatedProduct: Product) => {
    const newProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    await saveProducts(newProducts);
  };

  const deleteProduct = async (productId: string) => {
    const newProducts = products.filter(p => p.id !== productId);
    await saveProducts(newProducts);
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts,
  };
}; 