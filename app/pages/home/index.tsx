import Page from "@app/components/Page";
import TopBar, { topBarStyles } from "@app/components/TopBar";
import { merge } from "@app/helpers";
import useFetch from "@app/hooks/fetch/useFetch";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
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
  const listRef = useRef<FlashList<ITransaction> | null>(null);

  // fetch data from api with custom hook
  const { isLoading, data, fetch } = useFetch<Array<ITransaction>>([], {
    url: "frontend-test",
  });

  // restructure data from original object data to array of object data
  // to make it easier to use as a list
  const callbackApi = useCallback((_: any, newData: any, error: any) => {
    if (!!error) {
      console.warn(error);
    } else if (!!newData) {
      return Object.values(newData);
    }
    return [];
  }, []);

  // like callbackApi but in this case, we merge new data with existing data to collect more data
  // the api doesn't have pagination so we filter it based on unique id because we don't want duplicate data
  const callbackApiLoadMoreData = useCallback(
    (oldData: any, newData: any, error: any) => {
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
    },
    []
  );

  const init = useCallback(() => {
    fetch(callbackApi);
  }, [fetch, callbackApi]);

  const loadMore = useCallback(() => {
    fetch(callbackApiLoadMoreData);
  }, [fetch, callbackApiLoadMoreData]);

  // filter data based on search and sort and then return the filtered data
  // this is a memoized function to optimize performance
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
        // filter by sender name, beneficiary bank, sender bank, and amount
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
    init();
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
      <Filter
        modalState={modalState}
        sortState={sortState}
        searchState={searchState}
      />
      {/* Use FlashList from @shopify for better performance than FlatList */}
      <FlashList
        ref={listRef}
        // add refresh control to refresh data from api
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={init} />
        }
        renderItem={({ item }) => <Item item={item} />}
        estimatedItemSize={50}
        data={dataSource}
        contentContainerStyle={finalListStyle}
        // add load more data when scroll to the bottom of the list
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        // add empty view when there is no data
        ListEmptyComponent={
          <>
            {!isLoading && (
              <View style={styles.empty}>
                <Text>No data found.</Text>
              </View>
            )}
          </>
        }
      />
      {/* Modal view for sorting options */}
      <ModalSort
        modalState={modalState}
        sortState={sortState}
        listRef={listRef}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
  },
  empty: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomePage;
