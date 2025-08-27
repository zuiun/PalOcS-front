import { Dimensions, StyleSheet, View } from "react-native";
import Paragraph from "@/components/Paragraph";
import Section from "@/components/Section";
import Transaction from "@/components/Transaction";
import { Report } from "@/utils/types";

export default function Reprint ({ report }: Readonly<{ report: Report }>) {
  return (
    <View style = { styles.transaction }>
      <View style = { styles.title }>
        <Section title = { `Transaction: ${report.id}` }>
          <Paragraph style = {{ textAlign: "center", textAlignVertical: "center" }}>
            {/* TODO: name and time */}
            { `${report.user_id} - ${report.user_id}` }
          </Paragraph>
        </Section>
      </View>
      <Transaction purchases = { report.purchases } isSelectable = { false }/>
    </View>
  );
}

const styles = StyleSheet.create ({
  input: {
    backgroundColor: "#25292e",
    borderWidth: 1,
    borderColor: "#fff",
    paddingLeft: 0.02 * Dimensions.get ("window").height,
    paddingRight: 0.02 * Dimensions.get ("window").height,
  },
  transaction: {
    backgroundColor: "#25292e",
    width: 0.4 * Dimensions.get ("window").height,
    height: 0.8 * Dimensions.get ("window").height,
  },
  title: {
    borderColor: "#fff",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
