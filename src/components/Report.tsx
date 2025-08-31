import { Dimensions, StyleSheet, View } from "react-native";
// import { useEffect, useState } from "react";
// import { useMutation } from "@tanstack/react-query";
import Paragraph from "@/components/Paragraph";
import Section from "@/components/Section";
import Separator from "@/components/Separator";
import { colourBackground, currencySymbol, taxRate } from "@/utils/consts";
import { calculatePrice, convertDecimal } from "@/utils/helpers";
import { ReportAPI } from "@/utils/types";

function Line ({ title, information, total }: Readonly<{ title: string, information: string, total: number }>) {
  return (
    <View style = {[ styles.item, styles.row, styles.pad ]}>
      <Paragraph style = {[ styles.left, { flex: 1 } ]}>
        { title }
      </Paragraph>
      <Paragraph style = {[ styles.right, { flex: 2 } ]}>
        { information } ({ currencySymbol }{ convertDecimal (total) })
      </Paragraph>
    </View>
  );
}

export default function Report ({ report }: Readonly<{ report: ReportAPI }>) {
  let [voidsCount, voidsTotal] = [0, 0];
  let [refundsCount, refundsTotal] = [0, 0];
  let [salesCashCount, salesCashTotal] = [0, 0];
  let [salesNotCashCount, salesNotCashTotal] = [0, 0];
  let [discountsCount, discountsTotal] = [0, 0];
  let tax = report.tax;
  // const postReport = useMutation ({
  //   mutationFn: async () => {
  //     const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/report/${report.user_id}/${report.date}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify ({
  //         voids: [voidsCount, voidsTotal],
  //         refunds: [refundsCount, refundsTotal],
  //         sales_cash: [salesCashCount, salesCashTotal],
  //         sales_not_cash: [salesNotCashCount, salesNotCashTotal],
  //         discounts: [discountsCount, discountsTotal],
  //         tax: tax,
  //       }),
  //     });

  //     if (! response.ok) {
  //       throw new Error (`${response.status}`);
  //     }
  //   },
  // });
  // const [isInit, setInit] = useState (false);

  for (let v of report.voids) {
    voidsCount += 1;
    voidsTotal += calculatePrice (v.cost, v.discount);
  }

  for (let r of report.refunds) {
    refundsCount += 1;
    refundsTotal += calculatePrice (r.cost, r.discount);
  }

  for (let s of report.sales_cash) {
    const price = calculatePrice (s.cost, s.discount);

    salesCashCount += 1;
    salesCashTotal += price;

    if (s.discount) {
      const priceOriginal = calculatePrice (s.cost, undefined);

      discountsCount += 1;
      discountsTotal += priceOriginal - price;
    }
  }

  for (let s of report.sales_not_cash) {
    const price = calculatePrice (s.cost, s.discount);

    salesNotCashCount += 1;
    salesNotCashTotal += price;

    if (s.discount) {
      const priceOriginal = calculatePrice (s.cost, undefined);

      discountsCount += 1;
      discountsTotal += priceOriginal - price;
    }
  }

  // setInit (true);

  // useEffect (() => {
  //   const handleCompile = async () => {
  //     try {
  //       await postReport.mutateAsync ();
  //     } catch (error) {
  //       console.log (`Fetch Error ${error}`);
  //     }
  //   };

  //   handleCompile ();
  // }, []);

  return (
    <View style = { styles.transaction }>
      <View style = { styles.title }>
        <Section title = { `Report: ${report.user_id}, ${report.date}` }>
          <View style = { styles.row }>
            <Paragraph style = {[ styles.text, styles.left, { flex: 1 } ]}>
              { `${report.user_id} - ${report.user_name}` }
            </Paragraph>
            <Paragraph style = {[ styles.text, styles.right, { flex: 1 } ]}>
              { report.timestamp } CET
            </Paragraph>
          </View>
        </Section>
      </View>
      <View style = { styles.list }>
        <Line title = "Sales (Total)" information = { `${salesCashCount + salesNotCashCount}` } total = { salesCashTotal + salesNotCashTotal }/>
        <Separator/>
        <Line title = "Sales (Cash)" information = { `${salesCashCount}` } total = { salesCashTotal }/>
        <Separator/>
        <Line title = "Tax" information = { `${convertDecimal (taxRate)}%` } total = { tax }/>
        <Separator/>
        <Line title = "Discounts" information = { `${discountsCount}` } total = { discountsTotal }/>
        <Separator/>
        <Line title = "Voids" information = { `${voidsCount}` } total = { voidsTotal }/>
        <Separator/>
        <Line title = "Refunds" information = { `${refundsCount}` } total = { refundsTotal }/>
      </View>
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
  },
  title: {
    borderColor: "white",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
  },
  list: {
    width: "100%",
    justifyContent: "flex-start",
    borderColor: "white",
    borderWidth: 1,
  },
  text: {
    textAlignVertical: "center",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  pad: {
    paddingBottom: 0.003 * Dimensions.get ("window").height,
  },
  left: {
    paddingLeft: 0.01 * Dimensions.get ("window").height,
  },
  right: {
    paddingRight: 0.01 * Dimensions.get ("window").height,
    textAlign: "right",
  },
  item: {
    paddingTop: 0.003 * Dimensions.get ("window").height,
    paddingBottom: 0.003 * Dimensions.get ("window").height,
  },
});
