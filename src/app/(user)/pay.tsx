import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Indicator from "@/components/Indicator";
import Input from "@/components/Input";
import Popup from "@/components/Popup";
import Receipt from "@/components/Receipt";
import Section from "@/components/Section";
import Query from "@/components/Query";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionContext from "@/contexts/TransactionContext";
import UserContext from "@/contexts/UserContext";
import { colourDefault, colourSelected } from "@/utils/consts";
import { calculateTax } from "@/utils/helpers";
import { DiscountAPI, ReceiptAPI, RefundAPI } from "@/utils/types";

export default function Pay () {
  const router = useRouter ();
  const getDiscounts = async () => {
    const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/discount`);

    if (response.ok) {
      return await response.json ();
    } else {
      throw new Error (`${response.status}`);
    }
  };
  const discounts = useQuery ({ queryKey: [`/discount`], queryFn: getDiscounts });
  const user = useContext (UserContext);
  const transactions = useContext (TransactionContext);
  const selectedIdxs = useContext (SelectedIdxsContext);
  const postTransaction = useMutation ({
    mutationFn: async (payment: string) => {
      const tax = calculateTax (transactions.toLines ());
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify ({
          user_id: user.id,
          purchases: transactions.purchases,
          payment: payment,
          tax: tax,
          is_refund: isRefund,
          manager_id: manager?.id,
        }),
      });

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`${response.status}`);
      }
    },
  });
  const handlePress = async (payment: string) => {
    if (transactions.purchases.length > 0) {
      setVisibleIndicator (true);
      setPayment (payment);

      if (isRefund) {
        const { status } = await user.validate (user.id, true);

        if (status.isError) {
          return;
        // Suspend transaction until manager completes refund
        } else if (! status.isSuccess) {
          setVisibleInput (true);
          setVisibleIndicator (false);
          return;
        } else {
          setManager ({ id: user.id, name: user.name });
        }
      }

      setApproved (true);
    }
  };
  const [isVisibleIndicator, setVisibleIndicator] = useState (false);
  const [isVisibleReceipt, setVisibleReceipt] = useState (false);
  const [isVisibleInput, setVisibleInput] = useState (false);
  const [receipt, setReceipt] = useState<ReceiptAPI> ({
    id: 0,
    timestamp: "",
    user_id: "",
    user_name: "",
    lines: [],
    payment: "",
  });
  const [isRefund, setRefund] = useState (false);
  const [payment, setPayment] = useState<string | undefined> (undefined);
  const [manager, setManager] = useState<{ id: string, name: string } | undefined> (undefined);
  const [isApproved, setApproved] = useState (false);

  useEffect (() => {
    const completeTransaction = async (payment: string) => {
      setVisibleIndicator (true);

      try {
        const result = await postTransaction.mutateAsync (payment);
        const id: number = result.id;
        const timestamp: string = result.timestamp;
        const refund: RefundAPI | undefined = manager && {
          manager_id: manager.id,
          manager_name: manager.name,
        };

        setReceipt ({
          id: id,
          timestamp: timestamp,
          user_id: user.id,
          user_name: user.name,
          lines: transactions.toLines (),
          payment: payment,
          refund: refund,
        });
        setVisibleIndicator (false);
        setVisibleReceipt (true);
        transactions.clear ();
        selectedIdxs.clear ();
      } catch (error) {
        console.log (`Fetch Error ${error}`);
        setApproved (false);
      }
    };

    if (isApproved && payment) {
      if (! isRefund || manager) {
        completeTransaction (payment);
      }
    }
  // TODO: review this dependency array
  }, [isApproved, payment, isRefund, manager]);

  return (
    <View style = { styles.screen }>
      <Popup visible = { isVisibleIndicator || isVisibleReceipt || isVisibleInput } onPress = { () => {
        setVisibleIndicator (false);
        setVisibleReceipt (false);
        setVisibleInput (false);
        setPayment (undefined);
        setManager (undefined);

        if (isApproved) {
          router.replace ("/drink");
        } else {
          setApproved (false);
        }
      } }>
        { isVisibleIndicator && <Indicator/> }
        { isVisibleInput && <View style = { styles.input }>
          <Input title = {"Enter manager ID"} onPress = { async (id: string) => {
            const validation = await user.validate (id, true);

            if (! validation.status.isError && validation.status.isSuccess) {
              setManager ({ id: validation.id!, name: validation.name! });
            }

            return validation.status;
          } } onSuccess = { () => {
            setApproved (true);
            setVisibleInput (false);
          } }/>
        </View> }
        { isVisibleReceipt && <Receipt receipt = { receipt }/>}
      </Popup>
      <View style = {[ styles.container, { flex: 1 } ]}>
        <Grid align = { 1 }>
          <Panel title = "Refund" colour = { isRefund ? colourSelected : colourDefault } onPress = { () => setRefund (! isRefund) }/>
        </Grid>
      </View>
      <View style = {[ styles.container, { flex: 4 } ]}>
        <Section title = "Pay">
          <Grid align = { 3 }>
            {/* In an actual POS, onPress would activate the card reader/register */}
            <Panel title = "Card" onPress = { () => handlePress ("Card") }/>
            <Panel title = "Cash" onPress = { () => handlePress ("Cash") }/>
            <Panel title = "Student ID" onPress = { () => handlePress ("Student ID") }/>
          </Grid>
        </Section>
        <Section title = "Discounts">
          <Query result = { discounts }>
            <Grid align = { 4 }>
              {
                discounts.data?.map ((d: DiscountAPI) =>
                  <Panel key = { d.id } title = { d.name } onPress = { () => {
                    selectedIdxs.selectedIdxs.forEach ((i) => transactions.setDiscount (i, d));
                    selectedIdxs.clear ();
                  } }/>
                )
              }
            </Grid>
          </Query>
        </Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  screen: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center"
  },
  input: {
    backgroundColor: "#25292e",
    borderWidth: 1,
    borderColor: "#fff",
    paddingLeft: 0.02 * Dimensions.get ("window").height,
    paddingRight: 0.02 * Dimensions.get ("window").height,
  },
});
