import { Redirect, Slot } from "expo-router";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Footer from "@/components/Footer";
import List from "@/components/List";
import Section from "@/components/Section";
import { SelectedIdxsProvider } from "@/contexts/SelectedIdxsContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import UserContext from "@/contexts/UserContext";

export default function IDLayout () {
  const user = useContext (UserContext);

  return (
    user.id.length === 10 ?
      <SelectedIdxsProvider>
        <TransactionsProvider>
          <View style = {[ styles.screen, styles.row ]}>
            <View style = {[ styles.column, { flex: 4 } ]}>
              <View style = {[ styles.column, { flex: 4 } ]}>
                <Slot/>
              </View>
              <Footer flex = { 1 }/>
            </View>
            <View style = {{ flex: 1 }}>
              <Section title = { `Transaction: ${user.id} - ${user.name}` } height = "100%">
                <List/>
              </Section>
            </View>
          </View>
        </TransactionsProvider>
      </SelectedIdxsProvider>
    :
      <Redirect href = "/"/>
  );
}

const styles = StyleSheet.create ({
  screen: {
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  column: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center"
  },
});
