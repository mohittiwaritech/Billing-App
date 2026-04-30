import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* PROFILE SETTINGS */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/profile")}
      >
        <Ionicons name="person-circle-outline" size={40} color="#4f46e5" />

        <View>
          <Text style={styles.cardTitle}>Profile Settings</Text>
          <Text style={styles.cardSub}>Shop name, phone, address</Text>
        </View>
      </TouchableOpacity>

      {/* PRINTER SETTINGS */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/printSettings")}
      >
        <Ionicons name="print-outline" size={40} color="#4f46e5" />

        <View>
          <Text style={styles.cardTitle}>Printer Settings</Text>
          <Text style={styles.cardSub}>Printer & receipt settings</Text>
        </View>
      </TouchableOpacity>

      {/* APP SETTINGS */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push("/appSettings")}
      >
        <Ionicons name="settings-outline" size={40} color="#4f46e5" />

        <View>
          <Text style={styles.cardTitle}>App Settings</Text>
          <Text style={styles.cardSub}>System preferences</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  cardSub: {
    color: "#666",
    marginTop: 2,
  },
});