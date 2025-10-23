import { Chart } from "@/components";
import { PriceType, TokenMetadataType } from "@/types/tokens";
import React from "react";
import { View } from "react-native";
import TokenInfo from "./TokenInfo";

const index = ({tokenInfo}:{tokenInfo: TokenMetadataType & PriceType}) => {
  return (
    <View className="w-[240px] h-[150px] rounded-2xl bg-secondary/60 pt-4 overflow-hidden">
      <TokenInfo tokenInfo={tokenInfo} />

      <View className="mt-14 inset-0 h-fit overflow-hidden">
        <Chart height={45} width={240} />
      </View>
    </View>
  );
};

export default index;
