import { BtnLoader } from "@/components";
import { getOAuthUrl, isUserAuthenticated } from "@/utils/queries/auth";
import { useAppStore } from "@/zustand/appStore";
import { useUserStore } from "@/zustand/userStore";
import { AntDesign } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as SecureStorage from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Allow expo auth session to open a browser
WebBrowser.maybeCompleteAuthSession();

const index = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { isUserLoggedIn, setUserAuthStatus } = useUserStore();
  const { setToast } = useAppStore();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // This is the URI where the mobile app wants to receive the result
      const appRedirectUri = AuthSession.makeRedirectUri({
        scheme: "app", // from app.json
      });
      const authUrl = await getOAuthUrl(appRedirectUri);
      if (!authUrl) return;

      // Get the redirect URI for your app
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "app",
      });

      // Use WebBrowser.openAuthSessionAsync
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      // console.log("Result after auth: ", result)

      // Handle the result
      if (result.type === "success") {
        const url = result.url;
        const params = new URLSearchParams(url.split("?")[1]);
        const jwt = params.get("jwt");
        // Check if SecureStore is available
        const isAvailable = await SecureStorage.isAvailableAsync();
        // console.log("SecureStore available:", isAvailable);

        if (!isAvailable) {
          console.log("SecureStore is not available on this device");
          return;
        }

        // Try to set the item
        console.log("Setting auth_token...");
        await SecureStorage.setItemAsync("auth_token", jwt || "");
        console.log("Token set successfully");

        // Immediately verify it was stored
        const verifyToken = await SecureStorage.getItemAsync("auth_token");
        console.log(
          "Verification - Token retrieved:",
          verifyToken ? "SUCCESS" : "FAILED"
        );

        if (!verifyToken) {
          console.error("Token was not stored!");
          return;
        }

        checkIsUserAuthenticated()
      } else {
        console.log("Login Cancelled");
      }
    } catch (err: any) {
      setToast({
        title: "Auth Error",
        content: err?.message || "Error occurred while authentication",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkIsUserAuthenticated = async () => {
    setLoading(true);
    const response = await isUserAuthenticated();
    if (response) {
      setUserAuthStatus(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      router.replace("/home");
    } else {
      checkIsUserAuthenticated();
    }
  }, [isUserLoggedIn]);

  return (
    <View className="flex-1 bg-primary">
      {/* Top Section - Logo & Branding */}
      <View className="flex-[0.4] justify-center items-center px-8">
        <View className="w-24 h-24 bg-accent rounded-3xl items-center justify-center mb-6">
          <Text className="text-primary text-5xl font-bold">W</Text>
        </View>
        <Text className="text-text text-3xl font-bold text-center mb-3">
          Welcome Back
        </Text>
        <Text className="text-text/60 text-base text-center leading-6">
          Sign in to access your wallet and manage your crypto assets securely
        </Text>
      </View>

      {/* Middle Section - Illustration/Visual */}
      <View className="flex-[0.35] justify-center items-center px-8">
        <View className="w-full max-w-sm aspect-square bg-secondary/30 rounded-3xl items-center justify-center border-2 border-accent/20">
          {/* Decorative circles */}
          <View className="absolute top-8 left-8 w-16 h-16 bg-accent/20 rounded-full" />
          <View className="absolute bottom-12 right-12 w-20 h-20 bg-accent/30 rounded-full" />
          <View className="absolute top-20 right-8 w-12 h-12 bg-accent/10 rounded-full" />

          {/* Center icon */}
          <View className="w-32 h-32 bg-accent/40 rounded-full items-center justify-center">
            <View className="w-24 h-24 bg-accent rounded-full items-center justify-center">
              <Text className="text-primary text-4xl">🔐</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Section - Auth Button */}
      <View className="flex-[0.25] justify-start items-center px-8 pb-12">
        <TouchableOpacity
          onPress={() => loginWithGoogle()}
          disabled={loading}
          className="w-full bg-white gap-1 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg active:opacity-80"
          activeOpacity={0.9}
        >
          {/* Google Icon Placeholder */}
          <AntDesign name="google" size={24} color="black" />
          <Text className="text-gray-800 text-lg font-semibold">
            Continue with Google
          </Text>
          {loading ? <BtnLoader /> : ""}
        </TouchableOpacity>

        <View className="mt-6 flex-row items-center">
          <View className="flex-1 h-[1px] bg-text/20" />
          <Text className="text-text/40 text-sm px-4">
            Secure Authentication
          </Text>
          <View className="flex-1 h-[1px] bg-text/20" />
        </View>

        <Text className="text-text/40 text-xs text-center mt-6 px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default index;
