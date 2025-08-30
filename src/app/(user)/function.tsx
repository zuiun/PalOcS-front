import { useContext, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { queryClient } from "@/app/_layout";
import Grid, { Panel } from "@/components/Grid";
import InputDate from "@/components/InputDate";
import InputID from "@/components/InputID";
import Popup from "@/components/Popup";
import Receipt from "@/components/Receipt";
import Report from "@/components/Report";
import Section from "@/components/Section";
import UserContext from "@/contexts/UserContext";
import { colourDefault } from "@/utils/consts";
import { ReceiptAPI, ReportAPI } from "@/utils/types";

export default function Function () {
  const user = useContext (UserContext);
  const [isVisibleIDReceipt, setVisibleIDReceipt] = useState (false);
  const [isVisibleReceipt, setVisibleReceipt] = useState (false);
  const [receipt, setReceipt] = useState<ReceiptAPI> ({
    id: 0,
    timestamp: "",
    user_id: "",
    user_name: "",
    lines: [],
    payment: "",
  });
  const [isVisibleIDReport, setVisibleIDReport] = useState (false);
  const [isVisibleDate, setVisibleDate] = useState (false);
  const [isVisibleReport, setVisibleReport] = useState (false);
  const [id, setID] = useState ("");
  const [report, setReport] = useState<ReportAPI> ({
    user_id: "",
    user_name: "",
    date: "",
    voids: [],
    refunds: [],
    sales_cash: [],
    sales_not_cash: [],
    tax: 0,
  });
  const handlePressReceipt = async (id: string) => {
    const getTransaction = async () => {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/transaction/${id}`);

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

    setReceipt (receiptNew);
    return { isError: false, isSuccess: true };
  };
  const handlePressReportID = async (id: string) => {
    const validation = await user.validate (id, false);

    if (! validation.status.isError && validation.status.isSuccess) {
      setID (id);
    }

    return validation.status;
  };
  const handlePressReportDate = async (date: string) => {
    const getReport = async () => {
      const response = await fetch (`${process.env.EXPO_PUBLIC_API_URL}/report/${id}/${date}`);

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

    setReport (reportNew);
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
              onSuccess = { () => {
                setVisibleIDReceipt (false);
                setVisibleReceipt (true);
              }
          }/>
        </View> }
        { isVisibleReceipt && <Receipt receipt = { receipt }/> }
      </Popup>
      <Popup visible = { isVisibleIDReport || isVisibleDate || isVisibleReport } onPress = { () => {
        setVisibleIDReport (false);
        setVisibleDate (false);
        setVisibleReport (false);
      } }>
        { isVisibleIDReport && <View style = { styles.input }>
          <InputID title = "Enter user ID"
              onPress = { handlePressReportID }
              onSuccess = { () => {
                setVisibleIDReport (false);
                setVisibleDate (true);
              }
          }/>
        </View> }
        { isVisibleDate && <View style = { styles.input }>
          <InputDate onPress = { handlePressReportDate }
              onSuccess = { () => {
                setVisibleDate (false);
                setVisibleReport (true);
              }
          }/>
        </View> }
        { isVisibleReport && <Report report = { report } /> }
      </Popup>
      <Section title = "Function">
        <Grid align = { 2 }>
          <Panel title = "Receipt" colour = { colourDefault } onPress = { () => setVisibleIDReceipt (true) }/>
          <Panel title = "Report" colour = { colourDefault } onPress = { () => setVisibleIDReport (true) }/>
        </Grid>
      </Section>
    </>
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
