import { createContext } from "react";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";

// todo: this should be populated on app startup
const MilkIdsContext = createContext ([0]);
const SyrupIdsContext = createContext ([0]);
const ToppingIdsContext = createContext ([0]);

export default function Topping () {
  return (
    <>
      <MilkIdsContext value = {[ 0, 1, 2, 3, 4, 5 ]}>
        <Section title = "Milk">
          <Grid align = { 6 }>
            <Panel title = "2%"/>
            <Panel title = "Whole"/>
            <Panel title = "Skim"/>
            <Panel title = "Almond"/>
            <Panel title = "Oat"/>
            <Panel title = "Soy"/>
          </Grid>
        </Section>
      </MilkIdsContext>
      <SyrupIdsContext value = {[ 0, 1, 2, 3, 4, 5, 6, 7 ]}>
        <Section title = "Syrup">
          <Grid align = { 6 }>
            <Panel title = "Sugar"/>
            <Panel title = "Vanilla"/>
            <Panel title = "French Vanilla"/>
            <Panel title = "Caramel"/>
            <Panel title = "Chocolate"/>
            <Panel title = "White Chocolate"/>
            <Panel title = "Mint"/>
            <Panel title = "Hazelnut"/>
          </Grid>
        </Section>
      </SyrupIdsContext>
      <ToppingIdsContext value = {[ 0, 1, 2 ]}>
        <Section title = "Topping">
          <Grid align = { 6 }>
            <Panel title = "Whipped Cream"/>
            <Panel title = "Cinnamon"/>
            <Panel title = "Espresso"/>
          </Grid>
        </Section>
      </ToppingIdsContext>
    </>
  );
}
