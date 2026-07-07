import React,{useState} from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TextInput,
TouchableOpacity,
Modal,
Alert,
Image,
KeyboardAvoidingView,
ScrollView,
Platform
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {Ionicons} from "@expo/vector-icons";
import {Picker} from "@react-native-picker/picker";

import useStore from "../../../components/store/useStore";

export default function Products(){

const {products,categories,addProduct,updateProduct,deleteProduct,addCategory}=useStore();

const [search,setSearch]=useState("");
const [modal,setModal]=useState(false);
const [catModal,setCatModal]=useState(false);

const [name,setName]=useState("");
const [price,setPrice]=useState("");
const [category,setCategory]=useState("");
const [image,setImage]=useState("");

const [editId,setEditId]=useState(null);
const [newCategory,setNewCategory]=useState("");

/* IMAGE PICKER */

const pickImage = async () => {

let result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.Images,
allowsEditing:true,
aspect:[1,1],
quality:1
});

if(!result.canceled){
setImage(result.assets[0].uri);
}

};

/* OPEN ADD */

const openAdd=()=>{
setEditId(null);
setName("");
setPrice("");
setCategory("");
setImage("");
setModal(true);
};

/* OPEN EDIT */

const openEdit=(item)=>{
setEditId(item.id);
setName(item.name);
setPrice(String(item.price));
setCategory(item.category);
setImage(item.image || "");
setModal(true);
};

/* SAVE PRODUCT */

const saveProduct=()=>{

if(!name || !price){
Alert.alert("Error","Enter product name & price");
return;
}

if(editId){

updateProduct(editId,{
name,
price:Number(price),
category,
image
});

}else{

addProduct({
id:Date.now().toString(),
name,
price:Number(price),
category,
image
});

}

setModal(false);

};

/* SAVE CATEGORY */

const saveCategory=()=>{

if(!newCategory.trim()){
Alert.alert("Enter category name");
return;
}

addCategory(newCategory);

setNewCategory("");
setCatModal(false);

};

/* SEARCH */

const filtered=products.filter((p)=>
  p?.name?.toLowerCase()?.includes(search.toLowerCase())
);

return(

<View style={styles.container}>

<Text style={styles.title}>Products</Text>

<TextInput
style={styles.search}
placeholder="Search product..."
value={search}
onChangeText={setSearch}
/>

<FlatList
data={filtered}
keyExtractor={(item)=>item.id}

renderItem={({item})=>(

<View style={styles.card}>

{item.image!=="" && (
<Image
source={{uri:item.image}}
style={styles.image}
/>
)}

<View style={{flex:1}}>

<Text style={styles.name}>{item.name}</Text>
<Text style={styles.category}>{item.category}</Text>

</View>

<View style={styles.right}>

<Text style={styles.price}>₹{item.price}</Text>

<TouchableOpacity onPress={()=>openEdit(item)}>
<Ionicons name="create-outline" size={22} color="#3b82f6"/>
</TouchableOpacity>

<TouchableOpacity onPress={()=>deleteProduct(item.id)}>
<Ionicons name="trash-outline" size={22} color="red"/>
</TouchableOpacity>

</View>

</View>

)}
/>

<TouchableOpacity style={styles.addBtn} onPress={openAdd}>
<Ionicons name="add" size={30} color="#fff"/>
</TouchableOpacity>


{/* ADD PRODUCT MODAL */}

<Modal visible={modal} transparent animationType="fade">
<KeyboardAvoidingView style={styles.modalBg} behavior={Platform.OS === "ios" ? "padding" : "height"}>

<View style={styles.modalBox}>

<View style={styles.modalHeader}>

<Text style={styles.modalTitle}>{editId ? "Edit Product" : "Add Product"}</Text>

<TouchableOpacity onPress={()=>setModal(false)}>
<Ionicons name="close" size={26} color="#64748b"/>
</TouchableOpacity>

</View>

<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:20}}>

<View style={styles.imagePreviewBox}>

{image && image.trim() !== "" ? (
<Image source={{uri:image}} style={styles.previewImage}/>
) : (
<View style={{alignItems:"center"}}>
<Ionicons name="image-outline" size={32} color="#9ca3af" />
<Text style={styles.previewText}>No Image Selected</Text>
</View>
)}

</View>

<Text style={styles.label}>Image URL</Text>

<TextInput
style={styles.input}
placeholder="Paste image link here"
placeholderTextColor="#9ca3af"
value={image}
onChangeText={setImage}
/>

<TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
<Ionicons name="images-outline" size={20} color="#4f46e5" style={{marginRight:8}}/>
<Text style={styles.uploadText}>Select from Gallery</Text>
</TouchableOpacity>

<Text style={styles.label}>Product Name *</Text>

