import firestore from '@react-native-firebase/firestore';
import useStore from '../store/useStore';

class DatabaseService {
  constructor() {
    // We don't need to explicitly enable offline persistence because
    // @react-native-firebase/firestore has it enabled by default!
    this.unsubscribeFunctions = [];
  }

  // --- START REALTIME SYNC ---
  startSync() {
    this.stopSync(); // Stop existing listeners if any

    // 1. Sync Categories
    const unsubCategories = firestore()
      .collection('categories')
      .onSnapshot(
        (snapshot) => {
          if (snapshot) {
            const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            useStore.getState().setCategories(categories);
          }
        },
        (error) => console.log('Error syncing categories:', error)
      );

    // 2. Sync Products
    const unsubProducts = firestore()
      .collection('products')
      .onSnapshot(
        (snapshot) => {
          if (snapshot) {
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            useStore.getState().setProducts(products);
          }
        },
        (error) => console.log('Error syncing products:', error)
      );

    // 3. Sync Customers
    const unsubCustomers = firestore()
      .collection('customers')
      .onSnapshot(
        (snapshot) => {
          if (snapshot) {
            const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            useStore.getState().setCustomers(customers);
          }
        },
        (error) => console.log('Error syncing customers:', error)
      );

    // 4. Sync Sales
    const unsubSales = firestore()
      .collection('sales')
      .orderBy('timestamp', 'asc') // So we can calculate invoice numbers or show history properly
      .onSnapshot(
        (snapshot) => {
          if (snapshot) {
            const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            useStore.getState().setSales(sales);
          }
        },
        (error) => console.log('Error syncing sales:', error)
      );

    // Save unsubscribe functions to clean up later
    this.unsubscribeFunctions = [
      unsubCategories,
      unsubProducts,
      unsubCustomers,
      unsubSales
    ];
  }

  stopSync() {
    this.unsubscribeFunctions.forEach(unsub => unsub());
    this.unsubscribeFunctions = [];
  }

  // --- WRITE OPERATIONS ---

  // Sales
  async addSale(saleData) {
    try {
      const docRef = await firestore().collection('sales').add({
        ...saleData,
        timestamp: firestore.FieldValue.serverTimestamp() // Good for sorting
      });
      return docRef.id;
    } catch (error) {
      console.error('Failed to add sale to Firestore:', error);
      throw error;
    }
  }

  async deleteSale(id) {
    try {
      await firestore().collection('sales').doc(id).delete();
    } catch (error) {
      console.error('Failed to delete sale from Firestore:', error);
      throw error;
    }
  }

  // Customers
  async addCustomer(customerData) {
    try {
      // Check if phone already exists (we could do this locally for speed, but doing it in DB ensures consistency)
      const exists = await firestore().collection('customers').where('phone', '==', customerData.phone).get();
      if (!exists.empty) return null; // Already exists
      
      const docRef = await firestore().collection('customers').add(customerData);
      return docRef.id;
    } catch (error) {
      console.error('Failed to add customer to Firestore:', error);
      throw error;
    }
  }

  async deleteCustomer(id) {
    try {
      await firestore().collection('customers').doc(id).delete();
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  }

  // Categories
  async addCategory(name) {
    try {
      const exists = await firestore().collection('categories').where('name', '==', name).get();
      if (!exists.empty) return null;
      
      const docRef = await firestore().collection('categories').add({ name });
      return docRef.id;
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  }

  async updateCategory(id, name) {
    try {
      await firestore().collection('categories').doc(id).update({ name });
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      await firestore().collection('categories').doc(id).delete();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  }

  // Products
  async addProduct(productData) {
    try {
      const exists = await firestore().collection('products').where('name', '==', productData.name).get();
      if (!exists.empty) return null;

      const docRef = await firestore().collection('products').add(productData);
      return docRef.id;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }

  async updateProduct(id, data) {
    try {
      await firestore().collection('products').doc(id).update(data);
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await firestore().collection('products').doc(id).delete();
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }
}

const dbService = new DatabaseService();
export default dbService;
