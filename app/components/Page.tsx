import colors from "@assets/colors";
import { StyleSheet, View, ViewProps } from "react-native";

export interface PageProps extends ViewProps {}

const Page = ({ ...props }: PageProps) => {
  return <View {...props} style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});

export default Page;
