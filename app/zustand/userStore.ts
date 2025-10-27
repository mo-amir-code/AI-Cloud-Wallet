import { MyTokenDataType } from '@/types/tokens';
import { ContactType, UserStoreActionsType, UserStoreStatesType } from '@/types/zustand';
import { create } from 'zustand';


export const useUserStore = create<UserStoreStatesType & UserStoreActionsType>((set) => ({
    isUserLoggedIn: false,
    userInfo: null,
    totalBalance: 0,
    tokens: [],
    contacts: [],
    setUserAuthStatus: (status: boolean) => set({ isUserLoggedIn: status }),
    setUserInfo: (userInfo) => set({ userInfo }),
    clearUserInfo: () => set({ userInfo: null }),
    updateTotalBalance: (balance) => set({ totalBalance: balance }),
    setTokens: (tokens: MyTokenDataType[]) => set(() => ({
        tokens,
    })),
    updateTokenBalance: (mintAddress, amount) =>
        set((state) => {
            const updatedTokens = state.tokens.map((token) =>
                token.mintAddress === mintAddress
                    ? { ...token, balance: amount }
                    : token
            );
            return { tokens: updatedTokens };
        }),
    setContacts: (contacts: ContactType[]) => set({ contacts: contacts }),
    updateContact: (id: string, updatedData: Partial<ContactType>) =>
        set((state) => {
            const updatedContacts = state.contacts.map((contact) =>
                contact.id === id
                    ? { ...contact, ...updatedData }
                    : contact
            );
            return { contacts: updatedContacts };
        }),
}));