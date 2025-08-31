import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import { Colour } from "@/utils/types";

const CATEGORY_ID_COFFEE = 1;
const CATEGORY_ID_TEA = 2;
const CATEGORY_ID_JUICE = 3;
const CATEGORY_ID_OTHER = 4;

export default function Drink () {
  return (
    <Section title = "Drink">
      <Grid align = { 4 }>
        <Panel href = { `/drink/${CATEGORY_ID_COFFEE}` } title = "Coffee" colour = { Colour.default }/>
        <Panel href = { `/drink/${CATEGORY_ID_TEA}` } title = "Tea" colour = { Colour.default }/>
        <Panel href = { `/drink/${CATEGORY_ID_JUICE}` } title = "Juice" colour = { Colour.default }/>
        <Panel href = { `/drink/${CATEGORY_ID_OTHER}` } title = "Other" colour = { Colour.default }/>
      </Grid>
    </Section>
  );
}
