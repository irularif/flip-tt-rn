import { StyleSheet, Text } from "react-native";
import Page from "@app/components/Page";
import TopBar, { topBarStyles } from "@app/components/TopBar";

const HomePage = () => {
  const finalTitleStyle = StyleSheet.flatten([topBarStyles.title]);

  return (
    <Page>
      <TopBar>
        <Text style={finalTitleStyle}>Home</Text>
      </TopBar>
      <Text>Home Page</Text>
    </Page>
  );
};

export default HomePage;
