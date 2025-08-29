import { useContext } from "react";
import { Dimensions, FlatList, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Paragraph from "@/components/Paragraph";
import SelectedIdxsContext from "@/contexts/SelectedIdxsContext";
import { calculatePrice, calculateSubtotal, calculateTax } from "@/utils/helpers";
import { LineAPI, RefundAPI } from "@/utils/types";

const CURRENCY_SYMBOL = "$";

function convertDecimal (number: number) {
  const units = Math.floor (number / 1_00);
  const decimals = number % 1_00;
  const decimalsPadded = `${decimals}`.padStart (2, "0");

  return `${units},${decimalsPadded}`;
}

function convertSize (size: number) {
  switch (size) {
    case 0:
      return "(S)";
    case 1:
      return "(M)";
    case 2:
      return "(L)";
    default:
      return "";
  }
}

function Separator () {
  return <View style = { styles.separator }/>;
}

function Line ({ line, style, isRefund, onPress }: Readonly<{ line: LineAPI, style?: StyleProp<ViewStyle>, isRefund: boolean, onPress?: () => undefined }>) {
  const price = calculatePrice (line.price[line.size], line.discount_value);
  let row = (
    <>
      <Paragraph style = {[ styles.left, { flex: 3 } ]}>
        { line.name }{ line.price.length > 1 && ` ${convertSize (line.size)}` }
      </Paragraph>
      { (line.discount_name && line.discount_value) && <Paragraph style = {[ styles.centre, { flex: 3 } ]}>
        { line.discount_name } -{ line.discount_value }%
      </Paragraph> }
      <Paragraph style = {[ styles.right, isRefund && styles.centre, { flex: 1 } ]}>
        { isRefund && "-" }{ CURRENCY_SYMBOL }{ convertDecimal (price) }
      </Paragraph>
    </>
  );

  if (onPress) {
    return (
      <View style = {[ styles.row, styles.pad, style ]}>
        <Pressable style = { styles.row } onPress = { onPress }>
          { row }
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style = {[ styles.row, styles.pad, style ]}>
        { row }
      </View>
    );
  }
}

export default function Transaction ({ purchases, isSelectable, payment, refund }: Readonly<{ purchases: LineAPI[], isSelectable: boolean, payment?: string, refund?: RefundAPI }>) {
  const selectedIdxs = useContext (SelectedIdxsContext);
  const subtotal = calculateSubtotal (purchases);
  const tax = calculateTax (purchases);

  return (
    <>
      <FlatList contentContainerStyle = {[ styles.list ]} data = { purchases }
          ItemSeparatorComponent = { Separator }
          keyExtractor = { (item, index) => `${item.name}-${index}` }
          renderItem = { ({item, index}) => {
        return (
          <Line key = { index } line = { item }
              style = {[ styles.item, isSelectable && selectedIdxs.selectedIdxs.includes (index) && styles.selected ]}
              isRefund = { refund !== undefined }
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
            Subtotal
          </Paragraph>
          <Paragraph style = {[ styles.right, refund && styles.centre, { flex: 1} ]}>
            { refund && "-" }{ CURRENCY_SYMBOL }{ convertDecimal (subtotal) }
          </Paragraph>
        </View>
        <View style = { styles.row }>
          <Paragraph style = {[ styles.left, { flex: 4} ]}>
            Tax ({ convertDecimal (parseInt (process.env.EXPO_PUBLIC_TAX_RATE!)) }%)
          </Paragraph>
          <Paragraph style = {[ styles.right, refund && styles.centre, { flex: 1} ]}>
            { CURRENCY_SYMBOL }{ convertDecimal (tax) }
          </Paragraph>
        </View>
        <View style = { styles.row }>
          <Paragraph style = {[ styles.left, { flex: 4} ]}>
            Total
          </Paragraph>
          <Paragraph style = {[ styles.right, refund && styles.centre, { flex: 1} ]}>
            { refund && "-" }{ CURRENCY_SYMBOL }{ convertDecimal (subtotal + tax) }
          </Paragraph>
        </View>
        {
          payment ?
            refund ?
              <Paragraph>
                Refunded by { `${refund.manager_id} - ${refund.manager_name}` } to { payment }
              </Paragraph>
            :
              <Paragraph>
                Paid with { payment }
              </Paragraph>
          :
            undefined
        }
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
    justifyContent: "center",
  },
  pad: {
    paddingBottom: 0.003 * Dimensions.get ("window").height,
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
