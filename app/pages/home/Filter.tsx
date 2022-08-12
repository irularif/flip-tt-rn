import colors from "@assets/colors";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useState } from "react";
import { sortOptions } from "@app/data/sort";
import debounce from "@app/helpers/debounce";

interface FilterProps {
  modalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  sortState: [string, React.Dispatch<React.SetStateAction<string>>];
  searchState: [string, React.Dispatch<React.SetStateAction<string>>];
}

const Filter = ({ modalState, sortState, searchState }: FilterProps) => {
  const [keyword, setKeyword] = useState("");
  const [__, setSearch] = searchState;
  const [_, setVisibleModal] = modalState;
  const [sortBy] = sortState;

  const sort = useMemo(() => {
    const _sort = sortOptions.find((x) => x.value === sortBy);
    if (!!_sort) {
      return _sort.label;
    }
    return "";
  }, [sortBy]);

  const onSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
    []
  );

  const onChangeText = useCallback((value: string) => {
    setKeyword(value);
    onSearch(value);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={24} color={colors.gray} />
      <TextInput
        placeholder="Cari nama, bank, atau nominal"
        style={styles.input}
        placeholderTextColor={colors.gray}
        value={keyword}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisibleModal(true)}
      >
        <Text style={styles.buttonText}>{sort}</Text>
        <Ionicons name="chevron-down" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 4,
    backgroundColor: colors.white,
    flexDirection: "row",
    marginHorizontal: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    color: colors.primary,
  },
});

export default Filter;
