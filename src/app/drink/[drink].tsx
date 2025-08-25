import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import { colourDefault, colourSelected, uninitialisedIdx } from "@/constants/globals";
import { Category, Drink } from "@/constants/types";

export default function Drinks () {  
  const { drink }: { drink: string } = useLocalSearchParams ();
  const getCategories = async () => {
    try {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/drink/${drink}/categories`);

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`Fetch Error: ${response.status}`);
      }
    } catch (error) {
      console.log (error);
    }
  };
  const getDrinks = async () => {
    try {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/drink/${drink}`);

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`Fetch Error: ${response.status}`);
      }
    } catch (error) {
      console.log (error);
    }
  };
  const [sizeIdx, setSizeIdx] = useState (uninitialisedIdx);
  const categories = useQuery ({ queryKey: [`/drink/${drink}/categories`], queryFn: getCategories });
  const drinks = useQuery ({ queryKey: [`/drink/${drink}`], queryFn: getDrinks });

  useEffect (() => {
    if (sizeIdx > uninitialisedIdx) {
      router.setParams ({ size: sizeIdx });
    }
  }, [sizeIdx]);

  return (
    <View style = {[ styles.screen ]}>
      <View style = {[ styles.row, { flex: 4 } ]}>
      <View style = {[ styles.container, { flex: 1 } ]}>
        <Section title = "Size">
          <Grid align = { 1 }>
            <Panel title = "Small" colour = { sizeIdx === 0 ? colourSelected : colourDefault } onPress = { () => setSizeIdx (0) }/>
            <Panel title = "Medium" colour = { sizeIdx === 1 ? colourSelected : colourDefault } onPress = { () => setSizeIdx (1) }/>
            <Panel title = "Large" colour = { sizeIdx === 2 ? colourSelected : colourDefault } onPress = { () => setSizeIdx (2) }/>
          </Grid>
        </Section>
      </View>
        <View style = {[ styles.container, { flex: 4 } ]}>
          <Query result = { categories }>
            <Query result = { drinks }>
              {
                categories.data?.map ((c: Category) => 
                  <Section key = { c.id } title = { c.name }>
                    <Grid align = { 6 }>
                      {
                        drinks.data?.filter ((d: Drink) => d.category_id === c.id)
                          .map ((d: Drink) => <Panel key = { d.id } title = { d.name }/>)
                      }
                    </Grid>
                  </Section>
                )
              }
            </Query>
          </Query>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  screen: {
    backgroundColor: "#25292e",
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#fff",
  }
});
