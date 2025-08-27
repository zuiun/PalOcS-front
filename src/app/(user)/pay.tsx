import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Popup from "@/components/Popup";
import Reprint from "@/components/Reprint";
import Section from "@/components/Section";
import Query from "@/components/Query";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionsContext from "@/contexts/TransactionsContext";
import UserContext from "@/contexts/UserContext";
import { Discount, Report } from "@/utils/types";

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
  const transactions = useContext (TransactionsContext);
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
      try {
        const result = await postTransaction.mutateAsync (payment);
        const id: number = result.id;
        const timestamp: string = result.timestamp;

        setReport ({
          id: id,
          user_id: user.id,
          payment: payment,
          purchases: transactions.purchases.map ((p) => {
            return {
              product_name: p.name,
              price: p.price,
              discount_name: p.discount?.name,
              discount_value: p.discount?.value,
            }
          }),
        });
        setVisible (true);
      } catch (error) {
        console.log (error);
      }

      transactions.clear ();
      selectedIdxs.clear ();
    }
  };
  const [isVisible, setVisible] = useState (false);
  const [report, setReport] = useState<Report> ({
    id: 0,
    user_id: "",
    payment: "",
    purchases: [],
  });

  return (
    <>
      <Popup visible = { isVisible } onPress = { () => {
        setVisible (false);
        router.replace ("/drink");
      } }>
        <Reprint report = { report }/>
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
              discounts.data?.map ((d: Discount) =>
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
