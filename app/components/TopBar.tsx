import {
  StatusBar,
  StatusBarProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "@assets/colors";
import { getStyleValue } from "@app/helpers";

export interface TopBarProps extends ViewProps {
  statusBarProps?: StatusBarProps;
}

const TopBar = ({ statusBarProps, children, style, ...props }: TopBarProps) => {
  // add padding top for notch with safe area insets
  const inset = useSafeAreaInsets();
  const topbarStyle = StyleSheet.flatten([styles.container, style]);
  const finalTopBarStyle = StyleSheet.flatten([
    topbarStyle,
    {
      paddingTop:
        getStyleValue(
          topbarStyle,
          ["padding", "paddingVertical", "paddingTop"],
          0
        ) + inset.top,
    },
  ]);

  return (
    <View {...props} style={finalTopBarStyle}>
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle="light-content"
        {...statusBarProps}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  title: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 20,
  },
});

export { styles as topBarStyles };
export default TopBar;
