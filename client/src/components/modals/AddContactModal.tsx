import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contactsApi, type Contact } from "../../utils/axios/queries";
import { queryKeys } from "../../utils/query-keys";
import { useToastStore } from "../../stores/useToastStore";
import { PublicKey } from "@solana/web3.js";

interface AddContactModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  editingContact?: Contact | null;
}

const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  setVisible,
  editingContact,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  const isEditMode = !!editingContact;

  useEffect(() => {
    if (editingContact) {
      setName(editingContact.name);
      setAddress(editingContact.address);
    } else {
      setName("");
      setAddress("");
    }
    setError("");
  }, [editingContact, visible]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: contactsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      addToast("Contact added successfully", "success");
      handleClose();
    },
    onError: (error: any) => {
      setError(error?.message || "Failed to add contact");
      addToast(error?.message || "Failed to add contact", "error");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) =>
      contactsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      addToast("Contact updated successfully", "success");
      handleClose();
    },
    onError: (error: any) => {
      setError(error?.message || "Failed to update contact");
      addToast(error?.message || "Failed to update contact", "error");
    },
  });

  const validateAddress = (addr: string): boolean => {
    try {
      if (addr.endsWith(".sol")) {
        return addr.length > 4 && /^[a-z0-9-]+\.sol$/.test(addr);
      }
      new PublicKey(addr);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    if (!validateAddress(address.trim())) {
      setError("Invalid Solana address or .sol domain");
      return;
    }

    if (isEditMode && editingContact) {
      updateMutation.mutate({
        id: String(editingContact.id),
        data: { name: name.trim(), address: address.trim() },
      });
    } else {
      createMutation.mutate({ name: name.trim(), address: address.trim() });
    }
  };

  const handleClose = () => {
    setName("");
    setAddress("");
    setError("");
    setVisible(false);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-card-dark border border-border rounded-2xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {isEditMode ? "Edit Contact" : "Add New Contact"}
            </h2>
            <button
              onClick={handleClose}
              disabled={isPending}
              className="text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="contact-name"
                className="block text-text-primary text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter contact name"
                disabled={isPending}
                className="w-full h-12 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="contact-address"
                className="block text-text-primary text-sm font-medium mb-2"
              >
                Wallet Address
              </label>
              <input
                id="contact-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter SOL address or .sol name"
                disabled={isPending}
                className="w-full h-12 bg-background-dark border border-border rounded-lg text-text-primary placeholder:text-text-secondary px-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="flex-1 h-12 px-6 bg-transparent border border-border text-text-primary rounded-lg hover:bg-hover-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 h-12 px-6 bg-primary text-background-dark font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="w-5 h-5 border-3 border-background-dark/30 border-t-background-dark rounded-full animate-spin"></div>
                    <span>{isEditMode ? "Updating..." : "Adding..."}</span>
                  </>
                ) : (
                  <span>{isEditMode ? "Update Contact" : "Add Contact"}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddContactModal;
