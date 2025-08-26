import { useContext, useState } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, View } from "react-native";
import Paragraph from "@/components/Paragraph";
import TransactionsContext from "@/contexts/TransactionsContext";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";

function convertPrice (price: number) {
  const dollars = Math.floor (price / 1_00);
  const cents = price % 1_00;
  const centsPadded = `${cents}`.padStart (2, "0");

  return `$${dollars},${centsPadded}`;
}

function calculatePrice (price: number, discount?: number) {
  if (discount) {
    let priceNew = price;

    priceNew *= (100 - discount) / 100;
    priceNew = Math.ceil (priceNew);
    return priceNew;
  } else {
    return price;
  }
}

export default function Transaction () {
  const transactions = useContext (TransactionsContext);
  const selectedIdxs = useContext (SelectedIdxsContext);
  let priceTotal: number = 0;

  transactions.purchases.forEach ((p) => priceTotal += calculatePrice (p.price, p.discount?.value));

  return (
    <>
      <FlatList contentContainerStyle = {[ styles.list ]} data = { transactions.purchases }
          keyExtractor = { (item, index) => `${item.id}-${item.category_id}-${index}` }
          renderItem = { ({item, index}) => {
        let price = calculatePrice (item.price, item.discount?.value);

        return (
          <View key = { index } style = {[ styles.item, selectedIdxs.selectedIdxs.includes (index) && styles.selected ]}>
            <Pressable style = { styles.container } onPress = { () => {
              if (selectedIdxs.selectedIdxs.includes (index)) {
                selectedIdxs.remove (index);
              } else {
                selectedIdxs.add (index);
              }
            } }>
              <Paragraph style = {[ styles.name, { flex: 3} ]}>
                { item.name }
              </Paragraph>
              { item.discount && <Paragraph style = {[ styles.discount, { flex: 3} ]}>
                {item.discount.name} -{ item.discount.value }%
              </Paragraph> }
              <Paragraph style = {[ styles.price, { flex: 1} ]}>
                { convertPrice (price) }
              </Paragraph>
            </Pressable>
          </View>
        );
      } }/>
      <View style = {[ styles.item, styles.total, styles.container ]}>
        <Paragraph style = {[ styles.name, { flex: 4} ]}>
          Total
        </Paragraph>
        <Paragraph style = {[ styles.price, { flex: 1} ]}>
          { convertPrice (priceTotal) }
        </Paragraph>
      </View>
    </>
  );
}

const styles = StyleSheet.create ({
  list: {
    width: "100%",
    height: "100%",
    overflow: "scroll",
    justifyContent: "flex-start",
    borderColor: "#fff",
    borderWidth: 1,
  },
  item: {
    borderColor: "#fff",
    borderBottomWidth: 1,
  },
  total: {
    alignItems: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: 0.01 * Dimensions.get ("window").height,
    paddingBottom: 0.01 * Dimensions.get ("window").height,
  },
  container: {
    flexDirection: "row",
  },
  selected: {
    backgroundColor: "blue",
  },
  name: {
    paddingLeft: 0.01 * Dimensions.get ("window").height,
  },
  discount: {
    color: "red",
    textAlign: "right",
  },
  price: {
    paddingRight: 0.01 * Dimensions.get ("window").height,
    textAlign: "right",
  },
});
