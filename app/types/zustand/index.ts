import { MyTokenDataType } from "../tokens";

type UserInfoType = {
    id: string;
    name: string;
    email: string;
    photoUrl: string | null;
    wallet: {
        publicKey: string;
        privateKey: string | null;
    }
}


type UserStoreStatesType = {
    userInfo: UserInfoType | null;
    totalBalance: number;
    tokens: Record<string, MyTokenDataType>;
}

type UserStoreActionsType = {
    setUserInfo: (userInfo: UserInfoType) => void;
    clearUserInfo: () => void;
    updateTotalBalance: (balance: number) => void;
    updateTokenBalance: (mintAddress: string, amount: number) => void;
    setTokens: (tokens: MyTokenDataType[]) => void
}


export type { UserInfoType, UserStoreActionsType, UserStoreStatesType };

