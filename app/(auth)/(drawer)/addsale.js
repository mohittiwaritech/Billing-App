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

<Image
source={{uri:item.image}}
style={styles.productImage}
/>

<Text style={styles.productName}>
{item.name}
</Text>

<Text style={styles.productPrice}>
₹{item.price}
</Text>


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

<ScrollView style={styles.paymentScreen}>

<TouchableOpacity
onPress={()=>setCheckout(false)}
style={styles.backBtn}
>
<Text style={styles.backText}>← Back</Text>
</TouchableOpacity>

<Text style={styles.title}>
Customer Information
</Text>

<TextInput
placeholder="Customer Name"
style={styles.input}
value={customerName}
onChangeText={setCustomerName}
/>

<TextInput
placeholder="Phone"
style={styles.input}
value={phone}
onChangeText={setPhone}
/>

<TextInput
placeholder="Address"
style={styles.input}
value={address}
onChangeText={setAddress}
/>

<Text style={styles.label}>
Payment Method
</Text>

<View style={styles.payRow}>

<TouchableOpacity
style={[
styles.payBtn,
payment==="Cash" && styles.activePay
]}
onPress={()=>setPayment("Cash")}
>
<Text>Cash</Text>
</TouchableOpacity>

<TouchableOpacity
style={[
styles.payBtn,
payment==="UPI" && styles.activePay
]}
onPress={()=>setPayment("UPI")}
>
<Text>UPI</Text>
</TouchableOpacity>

</View>

<View style={styles.billBox}>

<Text>Total Qty : {totalQty}</Text>

<Text style={styles.billAmount}>
₹{total}
</Text>

</View>

<TouchableOpacity
style={styles.placeBtn}
onPress={placeOrder}
>

<Text style={styles.placeText}>
Place Order
</Text>

</TouchableOpacity>

</ScrollView>

)}

</View>

);
}


const styles=StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f5f7fb"
},

search:{
backgroundColor:"#fff",
padding:12,
margin:10,
borderRadius:10,
borderWidth:1,
borderColor:"#ddd"
},

categoryBar:{
padding:10,
backgroundColor:"#fff"
},

catBtn:{
paddingVertical:8,
paddingHorizontal:15,
marginRight:10,
backgroundColor:"#eee",
borderRadius:20
},

activeCat:{
backgroundColor:"#4f46e5"
},

products:{
flex:1,
padding:10
},

productCard:{
flex:1,
backgroundColor:"#fff",
margin:6,
borderRadius:12,
padding:12,
alignItems:"center",
elevation:2,
minHeight:150
},

productImage:{
width:60,
height:60,
borderRadius:10,
marginBottom:6,
resizeMode:"contain"
},

productName:{
fontWeight:"bold"
},

productPrice:{
color:"#4f46e5",
marginTop:5
},

addBtn:{
backgroundColor:"#22c55e",
paddingHorizontal:18,
paddingVertical:6,
borderRadius:6,
marginTop:8
},

addText:{
color:"#fff",
fontWeight:"bold"
},

qtyBox:{
flexDirection:"row",
marginTop:10
},

qtyBtn:{
backgroundColor:"#4f46e5",
paddingHorizontal:12,
borderRadius:6
},

qtyText:{
color:"#fff",
fontSize:18
},

qtyNumber:{
marginHorizontal:10,
fontWeight:"bold"
},

bottomBar:{
backgroundColor:"#fff",
padding:15,
borderTopWidth:1,
borderColor:"#eee"
},

totalPrice:{
fontSize:20,
fontWeight:"bold"
},

checkoutBtn:{
backgroundColor:"#4f46e5",
paddingVertical:16,
borderRadius:10,
marginTop:10,
alignItems:"center"
},

checkoutText:{
color:"#fff",
fontWeight:"bold"
},

paymentScreen:{
padding:20
},

backBtn:{
marginBottom:10
},

backText:{
fontSize:16,
color:"#4f46e5"
},

title:{
fontSize:22,
fontWeight:"bold"
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:8,
padding:12,
marginTop:12
},

label:{
marginTop:15
},

payRow:{
flexDirection:"row",
marginTop:10
},

payBtn:{
flex:1,
padding:12,
borderWidth:1,
borderColor:"#ddd",
alignItems:"center"
},

activePay:{
backgroundColor:"#ddd"
},

billBox:{
marginTop:20
},

billAmount:{
fontSize:24,
fontWeight:"bold"
},

placeBtn:{
backgroundColor:"#4f46e5",
padding:16,
borderRadius:10,
marginTop:20,
alignItems:"center"
},

placeText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
}

});