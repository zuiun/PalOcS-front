import { createContext } from "react";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";

// todo: this should be populated on app startup
const BlackIdsContext = createContext ([0]);
const GreenIdsContext = createContext ([0]);
const HerbalIdsContext = createContext ([0]);

export default function Tea () {
  return (
    <>
      <BlackIdsContext value = {[ 0, 1, 2, 3, 4 ]}>
        <Section title = "Black">
          <Grid align = { 6 }>
            <Panel title = "Earl Grey"/>
            <Panel title = "English Breakfast"/>
            <Panel title = "Assam"/>
            <Panel title = "Orange Pekoe"/>
            <Panel title = "Chai"/>
          </Grid>
        </Section>
      </BlackIdsContext>
      <GreenIdsContext value = {[ 0, 1 ]}>
        <Section title = "Green">
          <Grid align = { 6 }>
            <Panel title = "Jasmine"/>
            <Panel title = "Matcha"/>
          </Grid>
        </Section>
      </GreenIdsContext>
      <HerbalIdsContext value = {[ 0, 1, 2 ]}>
        <Section title = "Herbal">
          <Grid align = { 6 }>
            <Panel title = "Hibiscus"/>
            <Panel title = "Chamomile"/>
            <Panel title = "Mint"/>
          </Grid>
        </Section>
      </HerbalIdsContext>
    </>
  );
}
