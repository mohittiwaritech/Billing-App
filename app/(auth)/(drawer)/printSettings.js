import { useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThermalPrinterModule from "react-native-thermal-receipt-printer";

export default function App() {

  const [devices, setDevices] = useState([]);
  const [connected, setConnected] = useState(false);

  // Scan bluetooth devices
  const scanDevices = async () => {
    try {
      const list = await ThermalPrinterModule.getBluetoothDeviceList();
      setDevices(list);
    } catch (error) {
      console.log(error);
    }
  };

  // Connect selected printer
  const connectPrinter = async (mac) => {
    try {
      await ThermalPrinterModule.connectBluetoothPrinter(mac);
      setConnected(true);
      alert("Printer Connected");
    } catch (error) {
      console.log(error);
    }
  };

  // Print bill
  const printBill = async () => {
    try {
      await ThermalPrinterModule.printBluetooth({
        payload:
          "SLANT POS\n" +
          "-----------------------------\n" +
          "Item        Qty      Price\n" +
          "Burger       1        120\n" +
          "Pizza        1        250\n" +
          "Cold Drink   1         60\n" +
          "-----------------------------\n" +
          "TOTAL:                430\n\n" +
          "Thank You\n\n",
        printerNbrCharactersPerLine: 32,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Slant POS Billing</Text>

      <Button title="Scan Bluetooth Devices" onPress={scanDevices} />

      <FlatList
        data={devices}
        keyExtractor={(item) => item.macAddress}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.device}
            onPress={() => connectPrinter(item.macAddress)}
          >
            <Text>{item.deviceName}</Text>
            <Text>{item.macAddress}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ height: 20 }} />

      <Button title="Print Bill" onPress={printBill} disabled={!connected} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  device: {
    padding: 15,
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 8,
  },
});