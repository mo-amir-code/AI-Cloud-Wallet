import { BtnLoader, Contact } from "@/components";
import { useAPIClient } from "@/hooks/apiClient";
import { colors } from "@/theme/colors";
import { MyTokenDataType } from "@/types/tokens";
import { ContactType } from "@/types/zustand";
import { ROUTES } from "@/utils/axios";
import { useAppStore } from "@/zustand/appStore";
import { useUserStore } from "@/zustand/userStore";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const send = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [toAddress, setToAddress] = useState<string | null>(null);
  const { tokens, contacts } = useUserStore();
  const { apiRequest, isFetching } = useAPIClient();
  const { setToast } = useAppStore();

  const handleOnSubmit = async () => {
    try {
      // Validation: Check if all required fields are present

      // 1. Token is required
      if (!selectedToken) {
        setToast({
          title: "Validation Error",
          content: "Please select a token",
          status: "error",
        });
        return;
      }

      // 2. Amount is required and must be valid
      if (!amount || isNaN(amount) || amount <= 0) {
        setToast({
          title: "Validation Error",
          content: "Please enter a valid amount",
          status: "error",
        });
        return;
      }

      // 3. Either selectedContact OR toAddress must be present (at least one required)
      if (!selectedContact && !toAddress) {
        setToast({
          title: "Validation Error",
          content: "Please select a contact or enter a wallet address",
          status: "error",
        });
        return;
      }

      // Get the selected token data
      const token = tokens.find((t) => t.mintAddress === selectedToken);
      if (!token) {
        setToast({
          title: "Error",
          content: "Selected token not found",
          status: "error",
        });
        return;
      }

      // Check if user has enough balance
      if (amount > token.amount) {
        setToast({
          title: "Insufficient Balance",
          content: `You only have ${token.amount} ${token.symbol}`,
          status: "error",
        });
        return;
      }

      // Determine the recipient address
      let recipientAddress: string;
      if (toAddress) {
        // If wallet address is provided, use it (takes priority)
        recipientAddress = toAddress;
      } else if (selectedContact) {
        // Otherwise, use the selected contact's wallet address
        const contact = contacts.find((c) => c.id === selectedContact);
        if (!contact) {
          setToast({
            title: "Error",
            content: "Selected contact not found",
            status: "error",
          });
          return;
        }
        recipientAddress = contact.walletAddress;
      } else {
        setToast({
          title: "Error",
          content: "No recipient address available",
          status: "error",
        });
        return;
      }

      // Prepare the transaction data matching your Zod schema
      const transactionData: any = {
        toAddress: recipientAddress,
        amount: amount,
        decimals: token.decimals,
      };

      if (token.name !== "Solana") {
        transactionData["tokenMint"] = token.mintAddress;
        transactionData["tokenProgramId"] = token.programId;
      }

      const res = await apiRequest(ROUTES.TRANSACTION.ROOT, {
        method: "post",
        body: transactionData,
      });

      setToast({
        title: "Success",
        content: res.data.message,
        status: "success",
      });
    } catch (error) {
      console.error("Transaction error:", error);
      setToast({
        title: "Error",
        content: "Failed to process transaction",
        status: "error",
      });
    }
  };

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
              data={tokens}
              labelField="name"
              valueField="symbol"
              placeholder="Select Token..."
              containerStyle={{
                backgroundColor: colors.dark.secondary,
                borderRadius: 12,
                borderColor: "transparent",
                maxHeight: 195,
              }}
              itemContainerStyle={{
                backgroundColor: "transparent",
                margin: 4,
              }}
              activeColor="transparent"
              value={selectedToken}
              onChange={(item: MyTokenDataType) => {
                setSelectedToken(item.mintAddress);
              }}
              renderItem={(item: MyTokenDataType) => (
                <View className="flex flex-row items-center justify-between p-2 rounded-lg bg-primary/30">
                  <View className="flex flex-row items-center gap-2">
                    <Image
                      source={{ uri: item.imageUri || "" }}
                      className="bg-accent w-12 h-12 rounded-full"
                    />
                    <Text className="text-text font-medium">{item.name}</Text>
                  </View>
                  <View>
                    <Text className="text-accent font-medium">
                      {parseFloat(item.amount.toString())}
                    </Text>
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
              onChangeText={(e) => {
                setAmount(parseFloat(e));
              }}
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
              data={contacts}
              labelField="name"
              valueField="id"
              placeholder={
                contacts.length ? "Select Contact..." : "No Contacts!"
              }
              containerStyle={{
                backgroundColor: colors.dark.secondary,
                borderRadius: 12,
                borderColor: "transparent",
                maxHeight: 195,
              }}
              itemContainerStyle={{
                backgroundColor: "transparent",
                margin: 4,
              }}
              activeColor="transparent"
              value={selectedContact}
              onChange={(item) => {
                setSelectedContact(item.id);
              }}
              renderItem={(item: ContactType) => (
                <Contact isFromDropdown data={item} />
              )}
            />

            <TextInput
              className="w-full bg-secondary rounded-xl pl-3 text-text mt-4"
              placeholderTextColor={"gray"}
              placeholder="Wallet Address(Optional)"
              onChangeText={(e) => setToAddress(e)}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleOnSubmit()}
          disabled={isFetching}
          className={`${isFetching ? "bg-secondary" : "bg-accent"} py-3 rounded-full`}
        >
          <Text className="text-text font-medium text-lg text-center">
            {isFetching ? <BtnLoader /> : "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default send;
