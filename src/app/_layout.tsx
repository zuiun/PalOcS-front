import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { UserProvider } from "@/contexts/UserContext";

const queryClient = new QueryClient ();

export default function RootLayout () {
  return (
    <QueryClientProvider client = { queryClient }>
      <UserProvider>
        <View style = {[ styles.screen ]}>
          <Slot/>
        </View>
      </UserProvider>
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
