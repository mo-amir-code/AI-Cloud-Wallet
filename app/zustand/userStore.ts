import { MyTokenDataType } from "@/types/tokens";
import {
    ContactType,
    SettingsType,
    UserStoreActionsType,
    UserStoreStatesType,
} from "@/types/zustand";
import { create } from "zustand";

export const useUserStore = create<UserStoreStatesType & UserStoreActionsType>((set) => ({
    // ----------------------------
    // ✅ STATES
    // ----------------------------
    isUserLoggedIn: false,
    userInfo: null,
    totalBalance: 0,
    tokens: [],
    contacts: [],
    settings: { mode: "devnet" },

    // ----------------------------
    // ✅ ACTIONS
    // ----------------------------
    setUserAuthStatus: (status: boolean) => set({ isUserLoggedIn: status }),

    setUserInfo: (userInfo) => set({ userInfo }),

    clearUserInfo: () => set({ userInfo: null }),

    updateTotalBalance: (balance) => set({ totalBalance: balance }),

    setTokens: (tokens: MyTokenDataType[]) => set(() => ({ tokens })),

    updateTokenBalance: (mintAddress, amount) =>
        set((state) => {
            const updatedTokens = state.tokens.map((token) =>
                token.mintAddress === mintAddress ? { ...token, balance: amount } : token
            );
            return { tokens: updatedTokens };
        }),

    setContacts: (contacts: ContactType[]) => set({ contacts }),

    updateContact: (id: string, updatedData: Partial<ContactType>) =>
        set((state) => {
            const updatedContacts = state.contacts.map((contact) =>
                contact.id === id ? { ...contact, ...updatedData } : contact
            );
            return { contacts: updatedContacts };
        }),

    // ----------------------------
    // ✅ SETTINGS ACTIONS
    // ----------------------------
    setSettings: (settings: SettingsType) => set({ settings }),

    updateSettings: (updatedData: Partial<SettingsType>) =>
        set((state) => {
            // ensure existing settings and merge safely
            const currentSettings = state.settings ?? { mode: "devnet" };
            const mergedSettings: SettingsType = {
                ...currentSettings,
                ...updatedData,
                mode: updatedData.mode ?? currentSettings.mode ?? "devnet",
            };
            return { settings: mergedSettings };
        }),
}));
