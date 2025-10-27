import { useAPIClient } from "@/hooks/apiClient";
import { ContactType } from "@/types/zustand";
import { ROUTES } from "@/utils/axios";
import { useAppStore } from "@/zustand/appStore";
import { useUserStore } from "@/zustand/userStore";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BtnLoader } from "..";

const ContactModal = ({
  visible,
  editId,
  setVisible,
  setEditContact,
}: {
  visible: "edit" | "add" | null;
  editId: string | null;
  setVisible: Function;
  setEditContact: Function;
}) => {
  const [contact, setContact] = useState<Partial<ContactType> | null>(null);
  const { contacts } = useUserStore();
  const { apiRequest, isFetching } = useAPIClient();
  const { setToast } = useAppStore();

  if (visible === "edit" && editId === null) {
    setVisible(false);
    return;
  }

  const handleClose = () => {
    setEditContact && setEditContact(null);
    setContact(null);
    setVisible(false);
  };

  const handleOnNameChange = (name: string) => {
    let c: Partial<ContactType> = { name: "", walletAddress: "" };
    if (contact !== null) c = contact;

    c.name = name;
    setContact(c);
  };

  const handleOnWalletChange = (address: string) => {
    let c: Partial<ContactType> = { name: "", walletAddress: "" };
    if (contact !== null) c = contact;

    c.walletAddress = address;
    setContact(c);
  };

  const handleSubmit = async () => {
    if (!contact?.name || !contact?.walletAddress) {
      setToast({
        title: "All fields are required",
        content: "You must enter all the required fields to move further",
        status: "error",
      });
      return;
    }

    try {
      try {
        if (!PublicKey.isOnCurve(new PublicKey(contact.walletAddress))) {
          setToast({
            title: "Invalid Solana wallet address",
            content:
              "Enter a valid solana wallet address. You can see in your Phantom wallet extension.",
            status: "error",
          });
          return;
        }
      } catch (error) {
        setToast({
          title: "Invalid public key",
          content:
            "Enter a valid solana wallet address. You can see in your Phantom wallet extension.",
          status: "error",
        });
        return;
      }

      let contct: any = {
        name: contact.name,
        address: contact.walletAddress,
      };

      if (visible === "edit" && editId) {
        contct["id"] = contact.id;

        await apiRequest(ROUTES.CONTACTS.ROOT, {
          method: "patch",
          body: { contact: contct },
        });
        setToast({
          title: "Updated",
          content: "Contact is updated now",
          status: "success",
        });
      } else {
        await apiRequest(ROUTES.CONTACTS.ROOT, {
          method: "post",
          body: { contacts: [contct] },
        });
        setToast({
          title: "Added",
          content: "Your new contacted added saved successfully",
          status: "success",
        });
      }
      handleClose();
    } catch (err) {
      setToast({
        title: "Something went wrong",
        content: "Something unexpected happened",
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (visible !== "edit") return;
    const contct = contacts.find((c) => c.id === editId);
    setContact(contct as ContactType);
  }, [visible]);

  if (visible === "edit" && !contact) return;

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
            {visible === "add"
              ? "Enter the details for the new contact."
              : "Edit contact details of " + contact?.name || ""}
          </Text>

          <View>
            <View className="mt-4">
              <Text className="text-text/80 mb-1">Name</Text>
              <TextInput
                className="w-full bg-primary/60 rounded-md pl-3 text-text"
                placeholderTextColor={"gray"}
                defaultValue={contact?.name || ""}
                placeholder="e.g. John Doe"
                onChangeText={(name) => handleOnNameChange(name)}
              />
            </View>

            <View className="mt-4 mb-6">
              <Text className="text-text/80 mb-1">Wallet Address</Text>
              <TextInput
                className="w-full bg-primary/60 rounded-md pl-3 text-text"
                placeholderTextColor={"gray"}
                defaultValue={contact?.walletAddress || ""}
                placeholder="e.g. G6WVX...abc"
                onChangeText={(address) => handleOnWalletChange(address)}
              />
            </View>
          </View>

          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              className="bg-primary/60 px-4 py-4 rounded-xl w-[50%]"
              onPress={() => handleClose()}
            >
              <Text className="text-white/60 font-semibold text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSubmit()}
              className="bg-accent px-4 py-4 rounded-xl w-[50%]"
            >
              <Text className="text-text font-semibold text-center">
                {isFetching ? (
                  <BtnLoader />
                ) : visible === "add" ? (
                  "Save"
                ) : (
                  "Update"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ContactModal;
