import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "expo-router";

export default function OTP(){

const router = useRouter();

const [otp,setOtp] = useState(["","","",""]);
const [timer,setTimer] = useState(30);

const input1 = useRef(null);
const input2 = useRef(null);
const input3 = useRef(null);
const input4 = useRef(null);

useEffect(()=>{

if(timer>0){

const interval = setInterval(()=>{
setTimer(t=>t-1);
},1000);

return ()=>clearInterval(interval);

}

},[timer]);

const handleChange=(text,index)=>{

let newOtp=[...otp];
newOtp[index]=text;
setOtp(newOtp);

if(text && index<3){

if(index===0) input2.current.focus();
if(index===1) input3.current.focus();
if(index===2) input4.current.focus();

}

};

return(

<View style={styles.container}>

<TouchableOpacity onPress={()=>router.back()}>
<Text style={styles.back}>← Back</Text>
</TouchableOpacity>

<Text style={styles.title}>OTP Verification</Text>

<Text style={styles.subtitle}>
Enter the code sent to your phone
</Text>

<View style={styles.row}>

<TextInput
ref={input1}
style={styles.box}
keyboardType="numeric"
maxLength={1}
onChangeText={(text)=>handleChange(text,0)}
/>

<TextInput
ref={input2}
style={styles.box}
keyboardType="numeric"
maxLength={1}
onChangeText={(text)=>handleChange(text,1)}
/>

<TextInput
ref={input3}
style={styles.box}
keyboardType="numeric"
maxLength={1}
onChangeText={(text)=>handleChange(text,2)}
/>

<TextInput
ref={input4}
style={styles.box}
keyboardType="numeric"
maxLength={1}
onChangeText={(text)=>handleChange(text,3)}
/>

</View>

<Text style={styles.timer}>Resend in {timer}s</Text>

{timer===0 && (

<TouchableOpacity onPress={()=>setTimer(30)}>
<Text style={styles.resend}>Resend OTP</Text>
</TouchableOpacity>

)}

<TouchableOpacity
style={styles.button}
onPress={()=>router.replace("/(drawer)/dashboard")}
>

<Text style={styles.buttonText}>Verify OTP</Text>

</TouchableOpacity>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:25,
justifyContent:"center",
backgroundColor:"#f8fafc"
},

back:{
fontSize:16,
marginBottom:20
},

title:{
fontSize:26,
fontWeight:"bold"
},

subtitle:{
color:"#666",
marginBottom:30
},

row:{
flexDirection:"row",
gap:10,
marginBottom:20
},

box:{
width:55,
height:55,
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
textAlign:"center",
fontSize:20,
backgroundColor:"#fff"
},

timer:{
marginBottom:10
},

resend:{
color:"#2563eb",
marginBottom:20
},

button:{
backgroundColor:"#rgb(255 77 28)",
padding:15,
borderRadius:10
},

buttonText:{
color:"#fff",
textAlign:"center",
fontWeight:"bold"
}

});