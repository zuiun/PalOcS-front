import { useRouter } from "expo-router";
import { useContext, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, TextInput, View } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import Paragraph from "@/components/Paragraph";
import Section from "@/components/Section";
import UserContext from "@/contexts/UserContext";
import { colourSpecial } from "@/utils/globals";

// change to login page
export default function Index () {
  const router = useRouter ();
  const id = useRef ("");
  const [isError, setError] = useState (false);
  const [isPending, setPending] = useState (false);
  const [isFailure, setFailure] = useState (false);
  const handleChangeText = (text: string) => {
    id.current = text;
  };
  const user = useContext (UserContext);

  return (
    <View style = { styles.container }>
      <Section title = "Enter your ID">
        <TextInput style = { styles.input } placeholder = "ID" keyboardType = "numeric" maxLength = { 10 } onChangeText = { handleChangeText }/>
      </Section>
      <Grid align = { 1 }>
        <Panel title = "Log In" colour = { colourSpecial } onPress = { async () => {
          setPending (true);
          setError (false);
          setFailure (false);

          const result = await user.login (id.current)

          setPending (false);

          if (result.isError) {
            setError (true);
          } else if (result.isSuccess) {
            router.replace ("/drink");
          } else {
            setFailure (true);
          }
        } }/>
      </Grid>
      { isError && <Paragraph style = { styles.response }>Error, try again later</Paragraph> }
      { isPending && <ActivityIndicator style = { styles.response }/> }
      { isFailure && <Paragraph style = { styles.response }>Invalid ID</Paragraph> }
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
    marginTop: 0.01  * Dimensions.get ("window").height,
    color: "red",
  }
});
