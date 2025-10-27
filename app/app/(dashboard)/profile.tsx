import { colors } from "@/theme/colors";
import { useAppStore } from "@/zustand/appStore";
import { useUserStore } from "@/zustand/userStore";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const profile = () => {
  const { userInfo } = useUserStore();
  const { setToast } = useAppStore();

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(userInfo?.wallet.publicKey as string);
      setToast({
        title: "Copied",
        content: "Public key has been copied.",
        status: "success",
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <ScrollView className="bg-primary flex-1 pt-2">
      {/* Header */}
      <View className="flex flex-row items-center justify-center py-4">
        <Text className="text-text font-semibold text-xl">Profile</Text>
      </View>

      <View className="flex-1 flex flex-col justify-center items-center gap-4 mt-12">
        <View>
          <Image
            source={{ uri: userInfo?.photoUrl || "" }}
            className="bg-accent w-32 h-32 rounded-full"
          />
        </View>

        <View className="flex flex-col justify-center items-center">
          <Text className="text-text text-2xl font-semibold">
            {userInfo?.name || "MekYu"}
          </Text>
          <Text className="text-text/40 text-lg">
            {userInfo?.email || "mekyu@gmail.com"}
          </Text>
        </View>
      </View>

      <View className="flex-1 mt-6">
        <View className="bg-secondary/40 flex flex-row justify-between items-center px-4 py-4 mx-2 rounded-xl">
          <View className="w-[90%]">
            <Text className="text-text/40 text-sm font-medium">
              Wallet Address
            </Text>
            <Text className="text-text text-sm font-medium w-[90%] break-all">
              {userInfo?.wallet?.publicKey ||
                "G6WVXCkT7xatjdAwqFAbFRmheVsQ5SEatX1Ew2ZDBZrU"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => copyToClipboard()}>
            <Ionicons name="copy" size={20} color={colors.dark.accent} />
          </TouchableOpacity>
        </View>
        <View className="bg-secondary/40 flex flex-row justify-between items-center px-4 py-4 mx-2 mt-4 rounded-xl">
          <View className="w-[90%]">
            <Text className="text-text/40 text-sm font-medium">
              Private Address
            </Text>
            <Text className="text-text text-sm font-medium w-[90%] break-all">
              *****************************************
            </Text>
          </View>

          <TouchableOpacity>
            <Fontisto name="eye" size={16} color={colors.dark.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default profile;
