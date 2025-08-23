import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";

export default function Pay () {
  return (
    <>
      <Section title = "Payment Options">
        <Grid align = { 3 }>
          {/* In an actual POS, onPress would activate the card reader/register */}
          <Panel href = "/" title = "Card" onPress = { () => alert ("Paid with card") }/>
          <Panel href = "/" title = "Cash" onPress = { () => alert ("Paid with cash") }/>
          <Panel href = "/" title = "Student ID" onPress = { () => alert ("Paid with student ID") }/>
        </Grid>
      </Section>
      <Section title = "Discounts">
          <Grid align = { 4 }>
            <Panel title = "Loyalty Card"/>
            <Panel title = "10% Off"/>
          </Grid>
      </Section>
    </>
  );
}
