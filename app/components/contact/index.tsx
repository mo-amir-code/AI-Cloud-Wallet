import { ContactType } from "@/types/zustand";
import { shortenSolAddress } from "@/utils";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
const nonePersonImage = require("../../assets/none-person.jpg");

const index = ({
  data,
  isFromDropdown,
  setVisible,
  setEditId,
}: {
  data: ContactType;
  isFromDropdown?: boolean;
  setVisible?: Function;
  setEditId?: Function;
}) => {
  return (
    <View
      className={`flex flex-row justify-between ${isFromDropdown ? "bg-primary/30 p-2" : ""} items-center rounded-lg px-2 py-3`}
    >
      <View className="flex flex-row items-center gap-2">
        <Image
          source={data.imageUri ? { uri: data.imageUri } : nonePersonImage}
          className="bg-accent w-12 h-12 rounded-full"
        />
        <View>
          <Text className="text-text font-medium">{data.name}</Text>
          <Text className="text-text/60 text-sm">
            {shortenSolAddress(data.walletAddress)}
          </Text>
        </View>
      </View>

      {!isFromDropdown && (
        <TouchableOpacity
          onPress={() => {
            setVisible && setVisible("edit");
            setEditId && setEditId(data.id);
          }}
          className="bg-secondary/40 px-6 py-2 rounded-md"
        >
          <Text className="text-accent">Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default index;
