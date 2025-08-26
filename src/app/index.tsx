import { StyleSheet, Text } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import { colourDefault } from "@/utils/globals";

// change to login page
export default function Index () {
  return (
    <Text style = { styles.text }>Log In</Text>
  );
}

const styles = StyleSheet.create ({
  text: {
    color: "#fff",
  }
});

