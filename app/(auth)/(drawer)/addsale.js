import React,{useState} from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TouchableOpacity,
TextInput,
Alert,
Image,
Dimensions,
ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useStore from "../../../components/store/useStore";

const screenWidth = Dimensions.get("window").width;

export default function AddSale(){

const {products,categories,addSale,addCustomer} = useStore();

const [selectedCategory,setSelectedCategory]=useState("All");
const [cart,setCart]=useState([]);
const [checkout,setCheckout]=useState(false);

const [search,setSearch]=useState("");

const [customerName,setCustomerName]=useState("");
const [phone,setPhone]=useState("");
const [address,setAddress]=useState("");
const [payment,setPayment]=useState("Cash");


const filteredProducts =
products.filter(p =>
p.name.toLowerCase().includes(search.toLowerCase()) &&
(selectedCategory==="All" || p.category===selectedCategory)
);


const addItem=(product)=>{

const exists=cart.find(i=>i.id===product.id);

if(exists){

setCart(
cart.map(i=>
i.id===product.id
?{...i,qty:i.qty+1}
:i
)
);

}else{

setCart([...cart,{...product,qty:1}]);

}

};


const removeItem=(product)=>{

const exists=cart.find(i=>i.id===product.id);

if(!exists) return;

if(exists.qty===1){

setCart(cart.filter(i=>i.id!==product.id));

}else{

setCart(
cart.map(i=>
i.id===product.id
?{...i,qty:i.qty-1}
:i
)
);

}

};


const getQty=(id)=>{
const item=cart.find(i=>i.id===id);
return item?item.qty:0;
};


const total=cart.reduce(
(sum,item)=>sum+item.price*item.qty,
0
);

const totalQty=cart.reduce(
(sum,item)=>sum+item.qty,
0
);


const placeOrder=()=>{

if(cart.length===0){
Alert.alert("Cart Empty","Please add items");
return;
}

addSale({
id:Date.now().toString(),
items:cart,
qty:totalQty,
total,
payment,
customer:{
name:customerName,
phone,
address
}
});

if(customerName){

addCustomer({
name:customerName,
phone,
address
});

}

Alert.alert("Success","Order Placed");

setCart([]);
setCustomerName("");
setPhone("");
setAddress("");
setCheckout(false);

};


return(

<View style={styles.container}>


{!checkout && (

<>

<TextInput
style={styles.search}
placeholder="Search product..."
value={search}
onChangeText={setSearch}
/>


<View style={styles.categoryBar}>

<FlatList
horizontal
showsHorizontalScrollIndicator={false}
data={[{id:"0",name:"All"},...categories]}
keyExtractor={item=>item.id}

renderItem={({item})=>(

<TouchableOpacity
style={[
styles.catBtn,
selectedCategory===item.name && styles.activeCat
]}
onPress={()=>setSelectedCategory(item.name)}
>

<Text style={{
color:selectedCategory===item.name?"#fff":"#000"
}}>
{item.name}
</Text>

</TouchableOpacity>

)}
/>

</View>



<View style={styles.products}>

<FlatList
data={filteredProducts}
numColumns={screenWidth > 500 ? 3 : 2}
keyExtractor={item=>item.id}

renderItem={({item})=>{

const qty=getQty(item.id);

return(

<View style={styles.productCard}>

{item.image && item.image.trim() !== "" ? (
<Image source={{uri:item.image}} style={styles.productImage}/>
) : (
<View style={[styles.productImage, {backgroundColor:"#f1f5f9", justifyContent:"center", alignItems:"center"}]}>
<Ionicons name="image-outline" size={24} color="#cbd5e1" />
</View>
)}

<View style={styles.productInfo}>
<Text style={styles.productName} numberOfLines={2}>
{item.name}
</Text>
<Text style={styles.productPrice}>
₹{item.price}
</Text>
</View>


{qty===0 ? (

<TouchableOpacity
style={styles.addBtn}
onPress={()=>addItem(item)}
>
<Text style={styles.addText}>ADD</Text>
</TouchableOpacity>

):(


<View style={styles.qtyBox}>

<TouchableOpacity
style={styles.qtyBtn}
onPress={()=>removeItem(item)}
>
<Text style={styles.qtyText}>-</Text>
</TouchableOpacity>

<Text style={styles.qtyNumber}>
{qty}
</Text>

<TouchableOpacity
style={styles.qtyBtn}
onPress={()=>addItem(item)}
>
<Text style={styles.qtyText}>+</Text>
</TouchableOpacity>

</View>

)}

</View>

);

}}
/>

</View>



<View style={styles.bottomBar}>

<Text>Total Qty : {totalQty}</Text>

<Text style={styles.totalPrice}>
₹{total}
</Text>

<TouchableOpacity
style={styles.checkoutBtn}
onPress={()=>{

if(cart.length===0){
Alert.alert("Cart Empty","Add item first");
return;
}

setCheckout(true);

}}
>

<Text style={styles.checkoutText}>
Checkout
</Text>

</TouchableOpacity>

</View>

</>

)}



{checkout && (

<ScrollView style={styles.paymentScreen} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:40}}>

<View style={styles.checkoutHeader}>
<TouchableOpacity onPress={()=>setCheckout(false)} style={styles.backBtn}>
<Ionicons name="arrow-back" size={26} color="#1e293b"/>
</TouchableOpacity>
<Text style={styles.title}>Checkout</Text>
<View style={{width:26}}/>
</View>

<Text style={styles.sectionTitle}>Customer Details</Text>

<View style={styles.inputCard}>
<Text style={styles.label}>Customer Name *</Text>
<TextInput
placeholder="e.g. John Doe"
placeholderTextColor="#9ca3af"
style={styles.input}
value={customerName}
onChangeText={setCustomerName}
/>

<Text style={styles.label}>Phone Number *</Text>
<TextInput
placeholder="e.g. 9876543210"
placeholderTextColor="#9ca3af"
style={styles.input}
keyboardType="phone-pad"
value={phone}
onChangeText={setPhone}
/>

<Text style={styles.label}>Address</Text>
<TextInput
placeholder="e.g. 123 Main St"
placeholderTextColor="#9ca3af"
style={styles.input}
value={address}
onChangeText={setAddress}
/>
</View>

<Text style={styles.sectionTitle}>Payment Method</Text>

<View style={styles.payRow}>

<TouchableOpacity
style={[styles.payBtn, payment==="Cash" && styles.activePay]}
onPress={()=>setPayment("Cash")}
>
<Ionicons name="cash-outline" size={24} color={payment==="Cash" ? "#fff" : "#4f46e5"} />
<Text style={[styles.payBtnText, payment==="Cash" && {color:"#fff"}]}>Cash</Text>
</TouchableOpacity>

<TouchableOpacity
style={[styles.payBtn, payment==="UPI" && styles.activePay]}
onPress={()=>setPayment("UPI")}
>
<Ionicons name="qr-code-outline" size={24} color={payment==="UPI" ? "#fff" : "#4f46e5"} />
<Text style={[styles.payBtnText, payment==="UPI" && {color:"#fff"}]}>UPI</Text>
</TouchableOpacity>

</View>

<View style={styles.billContainer}>
<View style={styles.billBox}>
<Text style={styles.billText}>Total Items</Text>
<Text style={styles.billValue}>{totalQty}</Text>
</View>

<View style={styles.billBoxTop}>
<Text style={styles.billTotalText}>Grand Total</Text>
<Text style={styles.billAmount}>₹{total}</Text>
</View>
</View>

<TouchableOpacity style={styles.placeBtn} onPress={placeOrder}>
<Ionicons name="checkmark-circle" size={20} color="#fff" style={{marginRight:8}}/>
<Text style={styles.placeText}>Confirm Order</Text>
</TouchableOpacity>

</ScrollView>

)}

