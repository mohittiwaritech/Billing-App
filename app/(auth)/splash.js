import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>

      <Drawer.Screen
        name="dashboard"
        options={{ title: "Dashboard" }}
      />

      <Drawer.Screen
        name="addsale"
        options={{ title: "Add Sale" }}
      />

      <Drawer.Screen
        name="products"
        options={{ title: "Products" }}
      />

      <Drawer.Screen
        name="customers"
        options={{ title: "Customers" }}
      />

      <Drawer.Screen
        name="category"
        options={{ title: "Categories" }}
      />

      <Drawer.Screen
        name="salesorders"
        options={{ title: "Sales Orders" }}
      />

      <Drawer.Screen
        name="reports"
        options={{ title: "Reports" }}
      />

      <Drawer.Screen
        name="settings"
        options={{ title: "Settings" }}
      />

    </Drawer>
  );
}