import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Grid, { Panel } from "@/components/Grid";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionsContext from "@/contexts/TransactionsContext";
import UserContext from "@/contexts/UserContext";
import { colourSpecial, colourTab } from "@/utils/globals";

export default function Footer ({ flex }: Readonly<{ flex: number }>) {
  const user = useContext (UserContext);
  const transactions = useContext (TransactionsContext);
  const selectedIdxs = useContext (SelectedIdxsContext);

  return (
    <View style = {[ styles.row, { flex: flex } ]}>
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
        <Panel href = "/" title = "Exit" colour = { colourSpecial } onPress = { () => {
          user.logout ();
          transactions.clear ();
          selectedIdxs.clear ();
        } }/>
      </Grid>
    </View>
  );
}

const styles = StyleSheet.create ({
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
