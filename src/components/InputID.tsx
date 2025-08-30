import { useRef, useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import Indicator from "@/components/Indicator";
import Paragraph from "@/components/Paragraph";
import Section from "@/components/Section";
import { colourSpecial } from "@/utils/consts";
import { Status } from "@/utils/types";

export default function InputID ({ title, onPress, onSuccess }: Readonly<{ title: string, onPress: (id: string) => Promise<Status>, onSuccess: () => undefined }>) {
  const id = useRef ("");
  const [isError, setError] = useState (false);
  const [isPending, setPending] = useState (false);
  const [isFailure, setFailure] = useState (false);
  const handleChangeText = (text: string) => {
    id.current = text;
  };

  return (
    <View style = { styles.container }>
      <Section title = { title }>
        <TextInput style = { styles.input } placeholder = "ID" keyboardType = "numeric" maxLength = { 10 } onChangeText = { handleChangeText }/>
      </Section>
      <Grid align = { 1 }>
        <Panel title = "Enter" colour = { colourSpecial } onPress = { async () => {
          setPending (true);
          setError (false);
          setFailure (false);

          const result = await onPress (id.current);

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
  input: {
    backgroundColor: "#fff",
    width: 0.2 * Dimensions.get ("window").height,
    textAlign: "center",
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
