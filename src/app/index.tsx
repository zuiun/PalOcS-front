import { useRouter } from "expo-router";
import { useContext } from "react";
import UserContext from "@/contexts/UserContext";
import Input from "@/components/Input";

export default function Index () {
  const router = useRouter ();
  const user = useContext (UserContext);

  return (
    <Input title = "Enter user ID" onPress = { user.login } onSuccess = { () => { router.replace ("/drink"); } }/>
  );
}