<TextInput
style={styles.input}
placeholder="e.g. Printer, Mouse"
placeholderTextColor="#9ca3af"
value={name}
onChangeText={setName}
/>

<Text style={styles.label}>Price (₹) *</Text>

<TextInput
style={styles.input}
placeholder="0.00"
placeholderTextColor="#9ca3af"
value={price}
onChangeText={setPrice}
keyboardType="numeric"
/>

<Text style={styles.label}>Category</Text>

<View style={styles.dropdown}>

<Picker
selectedValue={category}
onValueChange={(value)=>setCategory(value)}
style={{height:54, color:"#1e293b"}}
dropdownIconColor="#4f46e5"
>

<Picker.Item label="Select Category..." value="" color="#9ca3af" />

{categories.map((item)=>(
<Picker.Item
key={item.id}
label={item.name}
value={item.name}
color="#1e293b"
/>
))}

</Picker>

</View>

<TouchableOpacity onPress={()=>setCatModal(true)}>
<Text style={styles.addCategory}>+ Create New Category</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.saveBtn} onPress={saveProduct}>
<Text style={styles.saveText}>Save Product</Text>
</TouchableOpacity>

</ScrollView>

</View>

</KeyboardAvoidingView>
</Modal>


{/* CATEGORY MODAL */}

<Modal visible={catModal} transparent animationType="fade">

<View style={styles.centerModal}>

<View style={styles.catBox}>

<View style={styles.modalHeader}>

<Text style={styles.modalTitle}>Add Category</Text>

<TouchableOpacity onPress={()=>setCatModal(false)}>
<Ionicons name="close" size={24}/>
</TouchableOpacity>

</View>

<TextInput
style={styles.input}
placeholder="Category name"
value={newCategory}
onChangeText={setNewCategory}
/>

<TouchableOpacity style={styles.saveBtn} onPress={saveCategory}>
<Text style={styles.saveText}>Save Category</Text>
</TouchableOpacity>

</View>

</View>

</Modal>

</View>

);
}

const styles=StyleSheet.create({

container:{flex:1,padding:20,backgroundColor:"#f5f7fb"},

title:{fontSize:26,fontWeight:"bold",marginBottom:10},

search:{backgroundColor:"#fff",padding:12,borderRadius:10,marginBottom:10},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:12,
marginBottom:10,
flexDirection:"row",
alignItems:"center",
gap:10,
elevation:2
},

image:{width:50,height:50,borderRadius:8},

name:{fontWeight:"bold",fontSize:16},

category:{color:"#6b7280"},

price:{fontWeight:"bold",color:"#4f46e5"},

right:{flexDirection:"row",gap:12,alignItems:"center"},

addBtn:{
position:"absolute",
bottom:30,
right:20,
backgroundColor:"#4f46e5",
width:60,
height:60,
borderRadius:30,
justifyContent:"center",
alignItems:"center"
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
marginBottom:16
},

modalTitle:{
fontSize:22,
fontWeight:"bold",
color:"#1e293b"
},

imagePreviewBox:{
height:140,
borderWidth:1,
borderColor:"#e2e8f0",
borderRadius:12,
justifyContent:"center",
alignItems:"center",
marginBottom:10,
backgroundColor:"#f8fafc",
borderStyle:"dashed"
},

previewImage:{width:120,height:120,borderRadius:8},

previewText:{color:"#94a3b8", marginTop:8, fontWeight:"500"},

label:{
fontWeight:"600",
marginBottom:6,
marginTop:12,
color:"#475569"
},

input:{
borderWidth:1,
borderColor:"#cbd5e1",
borderRadius:10,
height:50,
paddingHorizontal:14,
backgroundColor:"#f8fafc",
color:"#1e293b",
fontSize:15
},

dropdown:{
borderWidth:1,
borderColor:"#cbd5e1",
borderRadius:10,
height:54,
justifyContent:"center",
backgroundColor:"#f8fafc"
},

uploadBtn:{
backgroundColor:"#e0e7ff",
padding:12,
borderRadius:10,
alignItems:"center",
marginBottom:10,
marginTop:10,
flexDirection:"row",
justifyContent:"center"
},

uploadText:{
color:"#4f46e5",
fontWeight:"bold",
fontSize:15
},

addCategory:{
color:"#4f46e5",
marginTop:12,
fontWeight:"600",
fontSize:14,
textAlign:"right"
},

saveBtn:{
backgroundColor:"#4f46e5",
padding:16,
borderRadius:12,
marginTop:24,
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
},

centerModal:{
flex:1,
backgroundColor:"rgba(15,23,42,0.6)",
justifyContent:"center",
alignItems:"center"
},

catBox:{
width:"85%",
backgroundColor:"#fff",
borderRadius:16,
padding:20,
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:10,
elevation:10
}

});