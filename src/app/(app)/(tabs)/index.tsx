import { StyleSheet, Text, View } from "react-native";
export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}> Welcome to Narvent Crew </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 16, opacity: 0.5 },
});
