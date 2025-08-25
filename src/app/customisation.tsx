import { useQuery } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import Section from "@/components/Section";
import Query from "@/components/Query";
import { Category, Product } from "@/constants/types";

export default function Customisation () {
  const getCategories = async () => {
    try {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/customisation/categories`);

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`Fetch Error: ${response.status}`);
      }
    } catch (error) {
      console.log (error);
    }
  };
  const getCustomisations = async () => {
    try {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/customisation`);

      if (response.ok) {
        return await response.json ();
      } else {
        throw new Error (`Fetch Error: ${response.status}`);
      }
    } catch (error) {
      console.log (error);
    }
  };
  const categories = useQuery ({ queryKey: [`/customisation/categories`], queryFn: getCategories });
  const customisations = useQuery ({ queryKey: [`/customisation`], queryFn: getCustomisations });

  return (
    <>
      <Query result = { categories }>
        <Query result = { customisations }>
          {
            categories.data?.map ((ca: Category) =>
              <Section key = { ca.id } title = { ca.name }>
                <Grid align = { 8 }>
                  {
                    customisations.data?.filter ((cu: Product) => cu.category_id === ca.id)
                        .map ((cu: Product) => <Panel key = { cu.id } title = { cu.name }/>)
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


    // <>
    //   {
    //     categories.isPending ?
    //       <ActivityIndicator/>
    //     :
    //     categories.isError ?
    //       <Text style = { styles.text }>
    //         Error
    //       </Text>
    //     :
    //       <Grid align = { 4 }>
    //         {
    //           categories.data?.map ((ca: Category) => 
    //             <Section key = { ca.id } title = { ca.name }>
    //               <Grid align = { 8 }>
    //                 {
    //                   customisations.isPending ?
    //                     <ActivityIndicator/>
    //                   :
    //                   customisations.isError ?
    //                     <Text style = { styles.text }>
    //                       Error
    //                     </Text>
    //                   :
    //                     customisations.data?.filter ((cu) => cu.category_id === ca.id)
    //                         .map ((cu, j) => <Panel key = { j } title = { cu.name }/>)
    //                 }
    //               </Grid>
    //             </Section>
    //           )
    //         }
    //       </Grid>
    //   }
    // </>
