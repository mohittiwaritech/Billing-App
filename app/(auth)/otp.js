import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRef, useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import auth from '@react-native-firebase/auth';

export default function OTP(){

const router = useRouter();
const { verificationId } = useLocalSearchParams();

const [otp,setOtp] = useState(["","","","","",""]);
const [timer,setTimer] = useState(30);
const [loading, setLoading] = useState(false);

const input1 = useRef(null);
const input2 = useRef(null);
const input3 = useRef(null);
const input4 = useRef(null);
const input5 = useRef(null);
const input6 = useRef(null);

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

  if(text && index<5){
    if(index===0) input2.current.focus();
    if(index===1) input3.current.focus();
    if(index===2) input4.current.focus();
    if(index===3) input5.current.focus();
    if(index===4) input6.current.focus();
  }
};

const verifyOTP = async () => {
  const otpCode = otp.join("");
  if(otpCode.length !== 6){
    Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
    return;
  }

  setLoading(true);
  
  // HARDCODED BYPASS FOR TESTING (Any 6 digit OTP will work)
  setTimeout(() => {
    setLoading(false);
    router.replace("/(drawer)/dashboard");
  }, 1000);

  /* Original Code Commented Out
  if(!verificationId) {
    Alert.alert("Error", "Missing verification ID. Please go back and resend OTP.");
    return;
  }

  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, otpCode);
    await auth().signInWithCredential(credential);
    setLoading(false);
    // Success, go to dashboard
    router.replace("/(drawer)/dashboard");
  } catch (error) {
    setLoading(false);
    console.log(error);
    Alert.alert("Verification Failed", "The OTP you entered is incorrect or expired.");
  }
  */
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

<TextInput ref={input1} style={styles.box} keyboardType="numeric" maxLength={1} onChangeText={(text)=>handleChange(text,0)} />
<TextInput ref={input2} style={styles.box} keyboardType="numeric" maxLength={1} onChangeText={(text)=>handleChange(text,1)} />
<TextInput ref={input3} style={styles.box} keyboardType="numeric" maxLength={1} onChangeText={(text)=>handleChange(text,2)} />
<TextInput ref={input4} style={styles.box} keyboardType="numeric" maxLength={1} onChangeText={(text)=>handleChange(text,3)} />
<TextInput ref={input5} style={styles.box} keyboardType="numeric" maxLength={1} onChangeText={(text)=>handleChange(text,4)} />
<TextInput ref={input6} style={styles.box} keyboardType="numeric" maxLength={1} onChangeText={(text)=>handleChange(text,5)} />

</View>

<Text style={styles.timer}>Resend in {timer}s</Text>

{timer===0 && (

<TouchableOpacity onPress={()=>setTimer(30)}>
<Text style={styles.resend}>Resend OTP</Text>
</TouchableOpacity>

)}

<TouchableOpacity
  style={styles.button}
  onPress={verifyOTP}
  disabled={loading}
>
  {loading ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Verify OTP</Text>
  )}
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
  justifyContent: "center",
  gap: 8,
  marginBottom:20
},

box:{
  width:45,
  height:50,
  borderWidth:1,
  borderColor:"#ddd",
  borderRadius:8,
  textAlign:"center",
  fontSize:18,
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