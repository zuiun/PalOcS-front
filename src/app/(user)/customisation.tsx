import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import TransactionContext from "@/contexts/TransactionContext";
import { ProductAPI, SubcategoryAPI } from "@/utils/types";

const CATEGORY_ID = 5;

export default function Customisation () {
  const getSubcategories = async () => {
    const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/product/${CATEGORY_ID}/subcategories`);

    if (response.ok) {
      return await response.json ();
    } else {
      throw new Error (`${response.status}`);
    }
  };
  const getCustomisations = async () => {
    const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/product/${CATEGORY_ID}`);

    if (response.ok) {
      return await response.json ();
    } else {
      throw new Error (`${response.status}`);
    }
  };
  const subcategories = useQuery ({ queryKey: [`/product/${CATEGORY_ID}/subcategories`], queryFn: getSubcategories });
  const customisations = useQuery ({ queryKey: [`/product/${CATEGORY_ID}`], queryFn: getCustomisations });
  const transactions = useContext (TransactionContext);

  return (
    <>
      <Query result = { subcategories }>
        <Query result = { customisations }>
          {
            subcategories.data?.map ((s: SubcategoryAPI) =>
              <Section key = { s.id } title = { s.name }>
                <Grid align = { 8 }>
                  {
                    customisations.data?.filter ((c: ProductAPI) => c.subcategory_id === s.id)
                        .map ((c: ProductAPI) =>
                          <Panel key = { c.id } title = { c.name } onPress = { () =>
                            transactions.add ({
                              id: c.id,
                              name: c.name,
                              size: 0,
                              price: c.price,
                          })}/>
                        )
                  }
                </Grid>
              </Section>
            )
          }
        </Query>
      </Query>
    </>
  );
}
