import AsyncStorage from '@react-native-async-storage/async-storage';

export type StorageLocation = 'fridge' | 'freezer' | 'pantry' | 'counter';
export type ProductCategory = 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'bread' | 'pantry' | 'other';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  location: StorageLocation;
  expiryDate: string;
  dateAdded: string;
  notes?: string;
}

const STORAGE_KEY = '@dontspillit_products';

export const storage = {
  async getProducts(): Promise<Product[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  },

  async addProduct(product: Omit<Product, 'id' | 'dateAdded'>): Promise<Product> {
    try {
      const products = await this.getProducts();
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...products, newProduct]));
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  async updateProduct(product: Product): Promise<void> {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.map(p => 
        p.id === product.id ? product : p
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(p => p.id !== productId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  getExpiryDays(category: ProductCategory): number {
    // Default expiry days by category
    const expiryMap: Record<ProductCategory, number> = {
      fruits: 7,
      vegetables: 7,
      dairy: 14,
      meat: 5,
      bread: 5,
      pantry: 180,
      other: 7,
    };
    return expiryMap[category];
  },

  calculateExpiryDate(category: ProductCategory): string {
    const days = this.getExpiryDays(category);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  },
}; 