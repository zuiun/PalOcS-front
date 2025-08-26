import { useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionsContext from "@/contexts/TransactionsContext";
import UserContext from "@/contexts/UserContext";
import { Discount } from "@/utils/types";

export default function Pay () {
  const getDiscounts = async () => {
    try {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/discount`);

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`Fetch Error: ${response.status}`);
      }
    } catch (error) {
      console.log (error);
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
        throw new Error (`Fetch Error: ${response.status}`);
      }
    },
  });
  const handlePress = async (payment: string) => {
    if (transactions.purchases.length > 0) {
      let id: number;
      let timestamp: string;

      try {
        const result = await postTransaction.mutateAsync (payment);

        id = result.id;
        timestamp = result.timestamp;
      } catch (error) {
        console.log (error);
      }

      transactions.clear ();
      // TODO: Display receipt with ID
    }
  };
  

  return (
    <>
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
