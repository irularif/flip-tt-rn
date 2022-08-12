import Page from "@app/components/Page";
import TopBar, { topBarStyles } from "@app/components/TopBar";
import merge from "@app/helpers/merge";
import useFetch from "@app/hooks/fetch/useFetch";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ITransaction } from "types/data";
import Filter from "./Filter";
import Item from "./Item";
import ModalSort from "./ModalSort";

const HomePage = () => {
  const modalState = useState(false);
  const sortState = useState("");
  const searchState = useState("");
  const [sortBy] = sortState;
  const [search] = searchState;
  const inset = useSafeAreaInsets();
  const callbackApi = useCallback((oldData: any, newData: any, error: any) => {
    if (!!error) {
      console.warn(error);
    } else if (!!newData) {
      const ndata = merge(
        oldData,
        Object.values(newData),
        (array: Array<ITransaction>) => {
          const a = array;
          for (let i = 0; i < a.length; ++i) {
            for (let j = i + 1; j < a.length; ++j) {
              if (a[i].id === a[j].id) a.splice(j--, 1);
            }
          }
          return a;
        }
      );
      return ndata;
    }
    return [];
  }, []);
  const { isLoading, data, fetch } = useFetch<Array<ITransaction>>([], {
    url: "frontend-test",
    calback: callbackApi,
  });

  const dataSource = useMemo(() => {
    let _data = [...data];
    if (!!sortBy) {
      const keys = sortBy.split("-");
      _data = _data.sort((a: any, b: any) => {
        const _a = a[keys[0]];
        const _b = b[keys[0]];
        if (keys[1] === "asc") {
          return _a > _b ? 1 : -1;
        } else {
          return _a < _b ? 1 : -1;
        }
      });
    }
    if (!!search) {
      const keyword = search.toLowerCase();
      _data = _data.filter((x) => {
        return (
          x.beneficiary_name.toLowerCase().includes(keyword) ||
          x.beneficiary_bank.toLowerCase().includes(keyword) ||
          x.sender_bank.toLowerCase().includes(keyword) ||
          x.amount.toString().includes(keyword)
        );
      });
    }
    return _data;
  }, [data, sortBy, search]);

  useEffect(() => {
    fetch();
  }, []);

  const finalListStyle = StyleSheet.flatten([
    styles.list,
    {
      paddingBottom: inset.bottom + 8,
    },
  ]);
  const finalTitleStyle = StyleSheet.flatten([topBarStyles.title]);

  return (
    <Page>
      <TopBar>
        <Text style={finalTitleStyle}>History Transaction</Text>
      </TopBar>
      <FlashList
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetch} />
        }
        renderItem={({ item }) => <Item item={item} />}
        estimatedItemSize={50}
        data={dataSource}
        contentContainerStyle={finalListStyle}
        ListHeaderComponent={
          <Filter
            modalState={modalState}
            sortState={sortState}
            searchState={searchState}
          />
        }
        // onEndReachedThreshold={0.2}
        // onEndReached={fetch}
      />
      <ModalSort modalState={modalState} sortState={sortState} />
    </Page>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
});

export default HomePage;
