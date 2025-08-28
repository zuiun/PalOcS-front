import { UseQueryResult } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import Indicator from "@/components/Indicator";
import Paragraph from "@/components/Paragraph";

export default function Query ({ children, result }: Readonly<{ children: React.ReactNode, result: UseQueryResult }>) {
  if (result.isError) {
    console.log (`Fetch Error: ${result.error}`);

    return (
      <View style = { styles.container }>
        <Paragraph>
          Error
        </Paragraph>
      </View>
    );
  } else if (result.isPending) {
    return <Indicator/>;
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
});
