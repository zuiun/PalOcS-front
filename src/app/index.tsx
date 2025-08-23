import { useRouter } from "expo-router";
import { createContext, useEffect, useState } from "react";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import { colourDefault, colourSelected, uninitialisedIdx } from "@/constants/globals";

// todo: this should be populated on app startup
const TemperatureIdsContext = createContext ([0]);
const SizeIdsContext = createContext ([0]);
const DrinkIdsContext = createContext ([0]);

export default function Index () {
  const router = useRouter ();
  const [temperatureIdx, setTemperatureIdx] = useState (uninitialisedIdx);
  const [sizeIdx, setSizeIdx] = useState (uninitialisedIdx);
  const [drinkIdx, setDrinkIdx] = useState (uninitialisedIdx);

  useEffect (() => {
    if (temperatureIdx > uninitialisedIdx && sizeIdx > uninitialisedIdx && drinkIdx > uninitialisedIdx) {
      switch (drinkIdx) {
        case 0:
          router.push ("/drink/coffee");
          break;
        case 1:
          router.push ("/drink/tea");
          break;
        case 2:
          router.push ("/drink/juice");
          break;
        case 3:
          router.push ("/drink/other");
          break;
        default:
          // Reset page as state is probably broken
          router.push ("/");
          break;
      }
    }
  }, [temperatureIdx, sizeIdx, drinkIdx, router]);

  return (
    <>
      <TemperatureIdsContext value = {[ 0, 1 ]}>
        <Section title = "Temperature">
          <Grid align = { 2 }>
            <Panel title = "Hot" colour = { temperatureIdx === 0 ? colourSelected : colourDefault } onPress = { () => setTemperatureIdx (0) }/>
            <Panel title = "Cold" colour = { temperatureIdx === 1 ? colourSelected : colourDefault } onPress = { () => setTemperatureIdx (1) }/>
          </Grid>
        </Section>
      </TemperatureIdsContext>
      <SizeIdsContext value = {[ 0, 1, 2 ]}>
        <Section title = "Size">
          <Grid align = { 3 }>
            <Panel title = "Small" colour = { sizeIdx === 0 ? colourSelected : colourDefault } onPress = { () => setSizeIdx (0) }/>
            <Panel title = "Medium" colour = { sizeIdx === 1 ? colourSelected : colourDefault } onPress = { () => setSizeIdx (1) }/>
            <Panel title = "Large" colour = { sizeIdx === 2 ? colourSelected : colourDefault } onPress = { () => setSizeIdx (2) }/>
          </Grid>
        </Section>
      </SizeIdsContext>
      <DrinkIdsContext value = {[ 0, 1, 2, 3 ]}>
        <Section title = "Drink">
          <Grid align = { 4 }>
            <Panel title = "Coffee" colour = { drinkIdx === 0 ? colourSelected : colourDefault } onPress = { () => setDrinkIdx (0) }/>
            <Panel title = "Tea" colour = { drinkIdx === 1 ? colourSelected : colourDefault } onPress = { () => setDrinkIdx (1) }/>
            <Panel title = "Juice" colour = { drinkIdx === 2 ? colourSelected : colourDefault } onPress = { () => setDrinkIdx (2) }/>
            <Panel title = "Other" colour = { drinkIdx === 3 ? colourSelected : colourDefault } onPress = { () => setDrinkIdx (3) }/>
          </Grid>
        </Section>
      </DrinkIdsContext>
    </>
  );
}
