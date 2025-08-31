import { router, useLocalSearchParams } from "expo-router";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import TransactionContext from "@/contexts/TransactionContext";
import { colourDefault, colourSelected, uninitialisedIdx } from "@/utils/consts";
import { ProductAPI, SubcategoryAPI } from "@/utils/types";

export default function CategoryID () {  
  const { category_id }: { category_id: number } = useLocalSearchParams ();
  const getSubcategories = async () => {
    const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/product/${category_id}/subcategories`);

    if (response.ok) {
      return await response.json ();
    } else {
      throw new Error (`${response.status}`);
    }
  };
  const getDrinks = async () => {
    const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/product/${category_id}`);

    if (response.ok) {
      return await response.json ();
    } else {
      throw new Error (`${response.status}`);
    }
  };
  const [sizeIdx, setSizeIdx] = useState (uninitialisedIdx);
  const subcategories = useQuery ({ queryKey: [`/product/${category_id}/categories`], queryFn: getSubcategories });
  const drinks = useQuery ({ queryKey: [`/product/${category_id}`], queryFn: getDrinks });
  const transactions = useContext (TransactionContext);
  const handlePress = (sizeIdx: number) => {
    if (sizeIdx > uninitialisedIdx) {
      router.setParams ({ size: sizeIdx });
      setSizeIdx (sizeIdx);
    }
  };

  return (
    <View style = { styles.screen }>
      <View style = {[ styles.container, { flex: 1 } ]}>
        <Section title = "Size">
          <Grid align = { 1 }>
            <Panel title = "Small" colour = { sizeIdx === 0 ? colourSelected : colourDefault } onPress = { () => handlePress (0) }/>
            <Panel title = "Medium" colour = { sizeIdx === 1 ? colourSelected : colourDefault } onPress = { () => handlePress (1) }/>
            <Panel title = "Large" colour = { sizeIdx === 2 ? colourSelected : colourDefault } onPress = { () => handlePress (2) }/>
          </Grid>
        </Section>
      </View>
      <View style = {[ styles.container, { flex: 4 } ]}>
        <Query result = { subcategories }>
          <Query result = { drinks }>
            {
              subcategories.data?.map ((s: SubcategoryAPI) => 
                <Section key = { s.id } title = { s.name }>
                  <Grid align = { 6 }>
                    {
                      drinks.data?.filter ((d: ProductAPI) => d.subcategory_id === s.id)
                        .map ((d: ProductAPI) =>
                          <Panel key = { d.id } title = { d.name } onPress = { () => {
                            if (d.price.length > 1) {
                              if (sizeIdx > uninitialisedIdx && sizeIdx < d.price.length) {
                                transactions.add ({
                                  id: d.id,
                                  name: d.name,
                                  size: sizeIdx,
                                  price: d.price,
                                });
                              }
                            } else {
                              transactions.add ({
                                id: d.id,
                                name: d.name,
                                size: 0,
                                price: d.price,
                              });
                            }
                          }}/>
                        )
                    }
                  </Grid>
                </Section>
              )
            }
          </Query>
        </Query>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  screen: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  container: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center"
  },
});
