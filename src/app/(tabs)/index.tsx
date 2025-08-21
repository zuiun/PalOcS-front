import { StyleSheet, Text, View } from "react-native";
import Grid from "@/components/Grid";

export default function IndexScreen () {
  return (
    <View style = { styles.container }>
      <Text style = { styles.text }>Home screen</Text>
      <Grid panels = {[
        { title: "bruh", colour: "blue" },
        { title: "bruh", colour: "red" },
        { title: "bruh", colour: "red" },
      ]}/>
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
