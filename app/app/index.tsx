import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#211832]">
      <ScrollView className="bg-[#211832] flex-1">
        <View className="m-2">
          <Text>index</Text>
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Text>Go to Dashboard Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Text>Go to settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
