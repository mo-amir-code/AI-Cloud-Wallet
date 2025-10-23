import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const index = ({
  isFromDropdown,
  setVisible,
}: {
  isFromDropdown?: boolean;
  setVisible?: Function;
}) => {
  return (
    <View
      className={`flex-1 flex flex-row justify-between active:bg-secondary/20 ${isFromDropdown ? "bg-primary/30" : ""} items-center rounded-lg px-2 py-3`}
    >
      <View className="flex flex-row items-center gap-2">
        <Image className="bg-accent w-12 h-12 rounded-full" />
        <View>
          <Text className="text-text font-medium">MekYu</Text>
          <Text className="text-text/60 text-sm">G6WVXCkT...DBZrU</Text>
        </View>
      </View>

      {isFromDropdown ? (
        ""
      ) : (
        <TouchableOpacity
          onPress={() => setVisible && setVisible("edit")}
          className="bg-secondary/40 px-6 py-2 rounded-md"
        >
          <Text className="text-accent">Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default index;
