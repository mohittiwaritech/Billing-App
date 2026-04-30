import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login(){

const router = useRouter();
const [phone,setPhone] = useState("");


// Bluetooth Permission Function
async function requestBluetoothPermission() {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ]);
}

// Screen open hote hi permission
useEffect(() => {
  requestBluetoothPermission();
}, []);


const sendOTP = () => {

if(phone.length !== 10){
alert("Enter valid mobile number");
return;
}

router.push("/(auth)/otp");

};

return(

<View style={styles.container}>

<Text style={styles.logo}> Billing Zone</Text>

<Text style={styles.title}>Login with Mobile</Text>

<View style={styles.inputContainer}>

<Text style={styles.code}>+91</Text>

<TextInput
placeholder="Enter Mobile Number"
keyboardType="numeric"
maxLength={10}
value={phone}
onChangeText={setPhone}
style={styles.input}
/>

</View>

<TouchableOpacity style={styles.button} onPress={sendOTP}>
<Text style={styles.buttonText}>Send OTP</Text>
</TouchableOpacity>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
justifyContent:"center",
padding:25,
backgroundColor:"#f8fafc"
},

logo:{
fontSize:32,
fontWeight:"bold",
textAlign:"center",
color:"#ff4d1c",
marginBottom:20
},

title:{
textAlign:"center",
fontSize:18,
marginBottom:40
},

inputContainer:{
flexDirection:"row",
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
alignItems:"center",
paddingHorizontal:10,
marginBottom:25,
backgroundColor:"#fff"
},

code:{
fontSize:16,
marginRight:10
},

input:{
flex:1,
padding:15
},

button:{
backgroundColor:"#ff4d1c",
padding:15,
borderRadius:10
},

buttonText:{
color:"#fff",
textAlign:"center",
fontWeight:"bold",
fontSize:16
}

});