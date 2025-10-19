import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const _layout = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#211832]">
      <View className="m-2 flex-1">
        <View>
          <Text>Dashbord hai ye</Text>
        </View>

        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </SafeAreaView>
  );
};

export default _layout;
