import { createContext } from "react";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";

// todo: this should be populated on app startup
const OtherIdsContext = createContext ([0]);

export default function Other () {
  return (
    <OtherIdsContext value = {[ 0, 1 ]}>
      <Section title = "Other">
        <Grid align = { 6 }>
          <Panel title = "Water"/>
          <Panel title = "Milk"/>
        </Grid>
      </Section>
    </OtherIdsContext>
  );
}
