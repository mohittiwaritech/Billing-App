import { create } from "zustand";

const useStore = create((set) => ({

/* BUSINESS PROFILE */

businessProfile:{
businessName:"Billing Zone POS",
mobile:"",
email:"",
description:"",
gst:"",
address:"",
state:"",
type:"",
category:""
},

updateBusinessProfile:(data)=>
set((state)=>({
businessProfile:{
...state.businessProfile,
...data
}
})),

/* CATEGORY DATA */

categories: [
{ id: "1", name: "Food" },
{ id: "2", name: "Drinks" },
{ id: "3", name: "Desserts" }
],

/* PRODUCT DATA */

products: [],

/* CUSTOMER DATA */

customers: [],

/* ADD CUSTOMER */

addCustomer: (customer) =>
set((state) => {

const exists = state.customers.find(
(c) => c.phone === customer.phone
);

if (exists) return state;

return {
customers: [
...state.customers,
{
id: Date.now().toString(),
...customer
}
]
};

}),

/* DELETE CUSTOMER */

deleteCustomer: (id) =>
set((state) => ({
customers: state.customers.filter((c) => c.id !== id)
})),

/* ADD CATEGORY */

addCategory: (name) =>
set((state) => {

const exists = state.categories.find(
(c) => c.name.toLowerCase() === name.toLowerCase()
);

if (exists) return state;

return {
categories: [
...state.categories,
{ id: Date.now().toString(), name }
]
};

}),

/* UPDATE CATEGORY */

updateCategory: (id, name) =>
set((state) => ({
categories: state.categories.map((c) =>
c.id === id ? { ...c, name } : c
)
})),

/* DELETE CATEGORY */

deleteCategory: (id) =>
set((state) => ({
categories: state.categories.filter((c) => c.id !== id)
})),

/* PRODUCT DATA */

addProduct: (product) =>
set((state) => {

const exists = state.products.find(
(p) => p.name.toLowerCase() === product.name.toLowerCase()
);

if (exists) return state;

return {
products: [...state.products, product]
};

}),

updateProduct: (id, data) =>
set((state) => ({
products: state.products.map((p) =>
p.id === id ? { ...p, ...data } : p
)
})),

deleteProduct: (id) =>
set((state) => ({
products: state.products.filter((p) => p.id !== id)
})),

/* SALES */

sales: [],

addSale: (sale) =>
set((state) => {

const invoiceNumber = state.sales.length + 1;

return {

sales: [

...state.sales,

{
...sale,
invoiceNo: "#" + invoiceNumber,
date: new Date().toLocaleDateString(),
time: new Date().toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
})
}

]

};

}),

deleteSale: (id) =>
set((state) => ({
sales: state.sales.filter((s) => s.id !== id)
}))

}));

export default useStore;