import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import TransactionsContext from "@/contexts/TransactionsContext";
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
  const transactions = useContext (TransactionsContext);
  const selectedIdxs = useContext (SelectedIdxsContext);
  const payWith = (method: string) => {
    alert (`Paid with ${method}`);
    // TODO: log to database
    transactions.clear ();
  };

  return (
    <>
      <Section title = "Pay">
        <Grid align = { 3 }>
          {/* In an actual POS, onPress would activate the card reader/register */}
          <Panel href = "/drink" title = "Card" onPress = { () => payWith ("card") }/>
          <Panel href = "/drink" title = "Cash" onPress = { () => payWith ("cash") }/>
          <Panel href = "/drink" title = "Student ID" onPress = { () => payWith ("student ID") }/>
        </Grid>
      </Section>
      <Section title = "Discounts">
        <Query result = { discounts }>
          <Grid align = { 4 }>
            {
              discounts.data?.map ((d: Discount) =>
                <Panel key = { d.id } title = { d.name } onPress = { () => {
                  selectedIdxs.selectedIdxs.forEach ((i) => transactions.setDiscount (i, d))
                } }/>
              )
            }
          </Grid>
        </Query>
      </Section>
    </>
  );
}
