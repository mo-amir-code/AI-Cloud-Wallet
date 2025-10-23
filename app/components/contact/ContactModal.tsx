import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

const ContactModal = ({
  visible,
  setVisible,
}: {
  visible: "edit" | "add" | null;
  setVisible: Function;
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible ? true : false}
      onRequestClose={() => setVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-secondary rounded-t-xl p-6">
          <Text className="text-lg font-bold text-text">
            {visible === "add" ? "Add" : "Edit"} Contact
          </Text>
          <Text className="text-text/40">
            {visible === "add" ? "Enter" : "Edit"} the details for the new
            contact.
          </Text>

          <View>
            <View className="mt-4">
              <Text className="text-text/80 mb-1">Name</Text>
              <TextInput
                className="w-full bg-primary/60 rounded-md pl-3 text-text"
                placeholderTextColor={"gray"}
                placeholder="e.g. John Doe"
                keyboardType="numeric"
              />
            </View>

            <View className="mt-4 mb-6">
              <Text className="text-text/80 mb-1">Wallet Address</Text>
              <TextInput
                className="w-full bg-primary/60 rounded-md pl-3 text-text"
                placeholderTextColor={"gray"}
                placeholder="e.g. G6WVX...abc"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              className="bg-primary/60 px-4 py-4 rounded-xl w-[50%]"
              onPress={() => setVisible(false)}
            >
              <Text className="text-white/60 font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-accent px-4 py-4 rounded-xl w-[50%]"
              onPress={() => setVisible(false)}
            >
              <Text className="text-text font-semibold text-center">
                {visible === "add" ? "Save" : "Update"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ContactModal;
