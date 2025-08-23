import { createContext } from "react";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";

// todo: this should be populated on app startup
const JuiceIdsContext = createContext ([0]);

export default function Juice () {
  return (
    <JuiceIdsContext value = {[ 0, 1, 2, 3, 4 ]}>
      <Section title = "Juice">
        <Grid align = { 6 }>
          <Panel title = "Apple"/>
          <Panel title = "Orange"/>
          <Panel title = "Lemonade"/>
          <Panel title = "Grape"/>
          <Panel title = "Cranberry"/>
        </Grid>
      </Section>
    </JuiceIdsContext>
  );
}
