import { Dimensions, StyleProp, StyleSheet, Text, TextStyle } from "react-native";

export default function Paragraph ({ children, style }: Readonly<{ children: React.ReactNode, style?: StyleProp<TextStyle> }>) {
  return (
    <Text style = {[ styles.text, style ]}>
      { children }
    </Text>
  );
}

const styles = StyleSheet.create ({
  text: {
    fontFamily: "TimesNewRoman",
    color: "#fff",
    // fontSize: 14,
    fontSize: 0.015 * Dimensions.get ("window").height,
  },
});
