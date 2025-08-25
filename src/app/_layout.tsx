import { Slot } from "expo-router";
import { createContext } from "react";
import { StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import List from "@/components/List";
import Section from "@/components/Section";
import Grid, { Panel } from "@/components/Grid";
import { colourSpecial, colourTab } from "@/constants/globals";
import { Product } from "@/constants/types";

export const TransactionsContext = createContext<Product[]> ([]);
const queryClient = new QueryClient ();

export default function RootLayout () {
  return (
    <QueryClientProvider client = { queryClient }>
      <TransactionsContext value = {[]}>
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
            <Grid align = { 2 }>
              <Panel href = "/drink" title = "Drink" colour = { colourTab }/>
              <Panel href = "/customisation" title = "Customisation" colour = { colourTab }/>
            </Grid>
            <Grid align = { 2 }>
              <Panel href = "/pay" title = "Pay" colour = { colourSpecial }/>
              <Panel href = "/" title = "Exit" colour = { colourSpecial }/>
            </Grid>
          </View>
        </View>
      </TransactionsContext>
    </QueryClientProvider>
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
