import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import Indicator from "@/components/Indicator";
import Paragraph from "@/components/Paragraph";
import { colourSpecial } from "@/utils/consts";
import { Status } from "@/utils/types";

export default function Input ({ children, onPress, onSuccess }: Readonly<{ children: React.ReactNode, onPress: () => Promise<Status>, onSuccess: () => Promise<void> }>) {
  const [isError, setError] = useState (false);
  const [isPending, setPending] = useState (false);
  const [isFailure, setFailure] = useState (false);

  return (
    <View style = { styles.container }>
      { children }
      <Grid align = { 1 }>
        <Panel title = "Enter" colour = { colourSpecial } onPress = { async () => {
          setPending (true);
          setError (false);
          setFailure (false);

          const result = await onPress ();

          setPending (false);

          if (result.isError) {
            setError (true);
          } else if (result.isSuccess) {
            onSuccess ();
          } else {
            setFailure (true);
          }
        } }/>
      </Grid>
      <View style = { styles.response }>
        { isError && <Paragraph style = { styles.error }>Error, try again later</Paragraph> }
        { isPending && <Indicator/> }
        { isFailure && <Paragraph style = { styles.error }>Invalid input</Paragraph> }
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  response: {
    height: 0.02 * Dimensions.get ("window").height,
    marginTop: 0.01 * Dimensions.get ("window").height,
    marginBottom: 0.01 * Dimensions.get ("window").height,
  },
  error: {
    color: "red",
  }
});
