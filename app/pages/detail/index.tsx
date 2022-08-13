import Page from "@app/components/Page";
import TopBar, { topBarStyles } from "@app/components/TopBar";
import { dateFormat, moneyFormat } from "@app/helpers";
import colors from "@assets/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ITransaction } from "types/data";
import * as Clipboard from "expo-clipboard";

const DetailPage = () => {
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const [expanded, setExpanded] = useState(true);
  const animated = useRef(new Animated.Value(0)).current;
  const route = useRoute();
  const { goBack } = useNavigation();

  // get transaction data from route params
  const data: ITransaction = useMemo(() => {
    return (
      (route?.params as ITransaction) || {
        id: "",
        amount: 0,
        unique_code: null,
        status: "",
        sender_bank: "",
        account_number: "",
        beneficiary_name: "",
        beneficiary_bank: "",
        remark: "",
        created_at: "",
        completed_at: "",
        fee: 0,
      }
    );
  }, [route]);

  const back = useCallback(() => {
    goBack();
  }, []);

  // toggle expanded detail transaction
  const toggleExpanded = useCallback(() => {
    if (expanded) {
      Animated.spring(animated, {
        toValue: 1,
        bounciness: 0,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setExpanded(false);
        }
      });
    } else {
      Animated.spring(animated, {
        toValue: 0,
        bounciness: 0,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setExpanded(true);
        }
      });
    }
  }, [expanded]);

  const copyId = useCallback(() => {
    Clipboard.setStringAsync(data.id);
  }, [data]);

  // get layout of expanded detail transaction
  const onLayout = useCallback(
    (e: any) => {
      // set layout if height is 0
      if (!layout.height) {
        setLayout(e.nativeEvent.layout);
      }
    },
    [layout]
  );

  // get and formatted date with dateFormat helper
  const date = useMemo(() => {
    return dateFormat(data.created_at.split(" ")[0]);
  }, [data]);

  const finalDetailStyle = StyleSheet.flatten([
    styles.title,
    {
      flex: 1,
    },
  ]);
  const finalExpandedStyle = StyleSheet.flatten([
    styles.section,
    styles.expanded,
    // set animation style if already get layout
    !!layout.height && {
      height: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [layout.height, 0] as any,
      }),
      paddingVertical: animated.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 0] as any,
      }),
    },
  ]);

  return (
    <Page>
      <TopBar>
        <TouchableOpacity onPress={back} style={styles.buttonBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={topBarStyles.title}>Detail Transaction</Text>
      </TopBar>
      <ScrollView style={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.title}>ID TRANSAKSI: #{data.id}</Text>
            <TouchableOpacity style={styles.buttonCopy} onPress={copyId}>
              <Ionicons name="copy-outline" color={colors.primary} size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={finalDetailStyle}>Detail Transaksi</Text>
            <TouchableOpacity onPress={toggleExpanded}>
              <Text style={styles.buttonCloseLabel}>Tutup</Text>
            </TouchableOpacity>
          </View>
          <Animated.View onLayout={onLayout} style={finalExpandedStyle}>
            <View style={styles.fieldGroup}>
              <Text style={styles.field}>
                <Text style={styles.title}>{data.sender_bank}</Text>{" "}
                <Ionicons name="arrow-forward" size={18} />{" "}
                <Text style={styles.title}>{data.beneficiary_bank}</Text>
              </Text>
            </View>
            <View style={styles.fieldGroup}>
              <View style={styles.field}>
                <Text style={styles.title}>{data.beneficiary_name}</Text>
                <Text>{data.account_number}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.title}>Nominal</Text>
                <Text>{moneyFormat(data.amount)}</Text>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <View style={styles.field}>
                <Text style={styles.title}>Berita Transfer</Text>
                <Text>{data.remark}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.title}>Kode Unik</Text>
                <Text>{moneyFormat(data.unique_code)}</Text>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <View style={styles.field}>
                <Text style={styles.title}>Waktu Dibuat</Text>
                <Text>{date}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </Page>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
  },
  buttonBack: {
    marginRight: 8,
  },
  buttonCopy: {
    margin: 4,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.divider,
    marginHorizontal: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  expanded: {
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
    marginHorizontal: 0,
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  buttonCloseLabel: {
    color: colors.primary,
    margin: 8,
  },
  fieldGroup: {
    marginBottom: 16,
    flexDirection: "row",
  },
  field: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DetailPage;
