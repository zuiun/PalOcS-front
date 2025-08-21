import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/Button";

export default function IndexScreen () {
  return (
    <View style = { styles.container }>
      <Text style = { styles.text }>Home screen</Text>
      <Button title = "bruh" colour = "red"></Button>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
});
