import { useRef, useState } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import Indicator from "@/components/Indicator";
import Paragraph from "@/components/Paragraph";
import Section from "@/components/Section";
import { colourSpecial } from "@/utils/consts";
import { Status } from "@/utils/types";

export default function InputDate ({ onPress, onSuccess }: Readonly<{ onPress: (date: string) => Promise<Status>, onSuccess: () => undefined }>) {
  const day = useRef ("");
  const month = useRef ("");
  const year = useRef ("");
  const [isError, setError] = useState (false);
  const [isPending, setPending] = useState (false);
  const [isFailure, setFailure] = useState (false);
  const handleChangeTextDay = (text: string) => {
    day.current = text.padStart (2, "0");
  };
  const handleChangeTextMonth = (text: string) => {
    month.current = text.padStart (2, "0");
  };
  const handleChangeTextYear = (text: string) => {
    year.current = text;
  };

  return (
    <View style = { styles.container }>
      <Section title = "Enter date">
        <View style = { styles.date }>
          <TextInput style = {[ styles.input, styles.short ]} placeholder = "DD" keyboardType = "numeric" maxLength = { 2 } onChangeText = { handleChangeTextDay }/>
          <TextInput style = {[ styles.input, styles.short ]} placeholder = "MM" keyboardType = "numeric" maxLength = { 2 } onChangeText = { handleChangeTextMonth }/>
          <TextInput style = {[ styles.input, styles.long ]} placeholder = "YYYY" keyboardType = "numeric" maxLength = { 4 } onChangeText = { handleChangeTextYear }/>
        </View>
      </Section>
      <Grid align = { 1 }>
        <Panel title = "Enter" colour = { colourSpecial } onPress = { async () => {
          setPending (true);
          setError (false);
          setFailure (false);

          const date = `${year.current}-${month.current}-${day.current}`;
          const result = await onPress (date);

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
  date: {
    width: 0.2 * Dimensions.get ("window").height,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    textAlign: "center",
  },
  short: {
    width: 0.04 * Dimensions.get ("window").height,
  },
  long: {
    width: 0.08 * Dimensions.get ("window").height,
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
