import { sortOptions } from "@app/data/sort";
import colors from "@assets/colors";
import {
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ModalSortProps extends ModalProps {
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  sortState: [string, React.Dispatch<React.SetStateAction<string>>];
}

const ModalSort = ({ modalState, sortState, ...props }: ModalSortProps) => {
  const [visibleModal, setVisibleModal] = modalState;
  const [sortBy, setSortBy] = sortState;

  return (
    <Modal
      visible={visibleModal}
      onRequestClose={() => setVisibleModal(false)}
      transparent={true}
      animationType="fade"
      {...props}
    >
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdrop}
          onPress={() => setVisibleModal(false)}
        />
        <View style={styles.content}>
          {sortOptions.map(({ label, value }, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={styles.button}
              onPress={() => {
                setSortBy(value);
                setVisibleModal(false);
              }}
            >
              <Ionicons
                name={sortBy === value ? "radio-button-on" : "radio-button-off"}
                color={colors.primary}
                size={24}
              />
              <Text style={styles.buttonText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    backgroundColor: colors.white,
    alignSelf: "center",
    width: "80%",
    borderRadius: 8,
    padding: 16,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ModalSort;
