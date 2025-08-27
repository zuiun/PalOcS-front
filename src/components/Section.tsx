import { Dimensions, DimensionValue, StyleSheet, View } from "react-native";
import Paragraph from "@/components/Paragraph";

export default function Section ({ children, title, height }: Readonly<{ children: React.ReactNode, title: string, height?: DimensionValue }>) {
  return (
    <View style = {[ styles.container, { height: height } ]}>
      <Paragraph style = { styles.title }>{ title }</Paragraph>
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
    textAlign: "center",
    marginTop: 0.01 * Dimensions.get ("window").height,
    fontSize: 0.02 * Dimensions.get ("window").height,
  },
  contents: {
    width: "100%",
    flex: 1,
    marginBottom: 0.02 * Dimensions.get ("window").height,
  },
});
