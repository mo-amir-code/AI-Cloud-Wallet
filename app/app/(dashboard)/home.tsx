import { Chart } from "@/components";
import { MyToken, TrendingToken } from "@/components/tokens";
import { SECRETS } from "@/config/secrets";
import { colors } from "@/theme/colors";
import { MyTokenDataType, PriceType, TokenMetadataType } from "@/types/tokens";
import { UserInfoType } from "@/types/zustand";
import { httpAxios, ROUTES } from "@/utils/axios";
import { topTokens as topTokensData } from "@/utils/data";
import { fetchTokenPriceData } from "@/utils/queries/solana";
import { useUserStore } from "@/zustand/userStore";
import { FontAwesome } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const home = () => {
  const [topTokens, setTopTokens] = useState<(TokenMetadataType & PriceType)[]>(
    []
  );
  const { userInfo, setUserInfo, setTokens, updateTotalBalance, totalBalance } =
    useUserStore();
  const [userTokens, setUserTokens] = useState<MyTokenDataType[]>([]);

  const fetchUserTokens = async () => {
    try {
      if (!userInfo?.wallet.publicKey) return;

      // Get token balances
      const response = await axios.get(
        `https://api.helius.xyz/v0/addresses/${userInfo.wallet.publicKey}/balances?api-key=${SECRETS.HELIUS_API_KEY}`
      );

      // console.log("User Tokens Response:", response.data);

      const tokensInfo = response.data.tokens.map((token: any) => {
        return {
          mint: token.mint,
          amount: token.amount,
          decimals: token.decimals,
        };
      });

      const tokensMintAddresses = tokensInfo.map((token: any) => token.mint);

      let tokensData = await fetchTokenPriceData(tokensMintAddresses);
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

      if (response.data.nativeBalance > 0) {
        // Add Solana token with current price from CoinGecko
        const solPriceResponse = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,inr"
        );

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
        tokensData.push(solanaData);
      }

      tokensData = tokensData.sort((a, b) => b.amount - a.amount);

      setUserTokens(tokensData);
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
      const res = await httpAxios.get(ROUTES.USER.ROOT);

      const userData = res.data.data.user;

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
    } catch (error) {
      console.log("Error fetching user info:", error);
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

  useEffect(() => {
    if (userInfo === null) handleUserInfoRequest();
  }, [userInfo]);

  useEffect(() => {
    if (topTokens.length === 0) fetchTopTokensPrice();
    if (userInfo) fetchUserTokens();
  }, [topTokens, userInfo]);

  return (
    <View className="flex-1" >
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
          <Pressable>
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
                ${totalBalance}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              <TouchableOpacity className="bg-accent flex-1 rounded-2xl px-6 py-3">
                <Text className="font-semibold text-center text-primary">
                  Send
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-secondary flex-1 rounded-2xl px-6 py-3">
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
            {userTokens.map((token) => (
              <MyToken key={token.mintAddress} tokenInfo={token} />
            ))}
          </View>
        </View>
      </ScrollView>
      {/* Button To Activate AU */}
      <TouchableOpacity className="absolute bottom-4 right-4 bg-accent w-16 h-16 flex items-center justify-center rounded-full">
        <FontAwesome name="magic" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default home;
