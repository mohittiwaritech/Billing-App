import auth from '@react-native-firebase/auth';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, PermissionsAndroid, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {

  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);


  // Bluetooth Permission Function
  async function requestBluetoothPermission() {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      } catch (err) {
        console.log("Permission Error", err);
      }
    }
  }

  // Screen open hote hi permission
  useEffect(() => {
    requestBluetoothPermission();
  }, []);


  const sendOTP = async () => {
    if (phone.length !== 10) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    // HARDCODED BYPASS FOR TESTING
    // setTimeout(() => {
    //   setLoading(false);
    //   router.push({ pathname: "/(auth)/otp", params: { verificationId: "dummy-id" } });
    // }, 1000);

    // / Original Code Commented Out For Testing
    try {
      const confirmation = await auth().signInWithPhoneNumber('+91' + phone);
      setLoading(false);
      // Pass verificationId to the OTP screen
      router.push({ pathname: "/(auth)/otp", params: { verificationId: confirmation.verificationId } });
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Failed to send OTP. Make sure your Firebase Blaze plan and SHA1 keys are correctly set.");
    }



  };

  return (

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

      <TouchableOpacity style={styles.button} onPress={sendOTP} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#f8fafc"
  },

  logo: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#ff4d1c",
    marginBottom: 20
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 40
  },

  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 25,
    backgroundColor: "#fff"
  },

  code: {
    fontSize: 16,
    marginRight: 10
  },

  input: {
    flex: 1,
    padding: 15
  },

  button: {
    backgroundColor: "#ff4d1c",
    padding: 15,
    borderRadius: 10
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16
  }

});