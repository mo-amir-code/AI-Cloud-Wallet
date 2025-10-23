import { PriceType, TokenMetadataType } from "@/types/tokens";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

const TokenInfo = ({
  tokenInfo,
}: {
  tokenInfo: TokenMetadataType & PriceType;
}) => {
  return (
    <View className="flex flex-row items-center justify-between px-4">
      <View className="flex flex-row items-center gap-2">
        <Image
          style={{ width: 40, height: 40, borderRadius: 20 }}
          source={tokenInfo.imageUri || ""}
          contentFit="cover"
          transition={1000}
        />
        <View>
          <Text className="text-text font-medium">{tokenInfo.name}</Text>
          <Text className="text-text/40 text-sm">{tokenInfo.symbol}</Text>
        </View>
      </View>
      <View className="flex flex-col items-end">
        <Text className="text-text font-medium">
          ${tokenInfo.price?.usd?.toFixed(2) ?? "-"}
        </Text>
        <Text className="text-accent/80 font-medium text-sm">
          ₹{tokenInfo?.price?.inr?.toFixed(2) ?? "-"}
        </Text>
      </View>
    </View>
  );
};

export default TokenInfo;
