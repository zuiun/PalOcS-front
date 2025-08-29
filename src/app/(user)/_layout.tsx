import { Redirect, Slot } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Indicator from "@/components/Indicator";
import Screen from "@/components/Screen";
import { SelectedIdxsProvider } from "@/contexts/SelectedIdxsContext";
import { TransactionsProvider } from "@/contexts/TransactionContext";
import UserContext from "@/contexts/UserContext";

export default function UserLayout () {
  const user = useContext (UserContext);
  const [isValidated, setValidated] = useState (false);
  const [isInit, setInit] = useState (false);

  useEffect (() => {
    const getUser = async () => {
      const { status } = await user.validate (user.id, false);

      if (status.isError) {
        setValidated (false);
      } else if (status.isSuccess) {
        setValidated (true);
      }

      setInit (true);
    };

    if (user.id.length > 0 && !isInit) {
      getUser ();
    }
  }, [user, isInit]);

  return (
    isInit ?
      isValidated ?
        <SelectedIdxsProvider>
          <TransactionsProvider>
            <Screen>
              <Slot/>
            </Screen>
          </TransactionsProvider>
        </SelectedIdxsProvider>
      :
        <Redirect href = "/"/>
    :
      <View style = { styles.container }>
        <Indicator/>
      </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
});
