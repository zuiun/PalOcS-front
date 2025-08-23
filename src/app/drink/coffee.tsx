import { createContext } from "react";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";

// todo: this should be populated on app startup
const CoffeeIdsContext = createContext ([0]);
const EspressoIdsContext = createContext ([0]);

export default function Coffee () {
  return (
    <>
      <CoffeeIdsContext value = {[ 0, 1, 2 ]}>
        <Section title = "Coffee">
          <Grid align = { 6 }>
            <Panel title = "Drip"/>
            <Panel title = "Misto"/>
            <Panel title = "Cold Brew"/>
          </Grid>
        </Section>
      </CoffeeIdsContext>
      <EspressoIdsContext value = {[ 0, 1, 2, 3, 4 ]}>
        <Section title = "Espresso">
          <Grid align = { 6 }>
            <Panel title = "Latte"/>
            <Panel title = "Cortado"/>
            <Panel title = "Macchiato"/>
            <Panel title = "Solo"/>
            <Panel title = "Doppio"/>
          </Grid>
        </Section>
      </EspressoIdsContext>
    </>
  );
}
