import { useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import { Discount } from "@/constants/types";

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

  if (discounts.isError) {
    console.log (`Fetch Error: ${discounts.error.message}`);
  }

  return (
    <>
      <Section title = "Pay">
        <Grid align = { 3 }>
          {/* In an actual POS, onPress would activate the card reader/register */}
          <Panel href = "/" title = "Card" onPress = { () => alert ("Paid with card") }/>
          <Panel href = "/" title = "Cash" onPress = { () => alert ("Paid with cash") }/>
          <Panel href = "/" title = "Student ID" onPress = { () => alert ("Paid with student ID") }/>
        </Grid>
      </Section>
      <Section title = "Discounts">
        <Query result = { discounts }>
          <Grid align = { 4 }>
            {
              discounts.data?.map ((d: Discount) => <Panel key = { d.id } title = { d.name }/>)
            }
          </Grid>
        </Query>
      </Section>
    </>
  );
}
