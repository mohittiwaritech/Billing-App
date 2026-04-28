import React from "react";
import {
View,
Text,
FlatList,
StyleSheet,
TouchableOpacity
} from "react-native";

import useStore from "../../components/store/salesStore";

export default function SalesOrders(){

const {sales,deleteSale} = useStore();

return(

<View style={styles.container}>

<Text style={styles.title}>Sales Orders</Text>

{sales.length === 0 ? (
<Text style={styles.empty}>No Orders Yet</Text>
) : (

<FlatList
data={sales}
keyExtractor={(item)=>item.id.toString()}

renderItem={({item})=>(

<View style={styles.card}>

<View style={styles.header}>

<Text style={styles.customer}>
{item.customer?.name || "Walk-in Customer"}
</Text>

<Text style={styles.total}>
₹{item.total}
</Text>

</View>

<Text style={styles.payment}>
Payment : {item.payment}
</Text>

<Text style={styles.qty}>
Total Qty : {item.qty}
</Text>

<View style={styles.itemsBox}>

<Text style={styles.itemsTitle}>Items</Text>

{item.items.map((i,index)=>(
<Text key={index} style={styles.item}>
{i.name} x{i.qty}
</Text>
))}

</View>

<TouchableOpacity
style={styles.deleteBtn}
onPress={()=>deleteSale(item.id)}
>
<Text style={styles.deleteText}>
Delete Order
</Text>
</TouchableOpacity>

</View>

)}
/>

)}

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:15,
backgroundColor:"#f1f5f9"
},

title:{
fontSize:26,
fontWeight:"bold",
marginBottom:15
},

empty:{
textAlign:"center",
marginTop:40,
color:"#777"
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:12,
marginBottom:12,
elevation:3
},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

customer:{
fontSize:16,
fontWeight:"bold"
},

total:{
fontSize:18,
fontWeight:"bold",
color:"#4f46e5"
},

payment:{
marginTop:5,
color:"#555"
},

qty:{
marginTop:2,
color:"#555"
},

itemsBox:{
marginTop:10
},

itemsTitle:{
fontWeight:"bold"
},

item:{
marginLeft:10,
marginTop:2
},

deleteBtn:{
marginTop:12,
backgroundColor:"#ef4444",
padding:10,
borderRadius:8,
alignItems:"center"
},

deleteText:{
color:"#fff",
fontWeight:"bold"
}

});