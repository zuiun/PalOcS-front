import { Pressable, StyleSheet, Text, View } from "react-native";

interface ItemType {
  title: string,
}

function Item ({ title }: Readonly<{ title: string }>) {
  // TODO: items need to be indentable
  // or do they???
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
  return (
    <View style = { styles.list }>
      { items.map ((item, i) => <Item key = { i } title = { item.title }/>) }
    </View>
  );
}

const styles = StyleSheet.create ({
  list: {
    width: "100%",
    height: "100%",
    overflow: "scroll",
    justifyContent: "flex-start",
    // TODO: this is temporary just to see
    borderColor: "#ff00ff",
    borderWidth: 1,
  },
  item: {
    borderColor: "#fff",
    borderBottomWidth: 1,
  },
  text: {
    color: "#fff",
  },
});
