import { UseQueryResult } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Query ({ children, result }: Readonly<{ children: React.ReactNode, result: UseQueryResult }>) {
  if (result.isError) {
    console.log (`Fetch Error: ${result.error}`);

    return (
      <View style = { styles.container }>
        <Text style = { styles.text }>
          Error
        </Text>
      </View>
    );
  } else if (result.isPending) {
    return <ActivityIndicator/>;
  } else {
    return (
      <>
        { children }
      </>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
