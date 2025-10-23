import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  const router = useRouter();

  return (
    <SafeAreaView className={`flex-1 bg-primary`}>
      <ScrollView className="bg-primary text-text flex-1">
        <View className="m-2">
          <Text className="text-text" >index</Text>
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Text className="text-text" >Go to Dashboard Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/send")}>
            <Text className="text-text" >Go to Send</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
