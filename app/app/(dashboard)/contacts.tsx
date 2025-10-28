import { Contact } from "@/components";
import ContactModal from "@/components/contact/ContactModal";
import NoData from "@/components/NoData";
import { useUserStore } from "@/zustand/userStore";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const contacts = () => {
  const [visible, setVisible] = useState<"add" | "edit" | null>(null);
  const [editContactEdit, setEditContactId] = useState<string | null>(null); // Editing contact id
  const { contacts } = useUserStore();

  return (
    <View className="bg-primary flex-1 relative">
      {/* Header */}
      <View className="flex flex-row items-center justify-center py-4">
        <Text className="text-text font-semibold text-xl">Contacts</Text>
      </View>

      {contacts.length === 0 ? (
        <NoData
          title="No Contacts"
          content="You did not add contact in AI Cloud Wallet"
        />
      ) : (
        <>
          {/* Tokens will be listed here */}
          <FlatList
            className="p-2"
            showsVerticalScrollIndicator={false}
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Contact
                setVisible={setVisible}
                data={item}
                setEditId={setEditContactId}
              />
            )}
            contentContainerStyle={{ gap: 16 }}
          />

          {/* Button To Add Contact */}
          <TouchableOpacity
            onPress={() => setVisible("add")}
            className="absolute bottom-4 right-4 bg-accent w-16 h-16 flex items-center justify-center rounded-full"
          >
            <FontAwesome6 name="add" size={30} color="black" />
          </TouchableOpacity>

          <ContactModal
            visible={visible}
            editId={editContactEdit}
            setVisible={setVisible}
            setEditContact={setEditContactId}
          />
        </>
      )}
    </View>
  );
};

export default contacts;
