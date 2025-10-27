import AlertModal from "@/components/modals/AlertModal";
import { useAppStore } from "@/zustand/appStore";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const { toast, setToast } = useAppStore();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack screenOptions={{ headerShown: false }} />
      <AlertModal
        visible={toast ? true : false}
        heading={toast?.title || ""}
        content={toast?.content || ""}
        status={toast?.status}
        onOk={() => setToast(null)}
      />
    </SafeAreaView>
  );
}
