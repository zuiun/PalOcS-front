import { Redirect, Slot } from "expo-router";
import { useContext } from "react";
import Screen from "@/components/Screen";
import { SelectedIdxsProvider } from "@/contexts/SelectedIdxsContext";
import { TransactionsProvider } from "@/contexts/TransactionContext";
import UserContext from "@/contexts/UserContext";

export default function UserLayout () {
  const user = useContext (UserContext);

  return (
    user.id.length === 10 ?
      <SelectedIdxsProvider>
        <TransactionsProvider>
          <Screen>
            <Slot/>
          </Screen>
        </TransactionsProvider>
      </SelectedIdxsProvider>
    :
      <Redirect href = "/"/>
  );
}
