import React, { useState, useEffect } from "react";
import useStore from "../../../components/store/useStore";
import {
View,
Text,
TextInput,
StyleSheet,
TouchableOpacity,
ScrollView,
Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile(){

const { businessProfile, updateBusinessProfile } = useStore();

const [businessName,setBusinessName] = useState("");
const [phone,setPhone] = useState("");
const [email,setEmail] = useState("");
const [gst,setGst] = useState("");
const [address,setAddress] = useState("");
const [state,setState] = useState("");
const [type,setType] = useState("");
const [category,setCategory] = useState("");

const [saving,setSaving] = useState(false);
const [saved,setSaved] = useState(false);

/* LOAD STORE DATA */

useEffect(()=>{

if(businessProfile){

setBusinessName(businessProfile.businessName || "");
setPhone(businessProfile.mobile || "");
setEmail(businessProfile.email || "");
setGst(businessProfile.gst || "");
setAddress(businessProfile.address || "");
setState(businessProfile.state || "");
setType(businessProfile.type || "");
setCategory(businessProfile.category || "");

}

},[businessProfile]);

/* SAVE PROFILE */

function saveProfile(){

setSaving(true);

updateBusinessProfile({
businessName,
mobile:phone,
email,
gst,
address,
state,
type,
category
});

setTimeout(()=>{

setSaving(false);
setSaved(true);

Alert.alert(
"Success",
"Business Profile Updated Successfully"
);

setTimeout(()=>setSaved(false),2000);

},800);

}

return(

<ScrollView style={styles.container}>

{/* HEADER */}

<View style={styles.headerCard}>

<Ionicons name="storefront" size={40} color="#ff4d1c"/>

<View style={{marginLeft:12}}>

<Text style={styles.businessName}>
{businessName || "Business Name"}
</Text>

<Text style={styles.subtitle}>
Business Settings
</Text>

</View>

</View>

{/* SECTION */}

<Text style={styles.sectionTitle}>Business Information</Text>

<Input icon="business-outline" label="Business Name" value={businessName} onChange={setBusinessName}/>
<Input icon="call-outline" label="Mobile Number" value={phone} onChange={setPhone}/>
<Input icon="mail-outline" label="Email Address" value={email} onChange={setEmail}/>
<Input icon="pricetag-outline" label="GST Number" value={gst} onChange={setGst}/>

<Text style={styles.sectionTitle}>Business Details</Text>

<Input icon="location-outline" label="Business Address" value={address} onChange={setAddress}/>
<Input icon="map-outline" label="State" value={state} onChange={setState}/>
<Input icon="briefcase-outline" label="Business Type" value={type} onChange={setType}/>
<Input icon="grid-outline" label="Business Category" value={category} onChange={setCategory}/>

<TouchableOpacity style={styles.button} onPress={saveProfile}>

<Text style={styles.buttonText}>
{saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
</Text>

</TouchableOpacity>

</ScrollView>

);

}

/* INPUT COMPONENT */

function Input({icon,label,value,onChange}){

return(

<View style={styles.inputBox}>

<Ionicons name={icon} size={20} color="#64748b"/>

<TextInput
placeholder={label}
value={value}
onChangeText={onChange}
style={styles.input}
/>

</View>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#f1f5f9",
padding:20
},

headerCard:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#fff",
padding:20,
borderRadius:14,
marginBottom:20,
shadowColor:"#000",
shadowOpacity:0.08,
shadowRadius:6,
elevation:3
},

businessName:{
fontSize:18,
fontWeight:"700"
},

subtitle:{
color:"#64748b",
marginTop:2
},

sectionTitle:{
fontSize:16,
fontWeight:"600",
marginTop:15,
marginBottom:10
},

inputBox:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#fff",
borderRadius:12,
padding:14,
marginBottom:12,
shadowColor:"#000",
shadowOpacity:0.05,
shadowRadius:5,
elevation:2
},

input:{
marginLeft:10,
flex:1,
fontSize:15
},

button:{
backgroundColor:"#ff4d1c",
padding:16,
borderRadius:12,
alignItems:"center",
marginTop:20
},

buttonText:{
color:"#fff",
fontWeight:"600",
fontSize:16
}

});