import { useAPIClient } from "@/hooks/apiClient";
import { colors } from "@/theme/colors";
import { ROUTES } from "@/utils/axios";
import { useAppStore } from "@/zustand/appStore";
import { useUserStore } from "@/zustand/userStore";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function NetworkToggle() {
  const { settings, setSettings } = useUserStore();
  const { setToast } = useAppStore();
  const { apiRequest } = useAPIClient();
  const width = 160;
  const height = 42;
  const isDevnet = settings?.mode === "devnet";

  const knobPos = useRef(new Animated.Value(isDevnet ? 0 : 1)).current;

  useEffect(() => {
    Animated.timing(knobPos, {
      toValue: isDevnet ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isDevnet]);

  const knobTranslate = knobPos.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width / 2], // knob slides halfway across
  });

  const updateNetwork = async () => {
    const res = await apiRequest(ROUTES.SETTINGS.ROOT, {
      method: "patch",
      requiresAuth: true,
      body: { mode: settings?.mode === "devnet" ? "mainnet" : "devnet" },
    });
    if (res?.data) {
      setToast({
        title: "Network Status",
        content: res.data.message,
        status: "success",
      });
    }
  };

  const handlePress = async (next: "devnet" | "mainnet") => {
    await updateNetwork();
    setSettings({ ...settings, mode: next });
  };

  return (
    <View
      className="bg-zinc-200 dark:bg-zinc-800 flex-row items-center"
      style={[styles.container, { width, height, borderRadius: height / 2 }]}
    >
      {/* Devnet Button */}
      <Pressable
        className="flex-1 justify-center items-center"
        onPress={() => handlePress("devnet")}
      >
        <Text
          className={`text-base font-semibold ${
            isDevnet ? "text-white" : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          Devnet
        </Text>
      </Pressable>

      {/* Mainnet Button */}
      <Pressable
        className="flex-1 justify-center items-center"
        onPress={() => handlePress("mainnet")}
      >
        <Text
          className={`text-base font-semibold ${
            !isDevnet ? "text-white" : "text-zinc-700 dark:text-zinc-300"
          }`}
        >
          Mainnet
        </Text>
      </Pressable>

      {/* Animated Knob */}
      <Animated.View
        style={[
          styles.knob,
          {
            width: width / 2 - 4,
            height: height - 4,
            borderRadius: height / 2,
            transform: [{ translateX: knobTranslate }],
            backgroundColor: isDevnet ? colors.dark.accent : "#06b6d4",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    padding: 2,
  },
  knob: {
    position: "absolute",
    top: 2,
    left: 2,
    zIndex: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
});
