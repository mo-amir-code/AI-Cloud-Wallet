import { create } from 'zustand';
import type {
    UserStoreType,
    UserInfoType,
    MyTokenDataType,
    ContactType,
    SettingsType,
    NetworkType,
} from '../types/zustand/user.types';
import { persist } from 'zustand/middleware';

const initialState = {
    isUserLoggedIn: false,
    userInfo: null,
    totalBalance: 0,
    tokens: [],
    contacts: [],
    settings: null,
};

const ONE_MIN = 60 * 1000

const userStore = create<UserStoreType>()(
    persist(
        (set) => ({
            ...initialState,

            // Login user and set user info
            login: (userInfo: UserInfoType) => set({
                isUserLoggedIn: true,
                userInfo,
            }),

            // Logout user and reset store
            logout: () => set(initialState),

            // Set user info
            setUserInfo: (userInfo: UserInfoType | null) => set({ userInfo }),

            // Set total balance
            setTotalBalance: (balance: number) => set({ totalBalance: balance }),

            // Set tokens
            setTokens: (tokens: MyTokenDataType[]) => set({ tokens }),

            // Add a contact
            addContact: (contact: ContactType) => set((state) => ({
                contacts: [...state.contacts, contact],
            })),

            // Remove a contact
            removeContact: (contactId: string) => set((state) => ({
                contacts: state.contacts.filter((c) => c.id !== contactId),
            })),

            // Update all contacts
            updateContacts: (contacts: ContactType[]) => set({ contacts }),

            // Set settings
            setSettings: (settings: SettingsType) => set({ settings }),

            // Update network mode
            updateNetworkMode: (mode: NetworkType) => set((state) => ({
                settings: state.settings ? { ...state.settings, mode } : { mode },
            })),
        }),


        {
            name: 'user-store',
            // persist only selected fields; wrap short-lived fields with expiresAt
            partialize: (state) => {
                const now = Date.now()
                return {
                    isUserLoggedIn: state.isUserLoggedIn,
                    userInfo: state.userInfo,
                    // wrap totalBalance with expiry metadata if present
                    totalBalance:
                        state.totalBalance == 0
                            ? 0
                            : { value: state.totalBalance, expiresAt: now + ONE_MIN },
                    // wrap tokens with expiry metadata if present
                    tokens:
                        state.tokens.length === 0 ? [] : { value: state.tokens, expiresAt: now + ONE_MIN },
                    contacts: state.contacts,
                    settings: state.settings,
                }
            },
            // when restoring, unwrap and drop expired fields
            onRehydrateStorage: () => (inboundState) => {
                if (!inboundState) return

                const now = Date.now()

                // inboundState.totalBalance may be { value, expiresAt } | null | number (defensive)
                if (inboundState.totalBalance && typeof inboundState.totalBalance === 'object') {
                    const tb = inboundState.totalBalance as { value?: number; expiresAt?: number } | null
                    if (!tb || typeof tb.value === 'undefined' || typeof tb.expiresAt === 'undefined' || now > tb.expiresAt) {
                        inboundState.totalBalance = 0
                    } else {
                        inboundState.totalBalance = tb.value
                    }
                }

                // inboundState.tokens may be { value, expiresAt } | null | actual tokens (defensive)
                if (inboundState.tokens && typeof inboundState.tokens === 'object') {
                    const tk = inboundState.tokens as { value?: any; expiresAt?: number } | null
                    if (!tk || typeof tk.value === 'undefined' || typeof tk.expiresAt === 'undefined' || now > tk.expiresAt) {
                        inboundState.tokens = []
                    } else {
                        inboundState.tokens = tk.value
                    }
                }

                // other fields (isUserLoggedIn, userInfo, contacts, settings) are left as-is
            },
        }

    )
);


export const useUserStore = () => userStore();