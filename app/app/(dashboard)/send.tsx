import { Contact } from "@/components";
import { colors } from "@/theme/colors";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const data = [
  { label: "React Native", value: "react-native" },
  { label: "Next.js", value: "nextjs" },
  { label: "Solana", value: "solana" },
  { label: "Blockchain", value: "blockchain" },
];

const send = () => {
  const [value, setValue] = useState<string | null>(null);

  return (
    <View className="bg-primary flex-1 pt-2 px-4 pb-4">
      {/* Header */}
      <View className=" flex flex-row items-center justify-center py-4">
        <Text className="text-text font-semibold text-xl">Send</Text>
      </View>

      <View className="flex-1 flex flex-col justify-end">
        <View className="flex-1">
          {/* Token */}
          <View>
            <Text className="text-accent text-lg mb-1">Token</Text>
            <Dropdown
              style={{
                width: "100%",
                height: 50,
                backgroundColor: colors.dark.secondary,
                borderRadius: 12,
                paddingHorizontal: 10,
              }}
              placeholderStyle={{ color: "gray" }}
              selectedTextStyle={{ color: colors.dark.text }}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select Token..."
              containerStyle={{
                backgroundColor: colors.dark.secondary,
                borderRadius: 12,
                borderColor: "transparent",
                height: 195,
              }}
              itemContainerStyle={{
                backgroundColor: "transparent",
                padding: 4,
              }}
              activeColor="transparent"
              value={value}
              onChange={(item) => setValue(item.value)}
              renderItem={(item) => (
                <View className="flex flex-row items-center justify-between p-2 rounded-lg bg-primary/30">
                  <View className="flex flex-row items-center gap-2">
                    <Image className="bg-accent w-12 h-12 rounded-full" />
                    <Text className="text-text font-medium">Solana</Text>
                  </View>
                  <View>
                    <Text className="text-accent font-medium">12.34</Text>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Amount */}
          <View className="mt-4">
            <Text className="text-accent text-lg mb-1">Amount</Text>
            <TextInput
              className="w-full bg-secondary rounded-xl pl-3 text-text"
              placeholderTextColor={"gray"}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {/* To */}
          <View className="mt-4">
            <Text className="text-accent text-lg mb-1">To</Text>

            <Dropdown
              style={{
                width: "100%",
                height: 50,
                backgroundColor: colors.dark.secondary,
                borderRadius: 12,
                paddingHorizontal: 10,
              }}
              placeholderStyle={{ color: "gray" }}
              selectedTextStyle={{ color: colors.dark.text }}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select Contact..."
              containerStyle={{
                backgroundColor: colors.dark.secondary,
                borderRadius: 12,
                borderColor: "transparent",
                height: 195,
              }}
              itemContainerStyle={{
                backgroundColor: "transparent",
                padding: 4,
              }}
              activeColor="transparent"
              value={value}
              onChange={(item) => setValue(item.value)}
              renderItem={(item) => <Contact isFromDropdown />}
            />

            <TextInput
              className="w-full bg-secondary rounded-xl pl-3 text-text mt-4"
              placeholderTextColor={"gray"}
              placeholder="Wallet Address(Optional)"
            />
          </View>
        </View>

        <TouchableOpacity className="bg-accent py-3 rounded-full">
          <Text className="text-text font-medium text-lg text-center">
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default send;
