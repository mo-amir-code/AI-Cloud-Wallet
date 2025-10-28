import { Chart } from "@/components";
import { AIAssistant } from "@/components/ai";
import { NetworkToggle } from "@/components/settings";
import { MyToken, TrendingToken } from "@/components/tokens";
import { SECRETS } from "@/config/secrets";
import { useAPIClient } from "@/hooks/apiClient";
import { colors } from "@/theme/colors";
import { MyTokenDataType, PriceType, TokenMetadataType } from "@/types/tokens";
import { UserInfoType } from "@/types/zustand";
import { ROUTES } from "@/utils/axios";
import { apiClient } from "@/utils/axios/apiClient";
import { topTokens as topTokensData } from "@/utils/data";
import { fetchTokenPriceData } from "@/utils/queries/solana";
import { useUserStore } from "@/zustand/userStore";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

const SIDEBAR_WIDTH = 220;

const home = () => {
  const [topTokens, setTopTokens] = useState<(TokenMetadataType & PriceType)[]>(
    []
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const [isAIAssitantOpen, setIsAIAssitantOpen] = useState<boolean>(false);

  const {
    userInfo,
    isUserLoggedIn,
    setUserInfo,
    tokens,
    settings,
    setTokens,
    updateTotalBalance,
    totalBalance,
    setContacts,
    setSettings,
    setUserAuthStatus,
  } = useUserStore();
  const { apiRequest } = useAPIClient();
  const router = useRouter();

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? SIDEBAR_WIDTH : 0;

    Animated.timing(slideAnim, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchUserTokens = async () => {
    try {
      if (!userInfo?.wallet.publicKey) return;

      // Get token balances
      const baseUrl =
        settings?.mode === "mainnet"
          ? "api.helius.xyz"
          : "api-devnet.helius.xyz";
      console.log("BASE URL: ", baseUrl);
      const response = await axios.get(
        `https://${baseUrl}/v0/addresses/${userInfo.wallet.publicKey}/balances?api-key=${SECRETS.HELIUS_API_KEY}`
      );

      console.log("TOKEN DATA: ", response.data.tokens);

      const tokensInfo = response.data.tokens.map((token: any) => {
        return {
          mint: token.mint,
          amount: token.amount,
          decimals: token.decimals,
        };
      });

      console.log("TOKENS INFO:   ", tokensInfo);

      const tokensMintAddresses = tokensInfo.map((token: any) => token.mint);

      let tokensData = await fetchTokenPriceData(
        tokensMintAddresses,
        settings?.mode ?? "mainnet"
      );

      console.log("TOKENS PRICE DATA: ", tokensData);

      tokensData = tokensData.map((token: MyTokenDataType) => {
        const tokenInfo = tokensInfo.find(
          (t: any) => t.mint === token.mintAddress
        );
        const amount = tokenInfo
          ? tokenInfo.amount / Math.pow(10, tokenInfo.decimals)
          : 0;

        return {
          ...token,
          amount: amount,
          decimals: tokenInfo?.decimals || -1,
        };
      });
      // Add Solana token with current price from CoinGecko
      const solPriceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,inr"
      );

      // console.log("Sol Price Response: ", response.data.nativeBalance)

      const solanaData: MyTokenDataType = {
        mintAddress: "So11111111111111111111111111111111111111112",
        name: "Solana",
        symbol: "SOL",
        imageUri:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        amount: response.data.nativeBalance / Math.pow(10, 9),
        decimals: 9,
        programId: "",
        pricePerToken: solPriceResponse.data.solana.usd,
        currency: "USD",
      };

      tokensData = tokensData.sort((a, b) => b.amount - a.amount);
      tokensData = [solanaData, ...tokensData];

      setTokens(tokensData);

      // Calculate total balance
      const totalBalance = tokensData.reduce((acc, token) => {
        if (token.pricePerToken > 0 && token.amount > 0) {
          return acc + token.pricePerToken * token.amount;
        }
        return acc;
      }, 0);

      updateTotalBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching user tokens:", error);
    }
  };

  const handleUserInfoRequest = async () => {
    try {
      const res = await apiRequest(ROUTES.USER.ROOT, {
        method: "get",
      });

      const data = res.data.data;
      const userData = data.user;

      const userInfo: UserInfoType = {
        id: userData?.id,
        name: userData?.name,
        email: userData?.email,
        photoUrl: userData?.picture,
        wallet: {
          publicKey: userData?.publicKey,
          privateKey: null,
        },
      };

      setUserInfo(userInfo);
      setSettings(data.settings);
    } catch (error) {
      console.log("Error fetching user info:", error);
    }
  };

  const handleToGetContacts = async () => {
    const res = await apiRequest(ROUTES.CONTACTS.ROOT, { method: "get" });
    // console.log("REsponse ======>   ", res);

    if (res?.data) {
      const contacts = res.data.data.contacts.map((item: any) => {
        const walletAddress = item.address;
        delete item.address;
        return {
          ...item,
          walletAddress,
        };
      });
      setContacts(contacts);
    }
  };

  const fetchTopTokensPrice = async () => {
    try {
      const tokensIds = topTokensData
        .map((token) => token.coingeckoId)
        .join(",");
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokensIds}&vs_currencies=usd,inr`
      );
      const data = response.data;
      let tokensData = JSON.parse(JSON.stringify(topTokensData)).map(
        (token: TokenMetadataType) => {
          return {
            ...token,
            price: data[token.coingeckoId],
          };
        }
      ) as (TokenMetadataType & PriceType)[];

      setTopTokens(tokensData);
    } catch (error: any) {
      if (error?.response?.status === 429) {
        console.log("Rate limited by CoinGecko API. Retrying...");
        setTimeout(() => {
          fetchTopTokensPrice();
        }, 2000);
      }
    }
  };

  const handleLogout = async () => {
    await apiClient.clearAuth();
    // console.log("TOKEN: ", await apiClient.getToken())
    setUserAuthStatus(false);
    setUserInfo(null);
  };

  useEffect(() => {
    if (isUserLoggedIn) handleUserInfoRequest();
  }, [isUserLoggedIn]);

  useEffect(() => {
    if (topTokens.length === 0) fetchTopTokensPrice();
    if (userInfo) fetchUserTokens();
  }, [topTokens, userInfo, settings]);

  useEffect(() => {
    handleToGetContacts();
  }, []);

  return (
    <View className="flex-1 relative">
      <ScrollView className="bg-primary flex-1 pt-2 flex flex-col overflow-y-scroll">
        {/* Header */}
        <View className="py-2 px-4 flex flex-row justify-between items-center">
          <View className="flex items-center justify-start gap-2 flex-row">
            <Image
              source={{ uri: userInfo?.photoUrl || "" }}
              alt="Profile Picture"
              className="w-12 h-12 bg-accent rounded-full"
            />
            <Text className="text-text text-lg font-semibold">
              {userInfo?.name || "MekYu"}
            </Text>
          </View>
          <Pressable onPress={toggleSidebar}>
            <Ionicons name="settings" size={24} color={colors.dark.text} />
          </Pressable>
        </View>

        {/* Hero Section */}
        <View className="relative m-4 bg-secondary/40 rounded-3xl py-4 h-[240px] overflow-hidden">
          {/* Char Will be show here */}
          <View className="mt-14 inset-0 h-[120px] overflow-hidden">
            <Chart height={120} />
          </View>

          <View className="absolute top-0 left-0 w-full mt-4 h-full px-4 flex flex-col justify-between">
            <View className="flex">
              <Text className="text-text/60 text-sm">Total Balance</Text>
              <Text className="text-text text-4xl font-semibold mb-2">
                ${parseFloat(totalBalance.toFixed(4))}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => router.push("/send")}
                className="bg-accent flex-1 rounded-2xl px-6 py-3"
              >
                <Text className="font-semibold text-center text-primary">
                  Send
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleSidebar()}
                className="bg-secondary flex-1 rounded-2xl px-6 py-3"
              >
                <Text className="text-text font-medium text-center">
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Top Tokens Section */}
        <View className="mx-4 mt-2">
          <Text className="text-text font-semibold text-lg mb-4">
            Top Tokens on Solana
          </Text>
          {/* Tokens will be listed here */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={topTokens}
            keyExtractor={(item) => item.mintAddress}
            renderItem={({ item }) => <TrendingToken tokenInfo={item} />}
            contentContainerStyle={{ gap: 16 }}
          />
        </View>

        {/* My Tokens Section */}
        <View className="mx-4 mt-6 mb-4">
          <Text className="text-text font-semibold text-lg mb-4">
            My Tokens
          </Text>

          <View className="flex flex-col gap-3">
            {tokens.map((token) => (
              <MyToken key={token.mintAddress} tokenInfo={token} />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* AI MODAL */}
      <AIAssistant
        visible={isAIAssitantOpen}
        onClose={() => setIsAIAssitantOpen(false)}
      />

      {/* Button To Activate AI */}
      <TouchableOpacity
        onPress={() => setIsAIAssitantOpen(true)}
        className="absolute bottom-16 right-4 bg-accent w-16 h-16 flex items-center justify-center rounded-full"
      >
        <FontAwesome name="magic" size={24} color="black" />
      </TouchableOpacity>

      {/* Overlay - only when sidebar is open */}
      {isSidebarOpen && (
        <TouchableOpacity
          className="absolute top-0 left-0 right-0 bottom-0 bg-black/50"
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}

      {/* Settings Sidebar */}
      <Animated.View
        className="absolute right-0 top-0 bottom-0 bg-secondary shadow-2xl"
        style={{
          width: SIDEBAR_WIDTH,
          transform: [{ translateX: slideAnim }],
        }}
      >
        {/* Sidebar Header */}
        <View className="flex-row justify-between items-center p-4 bg-accent border-b border-white/10">
          <Text className="text-xl font-bold text-primary">Settings</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="close" size={24} color={colors.dark.primary} />
          </TouchableOpacity>
        </View>

        {/* Options Container */}
        <View className="flex-1 pt-2 flex justify-between">
          <View>
            {/* QR Code Section */}
            <View className="items-center mt-6">
              <Text className="text-text text-base font-medium mb-3">
                Receive Here 👇
              </Text>
              <View className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-2xl">
                <QRCode
                  value={userInfo?.wallet.publicKey}
                  size={150}
                  color={colors.dark.text}
                  backgroundColor="transparent"
                />
              </View>
              <Text className="text-xs text-zinc-500 mt-3 text-center px-4">
                Scan this QR to receive tokens to your public address
              </Text>
            </View>

            <View className="px-2 mt-4">
              <Text className="font-medium text-text pl-2 mb-1">Network</Text>
              <NetworkToggle />
            </View>
          </View>
        </View>

        {/* Sidebar Footer */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleLogout()}
          className="p-4 border-t gap-2 border-white/10 flex flex-row items-center"
        >
          <Text className="text-text font-medium">Log Out</Text>
          <MaterialCommunityIcons
            name="logout"
            size={16}
            color={colors.dark.accent}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default home;
