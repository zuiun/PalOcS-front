import { ActivityIndicator } from "react-native";

export default function Indicator ({ isLarge }: Readonly<{ isLarge?: boolean }>) {
  return <ActivityIndicator color = "white" size = { isLarge ? "large" : "small" }/>;
}
