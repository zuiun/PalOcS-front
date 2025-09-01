import { Dimensions, StyleSheet, View } from "react-native";
import Paragraph from "@/components/Paragraph";
import Section from "@/components/Section";
import Transaction from "@/components/Transaction";
import { colourBackground } from "@/utils/consts";
import { ReceiptAPI } from "@/utils/types";

export default function Receipt ({ receipt }: Readonly<{ receipt: ReceiptAPI }>) {
  return (
    <View style = { styles.transaction }>
      <View style = { styles.title }>
        <Section title = { `Transaction: ${receipt.id}` }>
          <View style = { styles.row }>
            <Paragraph style = {[ styles.text, styles.left, { flex: 1 } ]}>
              { `${receipt.user_id} - ${receipt.user_name}` }
            </Paragraph>
            <Paragraph style = {[ styles.text, styles.right, { flex: 1 } ]}>
              { receipt.timestamp }
            </Paragraph>
          </View>
        </Section>
      </View>
      <Transaction purchases = { receipt.lines } isSelectable = { false } payment = { receipt.payment } refund = { receipt.refund }/>
    </View>
  );
}

const styles = StyleSheet.create ({
  input: {
    backgroundColor: colourBackground,
    borderWidth: 1,
    borderColor: "white",
    paddingLeft: 0.02 * Dimensions.get ("window").height,
    paddingRight: 0.02 * Dimensions.get ("window").height,
  },
  transaction: {
    backgroundColor: colourBackground,
    width: 0.4 * Dimensions.get ("window").height,
    height: 0.8 * Dimensions.get ("window").height,
  },
  title: {
    borderColor: "white",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  text: {
    textAlignVertical: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  left: {
    paddingLeft: 0.01 * Dimensions.get ("window").height,
  },
  right: {
    paddingRight: 0.01 * Dimensions.get ("window").height,
    textAlign: "right",
  },
});
