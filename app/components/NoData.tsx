import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function NoData({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <View className="flex-1 justify-center items-center px-4">
      <MaterialCommunityIcons
        name="database-off-outline"
        size={64}
        color="#a1a1aa" // zinc-400
      />
      <Text className="text-xl font-semibold text-zinc-700 dark:text-zinc-200 mt-4">
        {title}
      </Text>
      <Text className="text-sm text-zinc-500 dark:text-zinc-400 text-center mt-1">
        {content}
      </Text>
    </View>
  );
}
