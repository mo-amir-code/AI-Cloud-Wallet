import { Contact } from "@/components";
import ContactModal from "@/components/contact/ContactModal";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const contacts = () => {
  const [visible, setVisible] = useState<"add" | "edit" | null>(null);

  return (
    <View className="bg-primary flex-1 relative">
      {/* Header */}
      <View className="flex flex-row items-center justify-center py-4">
        <Text className="text-text font-semibold text-xl">Contacts</Text>
      </View>

      <ScrollView className="bg-primary flex-1 pt-2 px-2">
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
        <Contact setVisible={setVisible} />
      </ScrollView>

      {/* Button To Add Contact */}
      <TouchableOpacity
        onPress={() => setVisible("add")}
        className="absolute bottom-4 right-4 bg-accent w-16 h-16 flex items-center justify-center rounded-full"
      >
        <FontAwesome6 name="add" size={30} color="black" />
      </TouchableOpacity>

      <ContactModal visible={visible} setVisible={setVisible} />
    </View>
  );
};

export default contacts;
