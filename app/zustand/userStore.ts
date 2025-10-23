import { MyTokenDataType } from '@/types/tokens';
import { UserStoreActionsType, UserStoreStatesType } from '@/types/zustand';
import { create } from 'zustand';


export const useUserStore = create<UserStoreStatesType & UserStoreActionsType>((set) => ({
    userInfo: null,
    totalBalance: 0,
    tokens: {},
    setUserInfo: (userInfo) => set({ userInfo }),
    clearUserInfo: () => set({ userInfo: null }),
    updateTotalBalance: (balance) => set({ totalBalance: balance }),
    setTokens: (tokens: MyTokenDataType[]) =>
        set((state) => {
            const tokensRecord = tokens.reduce<Record<string, MyTokenDataType>>((acc, token) => {
                acc[token.mintAddress] = token;
                return acc;
            }, {});
            return { tokens: tokensRecord };
        }),
    updateTokenBalance: (mintAddress, amount) => set((state) => {
        {
            const token = state.tokens[mintAddress];
            if (token) {
                return {
                    tokens: {
                        ...state.tokens,
                        [mintAddress]: {
                            ...token,
                            balance: amount,
                        },
                    },
                };
            }
            return state;
        }
    })
}));