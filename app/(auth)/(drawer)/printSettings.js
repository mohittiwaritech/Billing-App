import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { BluetoothManager, BluetoothEscposPrinter } from '@mateusdegobi/react-native-bluetooth-escpos-printer';

export default function PrintSettings() {

  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null); // Ab hum poora device save karenge
  const [isScanning, setIsScanning] = useState(false);
  const [connectingAddress, setConnectingAddress] = useState(null); // Loading dikhane ke liye

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === "android") {
      try {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const scanDevices = async () => {
    setIsScanning(true);
    setDevices([]);
    try {
      const paired = await BluetoothManager.enableBluetooth();

      if (!paired || paired.length === 0) {
        alert("No printer found. Pair printer first in phone settings.");
        setIsScanning(false);
        return;
      }

      if (paired && typeof paired === 'string') {
        paired = JSON.parse(paired);
      }
      
      let parsedDevices = [];
      for (let i = 0; i < paired.length; i++) {
        try {
          let device = typeof paired[i] === 'string' ? JSON.parse(paired[i]) : paired[i];
          parsedDevices.push(device);
        } catch (e) {
          console.log("Error parsing device: ", e);
        }
      }

      setDevices(parsedDevices);

    } catch (error) {
      console.log(error);
      alert("Bluetooth scan failed");
    }
    setIsScanning(false);
  };

  const connectPrinter = async (device) => {
    setConnectingAddress(device.address);
    try {
      await BluetoothManager.connect(device.address);
      setConnectedDevice(device); // Connect hone par device details save kar li
      alert("Printer Connected Successfully!");
    } catch (error) {
      console.log(error);
      alert("Connection Failed. Make sure printer is ON.");
    }
    setConnectingAddress(null);
  };

  const disconnectPrinter = () => {
    // Agar user dusra printer lagana chahe toh list wapas laane ke liye
    setConnectedDevice(null);
  };

  const printBill = async () => {
    try {
      await BluetoothEscposPrinter.printText("SLANT POS BILL\n", {});
      await BluetoothEscposPrinter.printText("---------------------------\n", {});
      await BluetoothEscposPrinter.printText("Burger     1    120\n", {});
      await BluetoothEscposPrinter.printText("Pizza      1    250\n", {});
      await BluetoothEscposPrinter.printText("ColdDrink  1     60\n", {});
      await BluetoothEscposPrinter.printText("---------------------------\n", {});
      await BluetoothEscposPrinter.printText("TOTAL           430\n", {});
      await BluetoothEscposPrinter.printText("\nThank You\n\n\n", {});
    } catch (error) {
      console.log(error);
      alert("Print Failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.title}>Printer Setup</Text>
        <Text style={styles.subtitle}>Slant POS Billing System</Text>
      </View>

      {/* MAIN CONTENT AREA */}
      <View style={styles.content}>
        
        {/* CONDITION 1: Jab printer connect NAHI hai (List dikhayenge) */}
        {!connectedDevice ? (
          <>
            <TouchableOpacity 
              style={styles.scanButton} 
              onPress={scanDevices}
              disabled={isScanning}
            >
              {isScanning ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.scanButtonText}>🔍 SCAN BLUETOOTH PRINTERS</Text>
              )}
            </TouchableOpacity>

            <FlatList
              data={devices}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item.address ? item.address : index.toString()}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.deviceCard, 
                    connectingAddress === item.address && styles.deviceCardConnecting
                  ]}
                  onPress={() => connectPrinter(item)}
                  disabled={connectingAddress !== null} // Agar ek connect ho raha hai toh baaki disable kar do
                >
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>
                      {item.name ? item.name : 'Unknown Device'}
                    </Text>
                    <Text style={styles.deviceAddress}>{item.address}</Text>
                  </View>
                  
                  {connectingAddress === item.address ? (
                    <ActivityIndicator color="#007BFF" />
                  ) : (
                    <Text style={styles.connectText}>Connect</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </>
        ) : (
          /* CONDITION 2: Jab printer CONNECT ho gaya hai (Success UI) */
          <View style={styles.connectedContainer}>
            <View style={styles.successCard}>
              <Text style={styles.checkIcon}>✅</Text>
              <Text style={styles.connectedTitle}>Printer Ready!</Text>
              
              <View style={styles.deviceBox}>
                <Text style={styles.connectedDeviceName}>
                  {connectedDevice.name ? connectedDevice.name : 'Bluetooth Printer'}
                </Text>
                <Text style={styles.connectedDeviceAddress}>{connectedDevice.address}</Text>
              </View>

              <TouchableOpacity style={styles.changeButton} onPress={disconnectPrinter}>
                <Text style={styles.changeButtonText}>Change Printer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>

      {/* FIXED BOTTOM BAR - PRINT BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.printButton, !connectedDevice && styles.printButtonDisabled]}
          onPress={printBill}
          disabled={!connectedDevice}
        >
          <Text style={styles.printButtonText}>
            🖨️ {connectedDevice ? "PRINT TEST BILL" : "CONNECT PRINTER FIRST"}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB', // Light modern background
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    alignItems: 'center',
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A2138',
  },
  subtitle: {
    fontSize: 13,
    color: '#8F9BB3',
    marginTop: 4,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#007BFF', // Professional Blue
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  deviceCardConnecting: {
    borderColor: '#007BFF',
    backgroundColor: '#F0F7FF',
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222B45',
  },
  deviceAddress: {
    fontSize: 13,
    color: '#8F9BB3',
    marginTop: 4,
  },
  connectText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  connectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00E096', // Success Green
    elevation: 5,
    shadowColor: '#00E096',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  checkIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  connectedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E096',
    marginBottom: 20,
  },
  deviceBox: {
    backgroundColor: '#F4F7FB',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
  },
  connectedDeviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A2138',
  },
  connectedDeviceAddress: {
    fontSize: 13,
    color: '#8F9BB3',
    marginTop: 5,
  },
  changeButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3D71', // Red color for disconnect/change
  },
  changeButtonText: {
    color: '#FF3D71',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E4E9F2',
  },
  printButton: {
    backgroundColor: '#00E096', // Active Green
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#00E096',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  printButtonDisabled: {
    backgroundColor: '#E4E9F2', // Disabled Grey
    elevation: 0,
    shadowOpacity: 0,
  },
  printButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});