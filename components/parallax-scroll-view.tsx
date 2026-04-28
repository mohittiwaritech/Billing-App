import React,{useState} from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TouchableOpacity
} from "react-native";

import useStore from "../../../components/store/useStore";

export default function AddSale({navigation}){

const {products,categories}=useStore();

const [selectedCategory,setSelectedCategory]=useState("All");
const [cart,setCart]=useState([]);


/* FILTER PRODUCTS */

const filteredProducts=
selectedCategory==="All"
?products
:products.filter((p)=>p.category===selectedCategory);


/* ADD ITEM */

const addItem=(product)=>{

const exists=cart.find((i)=>i.id===product.id);

if(exists){

setCart(
cart.map((i)=>
i.id===product.id
?{...i,qty:i.qty+1}
:i
)
);

}else{

setCart([...cart,{...product,qty:1}]);

}

};


/* REMOVE ITEM */

const removeItem=(product)=>{

const exists=cart.find((i)=>i.id===product.id);

if(!exists) return;

if(exists.qty===1){

setCart(cart.filter((i)=>i.id!==product.id));

}else{

setCart(
cart.map((i)=>
i.id===product.id
?{...i,qty:i.qty-1}
:i
)
);

}

};


/* GET QTY */

const getQty=(id)=>{
const item=cart.find((i)=>i.id===id);
return item?item.qty:0;
};


/* TOTAL */

const total=cart.reduce(
(sum,item)=>sum+item.price*item.qty,
0
);

const totalQty=cart.reduce(
(sum,item)=>sum+item.qty,
0
);


return(

<View style={styles.container}>

{/* CATEGORY BAR */}

<View style={styles.categoryBar}>

<FlatList
horizontal
showsHorizontalScrollIndicator={false}
data={[{id:"0",name:"All"},...categories]}
keyExtractor={(item)=>item.id}

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


{/* PRODUCTS */}

<View style={styles.products}>

<FlatList
data={filteredProducts}
numColumns={2}
keyExtractor={(item)=>item.id}

renderItem={({item})=>{

const qty=getQty(item.id);

return(

<View style={styles.productCard}>

<Text style={styles.productName}>
{item.name}
</Text>

<Text style={styles.productPrice}>
₹{item.price}
</Text>


{qty===0?(

<TouchableOpacity
style={styles.addBtn}
onPress={()=>addItem(item)}
>
<Text style={styles.addText}>
ADD
</Text>
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


{/* BOTTOM BAR */}

<View style={styles.bottomBar}>

<Text style={styles.totalText}>
Total Qty : {totalQty}
</Text>

<Text style={styles.totalPrice}>
₹{total}
</Text>

<TouchableOpacity
style={styles.checkoutBtn}
onPress={()=>navigation.navigate("PlaceOrder",{
cart,
total,
totalQty
})}
>

<Text style={styles.checkoutText}>
Checkout
</Text>

</TouchableOpacity>

</View>

</View>

);
}


const styles=StyleSheet.create({

container:{flex:1,backgroundColor:"#f5f7fb"},

categoryBar:{
padding:10,
backgroundColor:"#fff"
},

catBtn:{
padding:8,
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
margin:5,
borderRadius:12,
padding:15,
alignItems:"center",
elevation:2
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
paddingHorizontal:20,
paddingVertical:6,
borderRadius:6,
marginTop:10
},

addText:{
color:"#fff",
fontWeight:"bold"
},

qtyBox:{
flexDirection:"row",
marginTop:10,
alignItems:"center"
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

totalText:{
fontSize:16
},

totalPrice:{
fontSize:20,
fontWeight:"bold"
},

checkoutBtn:{
backgroundColor:"#4f46e5",
padding:16,
borderRadius:12,
marginTop:10,
alignItems:"center"
},

checkoutText:{
color:"#fff",
fontSize:18,
fontWeight:"bold"
}

});