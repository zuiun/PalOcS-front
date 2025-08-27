import { useContext } from "react";
import { Dimensions, FlatList, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Paragraph from "@/components/Paragraph";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import { calculatePrice, convertPrice } from "@/utils/helpers";
import { Item } from "@/utils/types";

function Separator () {
  return <View style = { styles.separator }/>;
}

function Line ({ product_name, discount_name, discount_value, price, style, onPress }: Readonly<{ product_name: string, discount_name?: string, discount_value?: number, price: number, style?: StyleProp<ViewStyle>, onPress?: () => undefined }>) {
  let row = (
    <>
      <Paragraph style = {[ styles.name, { flex: 3} ]}>
        { product_name }
      </Paragraph>
      { (discount_name && discount_value) && <Paragraph style = {[ styles.discount, { flex: 3} ]}>
        {discount_name} -{ discount_value }%
      </Paragraph> }
      <Paragraph style = {[ styles.price, { flex: 1} ]}>
        { convertPrice (price) }
      </Paragraph>
    </>
  );

  if (onPress) {
    return (
      <View style = { style }>
        <Pressable style = { styles.row } onPress = { onPress }>
          { row }
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style = {[ styles.row, style ]}>
        { row }
      </View>
    );
  }
}

export default function Transaction ({ purchases, isSelectable }: Readonly<{ purchases: Item[], isSelectable: boolean }>) {
  const selectedIdxs = useContext (SelectedIdxsContext);
  let priceTotal: number = 0;

  purchases.forEach ((p) => priceTotal += calculatePrice (p.price, p.discount_value));

  return (
    <>
      <FlatList contentContainerStyle = {[ styles.list ]} data = { purchases }
          ItemSeparatorComponent = { Separator }
          keyExtractor = { (item, index) => `${item.product_name}-${index}` }
          renderItem = { ({item, index}) => {
        let price = calculatePrice (item.price, item.discount_value);

        return (
          <Line key = { index } product_name = { item.product_name } discount_name = { item.discount_name } discount_value = { item.discount_value } price = { price }
              style = { selectedIdxs.selectedIdxs.includes (index) && styles.selected }
              onPress = { isSelectable ? 
                () => {
                  if (selectedIdxs.selectedIdxs.includes (index)) {
                    selectedIdxs.remove (index);
                  } else {
                    selectedIdxs.add (index);
                  }
                }
              :
                undefined
              }
          />
        );
      } }/>
      <View style = {[ styles.total, styles.row ]}>
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
  separator: {
    height: 1,
    backgroundColor: "#fff",
  },
  total: {
    alignItems: "center",
    borderColor: "#fff",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    paddingTop: 0.01 * Dimensions.get ("window").height,
    paddingBottom: 0.01 * Dimensions.get ("window").height,
  },
  row: {
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
