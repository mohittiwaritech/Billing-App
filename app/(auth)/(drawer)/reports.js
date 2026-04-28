import React from "react";
import {
View,
Text,
FlatList,
StyleSheet
} from "react-native";

import useStore from "../../../components/store/useStore";

export default function Reports(){

const {customers,sales} = useStore();

/* TOTAL SALES */

const totalSales = sales.reduce(
(sum,s)=>sum + (s.total || 0),
0
);

/* TOTAL ORDERS */

const totalOrders = sales.length;

/* PAYMENT REPORT */

const cashSales = sales
.filter(s=>s.payment==="Cash")
.reduce((sum,s)=>sum+s.total,0);

const upiSales = sales
.filter(s=>s.payment==="UPI")
.reduce((sum,s)=>sum+s.total,0);

return(

<View style={styles.container}>

<Text style={styles.title}>Reports</Text>

{/* SALES REPORT */}

<View style={styles.card}>
<Text style={styles.heading}>Sales Report</Text>
<Text>Total Sales : ₹{totalSales}</Text>
</View>

{/* ORDER REPORT */}

<View style={styles.card}>
<Text style={styles.heading}>Order Report</Text>
<Text>Total Orders : {totalOrders}</Text>
</View>

{/* CUSTOMER REPORT */}

<View style={styles.card}>
<Text style={styles.heading}>Customer Report</Text>
<Text>Total Customers : {customers.length}</Text>
</View>

{/* PAYMENT REPORT */}

<View style={styles.card}>
<Text style={styles.heading}>Payment Report</Text>
<Text>Cash Sales : ₹{cashSales}</Text>
<Text>UPI Sales : ₹{upiSales}</Text>
</View>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#f5f7fb"
},

title:{
fontSize:26,
fontWeight:"bold",
marginBottom:20
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:10,
marginBottom:15,
elevation:3
},

heading:{
fontWeight:"bold",
marginBottom:6,
fontSize:16
}

});