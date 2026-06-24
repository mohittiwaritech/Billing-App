import { create } from "zustand";
import dbService from "../services/dbService";

const useStore = create((set, get) => ({

  /* BUSINESS PROFILE */
  businessProfile: {
    businessName: "Billing Zone POS",
    mobile: "",
    email: "",
    description: "",
    gst: "",
    address: "",
    state: "",
    type: "",
    category: ""
  },

  updateBusinessProfile: (data) =>
    set((state) => ({
      businessProfile: {
        ...state.businessProfile,
        ...data
      }
    })),


  /* DATA INJECTION FROM DB (Used by dbService's onSnapshot listeners) */
  setCategories: (categories) => set({ categories }),
  setProducts: (products) => set({ products }),
  setCustomers: (customers) => set({ customers }),
  setSales: (sales) => set({ sales }),


  /* CATEGORY DATA */
  categories: [],

  addCategory: async (name) => {
    // Write to Firestore. Local state will be updated automatically via listener.
    await dbService.addCategory(name);
  },

  updateCategory: async (id, name) => {
    await dbService.updateCategory(id, name);
  },

  deleteCategory: async (id) => {
    await dbService.deleteCategory(id);
  },


  /* PRODUCT DATA */
  products: [],

  addProduct: async (product) => {
    await dbService.addProduct(product);
  },

  updateProduct: async (id, data) => {
    await dbService.updateProduct(id, data);
  },

  deleteProduct: async (id) => {
    await dbService.deleteProduct(id);
  },


  /* CUSTOMER DATA */
  customers: [],

  addCustomer: async (customer) => {
    await dbService.addCustomer(customer);
  },

  deleteCustomer: async (id) => {
    await dbService.deleteCustomer(id);
  },


  /* SALES DATA */
  sales: [],

  addSale: async (sale) => {
    const currentSales = get().sales;
    const invoiceNumber = currentSales.length + 1;

    const salePayload = {
      ...sale,
      invoiceNo: "#" + invoiceNumber,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    await dbService.addSale(salePayload);
  },

  deleteSale: async (id) => {
    await dbService.deleteSale(id);
  }

}));

export default useStore;