</View>

);
}


const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f8fafc"
},

search:{
backgroundColor:"#fff",
padding:14,
margin:15,
borderRadius:12,
borderWidth:1,
borderColor:"#e2e8f0",
fontSize:15
},

categoryBar:{
paddingHorizontal:15,
paddingBottom:10,
backgroundColor:"#f8fafc"
},

catBtn:{
paddingVertical:10,
paddingHorizontal:20,
marginRight:12,
backgroundColor:"#e2e8f0",
borderRadius:20
},

activeCat:{
backgroundColor:"#4f46e5",
shadowColor:"#4f46e5",
shadowOpacity:0.3,
shadowRadius:5,
elevation:4
},

products:{
flex:1,
paddingHorizontal:10,
paddingBottom: 80
},

productCard:{
flex:1,
backgroundColor:"#fff",
margin:8,
borderRadius:16,
padding:12,
alignItems:"center",
shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:6,
elevation:2,
minHeight:180
},

productImage:{
width:80,
height:80,
borderRadius:12,
marginBottom:10,
resizeMode:"cover"
},

productInfo:{
alignItems: "center",
flex: 1,
justifyContent: "flex-start",
width: "100%"
},

productName:{
fontWeight:"bold",
fontSize:14,
color:"#1e293b",
textAlign:"center"
},

