import { StyleSheet, Text } from "react-native";
import Page from "@app/components/Page";
import TopBar, { topBarStyles } from "@app/components/TopBar";
import useFetch from "@app/hooks/fetch/useFetch";
import { ITransaction } from "types/data";
import { useCallback, useEffect } from "react";

const HomePage = () => {
  const callbackApi = useCallback((data: any, error: any) => {
    if (!!error) {
      console.log(error);
    } else if (!!data) {
      return Object.values(data);
    }
    return [];
  }, []);
  const { isLoading, data, fetch } = useFetch<Array<ITransaction>>([], {
    url: "frontend-test",
    calback: callbackApi,
  });
  const finalTitleStyle = StyleSheet.flatten([topBarStyles.title]);

  useEffect(() => {
    fetch();
  }, []);

  console.log(isLoading, data);

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
