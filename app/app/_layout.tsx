import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
