import { useContext, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { queryClient } from "@/app/_layout";
import Grid, { Panel } from "@/components/Grid";
import Input from "@/components/Input";
import Popup from "@/components/Popup";
import Receipt from "@/components/Receipt";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionContext from "@/contexts/TransactionContext";
import UserContext from "@/contexts/UserContext";
import { colourSpecial, colourTab } from "@/utils/globals";
import { ReceiptAPI } from "@/utils/types";

export default function Footer ({ flex }: Readonly<{ flex: number }>) {
  const user = useContext (UserContext);
  const transactions = useContext (TransactionContext);
  const selectedIdxs = useContext (SelectedIdxsContext);
  const [isVisibleInput, setVisibleInput] = useState (false);
  const [isVisibleTransaction, setVisibleTransaction] = useState (false);
  const [receipt, setReceipt] = useState<ReceiptAPI> ({
    id: 0,
    timestamp: "",
    user_id: "",
    user_name: "",
    lines: [],
    payment: "",
  });
  const handlePress = async (id: string) => {
    const getTransaction = async () => {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/transaction/${id}`);

      if (response.ok) {
        return await response.json ();
      } else if (response.status === 404) {
        throw new RangeError (`No transaction found with ID ${id}`);
      } else {
        throw new Error (`${response.status}`);
      }
    };
    let receiptNew: ReceiptAPI;

    try {
      receiptNew = await queryClient.fetchQuery ({ queryKey: [`/transaction/${id}`], queryFn: getTransaction });
    } catch (error) {
      console.log (`Fetch Error: ${error}`);

      if (error instanceof RangeError) {
        return { isError: false, isSuccess: false };
      } else {
        return { isError: true, isSuccess: false };
      }
    }

    setReceipt (receiptNew);
    return { isError: false, isSuccess: true };
  };

  return (
    <>
      <Popup visible = { isVisibleInput || isVisibleTransaction } onPress = { () => {
        setVisibleInput (false);
        setVisibleTransaction (false);
      } }>
        { isVisibleInput && <View style = { styles.input }>
          <Input title = "Enter transaction ID"
              onPress = { handlePress }
              onSuccess = { () => {
                setVisibleInput (false);
                setVisibleTransaction (true);
              }
          }/>
        </View> }
        { isVisibleTransaction && <Receipt receipt = { receipt }/> }
      </Popup>
      <View style = {[ styles.row, { flex: flex } ]}>
        <Grid align = { 2 }>
          <Panel href = "/drink" title = "Drink" colour = { colourTab }/>
          <Panel href = "/customisation" title = "Customisation" colour = { colourTab }/>
        </Grid>
        <Grid align = { 4 }>
          <Panel title = "Void" colour = { colourSpecial } onPress = { () => {
            transactions.remove (selectedIdxs.selectedIdxs);
            selectedIdxs.clear ();
          } }/>
          <Panel href = "/pay" title = "Pay" colour = { colourSpecial }/>
          {/* TODO: pull up a Very Cool ID input Modal */}
          <Panel title = "Reprint" colour = { colourSpecial } onPress = { () => setVisibleInput (true) }/>
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
