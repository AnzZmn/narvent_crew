import { StyleSheet, Text, View } from "react-native";
export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}> Worker profile </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 16, opacity: 0.5 },
});
