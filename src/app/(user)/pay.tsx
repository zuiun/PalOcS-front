import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Indicator from "@/components/Indicator";
import Popup from "@/components/Popup";
import Receipt from "@/components/Receipt";
import Section from "@/components/Section";
import Query from "@/components/Query";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionContext from "@/contexts/TransactionContext";
import UserContext from "@/contexts/UserContext";
import { DiscountAPI, ReceiptAPI } from "@/utils/types";

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
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify ({
          user_id: user.id,
          purchases: transactions.purchases,
          payment: payment,
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

      try {
        const result = await postTransaction.mutateAsync (payment);
        const id: number = result.id;
        const timestamp: string = result.timestamp;

        setReceipt ({
          id: id,
          timestamp: timestamp,
          user_id: user.id,
          user_name: user.name,
          payment: payment,
          lines: transactions.purchases.map ((p) => {
            return {
              name: p.name,
              price: p.price,
              discount_name: p.discount?.name,
              discount_value: p.discount?.value,
            }
          }),
        });
        setVisibleIndicator (false);
        setVisibleReceipt (true);
      } catch (error) {
        console.log (error);
      }

      transactions.clear ();
      selectedIdxs.clear ();
    }
  };
  const [isVisibleIndicator, setVisibleIndicator] = useState (false);
  const [isVisibleReceipt, setVisibleReceipt] = useState (false);
  const [receipt, setReceipt] = useState<ReceiptAPI> ({
    id: 0,
    timestamp: "",
    user_id: "",
    user_name: "",
    lines: [],
    payment: "",
  });

  return (
    <>
      <Popup visible = { isVisibleIndicator || isVisibleReceipt } onPress = { () => {
        setVisibleIndicator (false);
        setVisibleReceipt (false);
        router.replace ("/drink");
      } }>
        { isVisibleIndicator && <Indicator isLarge = { true }/> }
        { isVisibleReceipt && <Receipt receipt = { receipt }/>}
      </Popup>
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
    </>
  );
}
