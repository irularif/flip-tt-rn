import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ITransaction } from "types/data";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "@assets/colors";
import { useMemo } from "react";
import { dateFormat, moneyFormat } from "@app/helpers/format";

interface ItemProps {
  item: ITransaction;
}
const Item = ({ item }: ItemProps) => {
  const statusColor = useMemo(() => {
    switch (item.status) {
      case "SUCCESS":
        return colors.success;
      case "PENDING":
        return colors.pending;
    }
  }, [item]);

  const status = useMemo(() => {
    switch (item.status) {
      case "SUCCESS":
        return "Berhasil";
      case "PENDING":
        return "Pengecekan";
    }
  }, [item]);

  const finalContainerStyle = StyleSheet.flatten([
    styles.container,
    {
      borderLeftColor: statusColor,
    },
  ]);

  const date = useMemo(() => {
    return dateFormat(item.created_at.split(" ")[0]);
  }, [item]);

  const titleStyle = StyleSheet.flatten([styles.title, styles.spaces]);
  const finalSenderStyle = StyleSheet.flatten([
    titleStyle,
    item.sender_bank.length < 5 ? styles.uppercase : styles.capitalize,
  ]);
  const finalBeneficiaryStyle = StyleSheet.flatten([
    titleStyle,
    item.beneficiary_bank.length < 5 ? styles.uppercase : styles.capitalize,
  ]);
  const finalNameStyle = StyleSheet.flatten([
    styles.description,
    styles.uppercase,
    styles.spaces,
  ]);
  const finalStatusLabelStyle = StyleSheet.flatten([
    styles.title,
    styles.description,
    styles.status,
    {
      SUCCESS: {
        backgroundColor: statusColor,
        borderColor: statusColor,
        color: colors.white,
      },
      PENDING: {
        backgroundColor: colors.white,
        borderColor: colors.pending,
      },
    }[item.status],
  ]);

  return (
    <TouchableOpacity style={finalContainerStyle}>
      <View style={styles.wrapper}>
        <Text>
          <Text style={finalSenderStyle}>{item.sender_bank}</Text>{" "}
          <Ionicons name="arrow-forward" size={18} />{" "}
          <Text style={finalBeneficiaryStyle}>{item.beneficiary_bank}</Text>
        </Text>
        <Text style={finalNameStyle}>{item.beneficiary_name}</Text>
        <Text style={styles.description}>
          {moneyFormat(item.amount)} <FontAwesome name="circle" size={8} />{" "}
          {date}
        </Text>
      </View>
      <Text style={finalStatusLabelStyle}>{status}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 8,
    marginHorizontal: 8,
    borderLeftWidth: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
  },
  spaces: {
    marginBottom: 4,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  uppercase: {
    textTransform: "uppercase",
  },
  status: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    overflow: "hidden",
  },
});

export default Item;
