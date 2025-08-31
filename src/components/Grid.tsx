import { Href, Link } from "expo-router";
import React from "react";
import { Dimensions, GestureResponderEvent, Pressable, StyleSheet, View } from "react-native";
import Paragraph from "@/components/Paragraph";
import { Colour } from "@/utils/types";

export function Panel ({ href, title, colour = Colour.default, onPress }: Readonly<{ href?: Href, title: string, colour?: Colour, onPress?: (event: GestureResponderEvent) => void }>) {
  let backgroundColour: string;
  let pressedColour: string;

  switch (colour) {
    case Colour.selected:
      backgroundColour = "blue";
      pressedColour = "darkblue";
      break;
    case Colour.tab:
      backgroundColour = "green";
      pressedColour = "darkgreen";
      break;
    case Colour.special:
      backgroundColour = "darkviolet";
      pressedColour = "purple";
      break;
    default:
      backgroundColour = "red";
      pressedColour = "darkred";
      break;
  }

  const panel = (
    <Pressable style = {({ pressed }) => [ styles.panel, { backgroundColor: pressed ? pressedColour : backgroundColour} ]} onPress = { onPress }>
      <Paragraph style = { styles.text }>{ title }</Paragraph>
    </Pressable>
  );

  if (href) {
    return (
      <Link href = { href }>
        { panel }
      </Link>
    );
  } else {
    return panel;
  }
}

export default function Grid ({ children, align }: Readonly<{ children: React.ReactNode, align: number }>) {
  const paddings: React.ReactElement[] = [];
  const width = align * (styles.panel.width + 0.02 * Dimensions.get ("window").height);

  for (let i = React.Children.count (children); i % align > 0; ++ i) {
    paddings.push (<View key = { i } style = { styles.panel }/>);
  }

  return (
    <View style = {[ styles.container, { width: width } ]}>
      { children }
      { paddings.map (padding => padding) }
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "space-between",
    flexWrap: "wrap",
    rowGap: 0.02 * Dimensions.get ("window").height,
    columnGap: 0.02 * Dimensions.get ("window").height,
  },
  panel: {
    width: 0.15 * Dimensions.get ("window").height,
    height: 0.15 * Dimensions.get ("window").height,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0.01 * Dimensions.get ("window").height,
  },
  text: {
    fontSize: 0.02 * Dimensions.get ("window").height,
  },
});
