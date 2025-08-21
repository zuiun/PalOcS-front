import { Dimensions, Pressable, StyleSheet, View, Text } from "react-native";

export default function Button ({ title, colour }: Readonly<{ title: string, colour: string }>) {
  return (
    <View style = { styles.panel }>
      <Pressable style = {[ styles.button, { backgroundColor: colour } ]} onPress = {
        // TODO: custom handler
        () => alert ("bruh")
      }>
        <Text style = { styles.text }>{ title }</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create ({
  panel: {
    width: 0.15 * Dimensions.get ("window").height,
    height: 0.15 * Dimensions.get ("window").height,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0.01 * Dimensions.get ("window").height,
  },
  text: {
    color: "#fff",
  },
});
