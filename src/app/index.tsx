import { useRouter } from "expo-router";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import InputID from "@/components/InputID";

export default function Index () {
  const router = useRouter ();
  const user = useContext (UserContext);

  return (
    <InputID title = "Enter user ID" onPress = { user.login } onSuccess = { async () => router.replace ("/drink") }/>
  );
}
