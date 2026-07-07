import React, { useState } from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TouchableOpacity,
Modal,
TextInput,
Alert,
KeyboardAvoidingView,
ScrollView,
Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useStore from "../../../components/store/useStore";

export default function Customers(){

const {customers, addCustomer, deleteCustomer} = useStore();

const [modal, setModal] = useState(false);
const [name, setName] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");

const openAdd = () => {
  setName("");
  setPhone("");
  setAddress("");
  setModal(true);
};

const saveCustomer = () => {
  if(!name || !phone) {
    Alert.alert("Error", "Please enter customer name and phone.");
    return;
  }
  
  addCustomer({
    name,
    phone,
    address
  });
  
  setModal(false);
};

return(

<View style={styles.container}>

<Text style={styles.title}>Customers</Text>

{customers.length === 0 ? (
  <View style={styles.emptyState}>
    <Ionicons name="people-outline" size={60} color="#cbd5e1" />
    <Text style={styles.emptyText}>No customers added yet.</Text>
  </View>
) : (
<FlatList
data={customers}
keyExtractor={(item)=>item.id || Math.random().toString()}
showsVerticalScrollIndicator={false}
renderItem={({item})=>(

<View style={styles.card}>
  <View style={styles.avatar}>
    <Text style={styles.avatarText}>{item.name ? item.name.charAt(0).toUpperCase() : "?"}</Text>
  </View>
  
  <View style={styles.infoBox}>
    <Text style={styles.name}>{item.name}</Text>
    
    <View style={styles.iconRow}>
      <Ionicons name="call-outline" size={14} color="#64748b" />
      <Text style={styles.phone}>{item.phone}</Text>
    </View>
    
    {item.address ? (
    <View style={styles.iconRow}>
      <Ionicons name="location-outline" size={14} color="#64748b" />
      <Text style={styles.address}>{item.address}</Text>
    </View>
    ) : null}
  </View>
  
  <TouchableOpacity onPress={()=>deleteCustomer(item.id)} style={styles.deleteBtn}>
    <Ionicons name="trash-outline" size={20} color="#ef4444" />
  </TouchableOpacity>

</View>

)}
/>
)}

{/* FAB */}
<TouchableOpacity style={styles.addBtn} onPress={openAdd}>
<Ionicons name="add" size={30} color="#fff"/>
</TouchableOpacity>


{/* ADD CUSTOMER MODAL */}
<Modal visible={modal} transparent animationType="fade">
<KeyboardAvoidingView style={styles.modalBg} behavior={Platform.OS === "ios" ? "padding" : "height"}>

<View style={styles.modalBox}>

<View style={styles.modalHeader}>
<Text style={styles.modalTitle}>Add New Customer</Text>
<TouchableOpacity onPress={()=>setModal(false)}>
<Ionicons name="close" size={26} color="#64748b"/>
</TouchableOpacity>
</View>

<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:20}}>

<Text style={styles.label}>Customer Name *</Text>
<TextInput
style={styles.input}
placeholder="e.g. John Doe"
placeholderTextColor="#9ca3af"
value={name}
onChangeText={setName}
/>

<Text style={styles.label}>Phone Number *</Text>
<TextInput
style={styles.input}
placeholder="e.g. 9876543210"
placeholderTextColor="#9ca3af"
keyboardType="phone-pad"
value={phone}
onChangeText={setPhone}
/>

<Text style={styles.label}>Address</Text>
<TextInput
style={[styles.input, {height: 80}]}
placeholder="e.g. 123 Main St"
placeholderTextColor="#9ca3af"
multiline
textAlignVertical="top"
value={address}
onChangeText={setAddress}
/>

<TouchableOpacity style={styles.saveBtn} onPress={saveCustomer}>
<Text style={styles.saveText}>Save Customer</Text>
</TouchableOpacity>

</ScrollView>
</View>
</KeyboardAvoidingView>
</Modal>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#f1f5f9"
},

title:{
fontSize:26,
fontWeight:"bold",
marginBottom:20,
color:"#1e293b"
},

emptyState:{
flex: 1,
justifyContent: "center",
alignItems: "center",
marginTop: 50
},
emptyText:{
marginTop: 10,
color: "#94a3b8",
fontSize: 16
},

card:{
backgroundColor:"#fff",
padding:16,
borderRadius:16,
marginBottom:12,
flexDirection: "row",
alignItems: "center",
shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:8,
elevation:3
},

avatar:{
width: 50,
height: 50,
borderRadius: 25,
backgroundColor: "#e0e7ff",
justifyContent: "center",
alignItems: "center",
marginRight: 16
},

avatarText:{
fontSize: 22,
fontWeight: "bold",
color: "#4f46e5"
},

infoBox:{
flex: 1
},

name:{
fontSize:18,
fontWeight:"bold",
color: "#1e293b",
marginBottom: 4
},

iconRow:{
flexDirection: "row",
alignItems: "center",
marginTop: 4
},

phone:{
color:"#475569",
marginLeft: 6,
fontSize: 14
},

address:{
color:"#64748b",
marginLeft: 6,
fontSize: 13,
flexShrink: 1
},

deleteBtn:{
padding: 8,
backgroundColor: "#fef2f2",
borderRadius: 8
},

addBtn:{
position:"absolute",
bottom:30,
right:20,
backgroundColor:"#4f46e5",
width:60,
height:60,
borderRadius:30,
justifyContent:"center",
alignItems:"center",
shadowColor:"#4f46e5",
shadowOpacity:0.3,
shadowRadius:5,
elevation:5
},

modalBg:{
flex:1,
backgroundColor:"rgba(15,23,42,0.6)",
justifyContent:"center",
alignItems:"center"
},

modalBox:{
width:"92%",
maxHeight:"85%",
backgroundColor:"#fff",
borderRadius:16,
padding:20,
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:10,
elevation:10
},

modalHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
},

modalTitle:{
fontSize:22,
fontWeight:"bold",
color:"#1e293b"
},

label:{
fontWeight:"600",
marginBottom:8,
marginTop:12,
color:"#475569"
},

input:{
borderWidth:1,
borderColor:"#cbd5e1",
borderRadius:10,
height:50,
paddingHorizontal:14,
paddingVertical:12,
backgroundColor:"#f8fafc",
color:"#1e293b",
fontSize:15
},

saveBtn:{
backgroundColor:"#4f46e5",
padding:16,
borderRadius:12,
marginTop:30,
alignItems:"center",
shadowColor:"#4f46e5",
shadowOpacity:0.3,
shadowRadius:5,
elevation:4
},

saveText:{
color:"#fff",
fontWeight:"bold",
fontSize:16,
letterSpacing:0.5
}

});