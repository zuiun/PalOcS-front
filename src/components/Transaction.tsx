import { useContext } from "react";
import { Dimensions, FlatList, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Paragraph from "@/components/Paragraph";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import { calculatePrice, convertPrice } from "@/utils/helpers";
import { LineAPI } from "@/utils/types";

function Separator () {
  return <View style = { styles.separator }/>;
}

function Line ({ line, style, onPress }: Readonly<{ line: LineAPI, style?: StyleProp<ViewStyle>, onPress?: () => undefined }>) {
  const price = calculatePrice (line.price, line.discount_value);
  let row = (
    <>
      <Paragraph style = {[ styles.left, { flex: 3} ]}>
        { line.name }
      </Paragraph>
      { (line.discount_name && line.discount_value) && <Paragraph style = {[ styles.centre, { flex: 3} ]}>
        { line.discount_name } -{ line.discount_value }%
      </Paragraph> }
      <Paragraph style = {[ styles.right, { flex: 1} ]}>
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

export default function Transaction ({ purchases, isSelectable, payment }: Readonly<{ purchases: LineAPI[], isSelectable: boolean, payment?: string }>) {
  const selectedIdxs = useContext (SelectedIdxsContext);
  let priceTotal: number = 0;

  purchases.forEach ((p) => priceTotal += calculatePrice (p.price, p.discount_value));

  return (
    <>
      <FlatList contentContainerStyle = {[ styles.list ]} data = { purchases }
          ItemSeparatorComponent = { Separator }
          keyExtractor = { (item, index) => `${item.name}-${index}` }
          renderItem = { ({item, index}) => {
        return (
          <Line key = { index } line = { item }
              style = {[ styles.item, isSelectable && selectedIdxs.selectedIdxs.includes (index) && styles.selected ]}
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
      <View style = { styles.total }>
        <View style = { styles.row }>
          <Paragraph style = {[ styles.left, { flex: 4} ]}>
            Total
          </Paragraph>
          <Paragraph style = {[ styles.right, { flex: 1} ]}>
            { convertPrice (priceTotal) }
          </Paragraph>
        </View>
        { payment && <Paragraph>
          Paid with { payment }
        </Paragraph> }
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
    width: "100%",
    flexDirection: "row",
  },
  selected: {
    backgroundColor: "blue",
  },
  left: {
    paddingLeft: 0.01 * Dimensions.get ("window").height,
  },
  centre: {
    color: "red",
    textAlign: "right",
  },
  right: {
    paddingRight: 0.01 * Dimensions.get ("window").height,
    textAlign: "right",
  },
  item: {
    paddingTop: 0.003 * Dimensions.get ("window").height,
    paddingBottom: 0.003 * Dimensions.get ("window").height,
  }
});
