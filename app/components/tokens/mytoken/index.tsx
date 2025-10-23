import { MyTokenDataType } from "@/types/tokens";
import React from "react";
import { Image, Text, View } from "react-native";
const imagePlaceholder = require("../../../assets/question_mark.webp");
// import imagePlaceholder from "@/assets/question_mark.webp";

const index = ({ tokenInfo }: { tokenInfo: MyTokenDataType }) => {
  return (
    <View className="w-full h-[60px] flex flex-row justify-between items-center rounded-2xl bg-secondary/60 p-4">
      <View className="flex flex-row gap-2 items-center">
        <Image
          source={
            tokenInfo?.imageUri
              ? {
                  uri: tokenInfo.imageUri,
                }
              : imagePlaceholder
          }
          className="h-11 w-11 rounded-full"
        />
        <View>
          <Text className="text-text font-medium">
            {tokenInfo?.name || "Unknown"}
          </Text>
          <Text className="text-text/40 text-sm">
            {tokenInfo?.symbol || "unknown"}
          </Text>
        </View>
      </View>

      <View className="flex flex-row items-center gap-4">
        {/* Chart Here */}
        {/* <View className="w-[80px] h-fit overflow-hidden">
          <Chart height={10} width={80} />
        </View> */}
        {/* Chart End */}

        <View className="flex flex-col items-end">
          <Text className="text-text font-medium">
            {tokenInfo.pricePerToken == -1
              ? "-"
              : "$" + tokenInfo.pricePerToken.toFixed(8)}
          </Text>
          <Text className="text-accent/80 font-medium text-sm">
            {tokenInfo.pricePerToken == -1
              ? "-"
              : (tokenInfo.pricePerToken * tokenInfo.amount).toFixed(8)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default index;
