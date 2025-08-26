import { useContext } from "react";
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import TransactionsContext from "@/contexts/TransactionsContext";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";

function convertPrice (price: number) {
  const dollars = Math.floor (price / 1_00);
  const cents = price % 1_00;
  const centsPadded = `${cents}`.padEnd (2, "0");

  return `${dollars},${centsPadded}`;
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

export default function List () {
  const transactions = useContext (TransactionsContext);
  const selectedIdxs = useContext (SelectedIdxsContext);

  return (
    <FlatList contentContainerStyle = { styles.list } data = { transactions.transactions } keyExtractor = { (item, index) => `${item.id}-${item.category_id}-${index}` }
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
            <Text style = {[ styles.text, styles.name ]}>{ item.name }</Text>
            { item.discount && <Text style = { styles.discount }>-{ item.discount.value }%</Text> }
            <Text style = {[ styles.text, styles.price ]}>{
              convertPrice (price)
            }</Text>
          </Pressable>
        </View>
      );
    } }/>
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
  container: {
    flexDirection: "row",
  },
  selected: {
    backgroundColor: "blue",
  },
  name: {
    flex: 3,
    paddingLeft: 0.01 * Dimensions.get ("window").height,
  },
  discount: {
    flex: 2,
    color: "red",
    textAlign: "right",
  },
  price: {
    flex: 1,
    paddingRight: 0.01 * Dimensions.get ("window").height,
    textAlign: "right",
  },
  text: {
    color: "#fff",
  },
});
