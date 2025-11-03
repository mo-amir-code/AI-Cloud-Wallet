import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AddContactModal } from "../components/modals";
import { contactsApi, type Contact } from "../utils/axios/queries";
import { queryKeys } from "../utils/query-keys";
import { useToastStore } from "../stores/useToastStore";

const Contacts: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContactId, setDeletingContactId] = useState<string | number | null>(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  // Fetch contacts using React Query
  const {
    data: contacts = [],
    isLoading,
    isError,
    error,
  } = useQuery<Contact[], Error>({
    queryKey: queryKeys.contacts.all,
    queryFn: contactsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => contactsApi.delete(String(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      addToast("Contact deleted successfully", "success");
      setDeletingContactId(null);
    },
    onError: (error: any) => {
      addToast(error?.message || "Failed to delete contact", "error");
      setDeletingContactId(null);
    },
  });

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setDeletingContactId(id);
      deleteMutation.mutate(id);
    }
  };

  const handleSend = (address: string) => {
    // Navigate to Send page with pre-filled recipient address
    navigate("/dashboard/send", { state: { recipient: address } });
  };

  const handleModalClose = () => {
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  return (
    <main className="flex-1 p-4 md:p-8 bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-text-primary text-3xl md:text-4xl font-bold leading-tight tracking-[-0.03em]">
            Contacts
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <label className="sr-only" htmlFor="search-contacts">
                Search Contacts
              </label>
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                style={{
                  fontVariationSettings:
                    "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                }}
              >
                search
              </span>
              <input
                id="search-contacts"
                type="search"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-card-dark border-none rounded-lg text-text-primary placeholder:text-text-secondary pl-10 pr-4 focus:ring-2 focus:ring-primary/50 transition-shadow outline-none"
              />
            </div>

            {/* Add Contact Button */}
            <button
              onClick={() => setIsContactModalOpen((prev) => !prev)}
              className="flex-shrink-0 flex items-center justify-center rounded-lg h-11 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
            >
              <span
                className="material-symbols-outlined mr-2"
                style={{
                  fontVariationSettings:
                    "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                }}
              >
                person_add
              </span>
              <span className="truncate">New Contact</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-500 text-sm">
              Error loading contacts: {error?.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredContacts.length === 0 && (
          <div className="bg-card-dark rounded-xl shadow-lg p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-text-muted mb-4">
              contacts
            </span>
            <h3 className="text-text-primary text-xl font-semibold mb-2">
              {searchQuery ? "No contacts found" : "No contacts yet"}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery
                ? "Try a different search term"
                : "Add your first contact to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Add Contact
              </button>
            )}
          </div>
        )}

        {/* Contacts List - Desktop Table View */}
        {!isLoading && !isError && filteredContacts.length > 0 && (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-card-dark rounded-xl shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-4 pl-6 text-sm font-semibold text-text-secondary tracking-wider uppercase">
                        Name
                      </th>
                      <th className="p-4 text-sm font-semibold text-text-secondary tracking-wider uppercase">
                        Wallet Address
                      </th>
                      <th className="p-4 pr-6 text-sm font-semibold text-text-secondary tracking-wider uppercase text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="group border-b border-white/5 last:border-b-0 hover:bg-hover-light transition-colors"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-4">
                            <div
                              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 flex items-center justify-center text-white font-bold text-base"
                              style={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              }}
                            >
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-text-primary text-base font-medium leading-normal">
                              {contact.name}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-text-secondary text-sm font-mono">
                          {contact.address}
                        </td>
                        <td className="p-4 pr-6">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => handleEdit(contact)}
                              disabled={deleteMutation.isPending && deletingContactId === contact.id}
                              className="text-text-muted hover:text-text-primary transition-colors flex size-8 items-center justify-center hover:bg-hover-light rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit Contact"
                            >
                              <span className="material-symbols-outlined text-xl">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => handleSend(contact.address)}
                              disabled={deleteMutation.isPending && deletingContactId === contact.id}
                              className="text-text-muted hover:text-text-primary transition-colors flex size-8 items-center justify-center hover:bg-hover-light rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Send Funds"
                            >
                              <span className="material-symbols-outlined text-xl">
                                send
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(contact.id)}
                              disabled={deleteMutation.isPending && deletingContactId === contact.id}
                              className="text-red-500/70 hover:text-red-500 transition-colors flex size-8 items-center justify-center hover:bg-red-500/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete Contact"
                            >
                              {deleteMutation.isPending && deletingContactId === contact.id ? (
                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                              ) : (
                                <span className="material-symbols-outlined text-xl">
                                  delete
                                </span>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-card-dark rounded-xl shadow-lg p-4 hover:bg-hover-light transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary text-base font-semibold mb-1">
                        {contact.name}
                      </h3>
                      <p className="text-text-secondary text-xs font-mono break-all">
                        {contact.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => handleEdit(contact)}
                      disabled={deleteMutation.isPending && deletingContactId === contact.id}
                      className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-hover-light hover:bg-white/10 text-text-primary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleSend(contact.address)}
                      disabled={deleteMutation.isPending && deletingContactId === contact.id}
                      className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-primary hover:opacity-90 text-background-dark rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-lg">send</span>
                      <span className="text-sm font-bold">Send</span>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deleteMutation.isPending && deletingContactId === contact.id}
                      className="flex items-center justify-center size-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleteMutation.isPending && deletingContactId === contact.id ? (
                        <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <span className="material-symbols-outlined text-lg">delete</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {/* Add/Edit Contact Modal */}
      <AddContactModal
        visible={isContactModalOpen}
        setVisible={handleModalClose}
        editingContact={editingContact}
      />
    </main>
  );
};

export default Contacts;
