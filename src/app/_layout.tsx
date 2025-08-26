import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SelectedIdxsProvider } from "@/contexts/SelectedIdxsContext";
import { TransactionsProvider } from "@/contexts/TransactionsContext";
import Screen from "@/components/Screen";

const queryClient = new QueryClient ();

export default function RootLayout () {
  return (
    <QueryClientProvider client = { queryClient }>
      <TransactionsProvider>
        <SelectedIdxsProvider>
          <View style = {[ styles.screen ]}>
            {/* TODO: once login is implemented, <Screen> should be in [id]/_layout.tsx */}
            <Screen>
              <Slot/>
            </Screen>
          </View>
        </SelectedIdxsProvider>
      </TransactionsProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create ({
  screen: {
    backgroundColor: "#25292e",
    width: "100%",
    height: "100%",
  },
});
