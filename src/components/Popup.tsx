import { Dimensions, Modal, Pressable, StyleSheet } from "react-native";
// import Paragraph from "@/components/Paragraph";

export default function Popup ({ children, visible, onPress }: Readonly<{ children: React.ReactNode, visible: boolean, onPress: () => void }>) {
  return (
    <Modal transparent = { true } visible = { visible } onRequestClose = { onPress }>
      <Pressable style = { styles.transparent } onPress = { onPress }>
        {/* <Paragraph style = { styles.instructions }>
          Click outside to close
        </Paragraph> */}
        <Pressable style = { styles.content }>
          { children }
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create ({
  transparent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  instructions: {
    paddingBottom: 0.01 * Dimensions.get ("window").height,
  },
  content: {
    cursor: "default",
  }
});
