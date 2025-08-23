import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import List from "@/components/List";
import Section from "@/components/Section";
import Grid, { Panel } from "@/components/Grid";

export default function Layout () {
  return (
    <View style = {[ styles.screen ]}>
      <View style = {[ styles.row, { flex: 4 } ]}>
        <View style = {[ styles.container, { flex: 4 } ]}>
          <Slot/>
        </View>
        <View style = {{ flex: 1 }}>
          <Section title = "Transaction" height = "100%">
            <List items = {[]}/>
          </Section>
        </View>
      </View>
      <View style = {[ styles.row, { flex: 1 } ]}>
        <Grid align = { 3 }>
          <Panel href = "/" title = "Drink" colour = "green"/>
          <Panel href = "/customisation" title = "Customisation" colour = "green"/>
          <Panel href = "/pay" title = "Pay" colour = "purple"/>
        </Grid>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  screen: {
    backgroundColor: "#25292e",
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center"
  }
});
