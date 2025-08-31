import { useRef } from "react";
import { Dimensions, StyleSheet, TextInput } from "react-native";
import Input from "@/components/Input";
import Section from "@/components/Section";
import { Status } from "@/utils/types";

export default function InputID ({ title, onPress, onSuccess }: Readonly<{ title: string, onPress: (id: string) => Promise<Status>, onSuccess: () => Promise<void> }>) {
  const id = useRef ("");
  const handleChangeText = (text: string) => {
    id.current = text;
  };

  return (
    <Input onPress = { async () => await onPress (id.current) } onSuccess = { onSuccess }>
      <Section title = { title }>
        <TextInput style = { styles.input } placeholder = "ID" keyboardType = "numeric" maxLength = { 10 } onChangeText = { handleChangeText }/>
      </Section>
    </Input>
  );
}

const styles = StyleSheet.create ({
  input: {
    backgroundColor: "#fff",
    width: 0.2 * Dimensions.get ("window").height,
    textAlign: "center",
  },
});
