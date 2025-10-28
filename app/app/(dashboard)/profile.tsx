import AlertModal from "@/components/modals/AlertModal";
import { useAPIClient } from "@/hooks/apiClient";
import { colors } from "@/theme/colors";
import { ROUTES } from "@/utils/axios";
import { useAppStore } from "@/zustand/appStore";
import { useUserStore } from "@/zustand/userStore";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const profile = () => {
  const { userInfo, setUserInfo } = useUserStore();
  const { setToast } = useAppStore();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { apiRequest } = useAPIClient();

  const copyToClipboard = async (isFromSecret?: boolean) => {
    try {
      await Clipboard.setStringAsync(
        (isFromSecret
          ? userInfo?.wallet.privateKey
          : userInfo?.wallet.publicKey) as string
      );
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getSecretKey = async () => {
    const res = await apiRequest(ROUTES.USER.SECRET, {
      method: "get",
      requiresAuth: true,
    });

    // console.log("RESPONSE: ", res)

    if (res?.data) {
      const key = res.data.data.key;
      const data: any = {
        ...userInfo,
        wallet: {
          ...userInfo?.wallet,
          privateKey: key,
        },
      };
      setUserInfo(data);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      getSecretKey();
    }
  }, [isConfirmed]);

  return (
    <View className="flex-1">
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
                {userInfo?.wallet?.publicKey || "No Address"}
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
                {userInfo?.wallet?.privateKey ||
                  "*****************************************"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                if (userInfo?.wallet.privateKey) {
                  copyToClipboard(true);
                } else {
                  setIsOpen(true);
                }
              }}
            >
              {userInfo?.wallet.privateKey ? (
                <Ionicons name="copy" size={20} color={colors.dark.accent} />
              ) : (
                <Fontisto name="eye" size={16} color={colors.dark.accent} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AlertModal
        visible={isOpen}
        heading="Reveal Secret Key"
        content="Your secret key gives full access to your wallet. Never share it with anyone. Make sure no one is watching your screen before continuing."
        status="warning"
        onOk={() => {
          setIsConfirmed(true);
          setIsOpen(false);
        }}
        onCancel={() => setIsOpen(false)}
      />
    </View>
  );
};

export default profile;
