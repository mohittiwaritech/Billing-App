import React from "react";
import {
View,
Text,
StyleSheet,
FlatList
} from "react-native";

import useStore from "../../../components/store/useStore";

export default function Customers(){

const {customers} = useStore();

return(

<View style={styles.container}>

<Text style={styles.title}>Customers</Text>

<FlatList
data={customers}
keyExtractor={(item)=>item.id}

renderItem={({item})=>(

<View style={styles.card}>

<Text style={styles.name}>{item.name}</Text>

<Text style={styles.phone}>{item.phone}</Text>

<Text style={styles.address}>{item.address}</Text>

</View>

)}

/>

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
fontSize:24,
fontWeight:"bold",
marginBottom:15
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:10,
marginBottom:10
},

name:{
fontSize:16,
fontWeight:"bold"
},

phone:{
marginTop:4
},

address:{
marginTop:4,
color:"#777"
}

});