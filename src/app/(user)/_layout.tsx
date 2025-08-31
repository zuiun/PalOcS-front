import { Redirect, Slot } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Indicator from "@/components/Indicator";
import Screen from "@/components/Screen";
import { SelectedIdxsProvider } from "@/contexts/SelectedIdxsContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import UserContext, { KEY } from "@/contexts/UserContext";

export default function UserLayout () {
  const user = useContext (UserContext);
  const [isInit, setInit] = useState (false);
  const [isValidated, setValidated] = useState (false);

  useEffect (() => {
    const getUser = async () => {
      const resultJson = await AsyncStorage.getItem (KEY);

      if (resultJson) {
        const result: { id: string, name: string } = JSON.parse (resultJson);
        const { status } = await user.validate (result.id, false);

        if (status.isError) {
          setValidated (false);
        } else if (status.isSuccess) {
          setValidated (true);
        }
      } else {
        setValidated (false);
      }

      setInit (true);
    };

    getUser ();
  }, [user]);

  return (
    isInit ?
      isValidated ?
        <SelectedIdxsProvider>
          <TransactionProvider>
            <Screen>
              <Slot/>
            </Screen>
          </TransactionProvider>
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
