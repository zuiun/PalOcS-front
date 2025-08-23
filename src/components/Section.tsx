import { Dimensions, DimensionValue, StyleSheet, Text, View } from "react-native";

export default function Section ({ children, title, height }: Readonly<{ children: React.ReactNode, title: string, height?: DimensionValue }>) {
  return (
    <View style = {[ styles.container, { height: height } ]}>
      <Text style = { styles.title }>{ title }</Text>
      <View style = { styles.contents }>
        { children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    rowGap: 0.01 * Dimensions.get ("window").height,
  },
  title: {
    width: "100%",
    textAlign: "center",
    color: "#fff",
    flex: 0,
  },
  contents: {
    width: "100%",
    flex: 1,
  }
});
