import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import BuyIcon from "../../components/icon/buy";
import IconSolana from "../../components/icon/iconsolana";
import ReceiveIcon from "../../components/icon/receive";
import SendIcon from "../../components/icon/send";

import SwapIcon from "../../components/icon/swap";
import { getAllTokens } from "../../storage/tokenStorage";

export default function TabTwoScreen() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  function formatAmount(value: any) {
    if (value === undefined || value === null) return "";

    const num = Number(value);
    if (isNaN(num)) return value;

    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + "M";
    }

    if (num >= 100_000) {
      return (num / 1_000).toFixed(2) + "K";
    }

    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const allTokens = await getAllTokens();
      console.log("All tokens loaded:", allTokens);
      const updatedTokens = allTokens.map((token) => {
        const changePercent =
          (Math.random() * (0.1 - 0.001) + 0.001) *
          (Math.random() > 0.5 ? 1 : -1);
        const newProfitRaw = token.profitPercent + changePercent;
        const newProfit = parseFloat(newProfitRaw.toFixed(2));

        const price = parseFloat(token.price.replace("$", "")) || 0;
        const amount = parseFloat(token.amount) || 0;
        const totalValueRaw = price * amount * (1 + newProfit / 100);

        // Format số profitPercent có dấu phẩy (nếu > 999) và 2 chữ số thập phân
        const profitPercentFormatted = newProfit.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        // Format totalValue thành dạng $1,234.56
        const totalValueFormatted = `$${totalValueRaw.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        return {
          ...token,
          profitPercent: newProfit, // giữ số thô để dễ xử lý tính toán
          profitPercentDisplay: profitPercentFormatted, // thêm trường hiển thị có dấu phẩy
          totalValue: totalValueFormatted,
        };
      });

      setTokens(updatedTokens);
    } catch (error) {
      console.error("Error refreshing tokens:", error);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh(); // Load khi mở tab
  }, []);

  // ✅ Tự động cập nhật giá trị token mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens((prevTokens) =>
        prevTokens.map((token) => {
          const changePercent =
            (Math.random() * (0.1 - 0.001) + 0.001) *
            (Math.random() > 0.5 ? 1 : -1);
          const newProfitRaw = token.profitPercent + changePercent;
          const newProfit = parseFloat(newProfitRaw.toFixed(2));

          const price = parseFloat(token.price.replace("$", "")) || 0;
          const amount = parseFloat(token.amount) || 0;
          const totalValueRaw = price * amount * (1 + newProfit / 100);

          const profitPercentDisplay = newProfit.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          const totalValueFormatted = `$${totalValueRaw.toLocaleString(
            "en-US",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`;

          return {
            ...token,
            profitPercent: newProfit, // giữ giá trị số
            profitPercentDisplay, // thêm chuỗi hiển thị format
            totalValue: totalValueFormatted,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const portfolioStats = useMemo(() => {
    let totalValue = 0;
    let totalChange = 0;

    for (const token of tokens) {
      const price = parseFloat(token.price.replace("$", "")) || 0;
      const amount = parseFloat(token.amount) || 0;

      const value = price * amount * (1 + (token.profitPercent || 0) / 100);
      const baseValue = price * amount;
      const change = value - baseValue;

      totalValue += value;
      totalChange += change;
    }

    const profitPercent =
      totalValue !== 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;

    // Biến động nhẹ cho totalValue
    const fluctuationPercent = Math.random() * 0.01 - 0.005; // -0.5% đến +0.5%
    const fluctuatedTotalValue = totalValue * (1 + fluctuationPercent);

    return {
      totalValue: `$${fluctuatedTotalValue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      totalChange: `${totalChange >= 0 ? "+" : "-"}$${Math.abs(
        totalChange
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      profitPercent: `${profitPercent >= 0 ? "+" : "-"}${Math.abs(
        profitPercent
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`,
      profitColor:
        profitPercent > 0
          ? "#24A570"
          : profitPercent < 0
          ? "#ff6666"
          : "#999999",
    };
  }, [tokens]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://em-content.zobj.net/source/apple/391/ghost_1f47b.png",
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@agathax100</Text>
            <Text style={styles.NameUser}>Bank Bot</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="maximize" size={wp("6%")} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={wp("6%")} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.bodyApp}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      >
        <View style={styles.balanceContainer}>
          <Text style={styles.balance}>{portfolioStats.totalValue}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: hp("0%"),
            }}
          >
            <Text
              style={[styles.subBalance, { color: portfolioStats.profitColor }]}
            >
              {portfolioStats.totalChange}
            </Text>
            <View
              style={[
                styles.profitpercentage,
                { backgroundColor: portfolioStats.profitColor + "20" },
              ]}
            >
              <Text
                style={{
                  fontFamily: "SFProDisplay-Medium",
                  fontSize: wp("4%"),
                  color: portfolioStats.profitColor,
                }}
              >
                {portfolioStats.profitPercent}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionItem}>
            <ReceiveIcon />
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <SendIcon />
            <Text style={styles.actionLabel}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <SwapIcon />
            <Text style={styles.actionLabel}>Swap</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <BuyIcon />
            <Text style={styles.actionLabel}>Buy</Text>
          </TouchableOpacity>
        </View>

        <View>
          {tokens.map((token, index) => {
            const profitColor =
              token.profitPercent > 0
                ? "#24a570"
                : token.profitPercent < 0
                ? "#ff6666"
                : "#999999";
            const profit =
              (token.profitPercent > 0 ? "+" : "") +
              token.profitPercent.toFixed(2) +
              "%";
            const amount = `${token.amount} ${token.symbol.toUpperCase()}`;
            const amountFormatted = `${formatAmount(
              token.amount
            )} ${token.symbol.toUpperCase()}`;

            return (
              <View
                key={token.id}
                style={[styles.Notification, index !== 0 && { marginTop: -10 }]}
              >
                <View style={styles.tokenRow}>
                  <View style={{ position: "relative" }}>
                    {token.name === "Solana" ? (
                      <View
                        style={{
                          width: wp("10%"),
                          height: wp("10%"),
                          borderRadius: wp("5%"),
                          backgroundColor: "black",
                          overflow: "hidden",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: wp("3%"),
                        }}
                      >
                        <Image
                          source={{ uri: token.logo }}
                          style={{
                            width: "70%",
                            height: "70%",
                            resizeMode: "contain", // giữ tỉ lệ
                          }}
                        />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: token.logo }}
                        style={styles.tokenLogo}
                        resizeMode="cover"
                      />
                    )}

                    {/* Render icon Solana only if token.symbol !== 'sol' */}
                    {token.symbol.toLowerCase() !== "sol" && (
                      <View
                        style={{
                          position: "absolute",
                          top: hp("2.3%"),
                          right: wp("2.4%"),
                          width: wp("5.2%"),
                          height: wp("5.2%"),
                          backgroundColor: "white",
                          padding: 2,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "black",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconSolana size={16} color="#c6b9ff" />
                      </View>
                    )}
                  </View>

                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenName}>{token.name}</Text>
                    <Text style={styles.tokenAmount}>{amountFormatted}</Text>
                  </View>

                  <View style={styles.tokenPrice}>
                    <Text style={styles.tokenPriceValue}>
                      {token.totalValue}
                    </Text>
                    <Text style={[styles.tokenProfit, { color: profitColor }]}>
                      {profit}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.container}>
          <Ionicons
            name="options-outline"
            size={20}
            color="#ccc"
            style={styles.icon}
          />
          <Text style={styles.text}>Manage token list</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1, // chiếm toàn bộ màn hình
    backgroundColor: "#111111",
    justifyContent: "center", // canh giữa theo chiều dọc
    alignItems: "center", // canh giữa theo chiều ngang
    flexDirection: "row",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "400",
  },
  Notification: {
    backgroundColor: "#222222",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 19,
  },
  tokenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("1%"),
    borderBottomColor: "#333",
  },

  tokenLogo: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"), // hình tròn
    marginRight: wp("3%"),
    backgroundColor: "black", // thêm nền trắng
  },

  tokenInfo: {
    flex: 1,
    justifyContent: "center",
  },

  tokenName: {
    color: "#fff",
    fontFamily: "SFProDisplay-Medium",

    fontWeight: "bold",
    fontSize: wp("4.3%"),
  },

  tokenAmount: {
    color: "#bbb",
    fontSize: wp("3.5%"),
    fontFamily: "SFProDisplay-Regular",

    marginTop: hp("0.3%"),
  },

  tokenPrice: {
    alignItems: "flex-end",

    justifyContent: "center",
    width: wp("30%"), // bạn chỉnh theo ý muốn
  },

  tokenPriceValue: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
    fontFamily: "SFProDisplay-Bold",
  },

  tokenProfit: {
    fontSize: wp("3.5%"),
    marginTop: hp("0.3%"),
    fontFamily: "SFProDisplay-Medium",
  },

  actionLabel: {
    color: "#AEAEAE",
    fontFamily: "SFProDisplay-Medium",

    marginTop: 6,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start", // đổi space-around -> flex-start
    marginVertical: 24,
  },

  actionItem: {
    marginTop: hp("-3%"),
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: wp("4%"),
    justifyContent: "center",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("2%"),
    width: wp("21.6%"),
    height: hp("9.2%"),

    marginRight: wp("2%"), // khoảng cách giữa các item
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#111111", // nền app chính
  },
  header: {
    paddingHorizontal: wp("4%"),
    paddingTop: hp("2.5%"),
    paddingBottom: hp("1.5%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    width: wp("10.5%"),
    height: wp("10.5%"),
    borderRadius: wp("6.25%"),
    // borderWidth: 2,
    backgroundColor: "#2A2A2A",

    borderColor: "#888888",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("2.5%"),
  },
  avatar: {
    width: wp("7.5%"),
    height: wp("7.5%"),
    borderRadius: wp("3.75%"),
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  username: {
    color: "#ccc",
    fontFamily: "SFProDisplay-Regular",

    fontWeight: "bold",
    fontSize: wp("3.3%"),
  },
  profitpercentage: {
    backgroundColor: "#462624",
    borderRadius: wp("1%"),
    height: 25,
    marginTop: 5, // fix marginTop thành 10px
    marginLeft: wp("1%"),
    paddingHorizontal: wp("2%"),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    alignSelf: "flex-start",
  },

  NameUser: {
    fontSize: wp("4.7%"),
    fontFamily: "SFProDisplay-Bold",

    color: "#fff",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: wp("4%"),
  },
  balanceContainer: {
    marginTop: hp("2.5%"),
    marginBottom: hp("2%"),
    alignItems: "center",
  },
  balance: {
      fontSize: wp("13%"),
      color: "white",
    fontWeight: "bold",
      // fontWeight: "900", // tăng độ đậm

    fontFamily: "SFProDisplay-Medium",
  },
  subBalance: {
    color: "#ff6666",
    marginTop: hp("0.5%"),
    fontSize: wp("5%"),
    fontFamily: "SFProDisplay-Medium",
  },
  bodyApp: {
    flex: 1,
    backgroundColor: "#111111",
    paddingHorizontal: wp("4%"),
  },
  scrollContent: {
    paddingBottom: hp("2%"),
  },
});
