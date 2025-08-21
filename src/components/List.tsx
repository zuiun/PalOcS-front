import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

interface ItemType {
  title: string,
}

function Item ({ title }: Readonly<{ title: string }>) {
  return (
    <View style = { styles.item }>
      <Pressable onPress = {
        // TODO: custom handler
        () => alert ("bruh")
      }>
        <Text style = { styles.text }>{ title }</Text>
      </Pressable>
    </View>
  );
}

export default function List ({ items }: Readonly<{ items: ItemType[] }>) {
  const paddings: React.ReactElement[] = [];

  for (let i = items.length; i % 5 > 0; ++ i) {
    paddings.push (<View key = { i } style = { styles.item }/>);
  }

  return (
    <View style = { styles.list }>
      {
        items.map ((item, i) => {
          return <Item key = { i } title = { item.title }/>;
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
  list: {
    width: 0.8 * Dimensions.get ("window").height,
    height: 0.8 * Dimensions.get ("window").height,
    overflow: "scroll",
    justifyContent: "flex-start",
    rowGap: 0.02 * Dimensions.get ("window").height,
    // TODO: this is temporary just to see
    borderColor: "#ff00ff",
    borderWidth: 2,
  },
  item: {
    // height: 0.4 * Dimensions.get ("window").height,
    borderColor: "#fff",
    borderBottomWidth: 0.005 * Dimensions.get ("window").height,
  },
  text: {
    color: "#fff",
  },
});
