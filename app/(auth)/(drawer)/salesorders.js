import React from "react";
import {
View,
Text,
FlatList,
StyleSheet,
TouchableOpacity
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import useStore from "../../../components/store/useStore";

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
keyExtractor={(item)=>item.id}

renderItem={({item})=>(

<View style={styles.card}>

{/* HEADER */}
<View style={styles.header}>

<View style={styles.customerSection}>

<View style={styles.iconBox}>
<Ionicons name="person" size={14} color="#fff"/>
</View>

<View style={{marginLeft:6}}>

<Text style={styles.customer}>
{item.customer?.name || "Walk-in Customer"}
</Text>

<Text style={styles.invoice}>
Invoice {item.invoiceNo}
</Text>

</View>

</View>

<View style={{alignItems:"flex-end"}}>

<Text style={styles.total}>
₹{item.total}
</Text>

<Text style={styles.date}>
{item.date} {item.time}
</Text>

</View>

</View>

<Text style={styles.payment}>
Payment : {item.payment}
</Text>

<Text style={styles.qty}>
Total Qty : {item.qty}
</Text>

{/* ITEMS */}
<View style={styles.itemsBox}>

{item.items.map((i,index)=>(

<View key={index} style={styles.itemRow}>
<Text style={styles.itemName}>{i.name}</Text>
<Text style={styles.itemQty}>x{i.qty}</Text>
</View>

))}

</View>

{/* FOOTER */}
<View style={styles.footer}>

<TouchableOpacity
style={styles.deleteBtn}
onPress={()=>deleteSale(item.id)}
>

<Ionicons name="trash-outline" size={14} color="#fff"/>

<Text style={styles.deleteText}>
Delete
</Text>

</TouchableOpacity>

</View>

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
padding:12,
backgroundColor:"#f1f5f9"
},

title:{
fontSize:22,
fontWeight:"700",
marginBottom:10,
color:"#0f172a"
},

empty:{
textAlign:"center",
marginTop:40,
color:"#64748b"
},

card:{
backgroundColor:"#fff",
padding:12,
borderRadius:10,
marginBottom:10,
elevation:3
},

header:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

customerSection:{
flexDirection:"row",
alignItems:"center"
},

iconBox:{
backgroundColor:"#6366f1",
padding:4,
borderRadius:6
},

customer:{
fontSize:14,
fontWeight:"600",
color:"#0f172a"
},

invoice:{
fontSize:11,
color:"#64748b"
},

date:{
fontSize:11,
color:"#64748b"
},

payment:{
marginTop:4,
fontSize:11,
color:"#475569"
},

total:{
fontSize:15,
fontWeight:"700",
color:"#4f46e5"
},

qty:{
marginTop:2,
fontSize:11,
color:"#475569"
},

itemsBox:{
marginTop:6,
borderTopWidth:1,
borderTopColor:"#e2e8f0",
paddingTop:5
},

itemRow:{
flexDirection:"row",
justifyContent:"space-between",
paddingVertical:1
},

itemName:{
fontSize:12,
color:"#334155"
},

itemQty:{
fontSize:12,
fontWeight:"600"
},

footer:{
marginTop:6,
flexDirection:"row",
justifyContent:"flex-end"
},

deleteBtn:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#ef4444",
paddingVertical:4,
paddingHorizontal:10,
borderRadius:6
},

deleteText:{
color:"#fff",
fontWeight:"600",
fontSize:12,
marginLeft:4
}

});