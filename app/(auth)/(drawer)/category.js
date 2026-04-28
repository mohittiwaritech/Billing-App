import React, { useState } from "react";
import useStore from "../../../components/store/useStore";
import {
View,
Text,
TextInput,
TouchableOpacity,
FlatList,
Modal,
StyleSheet,
Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryScreen() {

const { categories, addCategory, updateCategory, deleteCategory } = useStore();

const [search, setSearch] = useState("");
const [modalVisible, setModalVisible] = useState(false);
const [categoryName, setCategoryName] = useState("");
const [editId, setEditId] = useState(null);

const openAddModal = () => {
setCategoryName("");
setEditId(null);
setModalVisible(true);
};

const closeModal = () => {
setModalVisible(false);
setCategoryName("");
setEditId(null);
};

const saveCategory = () => {

if (categoryName.trim() === "") {
Alert.alert("Error","Enter category name");
return;
}

/* DUPLICATE CHECK */

const exists = categories.find(
c => c.name.toLowerCase() === categoryName.toLowerCase() && c.id !== editId
);

if(exists){
Alert.alert("Duplicate","Category already exists");
return;
}

if (editId) {

updateCategory(editId, categoryName);

} else {

addCategory(categoryName);

}

closeModal();

};

const editCategory = (item) => {
setCategoryName(item.name);
setEditId(item.id);
setModalVisible(true);
};

const filteredCategories = categories.filter((item) =>
item.name.toLowerCase().includes(search.toLowerCase())
);

return (

<View style={styles.container}>

<Text style={styles.title}>Categories</Text>

<View style={styles.topBar}>

<View style={styles.searchBox}>
<Ionicons name="search" size={18} color="#777" />
<TextInput
placeholder="Search category"
value={search}
onChangeText={setSearch}
style={styles.search}
/>
</View>

<TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
<Ionicons name="add" size={20} color="white" />
</TouchableOpacity>

</View>

<FlatList
data={filteredCategories}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (

<View style={styles.card}>

<Text style={styles.categoryText}>{item.name}</Text>

<View style={styles.actions}>

<TouchableOpacity onPress={() => editCategory(item)}>
<Ionicons name="create-outline" size={20} color="#2F80ED" />
</TouchableOpacity>

<TouchableOpacity onPress={() => deleteCategory(item.id)}>
<Ionicons name="trash-outline" size={20} color="#EB5757" />
</TouchableOpacity>

</View>

</View>

)}
/>

{/* MODAL */}

<Modal visible={modalVisible} transparent animationType="fade">

<View style={styles.modalContainer}>

<View style={styles.modalBox}>

{/* HEADER */}

<View style={styles.modalHeader}>

<Text style={styles.modalTitle}>
{editId ? "Edit Category" : "Add Category"}
</Text>

<TouchableOpacity onPress={closeModal}>
<Ionicons name="close" size={24} color="#333"/>
</TouchableOpacity>

</View>

<TextInput
placeholder="Category Name"
value={categoryName}
onChangeText={setCategoryName}
style={styles.input}
/>

<TouchableOpacity style={styles.saveBtn} onPress={saveCategory}>
<Text style={styles.saveText}>
{editId ? "Update Category" : "Save Category"}
</Text>
</TouchableOpacity>

</View>

</View>

</Modal>

</View>

);
}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#F5F7FB"
},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:15
},

topBar:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:15
},

searchBox:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#fff",
paddingHorizontal:10,
borderRadius:8,
flex:1,
marginRight:10
},

search:{
flex:1,
padding:8
},

addBtn:{
backgroundColor:"#2F80ED",
width:40,
height:40,
borderRadius:8,
alignItems:"center",
justifyContent:"center"
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:10,
marginBottom:10,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

categoryText:{
fontSize:16
},

actions:{
flexDirection:"row",
gap:15
},

modalContainer:{
flex:1,
backgroundColor:"rgba(0,0,0,0.3)",
justifyContent:"center",
alignItems:"center"
},

modalBox:{
backgroundColor:"#fff",
width:"85%",
padding:20,
borderRadius:10
},

modalHeader:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
marginBottom:15
},

modalTitle:{
fontSize:18,
fontWeight:"bold"
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:8,
padding:10,
marginBottom:15
},

saveBtn:{
backgroundColor:"#2F80ED",
padding:12,
borderRadius:8,
alignItems:"center"
},

saveText:{
color:"#fff",
fontWeight:"bold"
}

});