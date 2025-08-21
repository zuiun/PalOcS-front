import { Dimensions, Pressable, StyleSheet, View, Text } from "react-native";

export default function Button ({ title, colour }: Readonly<{ title: string, colour: string }>) {
  return (
    <View style = { styles.panel }>
      <Pressable style = {[ styles.button, { backgroundColor: colour } ]} onPress = {
        () => alert ("bruh")
      }>
        <Text style = { styles.text }>{ title }</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create ({
  panel: {
    width: 0.2 * Dimensions.get ("window").height,
    height: 0.2 * Dimensions.get ("window").height,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
  },
});
