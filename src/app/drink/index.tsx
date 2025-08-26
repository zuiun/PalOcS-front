import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import { colourDefault } from "@/utils/globals";

export default function Drink () {
  return (
    <Section title = "Drink">
      <Grid align = { 4 }>
        <Panel href = "/drink/coffees" title = "Coffee" colour = { colourDefault }/>
        <Panel href = "/drink/teas" title = "Tea" colour = { colourDefault }/>
        <Panel href = "/drink/juices" title = "Juice" colour = { colourDefault }/>
        <Panel href = "/drink/others" title = "Other" colour = { colourDefault }/>
      </Grid>
    </Section>
  );
}
