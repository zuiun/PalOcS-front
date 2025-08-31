import { useRef } from "react";
import { Dimensions, StyleSheet, TextInput, View } from "react-native";
import Input from "@/components/Input";
import Section from "@/components/Section";
import { Status } from "@/utils/types";

export default function InputDate ({ onPress, onSuccess }: Readonly<{ onPress: (date: string) => Promise<Status>, onSuccess: () => Promise<void> }>) {
  const day = useRef ("");
  const month = useRef ("");
  const year = useRef ("");
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
    <Input onPress = { async (): Promise<Status> => {
      const date = `${year.current}-${month.current}-${day.current}`;
      return await onPress (date);
    } } onSuccess = { onSuccess }>
      <Section title = "Enter date">
        <View style = { styles.date }>
          <TextInput style = {[ styles.input, styles.short ]} placeholder = "DD" keyboardType = "numeric" maxLength = { 2 } onChangeText = { handleChangeTextDay }/>
          <TextInput style = {[ styles.input, styles.short ]} placeholder = "MM" keyboardType = "numeric" maxLength = { 2 } onChangeText = { handleChangeTextMonth }/>
          <TextInput style = {[ styles.input, styles.long ]} placeholder = "YYYY" keyboardType = "numeric" maxLength = { 4 } onChangeText = { handleChangeTextYear }/>
        </View>
      </Section>
    </Input>
  );
}

const styles = StyleSheet.create ({
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
});