productPrice:{
color:"#10b981",
marginTop:4,
fontWeight:"bold",
fontSize:16
},

addBtn:{
backgroundColor:"#e0e7ff",
paddingHorizontal:24,
paddingVertical:8,
borderRadius:10,
marginTop:12,
width: "100%",
alignItems: "center"
},

addText:{
color:"#4f46e5",
fontWeight:"bold",
fontSize: 14
},

qtyBox:{
flexDirection:"row",
marginTop:12,
alignItems: "center",
justifyContent: "space-between",
width: "100%",
backgroundColor: "#f1f5f9",
borderRadius: 10,
padding: 4
},

qtyBtn:{
backgroundColor:"#fff",
width:32,
height:32,
borderRadius:8,
alignItems: "center",
justifyContent: "center",
shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:2,
elevation:1
},

qtyText:{
color:"#4f46e5",
fontSize:20,
fontWeight:"bold",
marginTop:-2
},

qtyNumber:{
marginHorizontal:10,
fontWeight:"bold",
fontSize:16,
color: "#1e293b"
},

bottomBar:{
position: "absolute",
bottom: 0,
left: 0,
right: 0,
backgroundColor:"#fff",
paddingHorizontal:20,
paddingVertical:15,
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
shadowColor:"#000",
shadowOpacity:0.1,
shadowRadius:10,
elevation:10,
borderTopLeftRadius: 20,
borderTopRightRadius: 20
},

totalPrice:{
fontSize:22,
fontWeight:"bold",
color: "#1e293b"
},

checkoutBtn:{
backgroundColor:"#4f46e5",
paddingVertical:14,
paddingHorizontal:24,
borderRadius:12,
alignItems:"center",
shadowColor:"#4f46e5",
shadowOpacity:0.3,
shadowRadius:5,
elevation:4
},

checkoutText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
},

paymentScreen:{
padding:20,
backgroundColor: "#f8fafc",
flex: 1
},

checkoutHeader: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 20,
marginTop: 10
},

backBtn:{
padding: 5
},

title:{
fontSize:22,
fontWeight:"bold",
color: "#1e293b"
},

sectionTitle: {
fontSize: 18,
fontWeight: "bold",
color: "#334155",
marginTop: 10,
marginBottom: 12
},

inputCard: {
backgroundColor: "#fff",
padding: 16,
borderRadius: 16,
shadowColor:"#000",
shadowOpacity:0.03,
shadowRadius:5,
elevation:2,
marginBottom: 20
},

label:{
marginTop:8,
marginBottom:4,
fontWeight: "600",
color: "#64748b"
},

input:{
borderWidth:1,
borderColor:"#e2e8f0",
borderRadius:10,
padding:12,
marginBottom:12,
backgroundColor: "#f8fafc",
color: "#1e293b",
fontSize: 15
},

payRow:{
flexDirection:"row",
gap: 12,
marginBottom: 24
},

payBtn:{
flex:1,
padding:16,
borderWidth:2,
borderColor:"#e0e7ff",
borderRadius:16,
alignItems:"center",
backgroundColor: "#fff"
},

activePay:{
backgroundColor:"#4f46e5",
borderColor:"#4f46e5",
shadowColor:"#4f46e5",
shadowOpacity:0.3,
shadowRadius:5,
elevation:4
},

payBtnText: {
marginTop: 8,
fontWeight: "bold",
color: "#4f46e5",
fontSize: 16
},

billContainer: {
backgroundColor: "#fff",
borderRadius: 16,
padding: 20,
shadowColor:"#000",
shadowOpacity:0.03,
shadowRadius:5,
elevation:2,
marginBottom: 24
},

billBox:{
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginBottom: 12
},

billText: {
color: "#64748b",
fontSize: 16
},
billValue: {
color: "#1e293b",
fontWeight: "bold",
fontSize: 16
},

billBoxTop: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
borderTopWidth: 1,
borderColor: "#f1f5f9",
paddingTop: 12
},

billTotalText: {
fontSize: 18,
fontWeight: "bold",
color: "#1e293b"
},

billAmount:{
fontSize:24,
fontWeight:"bold",
color: "#10b981"
},

placeBtn:{
backgroundColor:"#10b981",
padding:18,
borderRadius:14,
alignItems:"center",
flexDirection: "row",
justifyContent: "center",
shadowColor:"#10b981",
shadowOpacity:0.3,
shadowRadius:6,
elevation:5,
marginBottom: 20
},

placeText:{
color:"#fff",
fontWeight:"bold",
fontSize:18,
letterSpacing: 0.5
}

});