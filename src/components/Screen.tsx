import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import List from "@/components/List";
import Section from "@/components/Section";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionsContext from "@/contexts/TransactionsContext";
import { colourSpecial, colourTab } from "@/utils/globals";

export default function Screen ({ children }: Readonly<{ children: React.ReactNode }>) {
  const transactions = useContext (TransactionsContext);
  const selectedIdxs = useContext (SelectedIdxsContext);

  return (
    <>
      <View style = {[ styles.row, { flex: 4 } ]}>
        <View style = {[ styles.container, { flex: 4 } ]}>
          { children }
        </View>
        <View style = {{ flex: 1 }}>
          <Section title = "Transaction" height = "100%">
            <List/>
          </Section>
        </View>
      </View>
      <View style = {[ styles.row, { flex: 1 } ]}>
        <Grid align = { 2 }>
          <Panel href = "/drink" title = "Drink" colour = { colourTab }/>
          <Panel href = "/customisation" title = "Customisation" colour = { colourTab }/>
        </Grid>
        <Grid align = { 3 }>
          <Panel title = "Void" colour = { colourSpecial } onPress = { () => {
            transactions.remove (selectedIdxs.selectedIdxs);
            selectedIdxs.clear ();
          } }/>
          <Panel href = "/pay" title = "Pay" colour = { colourSpecial }/>
          <Panel href = "/" title = "Exit" colour = { colourSpecial }/>
        </Grid>
      </View>
    </>
  );
}

const styles = StyleSheet.create ({
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
