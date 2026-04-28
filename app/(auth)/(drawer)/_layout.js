import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useStore from "../../../components/store/useStore";

function CustomDrawer(props) {

const { businessProfile } = useStore();

const logout = () => {
router.replace("/login");
};

return (

<View style={{ flex: 1, justifyContent: "space-between" }}>

<DrawerContentScrollView {...props}>

<View style={styles.logoBox}>

<Ionicons name="storefront" size={30} color="#ff4d1c" />

<Text style={styles.logoText}>
{businessProfile?.businessName || "Billing Zone POS"}
</Text>

</View>

<DrawerItemList {...props} />

</DrawerContentScrollView>

<TouchableOpacity style={styles.logout} onPress={logout}>

<Ionicons name="log-out-outline" size={22} color="#fff" />

<Text style={styles.logoutText}>Logout</Text>

</TouchableOpacity>

</View>

);
}

export default function Layout() {

return (

<Drawer

backBehavior="none"

drawerContent={(props) => <CustomDrawer {...props} />}

screenOptions={({ navigation }) => ({

headerStyle: { backgroundColor: "#ff4d1c" },
headerTintColor: "#fff",

headerLeft: () => (
<TouchableOpacity
onPress={() => navigation.openDrawer()}
style={{ marginLeft: 15 }}
>
<Ionicons name="menu" size={28} color="#fff" />
</TouchableOpacity>
),

drawerActiveBackgroundColor: "#ff4d1c",
drawerActiveTintColor: "#fff",

drawerLabelStyle: {
fontSize: 16
},

drawerStyle: {
width: 280
},

drawerType: "front",
swipeEnabled: true,
overlayColor: "rgba(0,0,0,0.3)"

})}

>

<Drawer.Screen
name="dashboard"
options={{
title: "Dashboard",
drawerIcon: ({ color, size }) => (
<Ionicons name="home-outline" size={size} color={color} />
)
}}
/>

<Drawer.Screen
name="products"
options={{
title: "Products",
drawerIcon: ({ color, size }) => (
<Ionicons name="cube-outline" size={size} color={color} />
)
}}
/>

<Drawer.Screen
name="addsale"
options={{
title: "Add Sale",
drawerIcon: ({ color, size }) => (
<Ionicons name="add-circle-outline" size={size} color={color} />
)
}}
/>

<Drawer.Screen
name="salesorders"
options={{
title: "Sales Orders",
drawerIcon: ({ color, size }) => (
<Ionicons name="cart-outline" size={size} color={color} />
)
}}
/>

<Drawer.Screen
name="customers"
options={{
title: "Customers",
drawerIcon: ({ color, size }) => (
<Ionicons name="people-outline" size={size} color={color} />
)
}}
/>

<Drawer.Screen
name="reports"
options={{
title: "Reports",
drawerIcon: ({ color, size }) => (
<Ionicons name="stats-chart-outline" size={size} color={color} />
)
}}
/>

<Drawer.Screen
name="settings"
options={{
title: "Settings",
drawerIcon: ({ color, size }) => (
<Ionicons name="settings-outline" size={size} color={color} />
)
}}
/>

{/* Hidden Screens */}

<Drawer.Screen
name="profile"
options={{ drawerItemStyle: { display: "none" } }}
/>

<Drawer.Screen
name="category"
options={{ drawerItemStyle: { display: "none" } }}
/>

<Drawer.Screen
name="printSettings"
options={{ drawerItemStyle: { display: "none" } }}
/>

</Drawer>

);
}

const styles = StyleSheet.create({

logoBox: {
flexDirection: "row",
alignItems: "center",
paddingVertical: 25,
paddingHorizontal: 20
},

logoText: {
fontSize: 18,
fontWeight: "bold",
marginLeft: 10
},

logout: {
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
backgroundColor: "#ff4d1c",
margin: 20,
padding: 15,
borderRadius: 12
},

logoutText: {
color: "#fff",
fontWeight: "600",
marginLeft: 8
}

});