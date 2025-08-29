import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import Transaction from "@/components/Transaction";
import UserContext from "@/contexts/UserContext";
import TransactionContext from "@/contexts/TransactionContext";

export default function Screen ({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = useContext (UserContext);
  const transactions = useContext (TransactionContext);

  return (
    <View style = {[ styles.screen, styles.row ]}>
      <View style = {[ styles.column, { flex: 4 } ]}>
        <View style = {[ styles.column, { flex: 4 } ]}>
          { children }
        </View>
        <Footer flex = { 1 }/>
      </View>
      <View style = {{ flex: 1 }}>
        <Section title = { `${user.id} - ${user.name}` } height = "100%">
          <Transaction purchases = { transactions.purchases.map ((p) => {
            return {
              name: p.name,
              size: p.size,
              price: p.price,
              discount_name: p.discount?.name,
              discount_value: p.discount?.value,
            }
          }) } isSelectable={true}/>
        </Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create ({
  screen: {
    width: "100%",
    height: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  column: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center"
  },
});
