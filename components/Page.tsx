import { StyleSheet, View, ViewProps } from "react-native";

export interface PageProps extends ViewProps {}

const Page = ({ ...props }: PageProps) => {
  const finalContainerStyle = StyleSheet.flatten([styles.container]);

  return <View {...props} style={finalContainerStyle} />;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

export default Page;
