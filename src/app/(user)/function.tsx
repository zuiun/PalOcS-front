import { useContext, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import Grid, { Panel } from "@/components/Grid";
import InputDate from "@/components/InputDate";
import InputID from "@/components/InputID";
import Popup from "@/components/Popup";
import Receipt from "@/components/Receipt";
import Report from "@/components/Report";
import Section from "@/components/Section";
import UserContext from "@/contexts/UserContext";
import { colourBackground, timezone } from "@/utils/consts";
import { Colour, ReceiptAPI, ReportAPI } from "@/utils/types";

export default function Function () {
  const queryClient = useQueryClient ();
  const user = useContext (UserContext);
  const [isVisibleIDReceipt, setVisibleIDReceipt] = useState (false);
  const [isVisibleReceipt, setVisibleReceipt] = useState (false);
  const receipt = useRef<ReceiptAPI | undefined> (undefined);
  const [isVisibleIDReport, setVisibleIDReport] = useState (false);
  const [isVisibleDate, setVisibleDate] = useState (false);
  const [isVisibleReport, setVisibleReport] = useState (false);
  const id = useRef ("");
  const report = useRef<ReportAPI | undefined> (undefined);
  const handlePressReceipt = async (id: string) => {
    const getTransaction = async () => {
      const params = new URLSearchParams ({
        timezone: timezone,
      });
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/transaction/${id}?${params}`);

      if (response.ok) {
        return await response.json ();
      } else if (response.status === 404) {
        throw new RangeError (`No transaction found with ID ${id}`);
      } else {
        throw new Error (`${response.status}`);
      }
    };
    let receiptNew: ReceiptAPI;

    try {
      receiptNew = await queryClient.fetchQuery ({ queryKey: [`/transaction/${id}`], queryFn: getTransaction });
    } catch (error) {
      console.log (`Fetch Error: ${error}`);

      if (error instanceof RangeError) {
        return { isError: false, isSuccess: false };
      } else {
        return { isError: true, isSuccess: false };
      }
    }

    receipt.current = receiptNew;
    return { isError: false, isSuccess: true };
  };
  const handlePressReportID = async (idNew: string) => {
    const validation = await user.validate (idNew, false);

    if (! validation.status.isError && validation.status.isSuccess) {
      id.current = idNew;
    }

    return validation.status;
  };
  const handlePressReportDate = async (id: string, date: string) => {
    const getReport = async () => {
      const params = new URLSearchParams ({
        timezone: timezone,
      });
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/report/${id}/${date}?${params}`);

      if (response.ok) {
        return await response.json ();
      } else if (response.status === 404) {
        throw new RangeError (`No report found with user ID ${id} and date ${date}`);
      } else if (response.status === 400) {
        throw new TypeError (`Invalid date ${date}`);
      } else {
        throw new Error (`${response.status}`);
      }
    };
    let reportNew: ReportAPI;

    try {
      reportNew = await queryClient.fetchQuery ({ queryKey: [`/report/${id}/${date}`], queryFn: getReport });
    } catch (error) {
      console.log (`Fetch Error: ${error}`);

      if (error instanceof RangeError) {
        return { isError: false, isSuccess: false };
      } else {
        return { isError: true, isSuccess: false };
      }
    }

    report.current = reportNew;
    return { isError: false, isSuccess: true };
  };

  return (
    <>
      <Popup visible = { isVisibleIDReceipt || isVisibleReceipt } onPress = { () => {
        setVisibleIDReceipt (false);
        setVisibleReceipt (false);
      } }>
        { isVisibleIDReceipt && <View style = { styles.input }>
          <InputID title = "Enter transaction ID"
              onPress = { handlePressReceipt }
              onSuccess = { async () => {
                setVisibleIDReceipt (false);
                setVisibleReceipt (true);
              }
          }/>
        </View> }
        { isVisibleReceipt && <Receipt receipt = { receipt.current! }/> }
      </Popup>
      <Popup visible = { isVisibleIDReport || isVisibleDate || isVisibleReport } onPress = { () => {
        setVisibleIDReport (false);
        setVisibleDate (false);
        setVisibleReport (false);
      } }>
        { isVisibleIDReport && <View style = { styles.input }>
          <InputID title = "Enter user ID"
              onPress = { handlePressReportID }
              onSuccess = { async () => {
                setVisibleIDReport (false);
                setVisibleDate (true);
              }
          }/>
        </View> }
        { isVisibleDate && <View style = { styles.input }>
          <InputDate onPress = { async (date: string) => handlePressReportDate (id.current, date) }
              onSuccess = { async () => {
                setVisibleDate (false);
                setVisibleReport (true);
              }
          }/>
        </View> }
        { isVisibleReport && <Report report = { report.current! } /> }
      </Popup>
      <Section title = "Function">
        <Grid align = { 2 }>
          <Panel title = "Receipt" colour = { Colour.default } onPress = { () => setVisibleIDReceipt (true) }/>
          <Panel title = "Report" colour = { Colour.default } onPress = { () => setVisibleIDReport (true) }/>
        </Grid>
      </Section>
    </>
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
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
