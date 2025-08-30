import { useContext, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Indicator from "@/components/Indicator";
import Popup from "@/components/Popup";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionContext from "@/contexts/TransactionContext";
import UserContext from "@/contexts/UserContext";
import { colourSpecial, colourTab } from "@/utils/consts";
import { PurchaseAPI } from "@/utils/types";

export default function Footer ({ flex }: Readonly<{ flex: number }>) {
  const user = useContext (UserContext);
  const transactions = useContext (TransactionContext);
  const selectedIdxs = useContext (SelectedIdxsContext);
  const [isVisibleIndicator, setVisibleIndicator] = useState (false);
  const postVoid = useMutation ({
    mutationFn: async () => {
      const purchases = transactions.purchases.filter ((_, i) => selectedIdxs.selectedIdxs.includes (i));
      const voids: PurchaseAPI[] = purchases.map ((p) => {
        return {
          id: p.id,
          size: p.size,
          discount_id: p.discount?.id,
        };
      });
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/void/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify ({
          voids: voids,
        }),
      });

      if (! response.ok) {
        throw new Error (`${response.status}`);
      }
    },
  });
  const handlePress = async () => {
    if (selectedIdxs.selectedIdxs.length > 0) {
      try {
        setVisibleIndicator (true);
        await postVoid.mutateAsync ();
        transactions.remove (selectedIdxs.selectedIdxs);
        selectedIdxs.clear ();
      } catch (error) {
        console.log (`Fetch Error ${error}`);
      } finally {
        setVisibleIndicator (false);
      }
    }
  };

  return (
    <>
      <Popup visible = { isVisibleIndicator } onPress = { () => undefined }>
        <Indicator/>
      </Popup>
      <View style = {[ styles.row, { flex: flex } ]}>
        <Grid align = { 2 }>
          <Panel href = "/drink" title = "Drink" colour = { colourTab }/>
          <Panel href = "/customisation" title = "Customisation" colour = { colourTab }/>
        </Grid>
        <Grid align = { 4 }>
          <Panel title = "Void" colour = { colourSpecial } onPress = { handlePress }/>
          <Panel href = "/pay" title = "Pay" colour = { colourSpecial }/>
          <Panel href = "/function" title = "Function" colour = { colourSpecial }/>
          <Panel href = "/" title = "Exit" colour = { colourSpecial } onPress = { () => {
            user.logout ();
            transactions.clear ();
            selectedIdxs.clear ();
          } }/>
        </Grid>
      </View>
    </>
  );
}

const styles = StyleSheet.create ({
  input: {
    backgroundColor: "#25292e",
    borderWidth: 1,
    borderColor: "#fff",
    paddingLeft: 0.02 * Dimensions.get ("window").height,
    paddingRight: 0.02 * Dimensions.get ("window").height,
  },
  transaction: {
    backgroundColor: "#25292e",
    width: 0.4 * Dimensions.get ("window").height,
    height: 0.8 * Dimensions.get ("window").height,
  },
  title: {
    borderColor: "#fff",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
