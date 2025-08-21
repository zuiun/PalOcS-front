import { Dimensions, Pressable, StyleSheet, View, Text } from "react-native";

interface PanelType {
  title: string,
  colour: string,
}

function Panel ({ title, colour }: Readonly<{ title: string, colour: string }>) {
  return (
    <View style = { styles.panel }>
      <Pressable style = {[ styles.button, { backgroundColor: colour } ]} onPress = {
        // TODO: custom handler
        () => alert ("bruh")
      }>
        <Text style = { styles.text }>{ title }</Text>
      </Pressable>
    </View>
  );
}

export default function Grid ({ panels }: Readonly<{ panels: PanelType[] }>) {
  const paddings: React.ReactElement[] = [];

  for (let i = panels.length; i % 5 > 0; ++ i) {
    paddings.push (<View key = { i } style = { styles.panel }/>);
  }

  return (
    <View style = { styles.grid }>
      {
        panels.map ((panel, i) => {
          return <Panel key = { i } title = { panel.title } colour = { panel.colour }/>;
        })
      }
      {
        paddings.map (padding => { return padding })
      }
    </View>
  );
}

// <Child value={foo} onEvent={handleEvent}/>
// <Child onEvent={() => handleEvent(foo)} />

const styles = StyleSheet.create ({
  grid: {
    width: 0.8 * Dimensions.get ("window").height,
    height: 0.8 * Dimensions.get ("window").height,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // TODO: this is temporary just to see
    borderColor: "#ff00ff",
    borderWidth: 2,
  },
  panel: {
    width: 0.15 * Dimensions.get ("window").height,
    height: 0.15 * Dimensions.get ("window").height,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0.01 * Dimensions.get ("window").height,
  },
  text: {
    color: "#fff",
  },
});
